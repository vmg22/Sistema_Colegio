const express = require('express');
const router = express.Router();
const controladorPrevias = require('./previas.controller');

// GET /previas/alumnos-pendientes?curso=X&materia=Y&anioLectivo=Z
router.get('/alumnos-pendientes', controladorPrevias.obtenerAlumnosPendientes);

// GET /previas/alumnos-aprobados?curso=X&materia=Y&anioLectivo=Z
router.get('/alumnos-aprobados', controladorPrevias.obtenerAlumnosAprobados);

// POST /previas/registrar
router.post('/registrar', controladorPrevias.registrarIntentoPrevia);

module.exports = router;
