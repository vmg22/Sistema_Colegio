const db = require('../../config/db');
const consultas = require('./altasmaterias.queries');

/**
 * --- Estructura Corregida ---
 * Definimos todas las funciones por separado (async function ...)
 * para que puedan llamarse entre sí y evitar errores de sintaxis.
 */

/**
 * Obtiene una materia por su ID
 */
async function obtenerMateriaPorId(id) {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  if (rows.length === 0) {
    throw new Error('Materia no encontrada');
  }
  return rows[0];
}

/**
 * Obtiene todas las materias activas
 */
async function obtenerTodasMaterias(buscar) {
  let query = consultas.obtenerTodos; // Query base
  const params = [];

  if (buscar) {
    // Añade lógica de búsqueda
    query += ` AND (nombre LIKE ? OR descripcion LIKE ?)`;
    const searchTerm = `%${buscar}%`;
    params.push(searchTerm);
    params.push(searchTerm);
  }
  
  query += ` ORDER BY nivel, nombre`; // Ordena por nivel y luego nombre
  
  const [rows] = await db.query(query, params);
  return rows;
}

/**
 * Crear una nueva materia
 */
async function crearMateria(data) {
  const {
    nombre,
    descripcion,
    carga_horaria,
    nivel,
    ciclo,
    estado
  } = data;

  if (!nombre || !nivel) {
    throw new Error('Nombre y nivel son obligatorios');
  }

  // Validación de duplicados
 const [existentes] = await db.query(consultas.verificarExiste, [nombre, nivel]);
if (existentes.length > 0) {
  const error = new Error('Ya existe una materia con ese nombre para ese nivel.');
  error.statusCode = 409; // ← esto evita el 500 y devuelve un 409 Conflict
  throw error;
}

  const [result] = await db.query(consultas.crear, [
    nombre,
    descripcion || null,
    carga_horaria || null,
    nivel,
    ciclo || 'basico',
    estado || 'activa'
  ]);

  return await obtenerMateriaPorId(result.insertId);
}

/**
 * Actualizar una materia (PUT)
 */
async function actualizarMateria(id, data) {
  // Primero verificar que la materia existe
  const materiaExistente = await obtenerMateriaPorId(id);
  
  const {
    nombre,
    descripcion,
    carga_horaria,
    nivel,
    ciclo,
    estado
  } = data;

  // Validación de duplicados
  const [existentes] = await db.query(consultas.verificarExiste, [nombre || materiaExistente.nombre, nivel || materiaExistente.nivel]);
  if (existentes.length > 0 && existentes[0].id_materia != id) {
    throw new Error('Ya existe OTRA materia con ese nombre para ese nivel.');
  }

  const [result] = await db.query(consultas.actualizarCompleto, [
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

/**
 * Actualizar una materia parcialmente (PATCH)
 */
async function actualizarMateriaParcial(id, data) {
  const materiaExistente = await obtenerMateriaPorId(id);
  
  // Fusionar datos: lo nuevo (data) pisa a lo viejo (materiaExistente)
  const dataFinal = { ...materiaExistente, ...data };
  
  // Validar duplicado (solo si el nombre o nivel cambiaron)
  if (data.nombre || data.nivel) {
    const [existentes] = await db.query(consultas.verificarExiste, [dataFinal.nombre, dataFinal.nivel]);
    if (existentes.length > 0 && existentes[0].id_materia != id) {
      throw new Error('Ya existe OTRA materia con ese nombre para ese nivel.');
    }
  }

  // Filtrar solo los campos que vienen en 'data'
  const camposActualizar = {};
  const camposPermitidos = ['nombre', 'descripcion', 'carga_horaria', 'nivel', 'ciclo', 'estado'];
  
  camposPermitidos.forEach(campo => {
    if (data[campo] !== undefined) {
      camposActualizar[campo] = data[campo];
    }
  });

  if (Object.keys(camposActualizar).length === 0) {
    return materiaExistente; // No hay nada que actualizar
  }

  const setClauses = Object.keys(camposActualizar).map(campo => `${campo} = ?`);
  const valores = Object.values(camposActualizar);
  
  const query = `
    UPDATE materia
    SET 
      ${setClauses.join(', ')},
      updated_at = CURRENT_TIMESTAMP
    WHERE id_materia = ? AND deleted_at IS NULL
  `;
  valores.push(id); 

  const [result] = await db.query(query, valores);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar la materia');
  }

  return await obtenerMateriaPorId(id);
}

/**
 * Eliminar lógicamente una materia
 */
async function eliminarMateria(id) {
  await obtenerMateriaPorId(id); // Verificar que existe
  const [result] = await db.query(consultas.eliminarLogico, [id]);
  
  return { 
    mensaje: 'Materia eliminada correctamente',
    id_materia: id
  };
}

/**
 * Obtener materias eliminadas
 */
async function obtenerMateriasEliminadas() {
  const [rows] = await db.query(consultas.obtenerEliminados);
  return rows;
}

/**
 * Restaurar una materia eliminada
 */
async function restaurarMateria(id) {
  const [result] = await db.query(consultas.restaurar, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error('Materia no encontrada o no está eliminada');
  }
  
  return await obtenerMateriaPorId(id);
}

/**
 * --- ¡FUNCIONES AÑADIDAS PARA ENUMs! ---
 */

async function obtenerEstadosMateria() {
  try {
    const [rows] = await db.query(consultas.obtenerValoresEnumEstado);
    const enumString = rows[0].Type; 
    const valores = enumString.replace("enum(", "").replace(")", "").replaceAll("'", "").split(',');
    return valores; // Devuelve ['activa', 'inactiva']
  } catch (err) {
    console.error("Error al parsear ENUM 'estado':", err);
    throw new Error("Error del servidor al obtener estados.");
  }
}
async function obtenerCiclosMateria() {
  try {
    const [rows] = await db.query(consultas.obtenerValoresEnumCiclo);
    const enumString = rows[0].Type; 
    const valores = enumString.replace("enum(", "").replace(")", "").replaceAll("'", "").split(',');
    return valores; // Devuelve ['basico', 'orientado']
  } catch (err) {
    console.error("Error al parsear ENUM 'ciclo':", err);
    throw new Error("Error del servidor al obtener ciclos.");
  }
}

// 4. Exportamos todo junto
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