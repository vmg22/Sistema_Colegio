const servicioComunicaciones = require('./comunicacion.services');
const { exito, error } = require('../../utils/responses');

const controladorComunicaciones = {
  // GET /api/comunicaciones
  getAllComunicaciones: async (solicitud, respuesta) => {
    try {
      const comunicaciones = await servicioComunicaciones.obtenerTodasComunicaciones();
      exito(respuesta, 'Comunicaciones obtenidas correctamente', comunicaciones);
    } catch (err) {
      error(respuesta, 'Error al obtener comunicaciones', 500, err.message);
    }
  },

  // GET /api/comunicaciones/:id
  getComunicacionById: async (solicitud, respuesta) => {
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

  // POST /api/comunicaciones
  createComunicacion: async (solicitud, respuesta) => {
    try {
      const datosComunicacion = solicitud.body;
      
      if (!datosComunicacion.asunto || !datosComunicacion.contenido || !datosComunicacion.destinatario_tipo) {
        return error(respuesta, 'Asunto, contenido y destinatario_tipo son obligatorios', 400);
      }
      
      const comunicacionCreada = await servicioComunicaciones.crearComunicacion(datosComunicacion);
      exito(respuesta, 'Comunicación creada exitosamente', comunicacionCreada, 201);
    } catch (err) {
      error(respuesta, 'Error al crear comunicación', 400, err.message);
    }
  },

  // PUT /api/comunicaciones/:id
  updateComunicacion: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const comunicacionActualizada = await servicioComunicaciones.actualizarComunicacion(id, datosActualizados);
      exito(respuesta, 'Comunicación actualizada correctamente', comunicacionActualizada);
    } catch (err) {
      error(respuesta, 'Error al actualizar comunicación', 400, err.message);
    }
  },

  // DELETE /api/comunicaciones/:id
  deleteComunicacion: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioComunicaciones.eliminarComunicacion(id);
      exito(respuesta, resultado.mensaje);
    } catch (err) {
      error(respuesta, 'Error al eliminar comunicación', 400, err.message);
    }
  },

  // GET /api/comunicaciones/eliminados/listar
  getComunicacionesEliminadas: async (solicitud, respuesta) => {
    try {
      const comunicacionesEliminadas = await servicioComunicaciones.obtenerComunicacionesEliminadas();
      exito(respuesta, 'Comunicaciones eliminadas obtenidas', comunicacionesEliminadas);
    } catch (err) {
      error(respuesta, 'Error al obtener comunicaciones eliminadas', 500, err.message);
    }
  },

  // POST /api/comunicaciones/:id/restaurar
  restaurarComunicacion: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const comunicacionRestaurada = await servicioComunicaciones.restaurarComunicacion(id);
      exito(respuesta, 'Comunicación restaurada correctamente', comunicacionRestaurada);
    } catch (err) {
      error(respuesta, 'Error al restaurar comunicación', 400, err.message);
    }
  }
};

module.exports = controladorComunicaciones;