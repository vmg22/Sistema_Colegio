// modules/cursos/curso.controller.js
const servicio = require('./curso.services');
const { exito, error } = require('../../../utils/responses');

const controladorCursos = {

  obtenerTodos: async (solicitud, respuesta) => {
    try {
      const resultados = await servicio.obtenerTodos();
      exito(respuesta, 'Cursos obtenidos', resultados);
    } catch (err) {
      error(respuesta, 'Error al obtener cursos', 500, err.message);
    }
  },

  obtenerPorId: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicio.obtenerPorId(id);
      exito(respuesta, 'Curso obtenido', resultado);
    } catch (err) {
      error(respuesta, 'Error al obtener curso', err.statusCode || 500, err.message);
    }
  },

  crear: async (solicitud, respuesta) => {
    try {
      const resultado = await servicio.crear(solicitud.body);
      exito(respuesta, 'Curso creado', resultado, 201);
    } catch (err) {
      error(respuesta, 'Error al crear curso', err.statusCode || 500, err.message);
    }
  },

  actualizar: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicio.actualizar(id, solicitud.body);
      exito(respuesta, 'Curso actualizado', resultado);
    } catch (err) {
      error(respuesta, 'Error al actualizar curso', err.statusCode || 500, err.message);
    }
  },

  eliminar: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicio.eliminar(id);
      exito(respuesta, resultado.mensaje);
    } catch (err) {
      error(respuesta, 'Error al eliminar curso', err.statusCode || 500, err.message);
    }
  }
};

module.exports = controladorCursos;