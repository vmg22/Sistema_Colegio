const db = require('../../config/db');

// Obtener todas las calificaciones activas
exports.obtenerTodasCalificaciones = async () => {
  const [rows] = await db.query(`
    SELECT 
      id_calificacion,
      id_alumno,
      id_materia,
      id_docente,
      id_curso,
      anio_lectivo,
      cuatrimestre,
      nota_1,
      nota_2,
      nota_3,
      promedio_cuatrimestre,
      periodo_complementario,
      calificacion_definitiva,
      estado,
      created_at,
      updated_at
    FROM calificacion
    WHERE deleted_at IS NULL
  `);
  return rows;
};

// Obtener una calificación por su ID
exports.obtenerCalificacionPorId = async (id) => {
  const [rows] = await db.query(
    `SELECT 
      id_calificacion,
      id_alumno,
      id_materia,
      id_docente,
      id_curso,
      anio_lectivo,
      cuatrimestre,
      nota_1,
      nota_2,
      nota_3,
      promedio_cuatrimestre,
      periodo_complementario,
      calificacion_definitiva,
      estado,
      created_at,
      updated_at
     FROM calificacion 
     WHERE id_calificacion = ? AND deleted_at IS NULL`,
    [id]
  );
  return rows[0];
};

// Crear una nueva calificación
exports.crearCalificacion = async (data) => {
  const {
    id_alumno,
    id_materia,
    id_docente,
    id_curso,
    anio_lectivo,
    cuatrimestre,
    nota_1,
    nota_2,
    nota_3,
    promedio_cuatrimestre,
    periodo_complementario,
    calificacion_definitiva,
    estado
  } = data;

  const [result] = await db.query(
    `INSERT INTO calificacion 
      (id_alumno, id_materia, id_docente, id_curso, anio_lectivo, cuatrimestre, 
       nota_1, nota_2, nota_3, promedio_cuatrimestre, periodo_complementario, 
       calificacion_definitiva, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id_alumno,
      id_materia,
      id_docente,
      id_curso,
      anio_lectivo,
      cuatrimestre,
      nota_1 || null,
      nota_2 || null,
      nota_3 || null,
      promedio_cuatrimestre || null,
      periodo_complementario || null,
      calificacion_definitiva || null,
      estado || 'cursando'
    ]
  );

  return { id_calificacion: result.insertId, ...data };
};

// Actualizar una calificación
exports.actualizarCalificacion = async (id, data) => {
  const {
    id_alumno,
    id_materia,
    id_docente,
    id_curso,
    anio_lectivo,
    cuatrimestre,
    nota_1,
    nota_2,
    nota_3,
    promedio_cuatrimestre,
    periodo_complementario,
    calificacion_definitiva,
    estado
  } = data;

  const [result] = await db.query(
    `UPDATE calificacion
     SET 
       id_alumno = ?,
       id_materia = ?,
       id_docente = ?,
       id_curso = ?,
       anio_lectivo = ?,
       cuatrimestre = ?,
       nota_1 = ?,
       nota_2 = ?,
       nota_3 = ?,
       promedio_cuatrimestre = ?,
       periodo_complementario = ?,
       calificacion_definitiva = ?,
       estado = ?,
       updated_at = CURRENT_TIMESTAMP
     WHERE id_calificacion = ? AND deleted_at IS NULL`,
    [
      id_alumno,
      id_materia,
      id_docente,
      id_curso,
      anio_lectivo,
      cuatrimestre,
      nota_1,
      nota_2,
      nota_3,
      promedio_cuatrimestre,
      periodo_complementario,
      calificacion_definitiva,
      estado,
      id
    ]
  );

  return result.affectedRows > 0;
};

// Eliminar (lógicamente) una calificación
exports.eliminarCalificacion = async (id) => {
  const [result] = await db.query(
    `UPDATE calificacion 
     SET deleted_at = CURRENT_TIMESTAMP 
     WHERE id_calificacion = ? AND deleted_at IS NULL`,
    [id]
  );
  return { 
    mensaje: result.affectedRows > 0 ? 'Calificación eliminada correctamente' : 'Calificación no encontrada' 
  };
};

// Obtener calificaciones eliminadas
exports.obtenerCalificacionesEliminadas = async () => {
  const [rows] = await db.query(`
    SELECT 
      id_calificacion,
      id_alumno,
      id_materia,
      id_docente,
      id_curso,
      anio_lectivo,
      cuatrimestre,
      nota_1,
      nota_2,
      nota_3,
      promedio_cuatrimestre,
      periodo_complementario,
      calificacion_definitiva,
      estado,
      created_at,
      updated_at,
      deleted_at
    FROM calificacion
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `);
  return rows;
};

// Restaurar una calificación eliminada
exports.restaurarCalificacion = async (id) => {
  const [result] = await db.query(
    `UPDATE calificacion 
     SET deleted_at = NULL 
     WHERE id_calificacion = ? AND deleted_at IS NOT NULL`,
    [id]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Calificación no encontrada o no está eliminada');
  }

  const [calificacion] = await db.query(
    `SELECT 
      id_calificacion,
      id_alumno,
      id_materia,
      id_docente,
      id_curso,
      anio_lectivo,
      cuatrimestre,
      nota_1,
      nota_2,
      nota_3,
      promedio_cuatrimestre,
      periodo_complementario,
      calificacion_definitiva,
      estado
     FROM calificacion 
     WHERE id_calificacion = ?`,
    [id]
  );

  return calificacion[0];
};