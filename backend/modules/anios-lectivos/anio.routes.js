const express = require('express');
const router = express.Router();
const anioLectivoController = require('./anio.controller');

router.get('/', anioLectivoController.getAllAniosLectivos);
router.get('/eliminados/listar', anioLectivoController.getAniosLectivosEliminados);
router.get('/:id', anioLectivoController.getAnioLectivoById);
router.post('/', anioLectivoController.createAnioLectivo);
router.post('/:id/restaurar', anioLectivoController.restaurarAnioLectivo);
router.put('/:id', anioLectivoController.updateAnioLectivo);
router.delete('/:id', anioLectivoController.deleteAnioLectivo);

module.exports = router;