// materia_correlativa.routes.js

const express = require('express');
const router = express.Router();
const correlativaController = require('./materia_correlativa.controller'); // Usar el nuevo controlador

router.get('/', correlativaController.obtenerTodasCorrelativas);
router.get('/eliminados/listar', correlativaController.obtenerCorrelativasEliminadas);
router.get('/:id', correlativaController.obtenerCorrelativaPorId);
router.post('/', correlativaController.crearCorrelativa);
router.post('/:id/restaurar', correlativaController.restaurarCorrelativa);
router.put('/:id', correlativaController.actualizarCorrelativa);
router.patch('/:id', correlativaController.actualizarCorrelativaParcial);
router.delete('/:id', correlativaController.eliminarCorrelativa);

module.exports = router;