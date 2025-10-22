const express = require('express');
const router = express.Router();
const asistenciaController = require('./asistencia_alumno.controller');

router.get('/', (req, res) => {
  res.status(200).json({ mensaje: '✅ Módulo de asistencia funcionando correctamente' });
});

router.get('/clase', asistenciaController.obtenerListaClase);
router.post('/clase', asistenciaController.guardarAsistenciasClase);
router.get('/reporte/alumno/:id_alumno', asistenciaController.obtenerReportePorAlumno);

router.get('/eliminados/listar', asistenciaController.obtenerAsistenciasEliminadas);
router.get('/:id', asistenciaController.obtenerAsistenciaPorId);
router.put('/:id', asistenciaController.actualizarAsistencia);
router.delete('/:id', asistenciaController.eliminarAsistencia);
router.post('/:id/restaurar', asistenciaController.restaurarAsistencia);

module.exports = router;
