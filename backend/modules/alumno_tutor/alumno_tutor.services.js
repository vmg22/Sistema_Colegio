const db = require('../../config/db');
const consultas = require('./alumno_tutor.query');

// Obtener todas las relaciones alumno-tutor activas
exports.obtenerTodosAlumnoTutor = async () => {
  const [rows] = await db.query(consultas.obtenerTodos);
  return rows;
};

// Obtener una relación por su ID
exports.obtenerAlumnoTutorPorId = async (id) => {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  return rows[0];
};

// Obtener tutores de un alumno
exports.obtenerTutoresPorAlumno = async (idAlumno) => {
  const [rows] = await db.query(consultas.obtenerPorAlumno, [idAlumno]);
  return rows;
};

// Obtener alumnos de un tutor
exports.obtenerAlumnosPorTutor = async (idTutor) => {
  const [rows] = await db.query(consultas.obtenerPorTutor, [idTutor]);
  return rows;
};

// Crear una nueva relación alumno-tutor
exports.crearAlumnoTutor = async (data) => {
  const {
    id_alumno,
    id_tutor,
    es_principal
  } = data;

  // Validación adicional
  if (!id_alumno || !id_tutor) {
    throw new Error('id_alumno e id_tutor son obligatorios');
  }

  // Verificar si ya existe la relación
  const [existente] = await db.query(consultas.verificarExistente, [id_alumno, id_tutor]);
  
  if (existente.length > 0) {
    throw new Error('La relación alumno-tutor ya existe');
  }

  const [result] = await db.query(consultas.crear, [
    id_alumno,
    id_tutor,
    es_principal !== undefined ? es_principal : 1
  ]);

  // Obtener la relación recién creada con todos sus campos
  const [relacionCreada] = await db.query(consultas.obtenerPorId, [result.insertId]);
  
  return relacionCreada[0];
};

// Actualizar una relación alumno-tutor
exports.actualizarAlumnoTutor = async (id, data) => {
  // Primero verificar que la relación existe
  const relacionExistente = await exports.obtenerAlumnoTutorPorId(id);
  
  if (!relacionExistente) {
    throw new Error('Relación alumno-tutor no encontrada');
  }

  const {
    id_alumno,
    id_tutor,
    es_principal
  } = data;

  // Si se cambian alumno o tutor, verificar que no exista la nueva combinación
  const nuevoAlumno = id_alumno || relacionExistente.id_alumno;
  const nuevoTutor = id_tutor || relacionExistente.id_tutor;

  if (nuevoAlumno !== relacionExistente.id_alumno || nuevoTutor !== relacionExistente.id_tutor) {
    const [existente] = await db.query(consultas.verificarExistente, [nuevoAlumno, nuevoTutor]);
    
    if (existente.length > 0 && existente[0].id_alumno_tutor !== parseInt(id)) {
      throw new Error('La relación alumno-tutor ya existe');
    }
  }

  const [result] = await db.query(consultas.actualizarCompleto, [
    nuevoAlumno,
    nuevoTutor,
    es_principal !== undefined ? es_principal : relacionExistente.es_principal,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar la relación alumno-tutor');
  }

  // Retornar la relación actualizada
  const [relacionActualizada] = await db.query(consultas.obtenerPorId, [id]);
  return relacionActualizada[0];
};

// Actualización parcial
exports.actualizarAlumnoTutorParcial = async (id, data) => {
  // Primero verificar que la relación existe
  const relacionExistente = await exports.obtenerAlumnoTutorPorId(id);
  
  if (!relacionExistente) {
    throw new Error('Relación alumno-tutor no encontrada');
  }

  // Filtrar solo los campos que vienen en data
  const camposActualizar = {};
  const camposPermitidos = ['id_alumno', 'id_tutor', 'es_principal'];

  camposPermitidos.forEach(campo => {
    if (data[campo] !== undefined) {
      camposActualizar[campo] = data[campo];
    }
  });

  // Si no hay campos para actualizar, retornar la relación actual
  if (Object.keys(camposActualizar).length === 0) {
    return relacionExistente;
  }

  // Si se cambian alumno o tutor, verificar que no exista la nueva combinación
  const nuevoAlumno = camposActualizar.id_alumno || relacionExistente.id_alumno;
  const nuevoTutor = camposActualizar.id_tutor || relacionExistente.id_tutor;

  if ((camposActualizar.id_alumno && camposActualizar.id_alumno !== relacionExistente.id_alumno) ||
      (camposActualizar.id_tutor && camposActualizar.id_tutor !== relacionExistente.id_tutor)) {
    const [existente] = await db.query(consultas.verificarExistente, [nuevoAlumno, nuevoTutor]);
    
    if (existente.length > 0 && existente[0].id_alumno_tutor !== parseInt(id)) {
      throw new Error('La relación alumno-tutor ya existe');
    }
  }

  // Construir la query dinámica
  const setClauses = Object.keys(camposActualizar).map(campo => `${campo} = ?`);
  const valores = Object.values(camposActualizar);
  
  const query = `
    UPDATE alumno_tutor
    SET 
      ${setClauses.join(', ')},
      updated_at = CURRENT_TIMESTAMP
    WHERE id_alumno_tutor = ? AND deleted_at IS NULL
  `;

  valores.push(id);

  const [result] = await db.query(query, valores);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar la relación alumno-tutor');
  }

  // Retornar la relación actualizada
  const [relacionActualizada] = await db.query(consultas.obtenerPorId, [id]);
  return relacionActualizada[0];
};

// Eliminar lógicamente una relación
exports.eliminarAlumnoTutor = async (id) => {
  // Verificar que existe antes de eliminar
  const relacionExistente = await exports.obtenerAlumnoTutorPorId(id);
  
  if (!relacionExistente) {
    throw new Error('Relación alumno-tutor no encontrada');
  }

  const [result] = await db.query(consultas.eliminarLogico, [id]);
  
  return { 
    mensaje: result.affectedRows > 0 ? 'Relación alumno-tutor eliminada correctamente' : 'No se pudo eliminar la relación',
    id_alumno_tutor: id
  };
};

// Obtener relaciones eliminadas
exports.obtenerAlumnoTutorEliminados = async () => {
  const [rows] = await db.query(consultas.obtenerEliminados);
  return rows;
};

// Restaurar una relación eliminada
exports.restaurarAlumnoTutor = async (id) => {
  const [result] = await db.query(consultas.restaurar, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error('Relación alumno-tutor no encontrada o no está eliminada');
  }

  // Retornar la relación restaurada
  const [relacion] = await db.query(consultas.obtenerPorId, [id]);
  return relacion[0];
};