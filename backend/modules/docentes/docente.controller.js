const servicioDocentes = require('./docente.services');
const { exito, error } = require('../../utils/responses');

const controladorDocentes = {
  // GET /api/docentes
  getAllDocentes: async (solicitud, respuesta) => {
    try {
      const docentes = await servicioDocentes.obtenerTodosDocentes();
      exito(respuesta, 'Docentes obtenidos correctamente', docentes);
    } catch (err) {
      error(respuesta, 'Error al obtener docentes', 500, err.message);
    }
  },

  // GET /api/docentes/:id
  getDocenteById: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const docente = await servicioDocentes.obtenerDocentePorId(id);
      
      if (!docente) {
        return error(respuesta, 'Docente no encontrado', 404);
      }
      
      exito(respuesta, 'Docente obtenido correctamente', docente);
    } catch (err) {
      error(respuesta, 'Error al obtener docente', 500, err.message);
    }
  },

  // POST /api/docentes
  createDocente: async (solicitud, respuesta) => {
    try {
      const datosDocente = solicitud.body;
      
      if (!datosDocente.dni_docente || !datosDocente.nombre || !datosDocente.apellido) {
        return error(respuesta, 'DNI, nombre y apellido son obligatorios', 400);
      }
      
      const docenteCreado = await servicioDocentes.crearDocente(datosDocente);
      exito(respuesta, 'Docente creado exitosamente', docenteCreado, 201);
    } catch (err) {
      error(respuesta, 'Error al crear docente', 400, err.message);
    }
  },

  // PUT /api/docentes/:id
  updateDocente: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const docenteActualizado = await servicioDocentes.actualizarDocente(id, datosActualizados);
      exito(respuesta, 'Docente actualizado correctamente', docenteActualizado);
    } catch (err) {
      error(respuesta, 'Error al actualizar docente', 400, err.message);
    }
  },

  // DELETE /api/docentes/:id
  deleteDocente: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioDocentes.eliminarDocente(id);
      exito(respuesta, resultado.mensaje);
    } catch (err) {
      error(respuesta, 'Error al eliminar docente', 400, err.message);
    }
  },

  // GET /api/docentes/eliminados/listar
  getDocentesEliminados: async (solicitud, respuesta) => {
    try {
      const docentesEliminados = await servicioDocentes.obtenerDocentesEliminados();
      exito(respuesta, 'Docentes eliminados obtenidos', docentesEliminados);
    } catch (err) {
      error(respuesta, 'Error al obtener docentes eliminados', 500, err.message);
    }
  },

  // POST /api/docentes/:id/restaurar
  restaurarDocente: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const docenteRestaurado = await servicioDocentes.restaurarDocente(id);
      exito(respuesta, 'Docente restaurado correctamente', docenteRestaurado);
    } catch (err) {
      error(respuesta, 'Error al restaurar docente', 400, err.message);
    }
  }
};

module.exports = controladorDocentes;