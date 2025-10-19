const servicioCursos = require('./curso.services');
const { exito, error } = require('../../utils/responses');

const controladorCursos = {
 
  obtenerTodosCursos: async (solicitud, respuesta) => {
    try {
      const cursos = await servicioCursos.obtenerTodosCursos();
      exito(respuesta, 'Cursos obtenidos correctamente', cursos);
    } catch (err) {
      error(respuesta, 'Error al obtener cursos', 500, err.message);
    }
  },

  
  obtenerCursoPorId: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const curso = await servicioCursos.obtenerCursoPorId(id);
      
      if (!curso) {
        return error(respuesta, 'Curso no encontrado', 404);
      }
      
      exito(respuesta, 'Curso obtenido correctamente', curso);
    } catch (err) {
      error(respuesta, 'Error al obtener curso', 500, err.message);
    }
  },


  crearCurso: async (solicitud, respuesta) => {
    try {
      const datosCurso = solicitud.body;
      
      if (!datosCurso.nombre || !datosCurso.anio || !datosCurso.division || !datosCurso.turno) {
        return error(respuesta, 'Nombre, año, división y turno son obligatorios', 400);
      }
      
      const cursoCreado = await servicioCursos.crearCurso(datosCurso);
      
      exito(respuesta, 'Curso creado exitosamente', cursoCreado, 201);
    } catch (err) {
      if (err.message.includes('obligatorios')) {
        return error(respuesta, err.message, 400);
      }
      error(respuesta, 'Error al crear curso', 500, err.message);
    }
  },


  actualizarCurso: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const cursoActualizado = await servicioCursos.actualizarCurso(id, datosActualizados);
      
      exito(respuesta, 'Curso actualizado correctamente', cursoActualizado);
    } catch (err) {
      if (err.message === 'Curso no encontrado') {
        return error(respuesta, 'Curso no encontrado', 404);
      }
      error(respuesta, 'Error al actualizar curso', 500, err.message);
    }
  },


  eliminarCurso: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioCursos.eliminarCurso(id);
      
      exito(respuesta, resultado.mensaje, { id_curso: resultado.id_curso });
    } catch (err) {
      if (err.message === 'Curso no encontrado') {
        return error(respuesta, 'Curso no encontrado', 404);
      }
      error(respuesta, 'Error al eliminar curso', 500, err.message);
    }
  },


  obtenerCursosEliminados: async (solicitud, respuesta) => {
    try {
      const cursosEliminados = await servicioCursos.obtenerCursosEliminados();
      exito(respuesta, 'Cursos eliminados obtenidos', cursosEliminados);
    } catch (err) {
      error(respuesta, 'Error al obtener cursos eliminados', 500, err.message);
    }
  },


  restaurarCurso: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const cursoRestaurado = await servicioCursos.restaurarCurso(id);
      
      exito(respuesta, 'Curso restaurado correctamente', cursoRestaurado);
    } catch (err) {
      if (err.message.includes('no encontrado') || err.message.includes('no está eliminado')) {
        return error(respuesta, err.message, 404);
      }
      error(respuesta, 'Error al restaurar curso', 500, err.message);
    }
  }
};

module.exports = controladorCursos;