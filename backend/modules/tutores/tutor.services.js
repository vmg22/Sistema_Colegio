const db = require('../../config/db');

// Obtener todos los tutores activos
exports.obtenerTodosTutores = async () => {
  const [rows] = await db.query(`
    SELECT 
      id_tutor,
      id_usuario,
      dni_tutor,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      parentesco,
      estado,
      created_at,
      updated_at
    FROM tutor
    WHERE deleted_at IS NULL
  `);
  return rows;
};

// Obtener un tutor por su ID
exports.obtenerTutorPorId = async (id) => {
  const [rows] = await db.query(
    `SELECT 
      id_tutor,
      id_usuario,
      dni_tutor,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      parentesco,
      estado,
      created_at,
      updated_at
     FROM tutor 
     WHERE id_tutor = ? AND deleted_at IS NULL`,
    [id]
  );
  return rows[0];
};

// Crear un nuevo tutor
exports.crearTutor = async (data) => {
  const {
    id_usuario,
    dni_tutor,
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    parentesco,
    estado
  } = data;

  const [result] = await db.query(
    `INSERT INTO tutor 
      (id_usuario, dni_tutor, nombre, apellido, email, telefono, direccion, parentesco, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id_usuario || null,
      dni_tutor,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      parentesco,
      estado || 'activo'
    ]
  );

  return { id_tutor: result.insertId, ...data };
};

// Actualizar un tutor
exports.actualizarTutor = async (id, data) => {
  const {
    id_usuario,
    dni_tutor,
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    parentesco,
    estado
  } = data;

  const [result] = await db.query(
    `UPDATE tutor
     SET 
       id_usuario = ?,
       dni_tutor = ?,
       nombre = ?,
       apellido = ?,
       email = ?,
       telefono = ?,
       direccion = ?,
       parentesco = ?,
       estado = ?,
       updated_at = CURRENT_TIMESTAMP
     WHERE id_tutor = ? AND deleted_at IS NULL`,
    [
      id_usuario || null,
      dni_tutor,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      parentesco,
      estado,
      id
    ]
  );

  return result.affectedRows > 0;
};

// Eliminar (lógicamente) un tutor
exports.eliminarTutor = async (id) => {
  const [result] = await db.query(
    `UPDATE tutor 
     SET deleted_at = CURRENT_TIMESTAMP 
     WHERE id_tutor = ? AND deleted_at IS NULL`,
    [id]
  );
  return { 
    mensaje: result.affectedRows > 0 ? 'Tutor eliminado correctamente' : 'Tutor no encontrado' 
  };
};

// Obtener tutores eliminados
exports.obtenerTutoresEliminados = async () => {
  const [rows] = await db.query(`
    SELECT 
      id_tutor,
      id_usuario,
      dni_tutor,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      parentesco,
      estado,
      created_at,
      updated_at,
      deleted_at
    FROM tutor
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `);
  return rows;
};

// Restaurar un tutor eliminado
exports.restaurarTutor = async (id) => {
  const [result] = await db.query(
    `UPDATE tutor 
     SET deleted_at = NULL 
     WHERE id_tutor = ? AND deleted_at IS NOT NULL`,
    [id]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Tutor no encontrado o no está eliminado');
  }

  const [tutor] = await db.query(
    `SELECT 
      id_tutor,
      id_usuario,
      dni_tutor,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      parentesco,
      estado
     FROM tutor 
     WHERE id_tutor = ?`,
    [id]
  );

  return tutor[0];
};