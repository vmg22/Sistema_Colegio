const express = require('express');
const router = express.Router();
const tutorController = require('./tutor.controller');

router.get('/', tutorController.getAllTutores);
router.get('/eliminados/listar', tutorController.getTutoresEliminados);
router.get('/:id', tutorController.getTutorById);
router.post('/', tutorController.createTutor);
router.post('/:id/restaurar', tutorController.restaurarTutor);
router.put('/:id', tutorController.updateTutor);
router.delete('/:id', tutorController.deleteTutor);

module.exports = router;