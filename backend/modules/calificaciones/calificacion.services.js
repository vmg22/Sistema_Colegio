const db = require('../../config/db');
const consultas = require('./calificacion.queries'); 

// Obtener todas las calificaciones activas
exports.obtenerTodasCalificaciones = async () => {
  const [rows] = await db.query(consultas.obtenerTodas);
  return rows;
};

// Obtener una calificación por su ID
exports.obtenerCalificacionPorId = async (id) => {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
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

  // Validación adicional
  if (!id_alumno || !id_materia || !id_docente || !id_curso) {
    throw new Error('Alumno, materia, docente y curso son obligatorios');
  }

  const [result] = await db.query(consultas.crear, [
    id_alumno,
    id_materia,
    id_docente,
    id_curso,
    anio_lectivo || null,
    cuatrimestre || null,
    nota_1 || null,
    nota_2 || null,
    nota_3 || null,
    promedio_cuatrimestre || null,
    periodo_complementario || null,
    calificacion_definitiva || null,
    estado || 'cursando'
  ]);

  // Obtener la calificación recién creada con todos sus campos
  const [calificacionCreada] = await db.query(consultas.obtenerPorId, [result.insertId]);
  
  return calificacionCreada[0];
};

// Actualizar una calificación

exports.actualizarCalificacion = async (id, data) => {
  // Primero verificar que la calificación existe
  const calificacionExistente = await exports.obtenerCalificacionPorId(id);
  
  if (!calificacionExistente) {
    throw new Error('Calificación no encontrada');
  }

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

  // Usar los valores existentes si no se proporcionan nuevos
  const [result] = await db.query(consultas.actualizarCompleto, [
    id_alumno !== undefined ? id_alumno : calificacionExistente.id_alumno,
    id_materia !== undefined ? id_materia : calificacionExistente.id_materia,
    id_docente !== undefined ? id_docente : calificacionExistente.id_docente,
    id_curso !== undefined ? id_curso : calificacionExistente.id_curso,
    anio_lectivo !== undefined ? anio_lectivo : calificacionExistente.anio_lectivo,
    cuatrimestre !== undefined ? cuatrimestre : calificacionExistente.cuatrimestre,
    nota_1 !== undefined ? nota_1 : calificacionExistente.nota_1,
    nota_2 !== undefined ? nota_2 : calificacionExistente.nota_2,
    nota_3 !== undefined ? nota_3 : calificacionExistente.nota_3,
    promedio_cuatrimestre !== undefined ? promedio_cuatrimestre : calificacionExistente.promedio_cuatrimestre,
    periodo_complementario !== undefined ? periodo_complementario : calificacionExistente.periodo_complementario,
    calificacion_definitiva !== undefined ? calificacion_definitiva : calificacionExistente.calificacion_definitiva,
    estado !== undefined ? estado : calificacionExistente.estado,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar la calificación');
  }

  // Retornar la calificación actualizada
  const [calificacionActualizada] = await db.query(consultas.obtenerPorId, [id]);
  return calificacionActualizada[0];
};

exports.actualizarCalificacionParcial = async (id, data) => {
  // Verificar que existe
  const calificacionExistente = await exports.obtenerCalificacionPorId(id);
  
  if (!calificacionExistente) {
    throw new Error('Calificación no encontrada');
  }

  const {
    nota_1,
    nota_2,
    nota_3,
    promedio_cuatrimestre,
    periodo_complementario,
    calificacion_definitiva,
    estado
  } = data;

  const [result] = await db.query(consultas.actualizarParcial, [
    nota_1 !== undefined ? nota_1 : null,
    nota_2 !== undefined ? nota_2 : null,
    nota_3 !== undefined ? nota_3 : null,
    promedio_cuatrimestre !== undefined ? promedio_cuatrimestre : null,
    periodo_complementario !== undefined ? periodo_complementario : null,
    calificacion_definitiva !== undefined ? calificacion_definitiva : null,
    estado !== undefined ? estado : null,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar la calificación');
  }

  // Retornar la calificación actualizada
  const [calificacionActualizada] = await db.query(consultas.obtenerPorId, [id]);
  return calificacionActualizada[0];
};

// Eliminar lógicamente una calificación
exports.eliminarCalificacion = async (id) => {
  // Verificar que existe antes de eliminar
  const calificacionExistente = await exports.obtenerCalificacionPorId(id);
  
  if (!calificacionExistente) {
    throw new Error('Calificación no encontrada');
  }

  const [result] = await db.query(consultas.eliminarLogico, [id]);
  
  return { 
    mensaje: result.affectedRows > 0 ? 'Calificación eliminada correctamente' : 'No se pudo eliminar la calificación',
    id_calificacion: id
  };
};

// Obtener calificaciones eliminadas
exports.obtenerCalificacionesEliminadas = async () => {
  const [rows] = await db.query(consultas.obtenerEliminadas);
  return rows;
};

// Restaurar una calificación eliminada
exports.restaurarCalificacion = async (id) => {
  const [result] = await db.query(consultas.restaurar, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error('Calificación no encontrada o no está eliminada');
  }

  // Retornar la calificación restaurada
  const [calificacion] = await db.query(consultas.obtenerPorId, [id]);
  return calificacion[0];
};