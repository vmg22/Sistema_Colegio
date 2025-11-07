const express = require('express');
const router = express.Router();
const usuarioController = require('./usuario.controller');
const { authenticateToken, authorizeRoles } = require('../../middleware/auth.middleware');

// ✅ IMPORTANTE: Rutas específicas ANTES de rutas con parámetros

// Rutas específicas con segmentos fijos
router.get('/eliminados/listar', 
  authenticateToken, 
  authorizeRoles('admin'), 
  usuarioController.obtenerUsuariosEliminados
);

router.get('/email/:email', 
  authenticateToken, 
  authorizeRoles('admin'), 
  usuarioController.obtenerPorEmail
);

// Rutas generales (lista y detalle)
router.get('/', 
  authenticateToken, 
  authorizeRoles('admin'), 
  usuarioController.obtenerTodosUsuarios
);

router.get('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  usuarioController.obtenerUsuarioPorId
);

// Rutas de creación y modificación
router.post('/', 
  authenticateToken, 
  authorizeRoles('admin'), 
  usuarioController.crearUsuario
);

router.post('/:id/restaurar', 
  authenticateToken, 
  authorizeRoles('admin'), 
  usuarioController.restaurarUsuario
);

router.put('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  usuarioController.actualizarUsuario
);

router.patch('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  usuarioController.actualizarUsuarioParcial
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('admin'), 
  usuarioController.eliminarUsuario
);

module.exports = router;