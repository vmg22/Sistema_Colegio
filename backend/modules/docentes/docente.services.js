const db = require('../../config/db');

// Obtener todos los docentes activos
exports.obtenerTodosDocentes = async () => {
  const [rows] = await db.query(`
    SELECT 
      id_docente, 
      id_usuario, 
      dni_docente, 
      nombre, 
      apellido, 
      email, 
      telefono, 
      especialidad, 
      estado, 
      created_at, 
      updated_at
    FROM docente
    WHERE deleted_at IS NULL
  `);
  return rows;
};

// Obtener un docente por su ID
exports.obtenerDocentePorId = async (id) => {
  const [rows] = await db.query(
    `SELECT 
      id_docente, 
      id_usuario, 
      dni_docente, 
      nombre, 
      apellido, 
      email, 
      telefono, 
      especialidad, 
      estado, 
      created_at, 
      updated_at
     FROM docente 
     WHERE id_docente = ? AND deleted_at IS NULL`,
    [id]
  );
  return rows[0];
};

// Crear un nuevo docente
exports.crearDocente = async (data) => {
  const {
    id_usuario,
    dni_docente,
    nombre,
    apellido,
    email,
    telefono,
    especialidad,
    estado
  } = data;

  const [result] = await db.query(
    `INSERT INTO docente 
      (id_usuario, dni_docente, nombre, apellido, email, telefono, especialidad, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id_usuario || null,
      dni_docente,
      nombre,
      apellido,
      email,
      telefono,
      especialidad,
      estado || 'activo'
    ]
  );

  return { id_docente: result.insertId, ...data };
};

// Actualizar un docente
exports.actualizarDocente = async (id, data) => {
  const {
    id_usuario,
    dni_docente,
    nombre,
    apellido,
    email,
    telefono,
    especialidad,
    estado
  } = data;

  const [result] = await db.query(
    `UPDATE docente
     SET 
       id_usuario = ?, 
       dni_docente = ?, 
       nombre = ?, 
       apellido = ?, 
       email = ?, 
       telefono = ?, 
       especialidad = ?, 
       estado = ?, 
       updated_at = CURRENT_TIMESTAMP
     WHERE id_docente = ? AND deleted_at IS NULL`,
    [
      id_usuario || null,
      dni_docente,
      nombre,
      apellido,
      email,
      telefono,
      especialidad,
      estado,
      id
    ]
  );

  return result.affectedRows > 0;
};

// Eliminar (lógicamente) un docente
exports.eliminarDocente = async (id) => {
  const [result] = await db.query(
    `UPDATE docente 
     SET deleted_at = CURRENT_TIMESTAMP 
     WHERE id_docente = ? AND deleted_at IS NULL`,
    [id]
  );
  return { 
    mensaje: result.affectedRows > 0 ? 'Docente eliminado correctamente' : 'Docente no encontrado' 
  };
};

// Obtener docentes eliminados
exports.obtenerDocentesEliminados = async () => {
  const [rows] = await db.query(`
    SELECT 
      id_docente, 
      id_usuario, 
      dni_docente, 
      nombre, 
      apellido, 
      email, 
      telefono, 
      especialidad, 
      estado, 
      created_at, 
      updated_at,
      deleted_at
    FROM docente
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `);
  return rows;
};

// Restaurar un docente eliminado
exports.restaurarDocente = async (id) => {
  const [result] = await db.query(
    `UPDATE docente 
     SET deleted_at = NULL 
     WHERE id_docente = ? AND deleted_at IS NOT NULL`,
    [id]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Docente no encontrado o no está eliminado');
  }

  const [docente] = await db.query(
    `SELECT 
      id_docente, 
      id_usuario, 
      dni_docente, 
      nombre, 
      apellido, 
      email, 
      telefono, 
      especialidad, 
      estado
     FROM docente 
     WHERE id_docente = ?`,
    [id]
  );

  return docente[0];
};