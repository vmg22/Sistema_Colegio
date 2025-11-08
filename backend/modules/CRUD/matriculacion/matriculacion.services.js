const db = require('../../../config/db');
const consultas = require('./matriculacion.queries');

/**
 * Obtener una matrícula por ID
 */
async function obtenerMatriculaPorId(id) {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  if (rows.length === 0) {
    throw new Error('Matrícula no encontrada');
  }
  return rows[0];
}

/**
 * Obtener todas las matrículas (con filtros opcionales)
 * @param {Object} filtros - { id_curso, id_alumno, anio_lectivo }
 */
async function obtenerTodasMatriculas(filtros = {}) {
  let query = consultas.obtenerTodos;
  const params = [];

  // Filtros dinámicos
  if (filtros.id_curso) {
    query += ' AND i.id_curso = ?';
    params.push(filtros.id_curso);
  }
  if (filtros.id_alumno) {
    query += ' AND i.id_alumno = ?';
    params.push(filtros.id_alumno);
  }
  if (filtros.anio_lectivo) {
    query += ' AND i.anio_lectivo = ?';
    params.push(filtros.anio_lectivo);
  }

  query += ' ORDER BY i.anio_lectivo DESC, c.anio, c.division, a.apellido_alumno';

  const [matriculas] = await db.query(query, params);
  return matriculas;
}

/**
 * Crear una nueva matrícula
 */
async function crearMatricula(data) {
  const { id_alumno, id_curso, anio_lectivo, estado } = data;

  if (!id_alumno || !id_curso || !anio_lectivo) {
    throw new Error('Alumno, Curso y Año Lectivo son obligatorios para la matrícula');
  }

  // Validar duplicados
  const [existente] = await db.query(consultas.verificarExistencia, [id_alumno, id_curso, anio_lectivo]);
  if (existente.length > 0) {
    throw new Error('El alumno ya está matriculado en este curso para este año lectivo.');
  }

  const [result] = await db.query(consultas.crear, [
    id_alumno,
    id_curso,
    anio_lectivo,
    estado || 'regular'
  ]);

  return await obtenerMatriculaPorId(result.insertId);
}

/**
 * Actualizar matrícula (solo estado y año)
 */
async function actualizarMatricula(id, data) {
  const matriculaActual = await obtenerMatriculaPorId(id); // Valida existencia

  const anioNuevo = data.anio_lectivo || matriculaActual.anio_lectivo;
  const estadoNuevo = data.estado || matriculaActual.estado;

  if (data.anio_lectivo && data.anio_lectivo != matriculaActual.anio_lectivo) {
      const [existente] = await db.query(consultas.verificarExistencia, [
          matriculaActual.id_alumno, 
          matriculaActual.id_curso, 
          anioNuevo
      ]);
      if (existente.length > 0) {
        throw new Error('Conflicto de matrícula: El alumno ya existe en este curso para el nuevo año lectivo.');
      }
  }

  await db.query(consultas.actualizar, [anioNuevo, estadoNuevo, id]);
  return await obtenerMatriculaPorId(id);
}

/**
 * Eliminar matrícula (Soft Delete)
 */
async function eliminarMatricula(id) {
  await obtenerMatriculaPorId(id); // Valida existencia
  await db.query(consultas.eliminarLogico, [id]);
  return { message: 'Matrícula dada de baja correctamente', id_matricula: id };
}

/**
 * Obtener matrículas dadas de baja
 */
async function obtenerMatriculasEliminadas() {
  const [rows] = await db.query(consultas.obtenerEliminados);
  return rows;
}

/**
 * Restaurar matrícula
 */
async function restaurarMatricula(id) {
  const [result] = await db.query(consultas.restaurar, [id]);
  if (result.affectedRows === 0) {
    throw new Error('Matrícula no encontrada o no está dada de baja');
  }
  return await obtenerMatriculaPorId(id);
}

module.exports = {
  obtenerTodasMatriculas,
  obtenerMatriculaPorId,
  crearMatricula,
  actualizarMatricula,
  eliminarMatricula,
  obtenerMatriculasEliminadas,
  restaurarMatricula
};