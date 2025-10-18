const express = require('express');
const router = express.Router();
const materiaController = require('./materia.controller');

router.get('/', materiaController.getAllMaterias);
router.get('/eliminados/listar', materiaController.getMateriasEliminadas);
router.get('/:id', materiaController.getMateriaById);
router.post('/', materiaController.createMateria);
router.post('/:id/restaurar', materiaController.restaurarMateria);
router.put('/:id', materiaController.updateMateria);
router.delete('/:id', materiaController.deleteMateria);

module.exports = router;