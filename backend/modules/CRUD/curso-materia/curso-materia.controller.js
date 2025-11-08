// modules/cursoMateria/curso-materia.controller.js
const servicio = require('./curso-materia.services');
const { exito, error } = require('../../../utils/responses');

const controladorCursoMateria = {

  /**
   * GET /:id_curso
   * Obtiene las materias asignadas a un curso.
   */
  obtenerMateriasPorCurso: async (solicitud, respuesta) => {
    try {
      const { id_curso } = solicitud.params;
      const resultados = await servicio.obtenerMateriasPorCurso(id_curso);
      exito(respuesta, 'Materias obtenidas', resultados);
    } catch (err) {
      error(respuesta, 'Error al obtener materias', err.statusCode || 500, err.message);
    }
  },

  /**
   * PUT /:id_curso
   * Reemplaza la lista de materias de un curso.
   * Espera un body: { idMaterias: [1, 2, 3] }
   */
  actualizarAsignaciones: async (solicitud, respuesta) => {
    try {
      const { id_curso } = solicitud.params;
      const { idMaterias } = solicitud.body; // Esperamos un array de IDs

      if (!idMaterias) {
         return error(respuesta, 'El body debe incluir un array "idMaterias".', 400);
      }

      const resultados = await servicio.actualizarAsignaciones(id_curso, idMaterias);
      exito(respuesta, 'Plan de estudios actualizado', resultados);

    } catch (err) {
      error(respuesta, 'Error al actualizar asignaciones', err.statusCode || 500, err.message);
    }
  }
};

module.exports = controladorCursoMateria;