const express = require('express');
const router = express.Router();
const materiaController = require('./materia.controller');

router.get('/', materiaController.obtenerTodasMaterias);
router.get('/eliminados/listar', materiaController.obtenerMateriasEliminadas);
router.get('/:id', materiaController.obtenerMateriaPorId);
router.post('/', materiaController.crearMateria);
router.post('/:id/restaurar', materiaController.restaurarMateria);
router.put('/:id', materiaController.actualizarMateria);
router.delete('/:id', materiaController.eliminarMateria);

module.exports = router;