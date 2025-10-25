const altaServices = require('./alta.services');

/**
 * Funciones auxiliares para respuestas estandarizadas
 */
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

/**
 * Controlador para gestión de Docentes y Usuarios
 */
const altaController = {
  /**
   * Crea un docente junto con su usuario
   * @route POST /api/v1/altas/docente
   */
  crearDocente: async (req, res) => {
    try {
      const datosDocente = req.body;
      
      const docenteCreado = await altaServices.altaDocenteUsuario(datosDocente);
      
      exito(res, 'Docente y usuario creados exitosamente', docenteCreado, 201);
    } catch (err) {
      // Errores de validación
      if (err.message.includes('obligatorios')) {
        return error(res, err.message, 400);
      }
      
      // Errores de duplicados
      if (err.message.includes('ya está registrado')) {
        return error(res, err.message, 409);
      }
      
      // Errores de base de datos
      if (err.code === 'ER_DUP_ENTRY') {
        if (err.message.includes('dni_docente')) {
          return error(res, 'El DNI ya está registrado', 409, err.message);
        }
        if (err.message.includes('email')) {
          return error(res, 'El Email ya está registrado', 409, err.message);
        }
        return error(res, 'Ya existe un registro con estos datos', 409, err.message);
      }
      
      // Error genérico
      error(res, 'Error al crear docente y usuario', 500, err.message);
    }
  },

  /**
   * Obtiene todos los docentes
   * @route GET /api/v1/altas/docentes
   */
  obtenerTodosDocentes: async (req, res) => {
    try {
      const docentes = await altaServices.obtenerTodosDocentes();
      
      exito(res, 'Docentes obtenidos exitosamente', {
        total: docentes.length,
        docentes
      });
    } catch (err) {
      error(res, 'Error al obtener docentes', 500, err.message);
    }
  },

  /**
   * Obtiene un docente por ID
   * @route GET /api/v1/altas/docentes/:id
   */
  obtenerDocentePorId: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return error(res, 'ID de docente inválido', 400);
      }
      
      const docente = await altaServices.obtenerDocentePorId(id);
      
      exito(res, 'Docente obtenido exitosamente', docente);
    } catch (err) {
      if (err.message === 'Docente no encontrado') {
        return error(res, err.message, 404);
      }
      error(res, 'Error al obtener docente', 500, err.message);
    }
  },

  /**
   * Actualiza un docente
   * @route PUT /api/v1/altas/docentes/:id
   */
  actualizarDocente: async (req, res) => {
    try {
      const { id } = req.params;
      const datosActualizacion = req.body;
      
      if (!id || isNaN(id)) {
        return error(res, 'ID de docente inválido', 400);
      }
      
      const docenteActualizado = await altaServices.actualizarDocente(id, datosActualizacion);
      
      exito(res, 'Docente actualizado exitosamente', docenteActualizado);
    } catch (err) {
      if (err.message === 'Docente no encontrado') {
        return error(res, err.message, 404);
      }
      error(res, 'Error al actualizar docente', 500, err.message);
    }
  },

  /**
   * Actualiza parcialmente un docente
   * @route PATCH /api/v1/altas/docentes/:id
   */
  actualizarDocenteParcial: async (req, res) => {
    try {
      const { id } = req.params;
      const datosActualizacion = req.body;
      
      if (!id || isNaN(id)) {
        return error(res, 'ID de docente inválido', 400);
      }
      
      // Para PATCH, solo actualizamos los campos que vienen en el body
      const docenteActualizado = await altaServices.actualizarDocente(id, datosActualizacion);
      
      exito(res, 'Docente actualizado exitosamente', docenteActualizado);
    } catch (err) {
      if (err.message === 'Docente no encontrado') {
        return error(res, err.message, 404);
      }
      error(res, 'Error al actualizar docente', 500, err.message);
    }
  },

  /**
   * Elimina un docente (soft delete)
   * @route DELETE /api/v1/altas/docentes/:id
   */
  eliminarDocente: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return error(res, 'ID de docente inválido', 400);
      }
      
      const resultado = await altaServices.eliminarDocente(id);
      
      exito(res, resultado.message, {
        id_docente: resultado.id_docente,
        id_usuario: resultado.id_usuario
      });
    } catch (err) {
      if (err.message === 'Docente no encontrado') {
        return error(res, err.message, 404);
      }
      error(res, 'Error al eliminar docente', 500, err.message);
    }
  },

  /**
   * Obtiene docentes eliminados
   * @route GET /api/v1/altas/docentes/eliminados/listar
   */
  obtenerDocentesEliminados: async (req, res) => {
    try {
      const docentes = await altaServices.obtenerDocentesEliminados();
      
      exito(res, 'Docentes eliminados obtenidos exitosamente', {
        total: docentes.length,
        docentes
      });
    } catch (err) {
      error(res, 'Error al obtener docentes eliminados', 500, err.message);
    }
  },

  /**
   * Restaura un docente eliminado
   * @route POST /api/v1/altas/docentes/:id/restaurar
   */
  restaurarDocente: async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return error(res, 'ID de docente inválido', 400);
      }
      
      const docenteRestaurado = await altaServices.restaurarDocente(id);
      
      exito(res, 'Docente restaurado exitosamente', docenteRestaurado);
    } catch (err) {
      error(res, 'Error al restaurar docente', 500, err.message);
    }
  }
};

module.exports = altaController;