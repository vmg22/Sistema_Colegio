const servicioCursos = require('./curso.services');
const { exito, error } = require('../../utils/responses');

const controladorCursos = {
  // GET /api/cursos
  getAllCursos: async (solicitud, respuesta) => {
    try {
      const cursos = await servicioCursos.obtenerTodosCursos();
      exito(respuesta, 'Cursos obtenidos correctamente', cursos);
    } catch (err) {
      error(respuesta, 'Error al obtener cursos', 500, err.message);
    }
  },

  // GET /api/cursos/:id
  getCursoById: async (solicitud, respuesta) => {
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

  // POST /api/cursos
  createCurso: async (solicitud, respuesta) => {
    try {
      const datosCurso = solicitud.body;
      
      if (!datosCurso.nombre || !datosCurso.anio || !datosCurso.division || !datosCurso.turno) {
        return error(respuesta, 'Nombre, año, división y turno son obligatorios', 400);
      }
      
      const cursoCreado = await servicioCursos.crearCurso(datosCurso);
      exito(respuesta, 'Curso creado exitosamente', cursoCreado, 201);
    } catch (err) {
      error(respuesta, 'Error al crear curso', 400, err.message);
    }
  },

  // PUT /api/cursos/:id
  updateCurso: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const cursoActualizado = await servicioCursos.actualizarCurso(id, datosActualizados);
      exito(respuesta, 'Curso actualizado correctamente', cursoActualizado);
    } catch (err) {
      error(respuesta, 'Error al actualizar curso', 400, err.message);
    }
  },

  // DELETE /api/cursos/:id
  deleteCurso: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioCursos.eliminarCurso(id);
      exito(respuesta, resultado.mensaje);
    } catch (err) {
      error(respuesta, 'Error al eliminar curso', 400, err.message);
    }
  },

  // GET /api/cursos/eliminados/listar
  getCursosEliminados: async (solicitud, respuesta) => {
    try {
      const cursosEliminados = await servicioCursos.obtenerCursosEliminados();
      exito(respuesta, 'Cursos eliminados obtenidos', cursosEliminados);
    } catch (err) {
      error(respuesta, 'Error al obtener cursos eliminados', 500, err.message);
    }
  },

  // POST /api/cursos/:id/restaurar
  restaurarCurso: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const cursoRestaurado = await servicioCursos.restaurarCurso(id);
      exito(respuesta, 'Curso restaurado correctamente', cursoRestaurado);
    } catch (err) {
      error(respuesta, 'Error al restaurar curso', 400, err.message);
    }
  }
};

module.exports = controladorCursos;