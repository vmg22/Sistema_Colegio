const db = require('../../config/db');
const consultas = require('./comunicacion.queries');

// Obtener todas las comunicaciones activas
exports.obtenerTodasComunicaciones = async () => {
  const [rows] = await db.query(consultas.obtenerTodas);
  return rows;
};

// Obtener una comunicación por su ID
exports.obtenerComunicacionPorId = async (id) => {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  return rows[0];
};

// Crear una nueva comunicación
exports.crearComunicacion = async (data) => {
  const {
    asunto,
    contenido,
    id_usuario,
    destinatario_tipo,
    fecha_envio
  } = data;

  // Validación adicional
  if (!asunto || !contenido || !destinatario_tipo) {
    throw new Error('Asunto, contenido y destinatario_tipo son obligatorios');
  }

  const [result] = await db.query(consultas.crear, [
    asunto,
    contenido,
    id_usuario,
    destinatario_tipo,
    fecha_envio || null
  ]);

  // Obtener la comunicación recién creada
  const [comunicacionCreada] = await db.query(consultas.obtenerPorId, [result.insertId]);
  
  return comunicacionCreada[0];
};

// Actualizar una comunicación completa
exports.actualizarComunicacion = async (id, data) => {
  // Verificar que existe
  const comunicacionExistente = await exports.obtenerComunicacionPorId(id);
  
  if (!comunicacionExistente) {
    throw new Error('Comunicación no encontrada');
  }

  const {
    asunto,
    contenido,
    id_usuario,
    destinatario_tipo,
    fecha_envio
  } = data;

  const [result] = await db.query(consultas.actualizarCompleto, [
    asunto || comunicacionExistente.asunto,
    contenido || comunicacionExistente.contenido,
    id_usuario !== undefined ? id_usuario : comunicacionExistente.id_usuario,
    destinatario_tipo || comunicacionExistente.destinatario_tipo,
    fecha_envio !== undefined ? fecha_envio : comunicacionExistente.fecha_envio,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar la comunicación');
  }

  // Retornar la comunicación actualizada
  const [comunicacionActualizada] = await db.query(consultas.obtenerPorId, [id]);
  return comunicacionActualizada[0];
};

// Actualizar comunicación parcial
exports.actualizarComunicacionParcial = async (id, data) => {
  // Verificar que existe
  const comunicacionExistente = await exports.obtenerComunicacionPorId(id);
  
  if (!comunicacionExistente) {
    throw new Error('Comunicación no encontrada');
  }

  const {
    asunto,
    contenido,
    destinatario_tipo,
    fecha_envio
  } = data;

  const [result] = await db.query(consultas.actualizarParcial, [
    asunto !== undefined ? asunto : null,
    contenido !== undefined ? contenido : null,
    destinatario_tipo !== undefined ? destinatario_tipo : null,
    fecha_envio !== undefined ? fecha_envio : null,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar la comunicación');
  }

  // Retornar la comunicación actualizada
  const [comunicacionActualizada] = await db.query(consultas.obtenerPorId, [id]);
  return comunicacionActualizada[0];
};

// Eliminar lógicamente una comunicación
exports.eliminarComunicacion = async (id) => {
  // Verificar que existe
  const comunicacionExistente = await exports.obtenerComunicacionPorId(id);
  
  if (!comunicacionExistente) {
    throw new Error('Comunicación no encontrada');
  }

  const [result] = await db.query(consultas.eliminarLogico, [id]);
  
  return { 
    mensaje: result.affectedRows > 0 ? 'Comunicación eliminada correctamente' : 'No se pudo eliminar la comunicación',
    id_comunicacion: id
  };
};

// Obtener comunicaciones eliminadas
exports.obtenerComunicacionesEliminadas = async () => {
  const [rows] = await db.query(consultas.obtenerEliminadas);
  return rows;
};

// Restaurar una comunicación eliminada
exports.restaurarComunicacion = async (id) => {
  const [result] = await db.query(consultas.restaurar, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error('Comunicación no encontrada o no está eliminada');
  }

  // Retornar la comunicación restaurada
  const [comunicacion] = await db.query(consultas.obtenerPorId, [id]);
  return comunicacion[0];
};