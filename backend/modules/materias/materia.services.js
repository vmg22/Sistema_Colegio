const db = require('../../config/db');

// Obtener todas las materias activas
exports.obtenerTodasMaterias = async () => {
  const [rows] = await db.query(`
    SELECT 
      id_materia, 
      nombre, 
      descripcion, 
      carga_horaria, 
      nivel, 
      ciclo, 
      estado, 
      created_at, 
      updated_at
    FROM materia
    WHERE deleted_at IS NULL
  `);
  return rows;
};

// Obtener una materia por su ID
exports.obtenerMateriaPorId = async (id) => {
  const [rows] = await db.query(
    `SELECT 
      id_materia, 
      nombre, 
      descripcion, 
      carga_horaria, 
      nivel, 
      ciclo, 
      estado, 
      created_at, 
      updated_at
     FROM materia 
     WHERE id_materia = ? AND deleted_at IS NULL`,
    [id]
  );
  return rows[0];
};

// Crear una nueva materia
exports.crearMateria = async (data) => {
  const {
    nombre,
    descripcion,
    carga_horaria,
    nivel,
    ciclo,
    estado
  } = data;

  const [result] = await db.query(
    `INSERT INTO materia 
      (nombre, descripcion, carga_horaria, nivel, ciclo, estado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      descripcion || null,
      carga_horaria || null,
      nivel,
      ciclo || 'basico',
      estado || 'activa'
    ]
  );

  return { id_materia: result.insertId, ...data };
};

// Actualizar una materia
exports.actualizarMateria = async (id, data) => {
  const {
    nombre,
    descripcion,
    carga_horaria,
    nivel,
    ciclo,
    estado
  } = data;

  const [result] = await db.query(
    `UPDATE materia
     SET 
       nombre = ?, 
       descripcion = ?, 
       carga_horaria = ?, 
       nivel = ?, 
       ciclo = ?, 
       estado = ?, 
       updated_at = CURRENT_TIMESTAMP
     WHERE id_materia = ? AND deleted_at IS NULL`,
    [
      nombre,
      descripcion,
      carga_horaria,
      nivel,
      ciclo,
      estado,
      id
    ]
  );

  return result.affectedRows > 0;
};

// Eliminar (lógicamente) una materia
exports.eliminarMateria = async (id) => {
  const [result] = await db.query(
    `UPDATE materia 
     SET deleted_at = CURRENT_TIMESTAMP 
     WHERE id_materia = ? AND deleted_at IS NULL`,
    [id]
  );
  return { 
    mensaje: result.affectedRows > 0 ? 'Materia eliminada correctamente' : 'Materia no encontrada' 
  };
};

// Obtener materias eliminadas
exports.obtenerMateriasEliminadas = async () => {
  const [rows] = await db.query(`
    SELECT 
      id_materia, 
      nombre, 
      descripcion, 
      carga_horaria, 
      nivel, 
      ciclo, 
      estado, 
      created_at, 
      updated_at,
      deleted_at
    FROM materia
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `);
  return rows;
};

// Restaurar una materia eliminada
exports.restaurarMateria = async (id) => {
  const [result] = await db.query(
    `UPDATE materia 
     SET deleted_at = NULL 
     WHERE id_materia = ? AND deleted_at IS NOT NULL`,
    [id]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Materia no encontrada o no está eliminada');
  }

  const [materia] = await db.query(
    `SELECT 
      id_materia, 
      nombre, 
      descripcion, 
      carga_horaria, 
      nivel, 
      ciclo, 
      estado
     FROM materia 
     WHERE id_materia = ?`,
    [id]
  );

  return materia[0];
};