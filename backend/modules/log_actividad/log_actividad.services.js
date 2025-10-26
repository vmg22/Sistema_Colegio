// log_actividad.services.js

const db = require('../../config/db');
const consultas = require('./log_actividad.queries');

// ---------------------------
// HELPERS (No se exportan)
// ---------------------------
const obtenerLogPorId = async (id) => {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  return rows[0];
};

// ---------------------------
// FUNCIONES CRUD
// ---------------------------

exports.obtenerTodasActividades = async () => {
  const [rows] = await db.query(consultas.obtenerTodos);
  return rows;
};

exports.obtenerActividadPorId = obtenerLogPorId;

exports.crearActividad = async (data) => {
  const {
    id_usuario,
    accion,
    tabla_afectada,
    id_registro,
    ip_address
  } = data;

  // Validación de campos obligatorios
  if (!id_usuario || !accion) {
    throw new Error('id_usuario y accion son obligatorios');
  }

  const [result] = await db.query(consultas.crear, [
    id_usuario,
    accion,
    tabla_afectada || null,
    id_registro || null,
    ip_address || null
  ]);

  // Obtener el registro recién creado
  const actividadCreada = await obtenerLogPorId(result.insertId);
  
  return actividadCreada;
};

// Los logs son inmutables: no se implementan actualizar, eliminar, ni restaurar.