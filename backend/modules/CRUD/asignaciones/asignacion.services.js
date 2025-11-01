const db = require('../../../config/db');
const consultas = require('./asignacion.queries');

/**
 * Obtiene una asignación única por su ID (con nombres/JOINs)
 */
async function obtenerAsignacionPorId(id) {
  const query = `${consultas.obtenerBase} WHERE asig.id_asignacion = ? AND asig.deleted_at IS NULL`;
  const [rows] = await db.query(query, [id]);
  if (rows.length === 0) {
    throw new Error('Asignación no encontrada');
  }
  return rows[0];
}

/**
 * Obtiene una lista de asignaciones con filtros dinámicos
 * @param {object} queryParams - Ej: { id_docente: 5, anio_lectivo: 2025 }
 */
async function obtenerAsignaciones(queryParams) {
  let query = consultas.obtenerBase;
  const whereClauses = ['asig.deleted_at IS NULL'];
  const params = [];

  if (queryParams.id_docente) {
    whereClauses.push('asig.id_docente = ?');
    params.push(queryParams.id_docente);
  }
  if (queryParams.id_curso) {
    whereClauses.push('asig.id_curso = ?');
    params.push(queryParams.id_curso);
  }
  if (queryParams.id_materia) {
    whereClauses.push('asig.id_materia = ?');
    params.push(queryParams.id_materia);
  }
  if (queryParams.anio_lectivo) {
    whereClauses.push('asig.anio_lectivo = ?');
    params.push(queryParams.anio_lectivo);
  }

  if (whereClauses.length > 0) {
    query += ` WHERE ${whereClauses.join(' AND ')}`;
  }
  
  query += ` ORDER BY asig.anio_lectivo DESC, c.anio, c.division, m.nombre`;

  const [asignaciones] = await db.query(query, params);
  return asignaciones;
}

/**
 * Crea una nueva asignación
 */
async function crearAsignacion(data) {
  const { id_docente, id_curso, id_materia, anio_lectivo } = data;

  if (!id_docente || !id_curso || !id_materia || !anio_lectivo) {
    throw new Error('id_docente, id_curso, id_materia y anio_lectivo son obligatorios');
  }

  const [existentes] = await db.query(consultas.verificarExiste, [
    id_docente, id_curso, id_materia, anio_lectivo
  ]);

  if (existentes.length > 0) {
    throw new Error('Esta asignación ya existe para este año lectivo.');
  }

  const [result] = await db.query(consultas.crear, [
    id_docente, id_curso, id_materia, anio_lectivo
  ]);

  return await obtenerAsignacionPorId(result.insertId);
}

/**
 * Actualiza parcialmente una asignación (PATCH)
 * @param {number} id - ID de la asignación
 * @param {Object} data - Datos a actualizar (ej: { estado: 'inactivo' })
 */
async function actualizarAsignacion(id, data) {
  
  // 1. Obtener datos actuales (simple, sin JOINs)
  const [rows] = await db.query(consultas.obtenerPorIdSimple, [id]);
  if (rows.length === 0) {
    throw new Error('Asignación no encontrada');
  }
  const existente = rows[0];

  // 2. Fusionar datos
  const dataFinal = {
    anio_lectivo: data.anio_lectivo !== undefined ? data.anio_lectivo : existente.anio_lectivo,
    estado: data.estado !== undefined ? data.estado : existente.estado,
  };
  
  // 3. Verificar si el cambio viola la UNIQUE key
  if (data.anio_lectivo !== undefined && data.anio_lectivo != existente.anio_lectivo) {
     const [duplicados] = await db.query(consultas.verificarExiste, [
        existente.id_docente,
        existente.id_curso,
        existente.id_materia,
        dataFinal.anio_lectivo
     ]);
     
     if (duplicados.length > 0 && duplicados[0].id_asignacion != id) {
        throw new Error('Conflicto: Esta asignación (docente, curso, materia) ya existe para el nuevo año lectivo.');
     }
  }

  // 4. Ejecutar la actualización
  await db.query(consultas.actualizar, [
    dataFinal.anio_lectivo,
    dataFinal.estado,
    id
  ]);

  // 5. Devolver la asignación actualizada (con JOINs)
  return await obtenerAsignacionPorId(id);
}

/**
 * Elimina (soft delete) una asignación
 */
async function eliminarAsignacion(id) {
  const asignacion = await obtenerAsignacionPorId(id); // Verifica que existe

  const [result] = await db.query(consultas.eliminar, [id]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo eliminar la asignación');
  }

  return { 
    message: 'Asignación eliminada correctamente', 
    id_asignacion: id 
  };
}

// Exportamos todas las funciones
module.exports = {
  obtenerAsignaciones,
  obtenerAsignacionPorId,
  crearAsignacion,
  actualizarAsignacion,
  eliminarAsignacion,
};