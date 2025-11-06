const materiaServices = require('./altasmaterias.services');
const { exito, error } = require('../../utils/responses'); // Asumo que tienes esto en utils

const materiaController = {
  
  obtenerTodasMaterias: async (req, res) => {
    try {
      // --- CORRECCIÓN ---
      const { buscar } = req.query; // Lee el query param
      const materias = await materiaServices.obtenerTodasMaterias(buscar); // Pasa 'buscar'
      
      exito(res, 'Materias obtenidas correctamente', { total: materias.length, materias });
    } catch (err) {
      error(res, 'Error al obtener materias', 500, err.message);
    }
  },

  obtenerMateriaPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const materia = await materiaServices.obtenerMateriaPorId(id);
      
      // La validación de "no encontrado" ya la hace el servicio
      exito(res, 'Materia obtenida correctamente', materia);
    } catch (err) {
      if (err.message === 'Materia no encontrada') {
        return error(res, err.message, 404);
      }
      error(res, 'Error al obtener materia', 500, err.message);
    }
  },

crearMateria: async (req, res, next) => {
  try {
    const materiaCreada = await materiaServices.crearMateria(req.body);
    exito(res, 'Materia creada exitosamente', materiaCreada, 201);
} catch (err) {
  const mensaje = err.message?.toLowerCase() || '';

  if (mensaje.includes('obligatorio')) {
    return error(res, err.message, 400);
  }
  if (mensaje.includes('ya existe')) {
    return error(res, err.message, 409); // 💥 ahora sí siempre matchea
  }

  // Si no entra en los casos anteriores, logueamos el error real
  console.error('❌ Error inesperado en crearMateria:', err);
  error(res, 'Error al crear la materia', 500, err.message);
}
},


  actualizarMateria: async (req, res) => {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;
      const materiaActualizada = await materiaServices.actualizarMateria(id, datosActualizados);
      exito(res, 'Materia actualizada correctamente', materiaActualizada);
    } catch (err) {
      if (err.message === 'Materia no encontrada') {
        return error(res, err.message, 404);
      }
      // --- CORRECCIÓN ---
      if (err.message.includes('ya existe')) {
        return error(res, err.message, 409);
      }
      error(res, 'Error al actualizar la materia', 500, err.message);
    }
  },

  actualizarMateriaParcial: async (req, res) => {
    try {
      const { id } = req.params;
      const datosActualizados = req.body;
      // Llama al servicio de PATCH
      const materiaActualizada = await materiaServices.actualizarMateriaParcial(id, datosActualizados);
      exito(res, 'Materia actualizada correctamente', materiaActualizada);
    } catch (err) {
      if (err.message === 'Materia no encontrada') {
        return error(res, err.message, 404);
      }
      // --- CORRECCIÓN ---
      if (err.message.includes('ya existe')) {
        return error(res, err.message, 409);
      }
      error(res, 'Error al actualizar la materia', 500, err.message);
    }
  },

  eliminarMateria: async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await materiaServices.eliminarMateria(id);
      exito(res, resultado.mensaje, { id_materia: resultado.id_materia });
    } catch (err) {
      if (err.message === 'Materia no encontrada') {
        return error(res, err.message, 404);
      }
      error(res, 'Error al eliminar la materia', 500, err.message);
    }
  },
  
  obtenerMateriasEliminadas: async (req, res) => {
    try {
      const materiasEliminadas = await materiaServices.obtenerMateriasEliminadas();
      exito(res, 'Materias eliminadas obtenidas', { total: materiasEliminadas.length, materias: materiasEliminadas });
    } catch (err) {
      error(res, 'Error al obtener materias eliminadas', 500, err.message);
    }
  },
  
  restaurarMateria: async (req, res) => {
    try {
      const { id } = req.params;
      const materiaRestaurada = await materiaServices.restaurarMateria(id);
      exito(res, 'Materia restaurada correctamente', materiaRestaurada);
    } catch (err) {
      if (err.message.includes('no encontrada')) {
        return error(res, err.message, 404);
      }
      error(res, 'Error al restaurar la materia', 500, err.message);
    }
  },

  /**
   * --- ¡FUNCIONES AÑADIDAS PARA ENUMs! ---
   */
  obtenerEstadosMateria: async (req, res) => {
    try {
      const estados = await materiaServices.obtenerEstadosMateria();
      exito(res, 'Estados de materia obtenidos', estados);
    } catch (err) {
      error(res, 'Error al obtener estados', 500, err.message);
    }
  },
  obtenerCiclosMateria: async (req, res) => {
    try {
      const ciclos = await materiaServices.obtenerCiclosMateria();
      exito(res, 'Ciclos de materia obtenidos', ciclos);
    } catch (err) {
      error(res, 'Error al obtener ciclos', 500, err.message);
    }
  },
};

module.exports = materiaController;