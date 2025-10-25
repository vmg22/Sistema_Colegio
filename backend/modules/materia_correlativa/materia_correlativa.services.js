// materia_correlativa.services.js

const db = require('../../config/db');
const consultas = require('./materias_correlativa.queries'); // Importar el nuevo archivo de queries

// ---------------------------
// HELPERS (No se exportan)
// ---------------------------
const obtenerCorrelativaPorId = async (id) => {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  return rows[0];
};
exports.obtenerCorrelativaPorId = obtenerCorrelativaPorId; // Exportado para uso interno/controlador



// Obtener todas las correlativas activas
exports.obtenerTodasCorrelativas = async () => {
  const [rows] = await db.query(consultas.obtenerTodos);
  return rows;
};

// Crear una nueva correlativa
exports.crearCorrelativa = async (data) => {
  const {
    id_materia,
    id_materia_correlativa,
    tipo // opcional, por defecto 'obligatoria'
  } = data;

  // 1. Validación de campos obligatorios
  if (!id_materia || !id_materia_correlativa) {
    throw new Error('id_materia e id_materia_correlativa son obligatorios');
  }

  // 2. Validación de correlativa consigo misma
  if (id_materia === id_materia_correlativa) {
    throw new Error('Una materia no puede ser correlativa de sí misma');
  }

  const [result] = await db.query(consultas.crear, [
    id_materia,
    id_materia_correlativa,
    tipo || 'obligatoria'
  ]);

  // 3. Obtener la correlativa recién creada
  const materiaCreada = await obtenerCorrelativaPorId(result.insertId);
  
  return materiaCreada;
};

// Actualizar una correlativa (solo el tipo)
exports.actualizarCorrelativa = async (id, data) => {
  const correlativaExistente = await obtenerCorrelativaPorId(id);
  
  if (!correlativaExistente) {
    throw new Error('Correlativa no encontrada');
  }

  const { tipo } = data;
  
  // En correlativas, solo permitimos actualizar el tipo
  const [result] = await db.query(consultas.actualizarCompleto, [
    tipo || correlativaExistente.tipo,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar la correlativa');
  }

  const correlativaActualizada = await obtenerCorrelativaPorId(id);
  return correlativaActualizada;
};

// Eliminar lógicamente una correlativa
exports.eliminarCorrelativa = async (id) => {
  const correlativaExistente = await obtenerCorrelativaPorId(id);
  
  if (!correlativaExistente) {
    throw new Error('Correlativa no encontrada');
  }

  const [result] = await db.query(consultas.eliminarLogico, [id]);
  
  return { 
    mensaje: result.affectedRows > 0 ? 'Correlativa eliminada correctamente' : 'No se pudo eliminar la correlativa',
    id_correlativa: id
  };
};

// Obtener correlativas eliminadas
exports.obtenerCorrelativasEliminadas = async () => {
  const [rows] = await db.query(consultas.obtenerEliminados);
  return rows;
};

// Restaurar una correlativa eliminada
exports.restaurarCorrelativa = async (id) => {
  const [result] = await db.query(consultas.restaurar, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error('Correlativa no encontrada o no está eliminada');
  }

  const correlativaRestaurada = await obtenerCorrelativaPorId(id);
  return correlativaRestaurada;
};