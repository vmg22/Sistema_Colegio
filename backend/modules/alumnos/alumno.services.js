// src/modules/alumno/alumno.services.js
const pool = require('../../config/db');
const consultas = require('./alumno.queries');

async function _obtenerAlumnoPorId(id) {
  const [rows] = await pool.query(consultas.obtenerPorId, [id]);
  if (rows.length === 0) {
    const error = new Error('El alumno con el ID proporcionado no fue encontrado.');
    error.statusCode = 404;
    throw error;
  }
  return rows[0];
}

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
      const error = new Error('Ya existe un alumno con este DNI.');
      error.statusCode = 409;
      throw error;
    }

    if (email) {
      const [emailExistente] = await pool.query(consultas.verificarEmailExistente, [email]);
      if (emailExistente.length > 0) {
        const error = new Error('Ya existe un alumno con este email.');
        error.statusCode = 409;
        throw error;
      }
    }

    const params = [
      datos.dni_alumno,
      datos.nombre_alumno,
      datos.apellido_alumno,
      _formatDate(datos.fecha_nacimiento),
      datos.lugar_nacimiento || null,
      datos.direccion || null,
      datos.telefono || null,
      datos.email || null,
      _formatDate(datos.fecha_inscripcion) || _formatDate(new Date()),
      datos.estado?.toUpperCase() || 'ACTIVO'
    ];

    const [resultado] = await pool.query(consultas.crear, params);
    return { id_alumno: resultado.insertId, ...datos };
  },

  actualizarCompleto: async (id, datos) => {
    await _obtenerAlumnoPorId(id);
    const params = [
      datos.dni_alumno,
      datos.nombre_alumno,
      datos.apellido_alumno,
      _formatDate(datos.fecha_nacimiento),
      datos.lugar_nacimiento,
      datos.direccion,
      datos.telefono,
      datos.email,
      _formatDate(datos.fecha_inscripcion),
      datos.estado,
      id
    ];
    await pool.query(consultas.actualizarCompleto, params);
    return await _obtenerAlumnoPorId(id);
  },

  actualizarParcial: async (id, datosParciales) => {
    const alumnoActual = await _obtenerAlumnoPorId(id);
    const datosFusionados = { ...alumnoActual, ...datosParciales };
    const params = [
      datosFusionados.nombre_alumno,
      datosFusionados.apellido_alumno,
      datosFusionados.direccion,
      datosFusionados.telefono,
      datosFusionados.email,
      id
    ];
    await pool.query(consultas.actualizarParcial, params);
    return await _obtenerAlumnoPorId(id);
  },

  actualizarCompleto: async (id, datos) => {
  await _obtenerAlumnoPorId(id);
  
  const fechaNac = datos.fecha_nacimiento ? new Date(datos.fecha_nacimiento).toISOString().slice(0, 10) : null;
  const fechaIns = datos.fecha_inscripcion ? new Date(datos.fecha_inscripcion).toISOString().slice(0, 10) : null;
  const estado = datos.estado ? datos.estado.toUpperCase() : 'ACTIVO';

  const params = [
    datos.dni_alumno,
    datos.nombre_alumno,
    datos.apellido_alumno,
    fechaNac,
    datos.lugar_nacimiento,
    datos.direccion,
    datos.telefono,
    datos.email,
    fechaIns,
    estado,
    parseInt(id, 10)
  ];

  await pool.query(consultas.actualizarCompleto, params);
  return await _obtenerAlumnoPorId(id);
},

  eliminar: async (id) => {
  try {
    const alumno = await _obtenerAlumnoPorId(id); // Verifica existencia
    
    // Si ya está inactivo, evita marcarlo de nuevo
    if (alumno.deleted_at) {
      const error = new Error(`El alumno con ID ${id} ya fue eliminado anteriormente.`);
      error.statusCode = 400;
      throw error;
    }

    // Ejecutar eliminación lógica
    const [resultado] = await pool.query(
      `
      UPDATE alumno 
      SET deleted_at = CURRENT_TIMESTAMP, estado = 'inactivo'
      WHERE id_alumno = ? AND deleted_at IS NULL
      `,
      [id]
    );

    // Verificar si realmente se actualizó algo
    if (resultado.affectedRows === 0) {
      const error = new Error(`No se encontró un alumno activo con ID ${id}.`);
      error.statusCode = 404;
      throw error;
    }

    return { mensaje: `Alumno con ID ${id} eliminado correctamente.` };
  } catch (err) {
    console.error('💥 Error al eliminar alumno:', err.message);
    throw err;
  }
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
    const [[alumnos], [total]] = await Promise.all([
      pool.query(consultas.obtenerPaginados, [parseInt(limite, 10), parseInt(offset, 10)]),
      pool.query(consultas.contarPaginados)
    ]);
    const totalItems = total[0].total;
    return {
      total_items: totalItems,
      total_paginas: Math.ceil(totalItems / limite),
      pagina_actual: parseInt(pagina, 10),
      items_por_pagina: parseInt(limite, 10),
      items: alumnos
    };
  },

  obtenerPorEstado: async (estado) => {
    const [rows] = await pool.query(consultas.obtenerPorEstado, [estado]);
    return rows;
  },

  obtenerPorRangoInscripcion: async (inicio, fin) => {
    const [rows] = await pool.query(consultas.obtenerPorRangoInscripcion, [
      _formatDate(inicio),
      _formatDate(fin)
    ]);
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

  obtenerEstadisticas: async () => {
    try {
      const [total, porEstado, recientes] = await Promise.all([
        pool.query(consultas.contarTotal),
        pool.query(consultas.contarPorEstado),
        pool.query(consultas.obtenerRecientes, [5])
      ]);
      return {
        total_alumnos: total[0][0].total_alumnos,
        conteo_por_estado: porEstado[0],
        ultimos_inscritos: recientes[0]
      };
    } catch (err) {
      throw new Error('Error al obtener estadísticas: ' + err.message);
    }
  }
};

module.exports = servicioAlumnos;
