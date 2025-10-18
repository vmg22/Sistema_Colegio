const express = require('express');
const router = express.Router();
const comunicacionController = require('./comunicacion.controller');

router.get('/', comunicacionController.getAllComunicaciones);
router.get('/eliminados/listar', comunicacionController.getComunicacionesEliminadas);
router.get('/:id', comunicacionController.getComunicacionById);
router.post('/', comunicacionController.createComunicacion);
router.post('/:id/restaurar', comunicacionController.restaurarComunicacion);
router.put('/:id', comunicacionController.updateComunicacion);
router.delete('/:id', comunicacionController.deleteComunicacion);

module.exports = router;