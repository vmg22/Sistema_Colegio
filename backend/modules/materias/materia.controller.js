const servicioMaterias = require('./materia.services');
const { exito, error } = require('../../utils/responses');

const controladorMaterias = {
  // GET /api/materias
  getAllMaterias: async (solicitud, respuesta) => {
    try {
      const materias = await servicioMaterias.obtenerTodasMaterias();
      exito(respuesta, 'Materias obtenidas correctamente', materias);
    } catch (err) {
      error(respuesta, 'Error al obtener materias', 500, err.message);
    }
  },

  // GET /api/materias/:id
  getMateriaById: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const materia = await servicioMaterias.obtenerMateriaPorId(id);
      
      if (!materia) {
        return error(respuesta, 'Materia no encontrada', 404);
      }
      
      exito(respuesta, 'Materia obtenida correctamente', materia);
    } catch (err) {
      error(respuesta, 'Error al obtener materia', 500, err.message);
    }
  },

  // POST /api/materias
  createMateria: async (solicitud, respuesta) => {
    try {
      const datosMateria = solicitud.body;
      
      if (!datosMateria.nombre || !datosMateria.nivel) {
        return error(respuesta, 'Nombre y nivel son obligatorios', 400);
      }
      
      const materiaCreada = await servicioMaterias.crearMateria(datosMateria);
      exito(respuesta, 'Materia creada exitosamente', materiaCreada, 201);
    } catch (err) {
      error(respuesta, 'Error al crear materia', 400, err.message);
    }
  },

  // PUT /api/materias/:id
  updateMateria: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const materiaActualizada = await servicioMaterias.actualizarMateria(id, datosActualizados);
      exito(respuesta, 'Materia actualizada correctamente', materiaActualizada);
    } catch (err) {
      error(respuesta, 'Error al actualizar materia', 400, err.message);
    }
  },

  // DELETE /api/materias/:id
  deleteMateria: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioMaterias.eliminarMateria(id);
      exito(respuesta, resultado.mensaje);
    } catch (err) {
      error(respuesta, 'Error al eliminar materia', 400, err.message);
    }
  },

  // GET /api/materias/eliminados/listar
  getMateriasEliminadas: async (solicitud, respuesta) => {
    try {
      const materiasEliminadas = await servicioMaterias.obtenerMateriasEliminadas();
      exito(respuesta, 'Materias eliminadas obtenidas', materiasEliminadas);
    } catch (err) {
      error(respuesta, 'Error al obtener materias eliminadas', 500, err.message);
    }
  },

  // POST /api/materias/:id/restaurar
  restaurarMateria: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const materiaRestaurada = await servicioMaterias.restaurarMateria(id);
      exito(respuesta, 'Materia restaurada correctamente', materiaRestaurada);
    } catch (err) {
      error(respuesta, 'Error al restaurar materia', 400, err.message);
    }
  }
};

module.exports = controladorMaterias;