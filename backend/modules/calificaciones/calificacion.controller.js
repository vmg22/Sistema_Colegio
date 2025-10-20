const servicioCalificaciones = require('./calificacion.services');
const { exito, error } = require('../../utils/responses');

const controladorCalificaciones = {
 
  obtenerTodasCalificaciones: async (solicitud, respuesta) => {
    try {
      const calificaciones = await servicioCalificaciones.obtenerTodasCalificaciones();
      exito(respuesta, 'Calificaciones obtenidas correctamente', calificaciones);
    } catch (err) {
      error(respuesta, 'Error al obtener calificaciones', 500, err.message);
    }
  },

  
  obtenerCalificacionPorId: async (solicitud, respuesta) => {
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


  crearCalificacion: async (solicitud, respuesta) => {
    try {
      const datosCalificacion = solicitud.body;
      
      if (!datosCalificacion.id_alumno || !datosCalificacion.id_materia || !datosCalificacion.id_docente || !datosCalificacion.id_curso) {
        return error(respuesta, 'Alumno, materia, docente y curso son obligatorios', 400);
      }
      
      const calificacionCreada = await servicioCalificaciones.crearCalificacion(datosCalificacion);
      exito(respuesta, 'Calificación creada exitosamente', calificacionCreada, 201);
    } catch (err) {
      if (err.message.includes('obligatorios')) {
        return error(respuesta, err.message, 400);
      }
      if (err.code === 'ER_DUP_ENTRY') {
        return error(respuesta, 'La calificación ya está registrada', 409, err.message);
      }
      error(respuesta, 'Error al crear calificación', 500, err.message);
    }
  },


  actualizarCalificacion: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const calificacionActualizada = await servicioCalificaciones.actualizarCalificacion(id, datosActualizados);
      exito(respuesta, 'Calificación actualizada correctamente', calificacionActualizada);
    } catch (err) {
      if (err.message === 'Calificación no encontrada') {
        return error(respuesta, 'Calificación no encontrada', 404);
      }
      if (err.code === 'ER_DUP_ENTRY') {
        return error(respuesta, 'La calificación ya está registrada', 409, err.message);
      }
      error(respuesta, 'Error al actualizar calificación', 500, err.message);
    }
  },

  actualizarCalificacionParcial: async (solicitud, respuesta) => {
  try {
    const { id } = solicitud.params;
    const datosActualizados = solicitud.body;
    
    const calificacionActualizada = await servicioCalificaciones.actualizarCalificacionParcial(id, datosActualizados);
    
    exito(respuesta, 'Calificación actualizada correctamente', calificacionActualizada);
  } catch (err) {
    if (err.message === 'Calificación no encontrada') {
      return error(respuesta, 'Calificación no encontrada', 404);
    }
    error(respuesta, 'Error al actualizar calificación', 500, err.message);
  }
},


  eliminarCalificacion: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioCalificaciones.eliminarCalificacion(id);
      exito(respuesta, resultado.mensaje, { id_calificacion: resultado.id_calificacion });
    } catch (err) {
      if (err.message === 'Calificación no encontrada') {
        return error(respuesta, 'Calificación no encontrada', 404);
      }
      error(respuesta, 'Error al eliminar calificación', 500, err.message);
    }
  },


  obtenerCalificacionesEliminadas: async (solicitud, respuesta) => {
    try {
      const calificacionesEliminadas = await servicioCalificaciones.obtenerCalificacionesEliminadas();
      exito(respuesta, 'Calificaciones eliminadas obtenidas', calificacionesEliminadas);
    } catch (err) {
      error(respuesta, 'Error al obtener calificaciones eliminadas', 500, err.message);
    }
  },


  restaurarCalificacion: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const calificacionRestaurada = await servicioCalificaciones.restaurarCalificacion(id);
      exito(respuesta, 'Calificación restaurada correctamente', calificacionRestaurada);
    } catch (err) {
      if (err.message.includes('no encontrada') || err.message.includes('no está eliminada')) {
        return error(respuesta, err.message, 404);
      }
      error(respuesta, 'Error al restaurar calificación', 500, err.message);
    }
  }
};

module.exports = controladorCalificaciones;