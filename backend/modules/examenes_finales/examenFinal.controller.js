const serviciosExamenFinal = require('./examenFinal.services');
const { exito, error } = require('../../utils/responses');

const controladorExamenFinal = {

  /**
   * GET /examenes-finales/alumnos-en-final
   * Obtiene alumnos en estado 'final' para un curso/materia
   */
  obtenerAlumnosEnEstadoFinal: async (solicitud, respuesta) => {
    try {
      const { curso, materia, anioLectivo } = solicitud.query;

      if (!curso || !materia || !anioLectivo) {
        return error(respuesta, 'Debe especificar curso, materia y año lectivo', 400);
      }

      const alumnos = await serviciosExamenFinal.obtenerAlumnosEnEstadoFinal(
        curso,
        materia,
        anioLectivo
      );

      exito(respuesta, 'Alumnos en estado final obtenidos correctamente', alumnos);
    } catch (err) {
      error(respuesta, 'Error al obtener alumnos en estado final', 500, err.message);
    }
  },

  /**
   * GET /examenes-finales/alumnos-aprobados
   * Obtiene alumnos que aprobaron por examen final
   */
  obtenerAlumnosAprobadosPorFinal: async (solicitud, respuesta) => {
    try {
      const { curso, materia, anioLectivo } = solicitud.query;

      if (!curso || !materia || !anioLectivo) {
        return error(respuesta, 'Debe especificar curso, materia y año lectivo', 400);
      }

      const alumnos = await serviciosExamenFinal.obtenerAlumnosAprobadosPorFinal(
        curso,
        materia,
        anioLectivo
      );

      exito(respuesta, 'Alumnos aprobados por examen final obtenidos correctamente', alumnos);
    } catch (err) {
      error(respuesta, 'Error al obtener alumnos aprobados', 500, err.message);
    }
  },

  /**
   * POST /examenes-finales/registrar
   * Registra un examen final
   */
  registrarExamenFinal: async (solicitud, respuesta) => {
    try {
      const datosExamen = solicitud.body;

      const resultado = await serviciosExamenFinal.registrarExamenFinal(datosExamen);

      exito(respuesta, resultado.mensajeEstado, resultado, 201);
    } catch (err) {
      if (err.message.includes('obligatorio') || err.message.includes('inválida') || err.message.includes('debe estar')) {
        return error(respuesta, err.message, 400);
      }
      if (err.message.includes('Ya existe')) {
        return error(respuesta, err.message, 409);
      }
      error(respuesta, 'Error al registrar examen final', 500, err.message);
    }
  },

  /**
   * GET /examenes-finales/historial/:idAlumno/:idMateria/:anioLectivo
   * Obtiene el historial de exámenes finales de un alumno
   */
  obtenerHistorialExamenes: async (solicitud, respuesta) => {
    try {
      const { idAlumno, idMateria, anioLectivo } = solicitud.params;

      const historial = await serviciosExamenFinal.obtenerHistorialExamenes(
        idAlumno,
        idMateria,
        anioLectivo
      );

      exito(respuesta, 'Historial de exámenes obtenido correctamente', historial);
    } catch (err) {
      if (err.message.includes('obligatorio')) {
        return error(respuesta, err.message, 400);
      }
      error(respuesta, 'Error al obtener historial de exámenes', 500, err.message);
    }
  }
};

module.exports = controladorExamenFinal;
