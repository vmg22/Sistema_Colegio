const servicioAsistencia = require('./asistencia_alumno.services');
const { exito, error } = require('../../utils/responses');

const controladorAsistencia = {
  obtenerListaClase: async (req, res) => {
    try {
      const lista = await servicioAsistencia.obtenerListaClase(req.query);
      exito(res, 'Lista de clase obtenida', lista);
    } catch (err) {
      error(res, err.message, 400);
    }
  },

  obtenerReportePorAlumno: async (req, res) => {
    try {
      const { dni_alumno } = req.params;
      const { anio_lectivo } = req.query;
      const reporte = await servicioAsistencia.obtenerReportePorAlumno(dni_alumno, anio_lectivo);
      exito(res, 'Reporte obtenido', reporte);
    } catch (err) {
      error(res, err.message, 400);
    }
  },

  guardarAsistenciasClase: async (req, res) => {
    try {
      const resultado = await servicioAsistencia.guardarAsistenciasClase(req.body);
      exito(res, 'Asistencias guardadas correctamente', resultado, 201);
    } catch (err) {
      error(res, err.message, 400);
    }
  },

  obtenerAsistenciaPorDNI: async (req, res) => {
    try {
      const { dni } = req.params;
      const asistencia = await servicioAsistencia.obtenerAsistenciaPorDNI(dni);
      if (!asistencia || asistencia.length === 0)
        return error(res, 'No se encontraron registros para este alumno', 404);
      exito(res, 'Asistencias obtenidas', asistencia);
    } catch (err) {
      error(res, err.message, 400);
    }
  },

  actualizarAsistencia: async (req, res) => {
    try {
      const asistencia = await servicioAsistencia.actualizarAsistencia(req.params.id, req.body);
      exito(res, 'Registro actualizado', asistencia);
    } catch (err) {
      error(res, err.message, 400);
    }
  },

  eliminarAsistencia: async (req, res) => {
    try {
      const resultado = await servicioAsistencia.eliminarAsistencia(req.params.id);
      exito(res, resultado.mensaje, { id_asistencia: resultado.id_asistencia });
    } catch (err) {
      error(res, err.message, 400);
    }
  },

  obtenerAsistenciasEliminadas: async (req, res) => {
    try {
      const registros = await servicioAsistencia.obtenerAsistenciasEliminadas();
      exito(res, 'Registros eliminados obtenidos', registros);
    } catch (err) {
      error(res, err.message, 400);
    }
  },

  restaurarAsistencia: async (req, res) => {
    try {
      const restaurado = await servicioAsistencia.restaurarAsistencia(req.params.id);
      exito(res, 'Registro restaurado', restaurado);
    } catch (err) {
      error(res, err.message, 400);
    }
  }
};

module.exports = controladorAsistencia;
