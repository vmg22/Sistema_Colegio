const servicioTutores = require('./tutor.services');
const { exito, error } = require('../../utils/responses');

const controladorTutores = {
  // GET /api/tutores
  getAllTutores: async (solicitud, respuesta) => {
    try {
      const tutores = await servicioTutores.obtenerTodosTutores();
      exito(respuesta, 'Tutores obtenidos correctamente', tutores);
    } catch (err) {
      error(respuesta, 'Error al obtener tutores', 500, err.message);
    }
  },

  // GET /api/tutores/:id
  getTutorById: async (solicitud, respuesta) => {
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

  // POST /api/tutores
  createTutor: async (solicitud, respuesta) => {
    try {
      const datosTutor = solicitud.body;
      
      if (!datosTutor.dni_tutor || !datosTutor.nombre || !datosTutor.apellido) {
        return error(respuesta, 'DNI, nombre y apellido son obligatorios', 400);
      }
      
      const tutorCreado = await servicioTutores.crearTutor(datosTutor);
      exito(respuesta, 'Tutor creado exitosamente', tutorCreado, 201);
    } catch (err) {
      error(respuesta, 'Error al crear tutor', 400, err.message);
    }
  },

  // PUT /api/tutores/:id
  updateTutor: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const tutorActualizado = await servicioTutores.actualizarTutor(id, datosActualizados);
      exito(respuesta, 'Tutor actualizado correctamente', tutorActualizado);
    } catch (err) {
      error(respuesta, 'Error al actualizar tutor', 400, err.message);
    }
  },

  // DELETE /api/tutores/:id
  deleteTutor: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioTutores.eliminarTutor(id);
      exito(respuesta, resultado.mensaje);
    } catch (err) {
      error(respuesta, 'Error al eliminar tutor', 400, err.message);
    }
  },

  // GET /api/tutores/eliminados/listar
  getTutoresEliminados: async (solicitud, respuesta) => {
    try {
      const tutoresEliminados = await servicioTutores.obtenerTutoresEliminados();
      exito(respuesta, 'Tutores eliminados obtenidos', tutoresEliminados);
    } catch (err) {
      error(respuesta, 'Error al obtener tutores eliminados', 500, err.message);
    }
  },

  // POST /api/tutores/:id/restaurar
  restaurarTutor: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const tutorRestaurado = await servicioTutores.restaurarTutor(id);
      exito(respuesta, 'Tutor restaurado correctamente', tutorRestaurado);
    } catch (err) {
      error(respuesta, 'Error al restaurar tutor', 400, err.message);
    }
  }
};

module.exports = controladorTutores;