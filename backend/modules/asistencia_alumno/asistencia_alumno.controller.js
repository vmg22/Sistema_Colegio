const servicioAsistencia = require('./asistencia_alumno.services');
const { exito, error } = require('../../utils/responses');


// control de aisstencia por fecha materia y curso docente año // 
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
      const { id_alumno } = req.params;
      const { anio_lectivo } = req.query;
      const reporte = await servicioAsistencia.obtenerReportePorAlumno(id_alumno, anio_lectivo);
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

  obtenerAsistenciaPorId: async (req, res) => {
    try {
      const asistencia = await servicioAsistencia.obtenerAsistenciaPorId(req.params.id);
      if (!asistencia) return error(res, 'Registro no encontrado', 404);
      exito(res, 'Registro obtenido', asistencia);
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
