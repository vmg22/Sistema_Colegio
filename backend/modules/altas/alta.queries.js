/**
 * Consultas SQL para el módulo de Altas (Docente + Usuario)
 */

const altaDocenteUsuario = {
  // =============================================
  // CONSULTAS DE USUARIO
  // =============================================
  
  crearUsuario: `
    INSERT INTO usuario 
      (username, password_hash, email_usuario, rol, estado)
    VALUES (?, ?, ?, ?, ?)
  `,

  verificarEmailUsuarioExiste: `
    SELECT id_usuario 
    FROM usuario 
    WHERE email_usuario = ? 
      AND deleted_at IS NULL
  `,

  verificarUsernameExiste: `
    SELECT id_usuario 
    FROM usuario 
    WHERE username = ? 
      AND deleted_at IS NULL
  `,

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
  
  crearDocente: `
    INSERT INTO docente 
      (id_usuario, dni_docente, nombre, apellido, email, telefono, especialidad, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,

  verificarDniDocenteExiste: `
    SELECT id_docente 
    FROM docente 
    WHERE dni_docente = ? 
      AND deleted_at IS NULL
  `,

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
    ORDER BY d.id_docente ASC
  `, // <-- ¡CAMBIO REALIZADO AQUÍ!

  actualizarDocente: `
    UPDATE docente 
    SET 
      nombre = ?,
      apellido = ?,
      email = ?,
      telefono = ?,
      especialidad = ?,
      estado = ?,
      dni_docente = ?
    WHERE id_docente = ? 
      AND deleted_at IS NULL
  `,

  eliminarDocente: `
    UPDATE docente 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_docente = ?
  `,

  eliminarUsuario: `
    UPDATE usuario 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_usuario = ?
  `,

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

  restaurarDocente: `
    UPDATE docente 
    SET deleted_at = NULL 
    WHERE id_docente = ?
  `,

  restaurarUsuario: `
    UPDATE usuario 
    SET deleted_at = NULL 
    WHERE id_usuario = ?
  `,

  // Esta consulta faltaba en tu primer 'queries.js'
  vincularUsuarioADocente: `
    UPDATE docente 
    SET id_usuario = ? 
    WHERE id_docente = ? 
      AND deleted_at IS NULL
  `,
  obtenerValoresEnumEstado: `
    SHOW COLUMNS FROM docente LIKE 'estado'
  `
};

module.exports = altaDocenteUsuario;