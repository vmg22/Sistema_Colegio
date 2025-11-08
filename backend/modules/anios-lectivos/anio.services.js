// modules/anioLectivo/anioLectivo.service.js
const pool = require('../../config/db'); // 
const consultas = require('./anio.queries');

// Helper para formatear fechas (tu BD espera YYYY-MM-DD)
function _formatDate(date) {
<<<<<<< HEAD
  if (!date) return null;
  return new Date(date).toISOString().slice(0, 10);
=======
  if (!date) return null;
  return new Date(date).toISOString().slice(0, 10);
>>>>>>> 7d411b359a463e146eb364a0a1032af62eb138c1
}

const servicioAnioLectivo = {

  obtenerTodos: async () => {
    const [rows] = await pool.query(consultas.obtenerTodos);
    return rows;
  },

  obtenerPorId: async (id) => {
    const [rows] = await pool.query(consultas.obtenerPorId, [id]);
    if (rows.length === 0) {
      const error = new Error('Año lectivo no encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  },

  crear: async (datos) => {
    const { anio, fecha_inicio, fecha_fin, estado } = datos;

    // Verificación de duplicados
    const [existente] = await pool.query(consultas.verificarAnioExistente, [anio]);
    if (existente.length > 0) {
      const error = new Error('Ya existe un año lectivo con ese número.');
      error.statusCode = 409; // 409 Conflict
      throw error;
    }

    const params = [
      anio,
      _formatDate(fecha_inicio),
      _formatDate(fecha_fin),
      estado || 'planificacion'
    ];
    
    const [resultado] = await pool.query(consultas.crear, params);
    
    // Devolvemos el objeto recién creado
    return await servicioAnioLectivo.obtenerPorId(resultado.insertId);
  },

  actualizar: async (id, datos) => {
    // Primero, verificamos que existe
    const existente = await servicioAnioLectivo.obtenerPorId(id);

    const { anio, fecha_inicio, fecha_fin, estado } = datos;

    // Verificación de duplicados (si cambia el año)
    if (anio !== existente.anio) {
      const [duplicado] = await pool.query(consultas.verificarAnioExistente, [anio]);
      if (duplicado.length > 0) {
        const error = new Error('Ya existe otro año lectivo con ese número.');
        error.statusCode = 409;
        throw error;
      }
    }
    
    const params = [
      anio || existente.anio,
      _formatDate(fecha_inicio) || existente.fecha_inicio,
      _formatDate(fecha_fin) || existente.fecha_fin,
      estado || existente.estado,
      id
    ];

    await pool.query(consultas.actualizar, params);
    
    // Devolvemos el objeto actualizado
    return await servicioAnioLectivo.obtenerPorId(id);
  },

  eliminar: async (id) => {
    // Verificamos que existe
    await servicioAnioLectivo.obtenerPorId(id);
    
    await pool.query(consultas.eliminar, [id]);
    
    return { mensaje: `Año lectivo con ID ${id} eliminado.` };
  },
  
  restaurar: async (id) => {
    await pool.query(consultas.restaurar, [id]);
    return await servicioAnioLectivo.obtenerPorId(id);
  }
};

module.exports = servicioAnioLectivo;