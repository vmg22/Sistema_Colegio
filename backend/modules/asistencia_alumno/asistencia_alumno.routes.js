const express = require('express');
const router = express.Router();
const asistenciaController = require('./asistencia_alumno.controller');

// 🩵 Health check
router.get('/', (req, res) => {
  res.status(200).json({ mensaje: '✅ Módulo de asistencia funcionando correctamente' });
});

// 🧾 Obtener lista de clase (por curso, materia, fecha)
router.get('/clase', asistenciaController.obtenerListaClase);

// 💾 Guardar o actualizar asistencias de una clase
router.post('/clase', asistenciaController.guardarAsistenciasClase);

// 📊 Reporte consolidado de asistencias de un alumno (por DNI y año lectivo)
router.get('/reporte/alumno/:dni_alumno', asistenciaController.obtenerReportePorAlumno);

// 🧍♂️ Obtener todas las asistencias de un alumno por DNI
router.get('/alumno/:dni', asistenciaController.obtenerAsistenciaPorDNI);

// ⚙️ Actualizar un registro específico de asistencia (por id_asistencia)
router.put('/:id', asistenciaController.actualizarAsistencia);

// ❌ Eliminar lógicamente un registro de asistencia (por id_asistencia)
router.delete('/:id', asistenciaController.eliminarAsistencia);

// 🗑️ Listar registros eliminados
router.get('/eliminados/listar', asistenciaController.obtenerAsistenciasEliminadas);

// 🔁 Restaurar asistencia eliminada
router.post('/:id/restaurar', asistenciaController.restaurarAsistencia);

module.exports = router;
