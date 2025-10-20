const db = require('../../config/db');
const consultas = require('./anio.queries'); 

// Obtener todos los años lectivos activos
exports.obtenerTodosAniosLectivos = async () => {
  const [rows] = await db.query(consultas.obtenerTodos);
  return rows;
};

// Obtener un año lectivo por su ID
exports.obtenerAnioLectivoPorId = async (id) => {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  return rows[0];
};

// Crear un nuevo año lectivo
exports.crearAnioLectivo = async (data) => {
  const {
    anio,
    fecha_inicio,
    fecha_fin,
    estado
  } = data;

  // Validación adicional
  if (!anio || !fecha_inicio || !fecha_fin) {
    throw new Error('Año, fecha inicio y fecha fin son obligatorios');
  }

  const [result] = await db.query(consultas.crear, [
    anio,
    fecha_inicio,
    fecha_fin,
    estado || 'planificacion'
  ]);

  // Obtener el año lectivo recién creado con todos sus campos
  const [anioLectivoCreado] = await db.query(consultas.obtenerPorId, [result.insertId]);
  
  return anioLectivoCreado[0];
};

// Actualizar un año lectivo
exports.actualizarAnioLectivo = async (id, data) => {
  // Primero verificar que el año lectivo existe
  const anioLectivoExistente = await exports.obtenerAnioLectivoPorId(id);
  
  if (!anioLectivoExistente) {
    throw new Error('Año lectivo no encontrado');
  }

  const {
    anio,
    fecha_inicio,
    fecha_fin,
    estado
  } = data;

  const [result] = await db.query(consultas.actualizarCompleto, [
    anio || anioLectivoExistente.anio,
    fecha_inicio || anioLectivoExistente.fecha_inicio,
    fecha_fin || anioLectivoExistente.fecha_fin,
    estado || anioLectivoExistente.estado,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar el año lectivo');
  }

  // Retornar el año lectivo actualizado
  const [anioLectivoActualizado] = await db.query(consultas.obtenerPorId, [id]);
  return anioLectivoActualizado[0];
};

exports.actualizarAnioLectivoParcial = async (id, data) => {
  // Verificar que existe
  const anioLectivoExistente = await exports.obtenerAnioLectivoPorId(id);
  
  if (!anioLectivoExistente) {
    throw new Error('Año lectivo no encontrado');
  }

  const {
    fecha_inicio,
    fecha_fin,
    estado
  } = data;

  const [result] = await db.query(consultas.actualizarParcial, [
    fecha_inicio !== undefined ? fecha_inicio : null,
    fecha_fin !== undefined ? fecha_fin : null,
    estado !== undefined ? estado : null,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar el año lectivo');
  }

  // Retornar el año lectivo actualizado
  const [anioLectivoActualizado] = await db.query(consultas.obtenerPorId, [id]);
  return anioLectivoActualizado[0];
};

// Eliminar lógicamente un año lectivo
exports.eliminarAnioLectivo = async (id) => {
  // Verificar que existe antes de eliminar
  const anioLectivoExistente = await exports.obtenerAnioLectivoPorId(id);
  
  if (!anioLectivoExistente) {
    throw new Error('Año lectivo no encontrado');
  }

  const [result] = await db.query(consultas.eliminarLogico, [id]);
  
  return { 
    mensaje: result.affectedRows > 0 ? 'Año lectivo eliminado correctamente' : 'No se pudo eliminar el año lectivo',
    id_anio_lectivo: id
  };
};

// Obtener años lectivos eliminados
exports.obtenerAniosLectivosEliminados = async () => {
  const [rows] = await db.query(consultas.obtenerEliminados);
  return rows;
};

// Restaurar un año lectivo eliminado
exports.restaurarAnioLectivo = async (id) => {
  const [result] = await db.query(consultas.restaurar, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error('Año lectivo no encontrado o no está eliminado');
  }

  // Retornar el año lectivo restaurado
  const [anioLectivo] = await db.query(consultas.obtenerPorId, [id]);
  return anioLectivo[0];
};