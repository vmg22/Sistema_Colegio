const express = require('express');
const router = express.Router();
const tutorController = require('./tutor.controller');

router.get('/', tutorController.obtenerTodosTutores);
router.get('/eliminados/listar', tutorController.obtenerTutoresEliminados);
router.get('/:id', tutorController.obtenerTutorPorId);
router.post('/', tutorController.crearTutor);
router.post('/:id/restaurar', tutorController.restaurarTutor);
router.put('/:id', tutorController.actualizarTutor);
router.patch('/:id', tutorController.actualizarTutorParcial);
router.delete('/:id', tutorController.eliminarTutor);

module.exports = router;