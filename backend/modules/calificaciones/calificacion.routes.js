const express = require('express');
const router = express.Router();
const calificacionController = require('./calificacion.controller');

router.get('/', calificacionController.obtenerTodasCalificaciones);
router.get('/eliminadas/listar', calificacionController.obtenerCalificacionesEliminadas);
router.get('/:id', calificacionController.obtenerCalificacionPorId);
router.post('/', calificacionController.crearCalificacion);
router.post('/:id/restaurar', calificacionController.restaurarCalificacion);
router.put('/:id', calificacionController.actualizarCalificacion);
router.patch('/:id', calificacionController.actualizarCalificacionParcial); // ← NUEVA LÍNEA
router.delete('/:id', calificacionController.eliminarCalificacion);

module.exports = router;