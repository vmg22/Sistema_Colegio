const express = require('express');
const router = express.Router();
const usuarioController = require('./usuario.controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth.middleware');

// IMPORTANTE: Rutas específicas ANTES de rutas con parámetros
router.get('/eliminados/listar', usuarioController.obtenerUsuariosEliminados);

router.get('/', authenticateToken, authorizeRoles('admin'), usuarioController.obtenerTodosUsuarios);
router.get('/:id', authenticateToken, authorizeRoles('admin'), usuarioController.obtenerUsuarioPorId);
router.get('/email/:email', authenticateToken, authorizeRoles('administrador'), usuarioController.obtenerPorEmail);
router.post('/', usuarioController.crearUsuario);
router.post('/:id/restaurar', usuarioController.restaurarUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.patch('/:id', usuarioController.actualizarUsuarioParcial);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;
