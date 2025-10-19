const servicioMaterias = require('./materia.services');
const { exito, error } = require('../../utils/responses');

const controladorMaterias = {
 
  obtenerTodasMaterias: async (solicitud, respuesta) => {
    try {
      const materias = await servicioMaterias.obtenerTodasMaterias();
      exito(respuesta, 'Materias obtenidas correctamente', materias);
    } catch (err) {
      error(respuesta, 'Error al obtener materias', 500, err.message);
    }
  },

  
  obtenerMateriaPorId: async (solicitud, respuesta) => {
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


  crearMateria: async (solicitud, respuesta) => {
    try {
      const datosMateria = solicitud.body;
      
      if (!datosMateria.nombre || !datosMateria.nivel) {
        return error(respuesta, 'Nombre y nivel son obligatorios', 400);
      }
      
      const materiaCreada = await servicioMaterias.crearMateria(datosMateria);
      
      exito(respuesta, 'Materia creada exitosamente', materiaCreada, 201);
    } catch (err) {
      if (err.message.includes('obligatorios')) {
        return error(respuesta, err.message, 400);
      }
      error(respuesta, 'Error al crear materia', 500, err.message);
    }
  },


  actualizarMateria: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const materiaActualizada = await servicioMaterias.actualizarMateria(id, datosActualizados);
      
      exito(respuesta, 'Materia actualizada correctamente', materiaActualizada);
    } catch (err) {
      if (err.message === 'Materia no encontrada') {
        return error(respuesta, 'Materia no encontrada', 404);
      }
      error(respuesta, 'Error al actualizar materia', 500, err.message);
    }
  },


  eliminarMateria: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioMaterias.eliminarMateria(id);
      
      exito(respuesta, resultado.mensaje, { id_materia: resultado.id_materia });
    } catch (err) {
      if (err.message === 'Materia no encontrada') {
        return error(respuesta, 'Materia no encontrada', 404);
      }
      error(respuesta, 'Error al eliminar materia', 500, err.message);
    }
  },


  obtenerMateriasEliminadas: async (solicitud, respuesta) => {
    try {
      const materiasEliminadas = await servicioMaterias.obtenerMateriasEliminadas();
      exito(respuesta, 'Materias eliminadas obtenidas', materiasEliminadas);
    } catch (err) {
      error(respuesta, 'Error al obtener materias eliminadas', 500, err.message);
    }
  },


  restaurarMateria: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const materiaRestaurada = await servicioMaterias.restaurarMateria(id);
      
      exito(respuesta, 'Materia restaurada correctamente', materiaRestaurada);
    } catch (err) {
      if (err.message.includes('no encontrada') || err.message.includes('no está eliminada')) {
        return error(respuesta, err.message, 404);
      }
      error(respuesta, 'Error al restaurar materia', 500, err.message);
    }
  }
};

module.exports = controladorMaterias;