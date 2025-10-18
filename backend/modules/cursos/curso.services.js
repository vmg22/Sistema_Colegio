const db = require('../../config/db');

// Obtener todos los cursos activos
exports.obtenerTodosCursos = async () => {
  const [rows] = await db.query(`
    SELECT 
      id_curso, 
      nombre, 
      anio, 
      division, 
      turno, 
      id_docente_tutor, 
      estado, 
      created_at, 
      updated_at
    FROM curso
    WHERE deleted_at IS NULL
  `);
  return rows;
};

// Obtener un curso por su ID
exports.obtenerCursoPorId = async (id) => {
  const [rows] = await db.query(
    `SELECT 
      id_curso, 
      nombre, 
      anio, 
      division, 
      turno, 
      id_docente_tutor, 
      estado, 
      created_at, 
      updated_at
     FROM curso 
     WHERE id_curso = ? AND deleted_at IS NULL`,
    [id]
  );
  return rows[0];
};

// Crear un nuevo curso
exports.crearCurso = async (data) => {
  const {
    nombre,
    anio,
    division,
    turno,
    id_docente_tutor,
    estado
  } = data;

  const [result] = await db.query(
    `INSERT INTO curso 
      (nombre, anio, division, turno, id_docente_tutor, estado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      anio,
      division,
      turno,
      id_docente_tutor || null,
      estado || 'activo'
    ]
  );

  return { id_curso: result.insertId, ...data };
};

// Actualizar un curso
exports.actualizarCurso = async (id, data) => {
  const {
    nombre,
    anio,
    division,
    turno,
    id_docente_tutor,
    estado
  } = data;

  const [result] = await db.query(
    `UPDATE curso
     SET 
       nombre = ?, 
       anio = ?, 
       division = ?, 
       turno = ?, 
       id_docente_tutor = ?, 
       estado = ?, 
       updated_at = CURRENT_TIMESTAMP
     WHERE id_curso = ? AND deleted_at IS NULL`,
    [
      nombre,
      anio,
      division,
      turno,
      id_docente_tutor || null,
      estado,
      id
    ]
  );

  return result.affectedRows > 0;
};

// Eliminar (lógicamente) un curso
exports.eliminarCurso = async (id) => {
  const [result] = await db.query(
    `UPDATE curso 
     SET deleted_at = CURRENT_TIMESTAMP 
     WHERE id_curso = ? AND deleted_at IS NULL`,
    [id]
  );
  return { 
    mensaje: result.affectedRows > 0 ? 'Curso eliminado correctamente' : 'Curso no encontrado' 
  };
};

// Obtener cursos eliminados
exports.obtenerCursosEliminados = async () => {
  const [rows] = await db.query(`
    SELECT 
      id_curso, 
      nombre, 
      anio, 
      division, 
      turno, 
      id_docente_tutor, 
      estado, 
      created_at, 
      updated_at,
      deleted_at
    FROM curso
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `);
  return rows;
};

// Restaurar un curso eliminado
exports.restaurarCurso = async (id) => {
  const [result] = await db.query(
    `UPDATE curso 
     SET deleted_at = NULL 
     WHERE id_curso = ? AND deleted_at IS NOT NULL`,
    [id]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Curso no encontrado o no está eliminado');
  }

  const [curso] = await db.query(
    `SELECT 
      id_curso, 
      nombre, 
      anio, 
      division, 
      turno, 
      id_docente_tutor, 
      estado
     FROM curso 
     WHERE id_curso = ?`,
    [id]
  );

  return curso[0];
};