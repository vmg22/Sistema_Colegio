const express = require('express');
const router = express.Router();
const comunicacionController = require('./comunicacion.controller');

router.get('/', comunicacionController.obtenerTodasComunicaciones);
router.get('/eliminados/listar', comunicacionController.obtenerComunicacionesEliminadas);
// ✅ IMPORTANTE: Rutas específicas ANTES de rutas genéricas
router.get('/alumno/:idAlumno', comunicacionController.obtenerComunicacionesPorAlumno);
router.get('/:id', comunicacionController.obtenerComunicacionPorId);
router.post('/', comunicacionController.crearComunicacion);
router.post('/:id/restaurar', comunicacionController.restaurarComunicacion);
router.put('/:id', comunicacionController.actualizarComunicacion);
router.patch('/:id', comunicacionController.actualizarComunicacionParcial);
router.delete('/:id', comunicacionController.eliminarComunicacion);
module.exports = router;