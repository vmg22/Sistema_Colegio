const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

router.get('/', authController.getAllUsuarios);
router.get('/eliminados/listar', authController.getUsuariosEliminados);
router.get('/:id', authController.getUsuarioById);
router.post('/', authController.createUsuario);
router.post('/:id/restaurar', authController.restaurarUsuario);
router.put('/:id', authController.updateUsuario);
router.delete('/:id', authController.deleteUsuario);


module.exports = router;