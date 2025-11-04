const servicioAlumnoTutor = require('./alumno_tutor.services');
const { exito, error } = require('../../utils/responses');

const controladorAlumnoTutor = {
 
  obtenerTodosAlumnoTutor: async (solicitud, respuesta) => {
    try {
      const relaciones = await servicioAlumnoTutor.obtenerTodosAlumnoTutor();
      exito(respuesta, 'Relaciones alumno-tutor obtenidas correctamente', relaciones);
    } catch (err) {
      error(respuesta, 'Error al obtener relaciones alumno-tutor', 500, err.message);
    }
  },

  
  obtenerAlumnoTutorPorId: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const relacion = await servicioAlumnoTutor.obtenerAlumnoTutorPorId(id);
      
      if (!relacion) {
        return error(respuesta, 'Relación alumno-tutor no encontrada', 404);
      }
      
      exito(respuesta, 'Relación alumno-tutor obtenida correctamente', relacion);
    } catch (err) {
      error(respuesta, 'Error al obtener relación alumno-tutor', 500, err.message);
    }
  },


  obtenerTutoresPorAlumno: async (solicitud, respuesta) => {
    try {
      const { id_alumno } = solicitud.params;
      const tutores = await servicioAlumnoTutor.obtenerTutoresPorAlumno(id_alumno);
      exito(respuesta, 'Tutores del alumno obtenidos correctamente', tutores);
    } catch (err) {
      error(respuesta, 'Error al obtener tutores del alumno', 500, err.message);
    }
  },


  obtenerAlumnosPorTutor: async (solicitud, respuesta) => {
    try {
      const { id_tutor } = solicitud.params;
      const alumnos = await servicioAlumnoTutor.obtenerAlumnosPorTutor(id_tutor);
      exito(respuesta, 'Alumnos del tutor obtenidos correctamente', alumnos);
    } catch (err) {
      error(respuesta, 'Error al obtener alumnos del tutor', 500, err.message);
    }
  },


  crearAlumnoTutor: async (solicitud, respuesta) => {
    try {
      const datosRelacion = solicitud.body;
      
      // Validación básica
      if (!datosRelacion.id_alumno || !datosRelacion.id_tutor) {
        return error(respuesta, 'id_alumno e id_tutor son obligatorios', 400);
      }
      
      const relacionCreada = await servicioAlumnoTutor.crearAlumnoTutor(datosRelacion);
      
      exito(respuesta, 'Relación alumno-tutor creada exitosamente', relacionCreada, 201);
    } catch (err) {
      // Manejo de errores más específico
      if (err.message.includes('obligatorios')) {
        return error(respuesta, err.message, 400);
      }
      if (err.message.includes('ya existe')) {
        return error(respuesta, err.message, 409);
      }
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return error(respuesta, 'El alumno o tutor especificado no existe', 404, err.message);
      }
      error(respuesta, 'Error al crear relación alumno-tutor', 500, err.message);
    }
  },


  actualizarAlumnoTutor: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const relacionActualizada = await servicioAlumnoTutor.actualizarAlumnoTutor(id, datosActualizados);
      
      exito(respuesta, 'Relación alumno-tutor actualizada correctamente', relacionActualizada);
    } catch (err) {
      // Manejo de errores más específico
      if (err.message === 'Relación alumno-tutor no encontrada') {
        return error(respuesta, 'Relación alumno-tutor no encontrada', 404);
      }
      if (err.message.includes('ya existe')) {
        return error(respuesta, err.message, 409);
      }
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return error(respuesta, 'El alumno o tutor especificado no existe', 404, err.message);
      }
      error(respuesta, 'Error al actualizar relación alumno-tutor', 500, err.message);
    }
  },


  actualizarAlumnoTutorParcial: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const relacionActualizada = await servicioAlumnoTutor.actualizarAlumnoTutorParcial(id, datosActualizados);
      exito(respuesta, 'Relación alumno-tutor actualizada correctamente', relacionActualizada);
    } catch (err) {
      // Manejo de errores más específico
      if (err.message === 'Relación alumno-tutor no encontrada') {
        return error(respuesta, 'Relación alumno-tutor no encontrada', 404);
      }
      if (err.message.includes('ya existe')) {
        return error(respuesta, err.message, 409);
      }
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return error(respuesta, 'El alumno o tutor especificado no existe', 404, err.message);
      }
      error(respuesta, 'Error al actualizar relación alumno-tutor', 500, err.message);
    }
  },


  eliminarAlumnoTutor: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioAlumnoTutor.eliminarAlumnoTutor(id);
      
      exito(respuesta, resultado.mensaje, { id_alumno_tutor: resultado.id_alumno_tutor });
    } catch (err) {
      // Manejo de error específico
      if (err.message === 'Relación alumno-tutor no encontrada') {
        return error(respuesta, 'Relación alumno-tutor no encontrada', 404);
      }
      error(respuesta, 'Error al eliminar relación alumno-tutor', 500, err.message);
    }
  },


  obtenerAlumnoTutorEliminados: async (solicitud, respuesta) => {
    try {
      const relacionesEliminadas = await servicioAlumnoTutor.obtenerAlumnoTutorEliminados();
      exito(respuesta, 'Relaciones alumno-tutor eliminadas obtenidas', relacionesEliminadas);
    } catch (err) {
      error(respuesta, 'Error al obtener relaciones alumno-tutor eliminadas', 500, err.message);
    }
  },


  restaurarAlumnoTutor: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const relacionRestaurada = await servicioAlumnoTutor.restaurarAlumnoTutor(id);
      
      exito(respuesta, 'Relación alumno-tutor restaurada correctamente', relacionRestaurada);
    } catch (err) {
      // Manejo de error específico
      if (err.message.includes('no encontrada') || err.message.includes('no está eliminada')) {
        return error(respuesta, err.message, 404);
      }
      error(respuesta, 'Error al restaurar relación alumno-tutor', 500, err.message);
    }
  }
};

module.exports = controladorAlumnoTutor;