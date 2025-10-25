// materia_correlativa.controller.js

const servicioCorrelativas = require('./materia_correlativa.services'); // Usar el nuevo servicio
const { exito, error } = require('../../utils/responses');

const controladorCorrelativas = {
 
  obtenerTodasCorrelativas: async (solicitud, respuesta) => {
    try {
      const correlativas = await servicioCorrelativas.obtenerTodasCorrelativas();
      exito(respuesta, 'Correlativas obtenidas correctamente', correlativas);
    } catch (err) {
      error(respuesta, 'Error al obtener correlativas', 500, err.message);
    }
  },

  
  obtenerCorrelativaPorId: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const correlativa = await servicioCorrelativas.obtenerCorrelativaPorId(id);
      
      if (!correlativa) {
        return error(respuesta, 'Correlativa no encontrada', 404);
      }
      
      exito(respuesta, 'Correlativa obtenida correctamente', correlativa);
    } catch (err) {
      error(respuesta, 'Error al obtener correlativa', 500, err.message);
    }
  },


  crearCorrelativa: async (solicitud, respuesta) => {
    try {
      const datosCorrelativa = solicitud.body;
      
      if (!datosCorrelativa.id_materia || !datosCorrelativa.id_materia_correlativa) {
        return error(respuesta, 'IDs de materia son obligatorios', 400);
      }
      
      const correlativaCreada = await servicioCorrelativas.crearCorrelativa(datosCorrelativa);
      
      exito(respuesta, 'Correlativa creada exitosamente', correlativaCreada, 201);
    } catch (err) {
      if (err.message.includes('obligatorios') || err.message.includes('correlativa de sí misma')) {
        return error(respuesta, err.message, 400);
      }
      // Manejar error de clave UNIQUE (correlativa ya existe)
      if (err.code === 'ER_DUP_ENTRY') {
          return error(respuesta, 'Esta correlativa ya está registrada', 409);
      }
      error(respuesta, 'Error al crear correlativa', 500, err.message);
    }
  },


  actualizarCorrelativa: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      // En correlativas, PUT y PATCH hacen lo mismo: actualizar el 'tipo'
      const correlativaActualizada = await servicioCorrelativas.actualizarCorrelativa(id, datosActualizados);
      
      exito(respuesta, 'Correlativa actualizada correctamente', correlativaActualizada);
    } catch (err) {
      if (err.message === 'Correlativa no encontrada') {
        return error(respuesta, 'Correlativa no encontrada', 404);
      }
      error(respuesta, 'Error al actualizar correlativa', 500, err.message);
    }
  },

  // Para PATCH se utiliza la misma función que PUT (solo actualiza el tipo)
  actualizarCorrelativaParcial: async (solicitud, respuesta) => {
    return controladorCorrelativas.actualizarCorrelativa(solicitud, respuesta);
  },

  eliminarCorrelativa: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioCorrelativas.eliminarCorrelativa(id);
      
      exito(respuesta, resultado.mensaje, { id_correlativa: resultado.id_correlativa });
    } catch (err) {
      if (err.message === 'Correlativa no encontrada') {
        return error(respuesta, 'Correlativa no encontrada', 404);
      }
      error(respuesta, 'Error al eliminar correlativa', 500, err.message);
    }
  },


  obtenerCorrelativasEliminadas: async (solicitud, respuesta) => {
    try {
      const eliminadas = await servicioCorrelativas.obtenerCorrelativasEliminadas();
      exito(respuesta, 'Correlativas eliminadas obtenidas', eliminadas);
    } catch (err) {
      error(respuesta, 'Error al obtener correlativas eliminadas', 500, err.message);
    }
  },


  restaurarCorrelativa: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const correlativaRestaurada = await servicioCorrelativas.restaurarCorrelativa(id);
      
      exito(respuesta, 'Correlativa restaurada correctamente', correlativaRestaurada);
    } catch (err) {
      if (err.message.includes('no encontrada') || err.message.includes('no está eliminada')) {
        return error(respuesta, err.message, 404);
      }
      error(respuesta, 'Error al restaurar correlativa', 500, err.message);
    }
  }
};

module.exports = controladorCorrelativas;


// permitir que se modifiquen los campos id_materia e id_materia_correlativa en tu endpoint PUT o PATCH de correlativas, necesitas realizar cambios en dos lugares:

// El Servicio (materia_correlativa.services.js): Modificar la lógica para aceptar y usar estos IDs.

// Las Queries (materia_correlativa.queries.js): Crear una nueva consulta SQL que permita actualizar estas claves.

// ⚠️ Advertencia: Modificar claves foráneas es riesgoso. Lo común en sistemas de correlativas es eliminar el registro antiguo y crear uno nuevo para evitar problemas de integridad de datos. Sin embargo, te mostraré cómo modificarlo.