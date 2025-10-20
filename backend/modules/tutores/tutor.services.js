const db = require('../../config/db');
const consultas = require('./tutor.queries');

// Obtener todos los tutores activos
exports.obtenerTodosTutores = async () => {
  const [rows] = await db.query(consultas.obtenerTodos);
  return rows;
};

// Obtener un tutor por su ID
exports.obtenerTutorPorId = async (id) => {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  return rows[0];
};

// Crear un nuevo tutor
exports.crearTutor = async (data) => {
  const {
    id_usuario,
    dni_tutor,
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    parentesco,
    estado
  } = data;

  // Validación adicional
  if (!dni_tutor || !nombre || !apellido) {
    throw new Error('DNI, nombre y apellido son obligatorios');
  }

  const [result] = await db.query(consultas.crear, [
    id_usuario || null,
    dni_tutor,
    nombre,
    apellido,
    email || null,
    telefono || null,
    direccion || null,
    parentesco,
    estado || 'activo'
  ]);

  // Obtener el tutor recién creado con todos sus campos
  const [tutorCreado] = await db.query(consultas.obtenerPorId, [result.insertId]);
  
  return tutorCreado[0];
};

// Actualizar un tutor
exports.actualizarTutor = async (id, data) => {
  // Primero verificar que el tutor existe
  const tutorExistente = await exports.obtenerTutorPorId(id);
  
  if (!tutorExistente) {
    throw new Error('Tutor no encontrado');
  }

  const {
    id_usuario,
    dni_tutor,
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    parentesco,
    estado
  } = data;

  const [result] = await db.query(consultas.actualizarCompleto, [
    id_usuario !== undefined ? id_usuario : tutorExistente.id_usuario,
    dni_tutor || tutorExistente.dni_tutor,
    nombre || tutorExistente.nombre,
    apellido || tutorExistente.apellido,
    email !== undefined ? email : tutorExistente.email,
    telefono !== undefined ? telefono : tutorExistente.telefono,
    direccion !== undefined ? direccion : tutorExistente.direccion,
    parentesco || tutorExistente.parentesco,
    estado || tutorExistente.estado,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar el tutor');
  }

  // Retornar el tutor actualizado
  const [tutorActualizado] = await db.query(consultas.obtenerPorId, [id]);
  return tutorActualizado[0];
};

// Agregar después de actualizarTutor:

exports.actualizarTutorParcial = async (id, data) => {
  // Verificar que existe
  const tutorExistente = await exports.obtenerTutorPorId(id);
  
  if (!tutorExistente) {
    throw new Error('Tutor no encontrado');
  }

  const {
    nombre,
    apellido,
    email,
    telefono,
    direccion,
    parentesco,
    estado
  } = data;

  const [result] = await db.query(consultas.actualizarParcial, [
    nombre !== undefined ? nombre : null,
    apellido !== undefined ? apellido : null,
    email !== undefined ? email : null,
    telefono !== undefined ? telefono : null,
    direccion !== undefined ? direccion : null,
    parentesco !== undefined ? parentesco : null,
    estado !== undefined ? estado : null,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar el tutor');
  }

  // Retornar el tutor actualizado
  const [tutorActualizado] = await db.query(consultas.obtenerPorId, [id]);
  return tutorActualizado[0];
};

// Eliminar lógicamente un tutor
exports.eliminarTutor = async (id) => {
  // Verificar que existe antes de eliminar
  const tutorExistente = await exports.obtenerTutorPorId(id);
  
  if (!tutorExistente) {
    throw new Error('Tutor no encontrado');
  }

  const [result] = await db.query(consultas.eliminarLogico, [id]);
  
  return { 
    mensaje: result.affectedRows > 0 ? 'Tutor eliminado correctamente' : 'No se pudo eliminar el tutor',
    id_tutor: id
  };
};

// Obtener tutores eliminados
exports.obtenerTutoresEliminados = async () => {
  const [rows] = await db.query(consultas.obtenerEliminados);
  return rows;
};

// Restaurar un tutor eliminado
exports.restaurarTutor = async (id) => {
  const [result] = await db.query(consultas.restaurar, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error('Tutor no encontrado o no está eliminado');
  }

  // Retornar el tutor restaurado
  const [tutor] = await db.query(consultas.obtenerPorId, [id]);
  return tutor[0];
};