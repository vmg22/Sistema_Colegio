const express = require('express');
const router = express.Router();
const controladorAuth = require('./auth.controller');
const { 
  authenticateToken, 
  authorizeRoles,
  loginRateLimiter,
  passwordResetRateLimiter,
  checkTokenBlacklist
} = require('../../middleware/auth.middleware');

// ==================== RUTAS PÚBLICAS ====================

/**
 * POST /api/auth/login
 * Login con email y contraseña
 * Rate limited: 5 intentos / 15 minutos
 */
router.post('/login', loginRateLimiter, controladorAuth.login);

/**
 * POST /api/auth/register
 * Registro de nuevo usuario
 */
router.post('/register', controladorAuth.register);

/**
 * POST /api/auth/solicitar-reset
 * Solicita recuperación de contraseña por email
 * Rate limited: 3 intentos / 15 minutos
 */
router.post('/solicitar-reset', passwordResetRateLimiter, controladorAuth.solicitarReset);

/**
 * GET /api/auth/validar-token-reset/:token
 * Valida si un token de recuperación es válido
 */
router.get('/validar-token-reset/:token', controladorAuth.validarTokenReset);

/**
 * POST /api/auth/reset-password
 * Cambia la contraseña usando token de recuperación
 */
router.post('/reset-password', controladorAuth.resetPassword);

// ==================== RUTAS PROTEGIDAS ====================

/**
 * POST /api/auth/logout
 * Cierra la sesión del usuario autenticado
 * Requiere: Token JWT válido
 */
router.post('/logout', authenticateToken, checkTokenBlacklist, controladorAuth.logout);

/**
 * GET /api/auth/perfil
 * Obtiene el perfil del usuario autenticado
 * Requiere: Token JWT válido
 */
router.get('/perfil', authenticateToken, checkTokenBlacklist, controladorAuth.obtenerPerfil);

/**
 * PATCH /api/auth/perfil
 * Actualiza el perfil del usuario autenticado
 * Requiere: Token JWT válido
 */
router.patch('/perfil', authenticateToken, checkTokenBlacklist, controladorAuth.actualizarPerfil);

/**
 * POST /api/auth/cambiar-password
 * Cambia la contraseña del usuario autenticado (requiere contraseña actual)
 * Requiere: Token JWT válido
 */
router.post('/cambiar-password', authenticateToken, checkTokenBlacklist, controladorAuth.cambiarPasswordAutenticado);

/**
 * GET /api/auth/verificar
 * Verifica si el token actual es válido
 * Requiere: Token JWT válido
 */
router.get('/verificar', authenticateToken, checkTokenBlacklist, controladorAuth.verificarToken);

module.exports = router;