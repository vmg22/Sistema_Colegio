const db = require("../../config/db");

// Campos comunes para SELECT (excluye el sensible 'password_hash')
const CAMPOS_SELECT = `
  id_usuario, 
  username, 
  email_usuario, 
  rol, 
  estado, 
  ultimo_login, 
  created_at, 
  updated_at
`;

// --- QUERIES DE LECTURA ---

/**
 * Obtiene todos los usuarios activos (no eliminados)
 */
exports.obtenerTodosUsuarios = async () => {
  const [rows] = await db.query(`
    SELECT ${CAMPOS_SELECT}
    FROM usuario
    WHERE deleted_at IS NULL
  `);
  return rows;
};

/**
 * Obtiene un usuario por su ID (solo activos)
 */
exports.obtenerUsuarioPorId = async (id) => {
  const [rows] = await db.query(
    `SELECT ${CAMPOS_SELECT}
     FROM usuario 
     WHERE id_usuario = ? AND deleted_at IS NULL`,
    [id]
  );
  return rows[0];
};

/**
 * Obtiene todos los usuarios eliminados lógicamente
 */
exports.obtenerUsuariosEliminados = async () => {
  const [rows] = await db.query(`
    SELECT ${CAMPOS_SELECT}, deleted_at
    FROM usuario
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `);
  return rows;
};

/**
 * Busca un usuario por username (incluye password_hash para autenticación)
 */
exports.obtenerUsuarioPorUsername = async (username) => {
  const [rows] = await db.query(
    `SELECT id_usuario, username, password_hash, email_usuario, rol, estado
     FROM usuario 
     WHERE username = ? AND deleted_at IS NULL`,
    [username]
  );
  return rows[0];
};

/**
 * ✅ Busca un usuario por email (sin password_hash)
 * Usada en el paso 1 del login para obtener datos básicos
 */
exports.obtenerUsuarioPorEmail = async (email) => {
  try {
    const [rows] = await db.query(
      `SELECT id_usuario, username, email_usuario, rol, estado, ultimo_login
       FROM usuario 
       WHERE email_usuario = ? AND deleted_at IS NULL`,
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error al buscar usuario por email:", error);
    throw new Error("Error al buscar usuario");
  }
};

/**
 * ✅ Obtiene un usuario con su password_hash por ID
 * Usada para validar contraseñas
 */
exports.obtenerUsuarioConPassword = async (id_usuario) => {
  try {
    const [rows] = await db.query(
      `SELECT id_usuario, username, email_usuario, rol, estado, password_hash
       FROM usuario 
       WHERE id_usuario = ? AND deleted_at IS NULL`,
      [id_usuario]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error al obtener usuario con password:", error);
    throw new Error("Error al obtener usuario");
  }
};

/**
 * Busca un usuario por email (incluye password_hash para autenticación)
 * @deprecated Usar obtenerUsuarioPorEmail + obtenerUsuarioConPassword
 */
exports.obtenerUsuarioPorEmailConPassword = async (email) => {
  const [rows] = await db.query(
    `SELECT id_usuario, username, password_hash, email_usuario, rol, estado
     FROM usuario 
     WHERE email_usuario = ? AND deleted_at IS NULL`,
    [email]
  );
  return rows[0];
};

// --- QUERIES DE ESCRITURA ---

/**
 * Inserta un nuevo usuario en la base de datos
 */
exports.insertarUsuario = async (username, password_hash, email_usuario, rol, estado, ultimo_login) => {
  const [result] = await db.query(
    `INSERT INTO usuario 
     (username, password_hash, email_usuario, rol, estado, ultimo_login)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [username, password_hash, email_usuario, rol, estado, ultimo_login]
  );
  return result.insertId;
};

/**
 * Actualiza campos de un usuario (UPDATE dinámico) - Usado por PUT
 */
exports.actualizarUsuario = async (id, fields, values) => {
  const setClause = fields.join(", ");
  const [result] = await db.query(
    `UPDATE usuario
     SET ${setClause}
     WHERE id_usuario = ? AND deleted_at IS NULL`,
    [...values, id]
  );
  return result.affectedRows;
};

/**
 * Actualiza parcialmente un usuario (UPDATE dinámico) - Usado por PATCH
 */
exports.actualizarUsuarioParcial = async (id, fields, values) => {
  const setClause = fields.join(", ");
  const [result] = await db.query(
    `UPDATE usuario
     SET ${setClause}
     WHERE id_usuario = ? AND deleted_at IS NULL`,
    [...values, id]
  );
  return result.affectedRows;
};

/**
 * Marca un usuario como eliminado (soft delete)
 */
exports.marcarComoEliminado = async (id) => {
  const [result] = await db.query(
    `UPDATE usuario 
     SET deleted_at = CURRENT_TIMESTAMP, estado = 'inactivo'
     WHERE id_usuario = ? AND deleted_at IS NULL`,
    [id]
  );
  return result.affectedRows;
};

/**
 * Restaura un usuario eliminado
 */
exports.restaurarUsuarioEliminado = async (id) => {
  const [result] = await db.query(
    `UPDATE usuario 
     SET deleted_at = NULL, estado = 'activo'
     WHERE id_usuario = ? AND deleted_at IS NOT NULL`,
    [id]
  );
  return result.affectedRows;
};

/**
 * ✅ Actualiza la fecha del último login
 * Se llama después de un login exitoso
 */
exports.actualizarUltimoLogin = async (id_usuario) => {
  try {
    await db.query(
      `UPDATE usuario 
       SET ultimo_login = NOW()
       WHERE id_usuario = ?`,
      [id_usuario]
    );
  } catch (error) {
    console.error("Error al actualizar último login:", error);
    // No lanzamos error para no interrumpir el login
  }
};

module.exports.CAMPOS_SELECT = CAMPOS_SELECT;