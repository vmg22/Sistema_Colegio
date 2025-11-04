// comunicacion_destinatario.routes.js

const express = require('express');
const router = express.Router();
const destinatarioController = require('./comunicacion_destinatario.controller');

router.get('/', destinatarioController.obtenerTodosDestinatarios);
router.get('/eliminados/listar', destinatarioController.obtenerDestinatariosEliminados);
router.get('/:id', destinatarioController.obtenerDestinatarioPorId);
router.post('/', destinatarioController.crearDestinatario);
router.post('/:id/restaurar', destinatarioController.restaurarDestinatario);
router.put('/:id', destinatarioController.actualizarDestinatario);
router.patch('/:id', destinatarioController.actualizarDestinatarioParcial);
router.delete('/:id', destinatarioController.eliminarDestinatario);

module.exports = router;