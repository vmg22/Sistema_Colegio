// log_actividad.controller.js

const servicioLog = require('./log_actividad.services');
const { exito, error } = require('../../utils/responses');

const controladorLog = {
 
  // GET /logs
  obtenerTodasActividades: async (solicitud, respuesta) => {
    try {
      const actividades = await servicioLog.obtenerTodasActividades();
      exito(respuesta, 'Registros de actividad obtenidos correctamente', actividades);
    } catch (err) {
      error(respuesta, 'Error al obtener registros de actividad', 500, err.message);
    }
  },
  
  // GET /logs/:id
  obtenerActividadPorId: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const actividad = await servicioLog.obtenerActividadPorId(id);
      
      if (!actividad) {
        return error(respuesta, 'Registro de actividad no encontrado', 404);
      }
      
      exito(respuesta, 'Registro de actividad obtenido correctamente', actividad);
    } catch (err) {
      error(respuesta, 'Error al obtener registro de actividad', 500, err.message);
    }
  },

  // POST /logs
  crearActividad: async (solicitud, respuesta) => {
    try {
      const datosActividad = solicitud.body;
      
      if (!datosActividad.id_usuario || !datosActividad.accion) {
        return error(respuesta, 'id_usuario y acción son obligatorios', 400);
      }
      
      const actividadCreada = await servicioLog.crearActividad(datosActividad);
      
      exito(respuesta, 'Registro de actividad creado exitosamente', actividadCreada, 201);
    } catch (err) {
      if (err.message.includes('obligatorios')) {
        return error(respuesta, err.message, 400);
      }
      error(respuesta, 'Error al crear registro de actividad', 500, err.message);
    }
  },
};

module.exports = controladorLog;


// El módulo log_actividad tiene una lógica diferente a la de comunicacion (no necesita actualizar, eliminar ni restaurar), ya que los logs deben ser inmutables.

