const db = require('../../config/db');
const consultas = require('./docente.queries'); 

// Obtener todos los docentes activos
exports.obtenerTodosDocentes = async () => {
  const [rows] = await db.query(consultas.obtenerTodos);
  return rows;
};

// Obtener un docente por su ID
exports.obtenerDocentePorId = async (id) => {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  return rows[0];
};

// Crear un nuevo docente
exports.crearDocente = async (data) => {
  const {
    id_usuario,
    dni_docente,
    nombre,
    apellido,
    email,
    telefono,
    especialidad,
    estado
  } = data;

  // Validación adicional
  if (!dni_docente || !nombre || !apellido) {
    throw new Error('DNI, nombre y apellido son obligatorios');
  }

  const [result] = await db.query(consultas.crear, [
    id_usuario || null,
    dni_docente,
    nombre,
    apellido,
    email || null,
    telefono || null,
    especialidad || null,
    estado || 'activo'
  ]);

  // Obtener el docente recién creado con todos sus campos
  const [docenteCreado] = await db.query(consultas.obtenerPorId, [result.insertId]);
  
  return docenteCreado[0];
};

// Actualizar un docente
exports.actualizarDocente = async (id, data) => {
  // Primero verificar que el docente existe
  const docenteExistente = await exports.obtenerDocentePorId(id);
  
  if (!docenteExistente) {
    throw new Error('Docente no encontrado');
  }

  const {
    id_usuario,
    dni_docente,
    nombre,
    apellido,
    email,
    telefono,
    especialidad,
    estado
  } = data;

  const [result] = await db.query(consultas.actualizarCompleto, [
    id_usuario !== undefined ? id_usuario : docenteExistente.id_usuario,
    dni_docente || docenteExistente.dni_docente,
    nombre || docenteExistente.nombre,
    apellido || docenteExistente.apellido,
    email !== undefined ? email : docenteExistente.email,
    telefono !== undefined ? telefono : docenteExistente.telefono,
    especialidad !== undefined ? especialidad : docenteExistente.especialidad,
    estado || docenteExistente.estado,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar el docente');
  }

  // Retornar el docente actualizado
  const [docenteActualizado] = await db.query(consultas.obtenerPorId, [id]);
  return docenteActualizado[0];
};

// Eliminar lógicamente un docente
exports.eliminarDocente = async (id) => {
  // Verificar que existe antes de eliminar
  const docenteExistente = await exports.obtenerDocentePorId(id);
  
  if (!docenteExistente) {
    throw new Error('Docente no encontrado');
  }

  const [result] = await db.query(consultas.eliminarLogico, [id]);
  
  return { 
    mensaje: result.affectedRows > 0 ? 'Docente eliminado correctamente' : 'No se pudo eliminar el docente',
    id_docente: id
  };
};

// Obtener docentes eliminados
exports.obtenerDocentesEliminados = async () => {
  const [rows] = await db.query(consultas.obtenerEliminados);
  return rows;
};

// Restaurar un docente eliminado
exports.restaurarDocente = async (id) => {
  const [result] = await db.query(consultas.restaurar, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error('Docente no encontrado o no está eliminado');
  }

  // Retornar el docente restaurado
  const [docente] = await db.query(consultas.obtenerPorId, [id]);
  return docente[0];
};