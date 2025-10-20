const express = require('express');
const router = express.Router();
const cursoController = require('./curso.controller');

router.get('/', cursoController.obtenerTodosCursos);
router.get('/eliminados/listar', cursoController.obtenerCursosEliminados);
router.get('/:id', cursoController.obtenerCursoPorId);
router.post('/', cursoController.crearCurso);
router.post('/:id/restaurar', cursoController.restaurarCurso);
router.put('/:id', cursoController.actualizarCurso);
router.delete('/:id', cursoController.eliminarCurso);
router.patch('/:id', cursoController.actualizarCursoParcial);

module.exports = router;