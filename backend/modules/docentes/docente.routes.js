const express = require('express');
const router = express.Router();
const docenteController = require('./docente.controller');

router.get('/', docenteController.getAllDocentes);
router.get('/eliminados/listar', docenteController.getDocentesEliminados);
router.get('/:id', docenteController.getDocenteById);
router.post('/', docenteController.createDocente);
router.post('/:id/restaurar', docenteController.restaurarDocente);
router.put('/:id', docenteController.updateDocente);
router.delete('/:id', docenteController.deleteDocente);

module.exports = router;