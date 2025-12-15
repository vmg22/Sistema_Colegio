const serviciosPrevias = require('./previas.services');
const { exito, error } = require('../../utils/responses');

const controladorPrevias = {

  /**
   * GET /previas/alumnos-pendientes
   * Obtiene alumnos en estado 'previa' con su historial de intentos
   */
  obtenerAlumnosPendientes: async (solicitud, respuesta) => {
    try {
      const { curso, materia, anioLectivo } = solicitud.query;

      if (!curso || !materia || !anioLectivo) {
        return error(respuesta, 'Debe especificar curso, materia y año lectivo', 400);
      }

      const alumnos = await serviciosPrevias.obtenerAlumnosPreviasPorCurso(
        curso,
        materia,
        anioLectivo
      );

      exito(respuesta, 'Alumnos con previas obtenidos correctamente', alumnos);
    } catch (err) {
      error(respuesta, 'Error al obtener alumnos con previas', 500, err.message);
    }
  },

  /**
   * GET /previas/alumnos-aprobados
   * Obtiene alumnos que aprobaron por previa
   */
  obtenerAlumnosAprobados: async (solicitud, respuesta) => {
    try {
      const { curso, materia, anioLectivo } = solicitud.query;

      if (!curso || !materia || !anioLectivo) {
        return error(respuesta, 'Debe especificar curso, materia y año lectivo', 400);
      }

      const alumnos = await serviciosPrevias.obtenerAlumnosAprobadosPorPrevia(
        curso,
        materia,
        anioLectivo
      );

      exito(respuesta, 'Alumnos aprobados por previa obtenidos correctamente', alumnos);
    } catch (err) {
      error(respuesta, 'Error al obtener alumnos aprobados', 500, err.message);
    }
  },

  /**
   * POST /previas/registrar
   * Registra un intento de previa
   */
  registrarIntentoPrevia: async (solicitud, respuesta) => {
    try {
      const datosPrevia = solicitud.body;

      const resultado = await serviciosPrevias.registrarIntentoPrevia(datosPrevia);

      exito(respuesta, resultado.mensajeEstado, resultado, 201);
    } catch (err) {
      if (err.message.includes('obligatorio') || err.message.includes('debe estar')) {
        return error(respuesta, err.message, 400);
      }
      error(respuesta, 'Error al registrar intento de previa', 500, err.message);
    }
  }
};

module.exports = controladorPrevias;
