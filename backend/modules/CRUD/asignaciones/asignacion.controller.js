const asignacionServices = require('./asignacion.services');

// --- (Copia tus funciones 'exito' y 'error' de alta.controller.js) ---
const exito = (res, mensaje, datos = null, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message: mensaje,
    data: datos
  });
};
const error = (res, mensaje, statusCode = 500, detalles = null) => {
  const response = {
    success: false,
    message: mensaje
  };
  if (detalles && process.env.NODE_ENV === 'development') {
    response.error = detalles;
  }
  res.status(statusCode).json(response);
};
// ---

const asignacionController = {

  obtenerAsignaciones: async (req, res) => {
    try {
      const asignaciones = await asignacionServices.obtenerAsignaciones(req.query);
      exito(res, 'Asignaciones obtenidas correctamente', asignaciones);
    } catch (err) {
      error(res, 'Error al obtener asignaciones', 500, err.message);
    }
  },

  obtenerAsignacionPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const asignacion = await asignacionServices.obtenerAsignacionPorId(id);
      exito(res, 'Asignación obtenida correctamente', asignacion);
    } catch (err) {
      if (err.message === 'Asignación no encontrada') {
        return error(res, err.message, 404);
      }
      error(res, 'Error al obtener la asignación', 500, err.message);
    }
  },

  crearAsignacion: async (req, res) => {
    try {
      const nuevaAsignacion = await asignacionServices.crearAsignacion(req.body);
      exito(res, 'Asignación creada exitosamente', nuevaAsignacion, 201);
    } catch (err) {
      if (err.message.includes('obligatorios')) {
        return error(res, err.message, 400); // Bad Request
      }
      // --- ¡LÓGICA DE ERROR CORREGIDA! ---
      // Captura ambos errores: "ya existe" (duplicado) Y "Conflicto: Esta materia..."
      if (err.message.includes('ya existe') || err.message.includes('Conflicto')) {
        return error(res, err.message, 409); // Conflict
      }
      // --- FIN DE LA CORRECCIÓN ---
      error(res, 'Error al crear la asignación', 500, err.message);
    }
  },

  actualizarAsignacion: async (req, res) => {
    try {
      const { id } = req.params;
      const datos = req.body;
      if (Object.keys(datos).length === 0) {
        return error(res, 'No se enviaron datos para actualizar', 400);
      }
      const asignacionActualizada = await asignacionServices.actualizarAsignacion(id, datos);
      exito(res, 'Asignación actualizada correctamente', asignacionActualizada);
    } catch (err) {
      if (err.message === 'Asignación no encontrada') {
        return error(res, err.message, 404);
      }
      if (err.message.includes('Conflicto')) {
        return error(res, err.message, 409);
      }
      error(res, 'Error al actualizar la asignación', 500, err.message);
    }
  },

  eliminarAsignacion: async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await asignacionServices.eliminarAsignacion(id);
      exito(res, resultado.message, { id_asignacion: id });
    } catch (err) {
      if (err.message === 'Asignación no encontrada') {
        return error(res, err.message, 404);
      }
      error(res, 'Error al eliminar la asignación', 500, err.message);
    }
  },

  // (Función del ENUM que hicimos antes)
  obtenerEstadosAsignacion: async (req, res) => {
    try {
      const estados = await asignacionServices.obtenerEstadosAsignacion();
      exito(res, 'Estados de asignación obtenidos', estados);
    } catch (err) {
      error(res, 'Error al obtener estados de asignación', 500, err.message);
    }
  },

};

module.exports = asignacionController;