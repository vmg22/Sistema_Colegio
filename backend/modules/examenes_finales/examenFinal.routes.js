const express = require('express');
const router = express.Router();
const controladorExamenFinal = require('./examenFinal.controller');

// GET /examenes-finales/alumnos-en-final?curso=X&materia=Y&anioLectivo=Z
router.get('/alumnos-en-final', controladorExamenFinal.obtenerAlumnosEnEstadoFinal);

// GET /examenes-finales/alumnos-aprobados?curso=X&materia=Y&anioLectivo=Z
router.get('/alumnos-aprobados', controladorExamenFinal.obtenerAlumnosAprobadosPorFinal);

// GET /examenes-finales/previas-por-materia?materia=Y&anioLectivo=Z
router.get('/previas-por-materia', controladorExamenFinal.obtenerAlumnosConPreviaPorMateria);

// POST /examenes-finales/registrar
router.post('/registrar', controladorExamenFinal.registrarExamenFinal);

// GET /examenes-finales/historial/:idAlumno/:idMateria/:anioLectivo
router.get('/historial/:idAlumno/:idMateria/:anioLectivo', controladorExamenFinal.obtenerHistorialExamenes);

module.exports = router;
