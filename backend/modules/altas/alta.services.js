const db = require('../../config/db');
const consultas = require('./alta.queries');
const bcrypt = require('bcrypt'); // <-- Asegúrate de tenerlo instalado (npm install bcrypt)

/**
 * --- Estructura Corregida ---
 * Definimos todas las funciones por separado (async function ...)
 * para que puedan llamarse entre sí.
 */

/**
 * Obtiene un docente por su ID
 * (La definimos primero porque las otras la usan)
 */
async function obtenerDocentePorId(id) {
  const [docentes] = await db.query(consultas.obtenerDocentePorId, [id]);
  if (docentes.length === 0) {
    throw new Error('Docente no encontrado');
  }
  return docentes[0];
}

/**
 * (NUEVA FUNCIÓN - Paso 1 del Wizard)
 * Crea solo el perfil del docente
 */
async function crearDocentePerfil(data) {
  const {
    dni_docente, nombre, apellido, email,
    telefono, especialidad, estado,
  } = data;

  if (!dni_docente || !nombre || !apellido) {
    throw new Error('DNI, Nombre y Apellido son obligatorios');
  }
  
  const [docentesExistentes] = await db.query(
    consultas.verificarDniDocenteExiste, [dni_docente]
  );
  if (docentesExistentes.length > 0) {
    throw new Error('El DNI ya está registrado');
  }

  const [docenteResult] = await db.query(consultas.crearDocente, [
    null, dni_docente, nombre, apellido, email || null,
    telefono || null, especialidad || null, estado || 'activo',
  ]);
  
  const docenteCreado = await obtenerDocentePorId(docenteResult.insertId);
  return docenteCreado;
}

/**
 * (NUEVA FUNCIÓN - Paso 2 del Wizard)
 * Crea el usuario y lo vincula al docente
 */
async function crearUsuarioParaDocente(id_docente, data) {
  const { username, email, password } = data;

  if (!username || !email || !password) {
    throw new Error('Username, Email y Contraseña son obligatorios');
  }
  
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [usuariosConEseEmail] = await connection.query(
      consultas.verificarEmailUsuarioExiste, [email]
    );
    if (usuariosConEseEmail.length > 0) {
      throw new Error('El Email de Usuario ya está registrado');
    }

    const [usuariosConEseUsername] = await connection.query(
      consultas.verificarUsernameExiste, [username] 
    );
    if (usuariosConEseUsername.length > 0) {
      throw new Error('El Username ya está registrado');
    }
    
    // Hashear la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const [userResult] = await connection.query(consultas.crearUsuario, [
      username, 
      passwordHash,
      email, 
      'docente', 
      'activo',
    ]);
    const newUserId = userResult.insertId;

    await connection.query(consultas.vincularUsuarioADocente, [
      newUserId, id_docente
    ]);

    await connection.commit();
    
    const docenteActualizado = await obtenerDocentePorId(id_docente);
    return docenteActualizado;

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

/**
 * Obtiene todos los docentes activos
 */
async function obtenerTodosDocentes(buscar) { // <-- Recibe 'buscar'
  
  let query = consultas.obtenerTodosDocentes; // Query base (ORDER BY d.id_docente ASC)
  const params = [];

  if (buscar) {
    // Añade lógica de búsqueda
    // Reemplazamos el ORDER BY para insertarlo al final
    query = query.replace("ORDER BY d.id_docente ASC", ""); 
    query += ` AND (d.nombre LIKE ? OR d.apellido LIKE ? OR d.dni_docente LIKE ?)
               ORDER BY d.id_docente ASC`;
    
    const searchTerm = `%${buscar}%`;
    params.push(searchTerm);
    params.push(searchTerm);
    params.push(searchTerm);
  }

  const [docentes] = await db.query(query, params); 
  return docentes;
}

/**
 * Actualiza la información de un docente
 */
async function actualizarDocente(id, data) {
  const { nombre, apellido, email, telefono, especialidad, estado } = data;

  await obtenerDocentePorId(id); // Validar que el docente existe

  await db.query(consultas.actualizarDocente, [
    nombre, apellido, email, telefono, especialidad, estado, id,
  ]);

  return await obtenerDocentePorId(id);
}

/**
 * Elimina un docente y su usuario (soft delete)
 */
async function eliminarDocente(id) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const docente = await obtenerDocentePorId(id); // Obtiene o lanza error
    await connection.query(consultas.eliminarDocente, [id]);
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
}

/**
 * Obtiene los docentes eliminados
 */
async function obtenerDocentesEliminados() {
  const [docentes] = await db.query(consultas.obtenerDocentesEliminados);
  return docentes;
}

/**
 * Restaura un docente eliminado
 */
async function restaurarDocente(id) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(consultas.restaurarDocente, [id]);
    const [docentes] = await connection.query(
      `SELECT id_usuario FROM docente WHERE id_docente = ?`, [id]
    );
    if (docentes.length > 0 && docentes[0].id_usuario) {
      await connection.query(consultas.restaurarUsuario, [
        docentes[0].id_usuario,
      ]);
    }
    await connection.commit();
    return await obtenerDocentePorId(id);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}
 
async function obtenerEstadosDocente() {
  try {
    const [rows] = await db.query(consultas.obtenerValoresEnumEstado);
    
    if (!rows || rows.length === 0) {
      throw new Error("No se pudo obtener la definición de la columna 'estado'.");
    }

    // El resultado es algo como "enum('activo','licencia','inactivo')"
    const enumString = rows[0].Type; 
    
    // Parseamos el string para convertirlo en un array
    const valores = enumString
      .replace("enum(", "")  // Quita "enum("
      .replace(")", "")      // Quita ")"
      .replaceAll("'", "")   // Quita todas las comillas simples
      .split(',');          // Separa por comas

    return valores; // Devuelve ['activo', 'licencia', 'inactivo']

  } catch (err) {
    console.error("Error al parsear ENUM 'estado':", err);
    throw new Error("Error del servidor al obtener estados.");
  }
}
/**
 * (Tu función original de 1 solo paso - la mantenemos)
 */
async function altaDocenteUsuario(data) {
    const {
      username, email, password, dni_docente, nombre, apellido,
      telefono, especialidad, estado,
    } = data;

    if (
      !username || !email || !password || !dni_docente || !nombre || !apellido
    ) {
      throw new Error(
        'Username, Email, Contraseña, DNI, Nombre y Apellido son obligatorios'
      );
    }

    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [usuariosExistentes] = await connection.query(
        consultas.verificarEmailUsuarioExiste, [email]
      );
      if (usuariosExistentes.length > 0) {
        throw new Error('El Email de Usuario ya está registrado');
      }
      
      const [usuariosConEseUsername] = await connection.query(
        consultas.verificarUsernameExiste, [username] 
      );
      if (usuariosConEseUsername.length > 0) {
        throw new Error('El Username ya está registrado');
      }

      const [docentesExistentes] = await connection.query(
        consultas.verificarDniDocenteExiste, [dni_docente]
      );
      if (docentesExistentes.length > 0) {
        throw new Error('El DNI ya está registrado');
      }
      
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const [userResult] = await connection.query(consultas.crearUsuario, [
        username, passwordHash, email, 'docente', 'activo',
      ]);
      const newUserId = userResult.insertId;

      const [docenteResult] = await connection.query(consultas.crearDocente, [
        newUserId, dni_docente, nombre, apellido, email,
        telefono || null, especialidad || null, estado || 'activo',
      ]);

      await connection.commit();
      
      const docenteCreado = await obtenerDocentePorId(docenteResult.insertId);
      return docenteCreado;

    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
}

// 4. Exportamos todo junto al final
module.exports = {
  altaDocenteUsuario,
  crearDocentePerfil,
  crearUsuarioParaDocente,
  obtenerTodosDocentes,
  obtenerDocentePorId,
  actualizarDocente,
  eliminarDocente,
  obtenerDocentesEliminados,
  restaurarDocente,
  obtenerEstadosDocente
};