const express = require('express');
const router = express.Router();
const usuarioController = require('./usuario.controller');

router.get('/', usuarioController.obtenerTodosUsuarios);
router.get('/eliminados/listar', usuarioController.obtenerUsuariosEliminados);
router.get('/:id', usuarioController.obtenerUsuarioPorId);
router.post('/', usuarioController.crearUsuario);
router.post('/:id/restaurar', usuarioController.restaurarUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);


module.exports = router;