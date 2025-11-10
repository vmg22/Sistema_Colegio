// modules/anioLectivo/anioLectivo.controller.js
const servicio = require('./anio.services');
const { exito, error } = require('../../utils/responses'); // 

const controladorAnioLectivo = {

  obtenerTodos: async (solicitud, respuesta) => {
    try {
      const resultados = await servicio.obtenerTodos();
      exito(respuesta, 'Años lectivos obtenidos', resultados);
    } catch (err) {
      error(respuesta, 'Error al obtener años lectivos', 500, err.message);
    }
  },

  obtenerPorId: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicio.obtenerPorId(id);
      exito(respuesta, 'Año lectivo obtenido', resultado);
    } catch (err) {
      error(respuesta, 'Error al obtener año lectivo', err.statusCode || 500, err.message);
    }
  },

  crear: async (solicitud, respuesta) => {
    try {
      const resultado = await servicio.crear(solicitud.body);
      exito(respuesta, 'Año lectivo creado', resultado, 201);
    } catch (err) {
      error(respuesta, 'Error al crear año lectivo', err.statusCode || 500, err.message);
    }
  },

  actualizar: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicio.actualizar(id, solicitud.body);
      exito(respuesta, 'Año lectivo actualizado', resultado);
    } catch (err) {
      error(respuesta, 'Error al actualizar año lectivo', err.statusCode || 500, err.message);
    }
  },

  eliminar: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicio.eliminar(id);
      exito(respuesta, resultado.mensaje);
    } catch (err) {
      error(respuesta, 'Error al eliminar año lectivo', err.statusCode || 500, err.message);
    }
  },
  
  restaurar: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicio.restaurar(id);
      exito(respuesta, 'Año lectivo restaurado', resultado);
    } catch (err) {
      error(respuesta, 'Error al restaurar', err.statusCode || 500, err.message);
    }
  }
};

module.exports = controladorAnioLectivo;