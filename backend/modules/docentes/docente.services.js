/**
 * =======================================
 * DOCENTE.SERVICES.JS
 * =======================================
 * Lógica de negocio para el módulo de docentes.
 * Ejecuta las consultas y maneja la lógica de validación.
 */

// Asumo que tu pool está en ../../config/db
const pool = require('../../config/db'); 
const consultas = require('./docente.queries');

/**
 * Función helper interna para obtener un docente por ID
 * y lanzar un error 404 si no se encuentra.
 */
async function _obtenerDocentePorId(id) {
  const [rows] = await pool.query(consultas.obtenerPorId, [id]);
  if (rows.length === 0) {
    const error = new Error('El docente con el ID proporcionado no fue encontrado.');
    error.statusCode = 404;
    throw error;
  }
  return rows[0];
}

const servicioDocentes = {
  obtenerTodos: async () => {
    const [rows] = await pool.query(consultas.obtenerTodos);
    return rows;
  },

  obtenerPorId: async (id) => {
    return await _obtenerDocentePorId(id);
  },

  obtenerPorDni: async (dni) => {
    const [rows] = await pool.query(consultas.obtenerPorDni, [dni]);
    if (rows.length === 0) {
      const error = new Error('No se encontró ningún docente con ese DNI.');
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  },

  crear: async (datos) => {
    const { dni_docente, email } = datos;

    // 1. Validar DNI duplicado
    const [dniExistente] = await pool.query(consultas.verificarDniExistente, [dni_docente]);
    if (dniExistente.length > 0) {
      const error = new Error('Ya existe un docente con este DNI.');
      error.statusCode = 409; // 409 Conflict
      throw error;
    }

    // 2. Validar Email duplicado (si se provee)
    if (email) {
      const [emailExistente] = await pool.query(consultas.verificarEmailExistente, [email]);
      if (emailExistente.length > 0) {
        const error = new Error('Ya existe un docente con este email.');
        error.statusCode = 409;
        throw error;
      }
    }

    // 3. Preparar parámetros y ejecutar inserción
    const params = [
      datos.id_usuario || null, // Acepta nulo si no se asigna usuario
      datos.dni_docente,
      datos.nombre,
      datos.apellido,
      datos.email || null,
      datos.telefono || null,
      datos.especialidad || null,
      datos.estado?.toUpperCase() || 'ACTIVO'
    ];

    const [resultado] = await pool.query(consultas.crear, params);
    
    // Retornar el objeto creado
    return { id_docente: resultado.insertId, ...datos };
  },

  actualizar: async (id, datos) => {
    // 1. Verificar que el docente exista
    await _obtenerDocentePorId(id);

    // 2. Opcional: Validar DNI/Email si han cambiado y pertenecen a OTRO docente
    // (Esta lógica se puede añadir aquí si es necesaria)

    // 3. Preparar parámetros y ejecutar actualización
    const params = [
      datos.id_usuario || null,
      datos.dni_docente,
      datos.nombre,
      datos.apellido,
      datos.email || null,
      datos.telefono || null,
      datos.especialidad || null,
      datos.estado?.toUpperCase() || 'ACTIVO',
      id // id para el WHERE
    ];

    await pool.query(consultas.actualizar, params);

    // 4. Retornar el docente actualizado
    return await _obtenerDocentePorId(id);
  },

  eliminar: async (id) => {
    // 1. Verificar que el docente exista
    const docente = await _obtenerDocentePorId(id);
    
    // 2. Ejecutar borrado lógico
    const [resultado] = await pool.query(consultas.eliminarLogico, [id]);

    if (resultado.affectedRows === 0) {
      // Esto podría pasar si hay una condición de carrera, aunque _obtener... ya lo valida
      const error = new Error(`No se encontró un docente activo con ID ${id}.`);
      error.statusCode = 404;
      throw error;
    }

    return { mensaje: `Docente con ID ${id} dado de baja correctamente.` };
  }
};

module.exports = servicioDocentes;
