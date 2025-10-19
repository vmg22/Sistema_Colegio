const servicioTutores = require('./tutor.services');
const { exito, error } = require('../../utils/responses');

const controladorTutores = {
 
  obtenerTodosTutores: async (solicitud, respuesta) => {
    try {
      const tutores = await servicioTutores.obtenerTodosTutores();
      exito(respuesta, 'Tutores obtenidos correctamente', tutores);
    } catch (err) {
      error(respuesta, 'Error al obtener tutores', 500, err.message);
    }
  },

  
  obtenerTutorPorId: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const tutor = await servicioTutores.obtenerTutorPorId(id);
      
      if (!tutor) {
        return error(respuesta, 'Tutor no encontrado', 404);
      }
      
      exito(respuesta, 'Tutor obtenido correctamente', tutor);
    } catch (err) {
      error(respuesta, 'Error al obtener tutor', 500, err.message);
    }
  },


  crearTutor: async (solicitud, respuesta) => {
    try {
      const datosTutor = solicitud.body;
      
      if (!datosTutor.dni_tutor || !datosTutor.nombre || !datosTutor.apellido) {
        return error(respuesta, 'DNI, nombre y apellido son obligatorios', 400);
      }
      
      const tutorCreado = await servicioTutores.crearTutor(datosTutor);
      
      exito(respuesta, 'Tutor creado exitosamente', tutorCreado, 201);
    } catch (err) {
      if (err.message.includes('obligatorios')) {
        return error(respuesta, err.message, 400);
      }
      error(respuesta, 'Error al crear tutor', 500, err.message);
    }
  },


  actualizarTutor: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const tutorActualizado = await servicioTutores.actualizarTutor(id, datosActualizados);
      
      exito(respuesta, 'Tutor actualizado correctamente', tutorActualizado);
    } catch (err) {
      if (err.message === 'Tutor no encontrado') {
        return error(respuesta, 'Tutor no encontrado', 404);
      }
      error(respuesta, 'Error al actualizar tutor', 500, err.message);
    }
  },


  eliminarTutor: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioTutores.eliminarTutor(id);
      
      exito(respuesta, resultado.mensaje, { id_tutor: resultado.id_tutor });
    } catch (err) {
      if (err.message === 'Tutor no encontrado') {
        return error(respuesta, 'Tutor no encontrado', 404);
      }
      error(respuesta, 'Error al eliminar tutor', 500, err.message);
    }
  },


  obtenerTutoresEliminados: async (solicitud, respuesta) => {
    try {
      const tutoresEliminados = await servicioTutores.obtenerTutoresEliminados();
      exito(respuesta, 'Tutores eliminados obtenidos', tutoresEliminados);
    } catch (err) {
      error(respuesta, 'Error al obtener tutores eliminados', 500, err.message);
    }
  },


  restaurarTutor: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const tutorRestaurado = await servicioTutores.restaurarTutor(id);
      
      exito(respuesta, 'Tutor restaurado correctamente', tutorRestaurado);
    } catch (err) {
      if (err.message.includes('no encontrado') || err.message.includes('no está eliminado')) {
        return error(respuesta, err.message, 404);
      }
      error(respuesta, 'Error al restaurar tutor', 500, err.message);
    }
  }
};

module.exports = controladorTutores;