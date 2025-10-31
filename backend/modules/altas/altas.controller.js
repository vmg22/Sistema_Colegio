const altaServices = require('./alta.services');

// --- (Funciones 'exito' y 'error' - sin cambios) ---
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

const altaController = {

  // --- (Función 'crearDocente' de 1 paso - sin cambios) ---
  crearDocente: async (req, res) => {
    try {
      const datosDocente = req.body;
      const docenteCreado = await altaServices.altaDocenteUsuario(datosDocente);
      exito(res, 'Docente y usuario creados exitosamente', docenteCreado, 201);
    } catch (err) {
      if (err.message.includes('obligatorios')) {
        return error(res, err.message, 400);
      }
      if (err.message.includes('ya está registrado')) {
        return error(res, err.message, 409);
      }
      if (err.code === 'ER_DUP_ENTRY') {
        return error(res, 'El DNI o Email ya están en uso', 409, err.message);
      }
      error(res, 'Error al crear docente y usuario', 500, err.message);
    }
  },

  // --- (Funciones del Wizard - sin cambios) ---
  crearDocentePerfil: async (req, res) => {
    try {
      const datosDocente = req.body;
      const docenteCreado = await altaServices.crearDocentePerfil(datosDocente);
      exito(res, 'Perfil de docente creado exitosamente', docenteCreado, 201);
    } catch (err) {
      if (err.message.includes('obligatorios')) {
        return error(res, err.message, 400);
      }
      if (err.message.includes('ya está registrado')) {
        return error(res, err.message, 409);
      }
      error(res, 'Error al crear perfil de docente', 500, err.message);
    }
  },
  crearUsuarioParaDocente: async (req, res) => {
    try {
      const { id } = req.params; 
      const datosUsuario = req.body;
      const usuarioVinculado = await altaServices.crearUsuarioParaDocente(id, datosUsuario);
      exito(res, 'Usuario creado y vinculado exitosamente', usuarioVinculado, 201);
    } catch (err) {
      if (err.message.includes('obligatorios')) {
        return error(res, err.message, 400);
      }
      if (err.message.includes('ya está registrado')) {
        return error(res, err.message, 409);
      }
      if (err.code === 'ER_DUP_ENTRY') {
        return error(res, 'El Username o Email ya están en uso', 409, err.message);
      }
      error(res, 'Error al crear y vincular usuario', 500, err.message);
    }
  },

  // --- (Resto de funciones - completadas) ---
  obtenerTodosDocentes: async (req, res) => {
    try {
      const { buscar } = req.query; // Lee el query param
      const docentes = await altaServices.obtenerTodosDocentes(buscar); // Pásalo al service
      
      exito(res, 'Docentes obtenidos exitosamente', {
        total: docentes.length,
        docentes
      });
    } catch (err) {
      error(res, 'Error al obtener docentes', 500, err.message);
    }
  },
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
  actualizarDocenteParcial: async (req, res) => {
    try {
      const { id } = req.params;
      const datosActualizacion = req.body;
      if (!id || isNaN(id)) {
        return error(res, 'ID de docente inválido', 400);
      }
      // NOTA: Tu service llama a 'actualizarDocente' (actualización completa)
      // Deberías implementar una lógica de PATCH real si es necesario.
      const docenteActualizado = await altaServices.actualizarDocente(id, datosActualizacion);
      exito(res, 'Docente actualizado exitosamente', docenteActualizado);
    } catch (err) {
      if (err.message === 'Docente no encontrado') {
        return error(res, err.message, 404);
      }
      error(res, 'Error al actualizar docente', 500, err.message);
    }
  },
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