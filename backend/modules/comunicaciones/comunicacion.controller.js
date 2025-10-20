const servicioComunicaciones = require('./comunicacion.services');
const { exito, error } = require('../../utils/responses');

const controladorComunicaciones = {
 
  obtenerTodasComunicaciones: async (solicitud, respuesta) => {
    try {
      const comunicaciones = await servicioComunicaciones.obtenerTodasComunicaciones();
      exito(respuesta, 'Comunicaciones obtenidas correctamente', comunicaciones);
    } catch (err) {
      error(respuesta, 'Error al obtener comunicaciones', 500, err.message);
    }
  },

  
  obtenerComunicacionPorId: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const comunicacion = await servicioComunicaciones.obtenerComunicacionPorId(id);
      
      if (!comunicacion) {
        return error(respuesta, 'Comunicación no encontrada', 404);
      }
      
      exito(respuesta, 'Comunicación obtenida correctamente', comunicacion);
    } catch (err) {
      error(respuesta, 'Error al obtener comunicación', 500, err.message);
    }
  },


  crearComunicacion: async (solicitud, respuesta) => {
    try {
      const datosComunicacion = solicitud.body;
      
      if (!datosComunicacion.asunto || !datosComunicacion.contenido || !datosComunicacion.destinatario_tipo) {
        return error(respuesta, 'Asunto, contenido y destinatario_tipo son obligatorios', 400);
      }
      
      const comunicacionCreada = await servicioComunicaciones.crearComunicacion(datosComunicacion);
      
      exito(respuesta, 'Comunicación creada exitosamente', comunicacionCreada, 201);
    } catch (err) {
      if (err.message.includes('obligatorios')) {
        return error(respuesta, err.message, 400);
      }
      error(respuesta, 'Error al crear comunicación', 500, err.message);
    }
  },


  actualizarComunicacion: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const comunicacionActualizada = await servicioComunicaciones.actualizarComunicacion(id, datosActualizados);
      
      exito(respuesta, 'Comunicación actualizada correctamente', comunicacionActualizada);
    } catch (err) {
      if (err.message === 'Comunicación no encontrada') {
        return error(respuesta, 'Comunicación no encontrada', 404);
      }
      error(respuesta, 'Error al actualizar comunicación', 500, err.message);
    }
  },


  actualizarComunicacionParcial: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const comunicacionActualizada = await servicioComunicaciones.actualizarComunicacionParcial(id, datosActualizados);
      
      exito(respuesta, 'Comunicación actualizada correctamente', comunicacionActualizada);
    } catch (err) {
      if (err.message === 'Comunicación no encontrada') {
        return error(respuesta, 'Comunicación no encontrada', 404);
      }
      error(respuesta, 'Error al actualizar comunicación', 500, err.message);
    }
  },


  eliminarComunicacion: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioComunicaciones.eliminarComunicacion(id);
      
      exito(respuesta, resultado.mensaje, { id_comunicacion: resultado.id_comunicacion });
    } catch (err) {
      if (err.message === 'Comunicación no encontrada') {
        return error(respuesta, 'Comunicación no encontrada', 404);
      }
      error(respuesta, 'Error al eliminar comunicación', 500, err.message);
    }
  },


  obtenerComunicacionesEliminadas: async (solicitud, respuesta) => {
    try {
      const comunicacionesEliminadas = await servicioComunicaciones.obtenerComunicacionesEliminadas();
      exito(respuesta, 'Comunicaciones eliminadas obtenidas', comunicacionesEliminadas);
    } catch (err) {
      error(respuesta, 'Error al obtener comunicaciones eliminadas', 500, err.message);
    }
  },


  restaurarComunicacion: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const comunicacionRestaurada = await servicioComunicaciones.restaurarComunicacion(id);
      
      exito(respuesta, 'Comunicación restaurada correctamente', comunicacionRestaurada);
    } catch (err) {
      if (err.message.includes('no encontrada') || err.message.includes('no está eliminada')) {
        return error(respuesta, err.message, 404);
      }
      error(respuesta, 'Error al restaurar comunicación', 500, err.message);
    }
  }
};

module.exports = controladorComunicaciones;