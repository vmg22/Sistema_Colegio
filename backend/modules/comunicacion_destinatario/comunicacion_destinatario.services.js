// comunicacion_destinatario.services.js

const db = require('../../config/db');
const consultas = require('./comunicacion_destinatario.queries'); // Asegúrate que esta ruta es correcta

// Helper para obtener un destinatario por ID (uso interno y por el controlador)
const obtenerDestinatarioPorId = async (id) => {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  return rows[0];
};
exports.obtenerDestinatarioPorId = obtenerDestinatarioPorId;


// ---------------------------
// FUNCIONES CRUD
// ---------------------------

exports.obtenerTodosDestinatarios = async () => {
  const [rows] = await db.query(consultas.obtenerTodos);
  return rows;
};

exports.crearDestinatario = async (data) => {
  const {
    id_comunicacion,
    id_alumno,
    id_docente,
    id_curso,
    id_tutor,
    email,
    asistio // opcional, por defecto es 0
  } = data;

  // Validación de campo obligatorio
  if (!id_comunicacion) {
    throw new Error('El ID de comunicación es obligatorio');
  }

  // Ejecutar la inserción
  const [result] = await db.query(consultas.crear, [
    id_comunicacion,
    id_alumno || null,
    id_docente || null,
    id_curso || null,
    id_tutor || null,
    email || null,
    asistio || 0 // Usar 0 si no se especifica
  ]);

  // Obtener el registro recién creado
  const destinatarioCreado = await obtenerDestinatarioPorId(result.insertId);
  return destinatarioCreado;
};

exports.actualizarDestinatario = async (id, data) => {
  // 1. Verificar existencia
  const destinatarioExistente = await obtenerDestinatarioPorId(id);
  
  if (!destinatarioExistente) {
    throw new Error('Destinatario no encontrado');
  }

  const {
    id_comunicacion,
    id_alumno,
    id_docente,
    id_curso,
    id_tutor,
    email,
    asistio
  } = data;

  // 2. Ejecutar la actualización completa
  const [result] = await db.query(consultas.actualizarCompleto, [
    // Usar el valor nuevo si existe, si no, usar el existente
    id_comunicacion || destinatarioExistente.id_comunicacion,
    id_alumno !== undefined ? id_alumno : destinatarioExistente.id_alumno,
    id_docente !== undefined ? id_docente : destinatarioExistente.id_docente,
    id_curso !== undefined ? id_curso : destinatarioExistente.id_curso,
    id_tutor !== undefined ? id_tutor : destinatarioExistente.id_tutor,
    email !== undefined ? email : destinatarioExistente.email,
    asistio !== undefined ? asistio : destinatarioExistente.asistio,
    id // WHERE clause
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar el destinatario');
  }

  // 3. Retornar el registro actualizado
  const destinatarioActualizado = await obtenerDestinatarioPorId(id);
  return destinatarioActualizado;
};

exports.actualizarDestinatarioParcial = async (id, data) => {
  // 1. Verificar existencia
  const destinatarioExistente = await obtenerDestinatarioPorId(id);
  
  if (!destinatarioExistente) {
    throw new Error('Destinatario no encontrado');
  }

  const { email, asistio } = data;

  // 2. Ejecutar la actualización parcial (solo email y asistio)
  // COALESCE(?, email) en la query permite actualizar con NULL si se envía, 
  // pero aquí usamos una lógica simple para solo actualizar si se envía el valor.
  
  const [result] = await db.query(consultas.actualizarParcial, [
    email !== undefined ? email : destinatarioExistente.email,
    asistio !== undefined ? asistio : destinatarioExistente.asistio,
    id // WHERE clause
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar el destinatario');
  }

  // 3. Retornar el registro actualizado
  const destinatarioActualizado = await obtenerDestinatarioPorId(id);
  return destinatarioActualizado;
};

exports.eliminarDestinatario = async (id) => {
  // Verificar que existe
  const destinatarioExistente = await obtenerDestinatarioPorId(id);
  
  if (!destinatarioExistente) {
    throw new Error('Destinatario no encontrado');
  }

  const [result] = await db.query(consultas.eliminarLogico, [id]);
  
  return { 
    mensaje: result.affectedRows > 0 ? 'Destinatario eliminado correctamente' : 'No se pudo eliminar el destinatario',
    id_destinatario: id
  };
};

exports.obtenerDestinatariosEliminados = async () => {
  const [rows] = await db.query(consultas.obtenerEliminados);
  return rows;
};

exports.restaurarDestinatario = async (id) => {
  const [result] = await db.query(consultas.restaurar, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error('Destinatario no encontrado o no está eliminado');
  }

  const destinatarioRestaurado = await obtenerDestinatarioPorId(id);
  return destinatarioRestaurado;
};