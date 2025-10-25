/**
 * Consultas SQL para el módulo de Altas (Docente + Usuario)
 */

const altaDocenteUsuario = {
  // =============================================
  // CONSULTAS DE USUARIO
  // =============================================
  
  /**
   * Crear un nuevo usuario en el sistema
   * @params: username, password_hash, email_usuario, rol, estado
   */
  crearUsuario: `
    INSERT INTO usuario 
      (username, password_hash, email_usuario, rol, estado)
    VALUES (?, ?, ?, ?, ?)
  `,

  /**
   * Verificar si un email de usuario ya existe
   * @params: email_usuario
   */
  verificarEmailUsuarioExiste: `
    SELECT id_usuario 
    FROM usuario 
    WHERE email_usuario = ? 
      AND deleted_at IS NULL
  `,

  /**
   * Obtener usuario por ID
   * @params: id_usuario
   */
  obtenerUsuarioPorId: `
    SELECT 
      id_usuario,
      username,
      email_usuario,
      rol,
      estado,
      ultimo_login,
      created_at
    FROM usuario
    WHERE id_usuario = ? 
      AND deleted_at IS NULL
  `,

  // =============================================
  // CONSULTAS DE DOCENTE
  // =============================================
  
  /**
   * Crear un nuevo docente
   * @params: id_usuario, dni_docente, nombre, apellido, email, telefono, especialidad, estado
   */
  crearDocente: `
    INSERT INTO docente 
      (id_usuario, dni_docente, nombre, apellido, email, telefono, especialidad, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,

  /**
   * Verificar si un DNI de docente ya existe
   * @params: dni_docente
   */
  verificarDniDocenteExiste: `
    SELECT id_docente 
    FROM docente 
    WHERE dni_docente = ? 
      AND deleted_at IS NULL
  `,

  /**
   * Obtener docente por ID con información del usuario
   * @params: id_docente
   */
  obtenerDocentePorId: `
    SELECT 
      d.id_docente,
      d.dni_docente,
      d.nombre,
      d.apellido,
      d.email,
      d.telefono,
      d.especialidad,
      d.estado AS estado_docente,
      d.created_at,
      d.updated_at,
      u.id_usuario,
      u.username,
      u.email_usuario,
      u.rol,
      u.estado AS estado_usuario
    FROM docente d
    LEFT JOIN usuario u ON d.id_usuario = u.id_usuario
    WHERE d.id_docente = ? 
      AND d.deleted_at IS NULL
  `,

  /**
   * Obtener todos los docentes con información del usuario
   * @params: ninguno
   */
  obtenerTodosDocentes: `
    SELECT 
      d.id_docente,
      d.dni_docente,
      d.nombre,
      d.apellido,
      d.email,
      d.telefono,
      d.especialidad,
      d.estado AS estado_docente,
      d.created_at,
      u.id_usuario,
      u.username,
      u.email_usuario,
      u.rol,
      u.estado AS estado_usuario
    FROM docente d
    LEFT JOIN usuario u ON d.id_usuario = u.id_usuario
    WHERE d.deleted_at IS NULL
    ORDER BY d.apellido, d.nombre
  `,

  /**
   * Actualizar docente
   * @params: nombre, apellido, email, telefono, especialidad, estado, id_docente
   */
  actualizarDocente: `
    UPDATE docente 
    SET 
      nombre = ?,
      apellido = ?,
      email = ?,
      telefono = ?,
      especialidad = ?,
      estado = ?
    WHERE id_docente = ? 
      AND deleted_at IS NULL
  `,

  /**
   * Eliminar docente (soft delete)
   * @params: id_docente
   */
  eliminarDocente: `
    UPDATE docente 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_docente = ?
  `,

  /**
   * Eliminar usuario (soft delete)
   * @params: id_usuario
   */
  eliminarUsuario: `
    UPDATE usuario 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_usuario = ?
  `,

  /**
   * Obtener docentes eliminados
   * @params: ninguno
   */
  obtenerDocentesEliminados: `
    SELECT 
      d.id_docente,
      d.dni_docente,
      d.nombre,
      d.apellido,
      d.email,
      d.deleted_at,
      u.email_usuario
    FROM docente d
    LEFT JOIN usuario u ON d.id_usuario = u.id_usuario
    WHERE d.deleted_at IS NOT NULL
    ORDER BY d.deleted_at DESC
  `,

  /**
   * Restaurar docente
   * @params: id_docente
   */
  restaurarDocente: `
    UPDATE docente 
    SET deleted_at = NULL 
    WHERE id_docente = ?
  `,

  /**
   * Restaurar usuario
   * @params: id_usuario
   */
  restaurarUsuario: `
    UPDATE usuario 
    SET deleted_at = NULL 
    WHERE id_usuario = ?
  `
};

module.exports = altaDocenteUsuario;