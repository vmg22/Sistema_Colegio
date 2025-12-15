// modules/CRUD/tutores/tutor.service.js

// --- CORRECCIÓN CRÍTICA ---
const pool = require('../../../config/db'); // Cambiado de 'db' a 'pool'
const consultas = require('./tutor.queries');

// Obtener todos los tutores activos
exports.obtenerTodosTutores = async () => {
const [rows] = await pool.query(consultas.obtenerTodos); // Usa pool
return rows;
};

// Obtener un tutor por su ID
exports.obtenerTutorPorId = async (id) => {
const [rows] = await pool.query(consultas.obtenerPorId, [id]); // Usa pool
if (!rows[0]) {
const error = new Error('Tutor no encontrado');
error.statusCode = 404;
throw error;
}
return rows[0];
};

// Crear un nuevo tutor
exports.crearTutor = async (data) => {
const {
id_usuario, dni_tutor, nombre, apellido, email,
telefono, direccion, parentesco, estado
} = data;

if (!dni_tutor || !nombre || !apellido) {
throw new Error('DNI, nombre y apellido son obligatorios');
}

// --- AÑADIDO: Verificación de DNI ---
const [existente] = await pool.query(consultas.verificarDniExistente, [dni_tutor]);
if (existente.length > 0) {
const error = new Error('Ya existe un tutor con ese DNI.');
error.statusCode = 409;
throw error;
}

const [result] = await pool.query(consultas.crear, [ // Usa pool
id_usuario || null,
dni_tutor,
nombre,
apellido,
email || null,
telefono || null,
direccion || null,
parentesco, // Asumimos que parentesco es obligatorio
estado || 'activo'
]);

const [tutorCreado] = await pool.query(consultas.obtenerPorId, [result.insertId]); // Usa pool
return tutorCreado[0];
};

// Actualizar un tutor
exports.actualizarTutor = async (id, data) => {
const tutorExistente = await exports.obtenerTutorPorId(id); // Verifica si existe
const {
id_usuario, dni_tutor, nombre, apellido, email,
telefono, direccion, parentesco, estado
} = data;

// --- AÑADIDO: Verificación de DNI si está cambiando ---
if (dni_tutor && dni_tutor !== tutorExistente.dni_tutor) {
const [existente] = await pool.query(consultas.verificarDniExistente, [dni_tutor]);
if (existente.length > 0) {
const error = new Error('El DNI ya está registrado en otro tutor.');
error.statusCode = 409;
throw error;
}
}

const [result] = await pool.query(consultas.actualizarCompleto, [ // Usa pool
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

const [tutorActualizado] = await pool.query(consultas.obtenerPorId, [id]); // Usa pool
return tutorActualizado[0];
};

// --- CORREGIDO: Lógica de PATCH estandarizada ---
exports.actualizarTutorParcial = async (id, data) => {
const tutorExistente = await exports.obtenerTutorPorId(id);

// Validar DNI duplicado si se está cambiando
if (data.dni_tutor && data.dni_tutor !== tutorExistente.dni_tutor) {
const [existentes] = await pool.query(consultas.verificarDniExistente, [data.dni_tutor]);
if (existentes.length > 0) {
throw new Error('El DNI ya está registrado en otro tutor.');
}
}

const camposActualizar = {};
const camposPermitidos = [
'id_usuario', 'dni_tutor', 'nombre', 'apellido', 'email',
'telefono', 'direccion', 'parentesco', 'estado'
];

camposPermitidos.forEach(campo => {
if (data[campo] !== undefined) {
camposActualizar[campo] = data[campo];
}
});

if (Object.keys(camposActualizar).length === 0) {
return tutorExistente; // No hay nada que actualizar
}

const setClauses = Object.keys(camposActualizar).map(campo => `${campo} = ?`);
const valores = Object.values(camposActualizar);

const query = `
UPDATE tutor
SET 
${setClauses.join(', ')},
updated_at = CURRENT_TIMESTAMP
WHERE id_tutor = ? AND deleted_at IS NULL
`;
valores.push(id);

const [result] = await pool.query(query, valores); // Usa pool

if (result.affectedRows === 0) {
throw new Error('No se pudo actualizar el tutor');
}

const [tutorActualizado] = await pool.query(consultas.obtenerPorId, [id]); // Usa pool
return tutorActualizado[0];
};

// Eliminar lógicamente un tutor
exports.eliminarTutor = async (id) => {
await exports.obtenerTutorPorId(id); // Verifica que existe
const [result] = await pool.query(consultas.eliminarLogico, [id]); // Usa pool
return { 
mensaje: 'Tutor eliminado correctamente',
id_tutor: id
};
};

// Obtener tutores eliminados
exports.obtenerTutoresEliminados = async () => {
const [rows] = await pool.query(consultas.obtenerEliminados); // Usa pool
return rows;
};

// Restaurar un tutor eliminado
exports.restaurarTutor = async (id) => {
const [result] = await pool.query(consultas.restaurar, [id]); // Usa pool
if (result.affectedRows === 0) {
throw new Error('Tutor no encontrado o no está eliminado');
}
const [tutor] = await pool.query(consultas.obtenerPorId, [id]); // Usa pool
return tutor[0];
};
