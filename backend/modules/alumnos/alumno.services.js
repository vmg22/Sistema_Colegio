// src/modules/alumno/alumno.services.js (VERSIÓN FINAL REFACTORIZADA)
const pool = require('../../config/db');
const consultas = require('./alumno.queries');

// Helper para obtener y verificar la existencia de un alumno
async function _obtenerAlumnoPorId(id) {
  const [rows] = await pool.query(consultas.obtenerPorId, [id]);
  if (rows.length === 0) {
    const error = new Error('El alumno con el ID proporcionado no fue encontrado.');
    error.statusCode = 404;
    throw error;
  }
  return rows[0];
}

// Helper para asegurar el formato de fecha YYYY-MM-DD
function _formatDate(date) {
  if (!date) return null;
  return new Date(date).toISOString().slice(0, 10);
}

const servicioAlumnos = {
  obtenerTodos: async () => {
    const [rows] = await pool.query(consultas.obtenerTodos);
    return rows;
  },

  obtenerPorId: async (id) => _obtenerAlumnoPorId(id),

  obtenerPorDni: async (dni) => {
    const [rows] = await pool.query(consultas.obtenerPorDni, [dni]);
    if (rows.length === 0) {
      const error = new Error('No se encontró ningún alumno con ese DNI.');
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  },

  crear: async (datos) => {
    const { dni_alumno, email } = datos;
    const [dniExistente] = await pool.query(consultas.verificarDniExistente, [dni_alumno]);
    if (dniExistente.length > 0) {
      throw Object.assign(new Error('Ya existe un alumno con este DNI.'), { statusCode: 409 });
    }
    if (email) {
      const [emailExistente] = await pool.query(consultas.verificarEmailExistente, [email]);
      if (emailExistente.length > 0) {
        throw Object.assign(new Error('Ya existe un alumno con este email.'), { statusCode: 409 });
      }
    }
    const params = [
      datos.dni_alumno, datos.nombre_alumno, datos.apellido_alumno,
      _formatDate(datos.fecha_nacimiento), datos.lugar_nacimiento || null,
      datos.direccion || null, datos.telefono || null, datos.email || null,
      _formatDate(datos.fecha_inscripcion) || _formatDate(new Date()),
      datos.estado?.toUpperCase() || 'ACTIVO'
    ];
    const [resultado] = await pool.query(consultas.crear, params);
    return { id_alumno: resultado.insertId, ...datos };
  },

  actualizarCompleto: async (id, datos) => {
    await _obtenerAlumnoPorId(id);
    const params = [
      datos.dni_alumno, datos.nombre_alumno, datos.apellido_alumno,
      _formatDate(datos.fecha_nacimiento), datos.lugar_nacimiento,
      datos.direccion, datos.telefono, datos.email,
      _formatDate(datos.fecha_inscripcion), datos.estado?.toUpperCase() || 'ACTIVO', id
    ];
    await pool.query(consultas.actualizarCompleto, params);
    return await _obtenerAlumnoPorId(id);
  },

  actualizarParcial: async (id, datosParciales) => {
    const alumnoActual = await _obtenerAlumnoPorId(id);
    const datosFusionados = { ...alumnoActual, ...datosParciales };
    const params = [
      datosFusionados.nombre_alumno, datosFusionados.apellido_alumno,
      datosFusionados.direccion, datosFusionados.telefono, datosFusionados.email, id
    ];
    await pool.query(consultas.actualizarParcial, params);
    return await _obtenerAlumnoPorId(id);
  },

  // CORREGIDO: Lógica simplificada y consistente con las otras funciones
  eliminar: async (id) => {
    await _obtenerAlumnoPorId(id); // Esto ya verifica si existe y está activo
    await pool.query(consultas.eliminarLogico, [id]);
    return { mensaje: `Alumno con ID ${id} eliminado correctamente.` };
  },

  restaurar: async (id) => {
    await pool.query(consultas.restaurar, [id]);
    return await _obtenerAlumnoPorId(id);
  },

  buscarPorNombre: async (termino) => {
    const pattern = `%${termino}%`;
    const [rows] = await pool.query(consultas.buscarPorNombre, [pattern, pattern]);
    return rows;
  },

  obtenerPaginados: async (pagina, limite) => {
    const offset = (pagina - 1) * limite;
    const [alumnos] = await pool.query(consultas.obtenerPaginados, [limite, offset]);
    const [[{ total }]] = await pool.query(consultas.contarPaginados); // Doble destructuring
    return {
      total_items: total,
      total_paginas: Math.ceil(total / limite),
      pagina_actual: parseInt(pagina, 10),
      items_por_pagina: parseInt(limite, 10),
      items: alumnos
    };
  },

  obtenerPorEstado: async (estado) => {
    const [rows] = await pool.query(consultas.obtenerPorEstado, [estado.toUpperCase()]);
    return rows;
  },

  obtenerPorRangoInscripcion: async (inicio, fin) => {
    const [rows] = await pool.query(consultas.obtenerPorRangoInscripcion, [_formatDate(inicio), _formatDate(fin)]);
    return rows;
  },

  obtenerPorEdad: async (edadMin, edadMax) => {
    const [rows] = await pool.query(consultas.obtenerPorEdad, [edadMin, edadMax]);
    return rows;
  },

  obtenerConContactoIncompleto: async () => {
    const [rows] = await pool.query(consultas.obtenerConContactoIncompleto);
    return rows;
  },

  actualizarEstado: async (id, estado) => {
    await _obtenerAlumnoPorId(id);
    const estadoUpper = estado.toUpperCase();
    await pool.query(consultas.actualizarEstado, [estadoUpper, id]);
    return await _obtenerAlumnoPorId(id);
  },

  // CORREGIDO: Destructuring más robusto para evitar errores si una consulta no devuelve resultados
  obtenerEstadisticas: async () => {
    const [totalResult, porEstadoResult, recientesResult] = await Promise.all([
      pool.query(consultas.contarTotal),
      pool.query(consultas.contarPorEstado),
      pool.query(consultas.obtenerRecientes, [5])
    ]);
    return {
      total_alumnos: totalResult[0][0]?.total_alumnos || 0,
      conteo_por_estado: porEstadoResult[0],
      ultimos_inscritos: recientesResult[0]
    };
  }
};

module.exports = servicioAlumnos;