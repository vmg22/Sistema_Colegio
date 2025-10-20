const servicioCalificaciones = require('./calificacion.services');
const { exito, error } = require('../../utils/responses');

const controladorCalificaciones = {
  // GET /api/calificaciones
  getAllCalificaciones: async (solicitud, respuesta) => {
    try {
      const calificaciones = await servicioCalificaciones.obtenerTodasCalificaciones();
      exito(respuesta, 'Calificaciones obtenidas correctamente', calificaciones);
    } catch (err) {
      error(respuesta, 'Error al obtener calificaciones', 500, err.message);
    }
  },

  // GET /api/calificaciones/:id
  getCalificacionById: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const calificacion = await servicioCalificaciones.obtenerCalificacionPorId(id);
      
      if (!calificacion) {
        return error(respuesta, 'Calificación no encontrada', 404);
      }
      
      exito(respuesta, 'Calificación obtenida correctamente', calificacion);
    } catch (err) {
      error(respuesta, 'Error al obtener calificación', 500, err.message);
    }
  },

  // POST /api/calificaciones
  createCalificacion: async (solicitud, respuesta) => {
    try {
      const datosCalificacion = solicitud.body;
      
      if (!datosCalificacion.id_alumno || !datosCalificacion.id_materia || !datosCalificacion.id_docente || !datosCalificacion.id_curso) {
        return error(respuesta, 'Alumno, materia, docente y curso son obligatorios', 400);
      }
      
      const calificacionCreada = await servicioCalificaciones.crearCalificacion(datosCalificacion);
      exito(respuesta, 'Calificación creada exitosamente', calificacionCreada, 201);
    } catch (err) {
      error(respuesta, 'Error al crear calificación', 400, err.message);
    }
  },

  // PUT /api/calificaciones/:id
  updateCalificacion: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const calificacionActualizada = await servicioCalificaciones.actualizarCalificacion(id, datosActualizados);
      exito(respuesta, 'Calificación actualizada correctamente', calificacionActualizada);
    } catch (err) {
      error(respuesta, 'Error al actualizar calificación', 400, err.message);
    }
  },

  // DELETE /api/calificaciones/:id
  deleteCalificacion: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioCalificaciones.eliminarCalificacion(id);
      exito(respuesta, resultado.mensaje);
    } catch (err) {
      error(respuesta, 'Error al eliminar calificación', 400, err.message);
    }
  },

  // GET /api/calificaciones/eliminados/listar
  getCalificacionesEliminadas: async (solicitud, respuesta) => {
    try {
      const calificacionesEliminadas = await servicioCalificaciones.obtenerCalificacionesEliminadas();
      exito(respuesta, 'Calificaciones eliminadas obtenidas', calificacionesEliminadas);
    } catch (err) {
      error(respuesta, 'Error al obtener calificaciones eliminadas', 500, err.message);
    }
  },

  // POST /api/calificaciones/:id/restaurar
  restaurarCalificacion: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const calificacionRestaurada = await servicioCalificaciones.restaurarCalificacion(id);
      exito(respuesta, 'Calificación restaurada correctamente', calificacionRestaurada);
    } catch (err) {
      error(respuesta, 'Error al restaurar calificación', 400, err.message);
    }
  }
};

module.exports = controladorCalificaciones;