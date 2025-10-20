const express = require('express');
const router = express.Router();
const anioLectivoController = require('./anio.controller');

router.get('/', anioLectivoController.obtenerTodosAniosLectivos);
router.get('/eliminados/listar', anioLectivoController.obtenerAniosLectivosEliminados);
router.get('/:id', anioLectivoController.obtenerAnioLectivoPorId);
router.post('/', anioLectivoController.crearAnioLectivo);
router.post('/:id/restaurar', anioLectivoController.restaurarAnioLectivo);
router.put('/:id', anioLectivoController.actualizarAnioLectivo);
router.patch('/:id', anioLectivoController.actualizarAnioLectivoParcial);
router.delete('/:id', anioLectivoController.eliminarAnioLectivo);

module.exports = router;