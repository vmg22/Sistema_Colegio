const servicioAniosLectivos = require('./anio.services');
const { exito, error } = require('../../utils/responses');

const controladorAniosLectivos = {
 
  obtenerTodosAniosLectivos: async (solicitud, respuesta) => {
    try {
      const aniosLectivos = await servicioAniosLectivos.obtenerTodosAniosLectivos();
      exito(respuesta, 'Años lectivos obtenidos correctamente', aniosLectivos);
    } catch (err) {
      error(respuesta, 'Error al obtener años lectivos', 500, err.message);
    }
  },

  
  obtenerAnioLectivoPorId: async (solicitud, respuesta) => {
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


  crearAnioLectivo: async (solicitud, respuesta) => {
    try {
      const datosAnioLectivo = solicitud.body;
      
      if (!datosAnioLectivo.anio || !datosAnioLectivo.fecha_inicio || !datosAnioLectivo.fecha_fin) {
        return error(respuesta, 'Año, fecha inicio y fecha fin son obligatorios', 400);
      }
      
      const anioLectivoCreado = await servicioAniosLectivos.crearAnioLectivo(datosAnioLectivo);
      exito(respuesta, 'Año lectivo creado exitosamente', anioLectivoCreado, 201);
    } catch (err) {
      if (err.message.includes('obligatorios')) {
        return error(respuesta, err.message, 400);
      }
      if (err.code === 'ER_DUP_ENTRY') {
        return error(respuesta, 'El año lectivo ya está registrado', 409, err.message);
      }
      error(respuesta, 'Error al crear año lectivo', 500, err.message);
    }
  },


  actualizarAnioLectivo: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const anioLectivoActualizado = await servicioAniosLectivos.actualizarAnioLectivo(id, datosActualizados);
      exito(respuesta, 'Año lectivo actualizado correctamente', anioLectivoActualizado);
    } catch (err) {
      if (err.message === 'Año lectivo no encontrado') {
        return error(respuesta, 'Año lectivo no encontrado', 404);
      }
      if (err.code === 'ER_DUP_ENTRY') {
        return error(respuesta, 'El año lectivo ya está registrado', 409, err.message);
      }
      error(respuesta, 'Error al actualizar año lectivo', 500, err.message);
    }
  },


  eliminarAnioLectivo: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioAniosLectivos.eliminarAnioLectivo(id);
      exito(respuesta, resultado.mensaje, { id_anio_lectivo: resultado.id_anio_lectivo });
    } catch (err) {
      if (err.message === 'Año lectivo no encontrado') {
        return error(respuesta, 'Año lectivo no encontrado', 404);
      }
      error(respuesta, 'Error al eliminar año lectivo', 500, err.message);
    }
  },


  obtenerAniosLectivosEliminados: async (solicitud, respuesta) => {
    try {
      const aniosLectivosEliminados = await servicioAniosLectivos.obtenerAniosLectivosEliminados();
      exito(respuesta, 'Años lectivos eliminados obtenidos', aniosLectivosEliminados);
    } catch (err) {
      error(respuesta, 'Error al obtener años lectivos eliminados', 500, err.message);
    }
  },


  restaurarAnioLectivo: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const anioLectivoRestaurado = await servicioAniosLectivos.restaurarAnioLectivo(id);
      exito(respuesta, 'Año lectivo restaurado correctamente', anioLectivoRestaurado);
    } catch (err) {
      if (err.message.includes('no encontrado') || err.message.includes('no está eliminado')) {
        return error(respuesta, err.message, 404);
      }
      error(respuesta, 'Error al restaurar año lectivo', 500, err.message);
    }
  }
};

module.exports = controladorAniosLectivos;
