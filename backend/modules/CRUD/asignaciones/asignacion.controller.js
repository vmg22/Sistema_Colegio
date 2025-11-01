const asignacionServices = require('./asignacion.services');

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

  /**
   * @route GET /api/v1/asignaciones
   */
  obtenerAsignaciones: async (req, res) => {
    try {
      const asignaciones = await asignacionServices.obtenerAsignaciones(req.query);
      exito(res, 'Asignaciones obtenidas correctamente', asignaciones);
    } catch (err) {
      error(res, 'Error al obtener asignaciones', 500, err.message);
    }
  },

  /**
   * @route GET /api/v1/asignaciones/:id
   */
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

  /**
   * @route POST /api/v1/asignaciones
   */
  crearAsignacion: async (req, res) => {
    try {
      const nuevaAsignacion = await asignacionServices.crearAsignacion(req.body);
      exito(res, 'Asignación creada exitosamente', nuevaAsignacion, 201);
    } catch (err) {
      if (err.message.includes('obligatorios')) {
        return error(res, err.message, 400); // Bad Request
      }
      if (err.message.includes('ya existe')) {
        return error(res, err.message, 409); // Conflict
      }
      error(res, 'Error al crear la asignación', 500, err.message);
    }
  },

  /**
   * @route PATCH /api/v1/asignaciones/:id
   */
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

  /**
   * @route DELETE /api/v1/asignaciones/:id
   */
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

};

module.exports = asignacionController;