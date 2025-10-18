const express = require('express');
const router = express.Router();
const cursoController = require('./curso.controller');

router.get('/', cursoController.getAllCursos);
router.get('/eliminados/listar', cursoController.getCursosEliminados);
router.get('/:id', cursoController.getCursoById);
router.post('/', cursoController.createCurso);
router.post('/:id/restaurar', cursoController.restaurarCurso);
router.put('/:id', cursoController.updateCurso);
router.delete('/:id', cursoController.deleteCurso);

module.exports = router;