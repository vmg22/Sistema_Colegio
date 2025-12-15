// CORREGIDO: Importamos 'pool'
const pool = require('../../../config/db');
const consultas = require('./altasmaterias.queries');

/**
* --- Estructura Corregida ---
* Definimos todas las funciones por separado (async function ...)
*/

async function obtenerMateriaPorId(id) {
const [rows] = await pool.query(consultas.obtenerPorId, [id]); // Usa pool
if (rows.length === 0) {
throw new Error('Materia no encontrada');
}
return rows[0];
}

async function obtenerTodasMaterias(buscar) {
let query = consultas.obtenerTodos;
const params = [];

if (buscar) {
query += ` AND (nombre LIKE ? OR descripcion LIKE ?)`;
const searchTerm = `%${buscar}%`;
params.push(searchTerm);
params.push(searchTerm);
}
query += ` ORDER BY nivel, nombre`;

const [rows] = await pool.query(query, params); // Usa pool
return rows;
}

async function crearMateria(data) {
const { nombre, descripcion, carga_horaria, nivel, ciclo, estado } = data;

if (!nombre || !nivel) {
throw new Error('Nombre y nivel son obligatorios');
}

const [existentes] = await pool.query(consultas.verificarExiste, [nombre, nivel]); // Usa pool
if (existentes.length > 0) {
const error = new Error('Ya existe una materia con ese nombre para ese nivel.');
error.statusCode = 409;
throw error;
}

const [result] = await pool.query(consultas.crear, [ // Usa pool
nombre,
descripcion || null,
carga_horaria || null,
nivel,
ciclo || 'basico',
estado || 'activa'
]);

return await obtenerMateriaPorId(result.insertId);
}

async function actualizarMateria(id, data) {
const materiaExistente = await obtenerMateriaPorId(id);
const { nombre, descripcion, carga_horaria, nivel, ciclo, estado } = data;

const [existentes] = await pool.query(consultas.verificarExiste, [nombre || materiaExistente.nombre, nivel || materiaExistente.nivel]); // Usa pool
if (existentes.length > 0 && existentes[0].id_materia != id) {
throw new Error('Ya existe OTRA materia con ese nombre para ese nivel.');
}

const [result] = await pool.query(consultas.actualizarCompleto, [ // Usa pool
nombre || materiaExistente.nombre,
descripcion !== undefined ? descripcion : materiaExistente.descripcion,
carga_horaria !== undefined ? carga_horaria : materiaExistente.carga_horaria,
nivel || materiaExistente.nivel,
ciclo || materiaExistente.ciclo,
estado || materiaExistente.estado,
id
]);

if (result.affectedRows === 0) {
throw new Error('No se pudo actualizar la materia');
}

return await obtenerMateriaPorId(id);
}

async function actualizarMateriaParcial(id, data) {
const materiaExistente = await obtenerMateriaPorId(id);
const dataFinal = { ...materiaExistente, ...data };

if (data.nombre || data.nivel) {
const [existentes] = await pool.query(consultas.verificarExiste, [dataFinal.nombre, dataFinal.nivel]); // Usa pool
if (existentes.length > 0 && existentes[0].id_materia != id) {
throw new Error('Ya existe OTRA materia con ese nombre para ese nivel.');
}
}

const camposActualizar = {};
const camposPermitidos = ['nombre', 'descripcion', 'carga_horaria', 'nivel', 'ciclo', 'estado'];

camposPermitidos.forEach(campo => {
if (data[campo] !== undefined) {
camposActualizar[campo] = data[campo];
}
});

if (Object.keys(camposActualizar).length === 0) {
return materiaExistente;
}

const setClauses = Object.keys(camposActualizar).map(campo => `${campo} = ?`);
const valores = Object.values(camposActualizar);

const query = `
UPDATE materia
SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
WHERE id_materia = ? AND deleted_at IS NULL
`;
valores.push(id);

const [result] = await pool.query(query, valores); // Usa pool

if (result.affectedRows === 0) {
throw new Error('No se pudo actualizar la materia');
}

return await obtenerMateriaPorId(id);
}

async function eliminarMateria(id) {
await obtenerMateriaPorId(id);
const [result] = await pool.query(consultas.eliminarLogico, [id]); // Usa pool

return {
mensaje: 'Materia eliminada correctamente',
id_materia: id
};
}

async function obtenerMateriasEliminadas() {
const [rows] = await pool.query(consultas.obtenerEliminados); // Usa pool
return rows;
}

async function restaurarMateria(id) {
const [result] = await pool.query(consultas.restaurar, [id]); // Usa pool

if (result.affectedRows === 0) {
throw new Error('Materia no encontrada o no está eliminada');
}

return await obtenerMateriaPorId(id);
}

async function obtenerEstadosMateria() {
try {
const [rows] = await pool.query(consultas.obtenerValoresEnumEstado); // Usa pool
const enumString = rows[0].Type;
const valores = enumString.replace("enum(", "").replace(")", "").replaceAll("'", "").split(',');
return valores;
} catch (err) {
console.error("Error al parsear ENUM 'estado':", err);
throw new Error("Error del servidor al obtener estados.");
}
}
async function obtenerCiclosMateria() {
try {
const [rows] = await pool.query(consultas.obtenerValoresEnumCiclo); // Usa pool
const enumString = rows[0].Type;
const valores = enumString.replace("enum(", "").replace(")", "").replaceAll("'", "").split(',');
return valores;
} catch (err) {
console.error("Error al parsear ENUM 'ciclo':", err);
throw new Error("Error del servidor al obtener ciclos.");
}
}

module.exports = {
obtenerTodasMaterias,
obtenerMateriaPorId,
crearMateria,
actualizarMateria,
actualizarMateriaParcial,
eliminarMateria,
obtenerMateriasEliminadas,
restaurarMateria,
obtenerEstadosMateria,
obtenerCiclosMateria
};
