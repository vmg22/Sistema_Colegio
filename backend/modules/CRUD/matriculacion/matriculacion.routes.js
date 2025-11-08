const express = require('express');
const router = express.Router();
const matriculaController = require('./matriculacion.controller');

// Base URL: /api/v1/matriculas

router.get('/', matriculaController.obtenerTodasMatriculas);
router.post('/', matriculaController.crearMatricula);

router.get('/eliminadas/listar', matriculaController.obtenerMatriculasEliminadas);

router.get('/:id', matriculaController.obtenerMatriculaPorId);
router.patch('/:id', matriculaController.actualizarMatricula);
router.delete('/:id', matriculaController.eliminarMatricula);
router.post('/:id/restaurar', matriculaController.restaurarMatricula);

module.exports = router;