const db = require('../../config/db');

// Obtener todos los años lectivos activos
exports.obtenerTodosAniosLectivos = async () => {
  const [rows] = await db.query(`
    SELECT 
      id_anio_lectivo,
      anio,
      fecha_inicio,
      fecha_fin,
      estado,
      created_at,
      updated_at
    FROM anio_lectivo
    WHERE deleted_at IS NULL
  `);
  return rows;
};

// Obtener un año lectivo por su ID
exports.obtenerAnioLectivoPorId = async (id) => {
  const [rows] = await db.query(
    `SELECT 
      id_anio_lectivo,
      anio,
      fecha_inicio,
      fecha_fin,
      estado,
      created_at,
      updated_at
     FROM anio_lectivo 
     WHERE id_anio_lectivo = ? AND deleted_at IS NULL`,
    [id]
  );
  return rows[0];
};

// Crear un nuevo año lectivo
exports.crearAnioLectivo = async (data) => {
  const {
    anio,
    fecha_inicio,
    fecha_fin,
    estado
  } = data;

  const [result] = await db.query(
    `INSERT INTO anio_lectivo 
      (anio, fecha_inicio, fecha_fin, estado)
     VALUES (?, ?, ?, ?)`,
    [
      anio,
      fecha_inicio,
      fecha_fin,
      estado || 'planificacion'
    ]
  );

  return { id_anio_lectivo: result.insertId, ...data };
};

// Actualizar un año lectivo
exports.actualizarAnioLectivo = async (id, data) => {
  const {
    anio,
    fecha_inicio,
    fecha_fin,
    estado
  } = data;

  const [result] = await db.query(
    `UPDATE anio_lectivo
     SET 
       anio = ?,
       fecha_inicio = ?,
       fecha_fin = ?,
       estado = ?,
       updated_at = CURRENT_TIMESTAMP
     WHERE id_anio_lectivo = ? AND deleted_at IS NULL`,
    [
      anio,
      fecha_inicio,
      fecha_fin,
      estado,
      id
    ]
  );

  return result.affectedRows > 0;
};

// Eliminar (lógicamente) un año lectivo
exports.eliminarAnioLectivo = async (id) => {
  const [result] = await db.query(
    `UPDATE anio_lectivo 
     SET deleted_at = CURRENT_TIMESTAMP 
     WHERE id_anio_lectivo = ? AND deleted_at IS NULL`,
    [id]
  );
  return { 
    mensaje: result.affectedRows > 0 ? 'Año lectivo eliminado correctamente' : 'Año lectivo no encontrado' 
  };
};

// Obtener años lectivos eliminados
exports.obtenerAniosLectivosEliminados = async () => {
  const [rows] = await db.query(`
    SELECT 
      id_anio_lectivo,
      anio,
      fecha_inicio,
      fecha_fin,
      estado,
      created_at,
      updated_at,
      deleted_at
    FROM anio_lectivo
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `);
  return rows;
};

// Restaurar un año lectivo eliminado
exports.restaurarAnioLectivo = async (id) => {
  const [result] = await db.query(
    `UPDATE anio_lectivo 
     SET deleted_at = NULL 
     WHERE id_anio_lectivo = ? AND deleted_at IS NOT NULL`,
    [id]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Año lectivo no encontrado o no está eliminado');
  }

  const [anioLectivo] = await db.query(
    `SELECT 
      id_anio_lectivo,
      anio,
      fecha_inicio,
      fecha_fin,
      estado
     FROM anio_lectivo 
     WHERE id_anio_lectivo = ?`,
    [id]
  );

  return anioLectivo[0];
};