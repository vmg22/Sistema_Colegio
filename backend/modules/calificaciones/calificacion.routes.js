const express = require('express');
const router = express.Router();
const calificacionController = require('./calificacion.controller');

router.get('/', calificacionController.getAllCalificaciones);
router.get('/eliminados/listar', calificacionController.getCalificacionesEliminadas);
router.get('/:id', calificacionController.getCalificacionById);
router.post('/', calificacionController.createCalificacion);
router.post('/:id/restaurar', calificacionController.restaurarCalificacion);
router.put('/:id', calificacionController.updateCalificacion);
router.delete('/:id', calificacionController.deleteCalificacion);

module.exports = router;