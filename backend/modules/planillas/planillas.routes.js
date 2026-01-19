const express = require('express');
const router = express.Router();
const controller = require('./planillas.controller');

// Nivelación (Manual)
router.post('/nivelacion', controller.crearPlanillaNivelacion);
router.get('/nivelacion', controller.obtenerPlanillasNivelacion);
router.get('/nivelacion/:id/detalles', controller.obtenerDetalleNivelacion);

// Regular y Previa (Automático/Consulta)
router.get('/regular', controller.obtenerCandidatosRegular);
router.get('/previa', controller.obtenerCandidatosPrevia);

module.exports = router;
