// modules/CRUD/alumno_tutor/alumno_tutor.services.js

// --- CORRECCIÓN CRÍTICA ---
const pool = require('../../../config/db'); // Cambiado de 'db' a 'pool'
const consultas = require('./alumno_tutor.query'); // Asumo que el nombre de tu archivo es .query y no .queries

// Obtener todas las relaciones alumno-tutor activas
exports.obtenerTodosAlumnoTutor = async () => {
const [rows] = await pool.query(consultas.obtenerTodos); // Usa pool
return rows;
};

// Obtener una relación por su ID
exports.obtenerAlumnoTutorPorId = async (id) => {
const [rows] = await pool.query(consultas.obtenerPorId, [id]); // Usa pool
if (!rows[0]) {
const error = new Error('Relación alumno-tutor no encontrada');
error.statusCode = 404;
throw error;
}
return rows[0];
};

// Obtener tutores de un alumno
exports.obtenerTutoresPorAlumno = async (idAlumno) => {
const [rows] = await pool.query(consultas.obtenerPorAlumno, [idAlumno]); // Usa pool
return rows;
};

// Obtener alumnos de un tutor
exports.obtenerAlumnosPorTutor = async (idTutor) => {
const [rows] = await pool.query(consultas.obtenerPorTutor, [idTutor]); // Usa pool
return rows;
};

// Crear una nueva relación alumno-tutor
exports.crearAlumnoTutor = async (data) => {
const {
id_alumno,
id_tutor,
es_principal
} = data;

if (!id_alumno || !id_tutor) {
throw new Error('id_alumno e id_tutor son obligatorios');
}

const [existente] = await pool.query(consultas.verificarExistente, [id_alumno, id_tutor]); // Usa pool

if (existente.length > 0) {
throw new Error('La relación alumno-tutor ya existe');
}

const [result] = await pool.query(consultas.crear, [ // Usa pool
id_alumno,
id_tutor,
es_principal !== undefined ? es_principal : 1
]);

const [relacionCreada] = await pool.query(consultas.obtenerPorId, [result.insertId]); // Usa pool
return relacionCreada[0];
};

// Actualizar una relación alumno-tutor
exports.actualizarAlumnoTutor = async (id, data) => {
const relacionExistente = await exports.obtenerAlumnoTutorPorId(id);

const { id_alumno, id_tutor, es_principal } = data;
const nuevoAlumno = id_alumno || relacionExistente.id_alumno;
const nuevoTutor = id_tutor || relacionExistente.id_tutor;

if (nuevoAlumno !== relacionExistente.id_alumno || nuevoTutor !== relacionExistente.id_tutor) {
const [existente] = await pool.query(consultas.verificarExistente, [nuevoAlumno, nuevoTutor]); // Usa pool
if (existente.length > 0 && existente[0].id_alumno_tutor !== parseInt(id)) {
throw new Error('La relación alumno-tutor ya existe');
}
}

const [result] = await pool.query(consultas.actualizarCompleto, [ // Usa pool
nuevoAlumno,
nuevoTutor,
es_principal !== undefined ? es_principal : relacionExistente.es_principal,
id
]);

if (result.affectedRows === 0) {
throw new Error('No se pudo actualizar la relación alumno-tutor');
}

const [relacionActualizada] = await pool.query(consultas.obtenerPorId, [id]); // Usa pool
return relacionActualizada[0];
};

// Actualización parcial
exports.actualizarAlumnoTutorParcial = async (id, data) => {
const relacionExistente = await exports.obtenerAlumnoTutorPorId(id);

const camposActualizar = {};
const camposPermitidos = ['id_alumno', 'id_tutor', 'es_principal'];

camposPermitidos.forEach(campo => {
if (data[campo] !== undefined) {
camposActualizar[campo] = data[campo];
}
});

if (Object.keys(camposActualizar).length === 0) {
return relacionExistente;
}

const nuevoAlumno = camposActualizar.id_alumno || relacionExistente.id_alumno;
const nuevoTutor = camposActualizar.id_tutor || relacionExistente.id_tutor;

if ((camposActualizar.id_alumno && camposActualizar.id_alumno !== relacionExistente.id_alumno) ||
(camposActualizar.id_tutor && camposActualizar.id_tutor !== relacionExistente.id_tutor)) {
const [existente] = await pool.query(consultas.verificarExistente, [nuevoAlumno, nuevoTutor]); // Usa pool
if (existente.length > 0 && existente[0].id_alumno_tutor !== parseInt(id)) {
throw new Error('La relación alumno-tutor ya existe');
}
}

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

const [result] = await pool.query(query, valores); // Usa pool

if (result.affectedRows === 0) {
throw new Error('No se pudo actualizar la relación alumno-tutor');
}

const [relacionActualizada] = await pool.query(consultas.obtenerPorId, [id]); // Usa pool
return relacionActualizada[0];
};

// Eliminar lógicamente una relación
exports.eliminarAlumnoTutor = async (id) => {
await exports.obtenerAlumnoTutorPorId(id); // Verifica que existe
const [result] = await pool.query(consultas.eliminarLogico, [id]); // Usa pool
return {
mensaje: 'Relación alumno-tutor eliminada correctamente',
id_alumno_tutor: id
};
};

// Obtener relaciones eliminadas
exports.obtenerAlumnoTutorEliminados = async () => {
const [rows] = await pool.query(consultas.obtenerEliminados); // Usa pool
return rows;
};

// Restaurar una relación eliminada
exports.restaurarAlumnoTutor = async (id) => {
const [result] = await pool.query(consultas.restaurar, [id]); // Usa pool
if (result.affectedRows === 0) {
throw new Error('Relación alumno-tutor no encontrada o no está eliminada');
}
const [relacion] = await pool.query(consultas.obtenerPorId, [id]); // Usa pool
return relacion[0];
};
