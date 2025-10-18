const servicioAniosLectivos = require('./anio.services');
const { exito, error } = require('../../utils/responses');

const controladorAniosLectivos = {
  // GET /api/anios-lectivos
  getAllAniosLectivos: async (solicitud, respuesta) => {
    try {
      const aniosLectivos = await servicioAniosLectivos.obtenerTodosAniosLectivos();
      exito(respuesta, 'Años lectivos obtenidos correctamente', aniosLectivos);
    } catch (err) {
      error(respuesta, 'Error al obtener años lectivos', 500, err.message);
    }
  },

  // GET /api/anios-lectivos/:id
  getAnioLectivoById: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const anioLectivo = await servicioAniosLectivos.obtenerAnioLectivoPorId(id);
      
      if (!anioLectivo) {
        return error(respuesta, 'Año lectivo no encontrado', 404);
      }
      
      exito(respuesta, 'Año lectivo obtenido correctamente', anioLectivo);
    } catch (err) {
      error(respuesta, 'Error al obtener año lectivo', 500, err.message);
    }
  },

  // POST /api/anios-lectivos
  createAnioLectivo: async (solicitud, respuesta) => {
    try {
      const datosAnioLectivo = solicitud.body;
      
      if (!datosAnioLectivo.anio || !datosAnioLectivo.fecha_inicio || !datosAnioLectivo.fecha_fin) {
        return error(respuesta, 'Año, fecha inicio y fecha fin son obligatorios', 400);
      }
      
      const anioLectivoCreado = await servicioAniosLectivos.crearAnioLectivo(datosAnioLectivo);
      exito(respuesta, 'Año lectivo creado exitosamente', anioLectivoCreado, 201);
    } catch (err) {
      error(respuesta, 'Error al crear año lectivo', 400, err.message);
    }
  },

  // PUT /api/anios-lectivos/:id
  updateAnioLectivo: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const anioLectivoActualizado = await servicioAniosLectivos.actualizarAnioLectivo(id, datosActualizados);
      exito(respuesta, 'Año lectivo actualizado correctamente', anioLectivoActualizado);
    } catch (err) {
      error(respuesta, 'Error al actualizar año lectivo', 400, err.message);
    }
  },

  // DELETE /api/anios-lectivos/:id
  deleteAnioLectivo: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioAniosLectivos.eliminarAnioLectivo(id);
      exito(respuesta, resultado.mensaje);
    } catch (err) {
      error(respuesta, 'Error al eliminar año lectivo', 400, err.message);
    }
  },

  // GET /api/anios-lectivos/eliminados/listar
  getAniosLectivosEliminados: async (solicitud, respuesta) => {
    try {
      const aniosLectivosEliminados = await servicioAniosLectivos.obtenerAniosLectivosEliminados();
      exito(respuesta, 'Años lectivos eliminados obtenidos', aniosLectivosEliminados);
    } catch (err) {
      error(respuesta, 'Error al obtener años lectivos eliminados', 500, err.message);
    }
  },

  // POST /api/anios-lectivos/:id/restaurar
  restaurarAnioLectivo: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const anioLectivoRestaurado = await servicioAniosLectivos.restaurarAnioLectivo(id);
      exito(respuesta, 'Año lectivo restaurado correctamente', anioLectivoRestaurado);
    } catch (err) {
      error(respuesta, 'Error al restaurar año lectivo', 400, err.message);
    }
  }
};

module.exports = controladorAniosLectivos;