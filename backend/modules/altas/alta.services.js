const db = require('../../config/db');
const consultas = require('./alta.queries');

/**
 * Servicios para gestión de Docentes y Usuarios
 */
const altaServices = {
  /**
   * Crea un docente junto con su usuario en una transacción
   * @param {Object} data - Datos del docente y usuario
   * @returns {Object} Docente creado con información del usuario
   */
  altaDocenteUsuario: async (data) => {
    const {
      // Datos de Usuario
      username, // ✅ NUEVO: Recibido desde el body
      email,
      password,
      // Datos del Docente
      dni_docente,
      nombre,
      apellido,
      telefono,
      especialidad,
      estado,
    } = data;

    // 1. Validaciones
    // [CORREGIDO] Añadida validación para 'username'
    if (
      !username ||
      !email ||
      !password ||
      !dni_docente ||
      !nombre ||
      !apellido
    ) {
      throw new Error(
        'Username, Email, Contraseña, DNI, Nombre y Apellido son obligatorios'
      );
    }

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 2. Verificar que el email de usuario no exista
      const [usuariosExistentes] = await connection.query(
        consultas.verificarEmailUsuarioExiste,
        [email]
      );

      if (usuariosExistentes.length > 0) {
        throw new Error('El Email de Usuario ya está registrado');
      }
      
      // TODO: Sería bueno verificar también si el 'username' ya existe
      // (Si tienes una consulta para 'verificarUsernameExiste', añádela aquí)

      // 3. Verificar que el DNI del docente no exista
      const [docentesExistentes] = await connection.query(
        consultas.verificarDniDocenteExiste,
        [dni_docente]
      );

      if (docentesExistentes.length > 0) {
        throw new Error('El DNI ya está registrado');
      }

      // 4. Crear el USUARIO
      // [CORREGIDO] Se usa 'username' y 'email' por separado
      const [userResult] = await connection.query(consultas.crearUsuario, [
        username, // username
        password, // password_hash
        email, // email_usuario
        'docente', // rol
        'activo', // estado
      ]);

      const newUserId = userResult.insertId;

      // 5. Crear el DOCENTE
      const [docenteResult] = await connection.query(consultas.crearDocente, [
        newUserId,
        dni_docente,
        nombre,
        apellido,
        email, // El email se mantiene igual en ambas tablas
        telefono || null,
        especialidad || null,
        estado || 'activo',
      ]);

      // 6. Confirmar transacción
      await connection.commit();

      // 7. Obtener el docente completo con información del usuario
      const [docenteCreado] = await connection.query(
        consultas.obtenerDocentePorId,
        [docenteResult.insertId]
      );

      return docenteCreado[0];
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  /**
   * Obtiene todos los docentes activos
   * @returns {Array} Lista de docentes
   */
  obtenerTodosDocentes: async () => {
    const [docentes] = await db.query(consultas.obtenerTodosDocentes);
    return docentes;
  },

  /**
   * Obtiene un docente por su ID
   * @param {number} id - ID del docente
   * @returns {Object} Docente encontrado
   */
  obtenerDocentePorId: async (id) => {
    const [docentes] = await db.query(consultas.obtenerDocentePorId, [id]);

    if (docentes.length === 0) {
      throw new Error('Docente no encontrado');
    }

    return docentes[0];
  },

  /**
   * Actualiza la información de un docente
   * @param {number} id - ID del docente
   * @param {Object} data - Datos a actualizar
   * @returns {Object} Docente actualizado
   */
  actualizarDocente: async (id, data) => {
    const { nombre, apellido, email, telefono, especialidad, estado } = data;

    // Validar que el docente existe
    await altaServices.obtenerDocentePorId(id);

    await db.query(consultas.actualizarDocente, [
      nombre,
      apellido,
      email,
      telefono,
      especialidad,
      estado,
      id,
    ]);

    return await altaServices.obtenerDocentePorId(id);
  },

  /**
   * Elimina un docente y su usuario (soft delete)
   * @param {number} id - ID del docente
   * @returns {Object} Resultado de la eliminación
   */
  eliminarDocente: async (id) => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Obtener el docente para obtener su id_usuario
      const [docentes] = await connection.query(
        consultas.obtenerDocentePorId,
        [id]
      );

      if (docentes.length === 0) {
        throw new Error('Docente no encontrado');
      }

      const docente = docentes[0];

      // Eliminar docente (soft delete)
      await connection.query(consultas.eliminarDocente, [id]);

      // Eliminar usuario asociado (soft delete)
      if (docente.id_usuario) {
        await connection.query(consultas.eliminarUsuario, [docente.id_usuario]);
      }

      await connection.commit();

      return {
        success: true,
        message: 'Docente y usuario eliminados correctamente',
        id_docente: id,
        id_usuario: docente.id_usuario,
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  /**
   * Obtiene los docentes eliminados
   * @returns {Array} Lista de docentes eliminados
   */
  obtenerDocentesEliminados: async () => {
    const [docentes] = await db.query(consultas.obtenerDocentesEliminados);
    return docentes;
  },

  /**
   * Restaura un docente eliminado
   * @param {number} id - ID del docente
   * @returns {Object} Docente restaurado
   */
  restaurarDocente: async (id) => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Restaurar docente
      await connection.query(consultas.restaurarDocente, [id]);

      // Obtener el docente para obtener su id_usuario
      const [docentes] = await connection.query(
        `SELECT id_usuario FROM docente WHERE id_docente = ?`,
        [id]
      );

      if (docentes.length > 0 && docentes[0].id_usuario) {
        // Restaurar usuario
        await connection.query(consultas.restaurarUsuario, [
          docentes[0].id_usuario,
        ]);
      }

      await connection.commit();

      return await altaServices.obtenerDocentePorId(id);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
};

module.exports = altaServices;