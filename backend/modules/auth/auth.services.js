const db = require('../../config/db');

// Obtener todos los usuarios activos
exports.obtenerTodosUsuarios = async () => {
  const [rows] = await db.query(`
    SELECT 
      id_usuario, 
      username, 
      email_usuario, 
      rol, 
      estado, 
      ultimo_login, 
      created_at, 
      updated_at
    FROM usuario
    WHERE deleted_at IS NULL
  `);
  return rows;
};

// Obtener un usuario por su ID
exports.obtenerUsuarioPorId = async (id) => {
  const [rows] = await db.query(
    `SELECT 
      id_usuario, 
      username, 
      email_usuario, 
      rol, 
      estado, 
      ultimo_login, 
      created_at, 
      updated_at
     FROM usuario 
     WHERE id_usuario = ? AND deleted_at IS NULL`,
    [id]
  );
  return rows[0];
};

// Crear un nuevo usuario
exports.crearUsuario = async (data) => {
  const {
    username,
    password_hash,
    email_usuario,
    rol,
    estado,
    ultimo_login
  } = data;

  const [result] = await db.query(
    `INSERT INTO usuario 
      (username, password_hash, email_usuario, rol, estado, ultimo_login)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      username,
      password_hash,
      email_usuario,
      rol,
      estado || 'activo',
      ultimo_login || null
    ]
  );

  return { id_usuario: result.insertId, ...data };
};

// Actualizar un usuario
exports.actualizarUsuario = async (id, data) => {
  const {
    username,
    password_hash,
    email_usuario,
    rol,
    estado,
    ultimo_login
  } = data;

  const [result] = await db.query(
    `UPDATE usuario
     SET 
       username = ?, 
       password_hash = ?, 
       email_usuario = ?, 
       rol = ?, 
       estado = ?, 
       ultimo_login = ?, 
       updated_at = CURRENT_TIMESTAMP
     WHERE id_usuario = ? AND deleted_at IS NULL`,
    [
      username,
      password_hash,
      email_usuario,
      rol,
      estado,
      ultimo_login || null,
      id
    ]
  );

  return result.affectedRows > 0;
};

// Eliminar (lógicamente) un usuario
exports.eliminarUsuario = async (id) => {
  const [result] = await db.query(
    `UPDATE usuario 
     SET deleted_at = CURRENT_TIMESTAMP 
     WHERE id_usuario = ? AND deleted_at IS NULL`,
    [id]
  );
  return { 
    mensaje: result.affectedRows > 0 ? 'Usuario eliminado correctamente' : 'Usuario no encontrado' 
  };
};

// Obtener usuarios eliminados
exports.obtenerUsuariosEliminados = async () => {
  const [rows] = await db.query(`
    SELECT 
      id_usuario, 
      username, 
      email_usuario, 
      rol, 
      estado, 
      ultimo_login, 
      created_at, 
      updated_at,
      deleted_at
    FROM usuario
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `);
  return rows;
};

// Restaurar un usuario eliminado
exports.restaurarUsuario = async (id) => {
  const [result] = await db.query(
    `UPDATE usuario 
     SET deleted_at = NULL 
     WHERE id_usuario = ? AND deleted_at IS NOT NULL`,
    [id]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Usuario no encontrado o no está eliminado');
  }

  const [usuario] = await db.query(
    `SELECT 
      id_usuario, 
      username, 
      email_usuario, 
      rol, 
      estado, 
      ultimo_login
     FROM usuario 
     WHERE id_usuario = ?`,
    [id]
  );

  return usuario[0];
};