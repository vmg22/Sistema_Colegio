// comunicacion_destinatario.controller.js

const servicioDestinatarios = require('./comunicacion_destinatario.services');
const { exito, error } = require('../../utils/responses');

// 🔑 Renombrado del controlador
const controladorDestinatarios = {
 
  obtenerTodosDestinatarios: async (solicitud, respuesta) => {
    try {
      const destinatarios = await servicioDestinatarios.obtenerTodosDestinatarios();
      exito(respuesta, 'Destinatarios obtenidos correctamente', destinatarios);
    } catch (err) {
      error(respuesta, 'Error al obtener destinatarios', 500, err.message);
    }
  },

  obtenerDestinatarioPorId: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const destinatario = await servicioDestinatarios.obtenerDestinatarioPorId(id);
      
      if (!destinatario) {
        return error(respuesta, 'Destinatario no encontrado', 404);
      }
      
      exito(respuesta, 'Destinatario obtenido correctamente', destinatario);
    } catch (err) {
      error(respuesta, 'Error al obtener destinatario', 500, err.message);
    }
  },

  crearDestinatario: async (solicitud, respuesta) => {
    try {
      const datosDestinatario = solicitud.body;
      
      // 🔑 Validación: id_comunicacion es obligatorio
      if (!datosDestinatario.id_comunicacion) {
        return error(respuesta, 'El ID de comunicación es obligatorio', 400);
      }
      
      const destinatarioCreado = await servicioDestinatarios.crearDestinatario(datosDestinatario);
      
      exito(respuesta, 'Destinatario creado exitosamente', destinatarioCreado, 201);
    } catch (err) {
      if (err.message.includes('obligatorio')) {
        return error(respuesta, err.message, 400);
      }
      error(respuesta, 'Error al crear destinatario', 500, err.message);
    }
  },

  actualizarDestinatario: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const destinatarioActualizado = await servicioDestinatarios.actualizarDestinatario(id, datosActualizados);
      
      exito(respuesta, 'Destinatario actualizado correctamente', destinatarioActualizado);
    } catch (err) {
      if (err.message === 'Destinatario no encontrado') {
        return error(respuesta, 'Destinatario no encontrado', 404);
      }
      error(respuesta, 'Error al actualizar destinatario', 500, err.message);
    }
  },

  actualizarDestinatarioParcial: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const destinatarioActualizado = await servicioDestinatarios.actualizarDestinatarioParcial(id, datosActualizados);
      
      exito(respuesta, 'Destinatario actualizado correctamente', destinatarioActualizado);
    } catch (err) {
      if (err.message === 'Destinatario no encontrado') {
        return error(respuesta, 'Destinatario no encontrado', 404);
      }
      error(respuesta, 'Error al actualizar destinatario', 500, err.message);
    }
  },

  eliminarDestinatario: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioDestinatarios.eliminarDestinatario(id);
      
      exito(respuesta, resultado.mensaje, { id_destinatario: resultado.id_destinatario });
    } catch (err) {
      if (err.message === 'Destinatario no encontrado') {
        return error(respuesta, 'Destinatario no encontrado', 404);
      }
      error(respuesta, 'Error al eliminar destinatario', 500, err.message);
    }
  },

  obtenerDestinatariosEliminados: async (solicitud, respuesta) => {
    try {
      const eliminados = await servicioDestinatarios.obtenerDestinatariosEliminados();
      exito(respuesta, 'Destinatarios eliminados obtenidos', eliminados);
    } catch (err) {
      error(respuesta, 'Error al obtener destinatarios eliminados', 500, err.message);
    }
  },

  restaurarDestinatario: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const restaurado = await servicioDestinatarios.restaurarDestinatario(id);
      
      exito(respuesta, 'Destinatario restaurado correctamente', restaurado);
    } catch (err) {
      if (err.message.includes('no encontrado') || err.message.includes('no está eliminada')) {
        return error(respuesta, err.message, 404);
      }
      error(respuesta, 'Error al restaurar destinatario', 500, err.message);
    }
  }
};

module.exports = controladorDestinatarios;