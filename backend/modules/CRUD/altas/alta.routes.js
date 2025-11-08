const express = require('express');
const router = express.Router();
const altaController = require('./alta.controller');

/**
 * Rutas para gestión de Docentes y Usuarios
 * Base URL: /api/v1/altas
 */

// =============================================
// RUTAS DE CONSULTA
// =============================================
router.get('/docentes', altaController.obtenerTodosDocentes);

// --- ¡RUTA CORREGIDA! ---
// Debe ir ANTES de /docentes/:id para que 'estados' no sea tratado como un ID
router.get('/docentes/estados', altaController.obtenerEstadosDocente);

router.get('/docentes/eliminados/listar', altaController.obtenerDocentesEliminados);
router.get('/docentes/:id', altaController.obtenerDocentePorId);

// =============================================
// RUTAS DE CREACIÓN
// =============================================
// (Ruta Antigua - 1 paso)
router.post('/docente', altaController.crearDocente);

// (Wizard Paso 1)
router.post('/docente/perfil', altaController.crearDocentePerfil);

// (Wizard Paso 2)
router.post('/docente/:id/usuario', altaController.crearUsuarioParaDocente);

// =============================================
// RUTAS DE ACTUALIZACIÓN Y OTRAS
// =============================================
router.put('/docentes/:id', altaController.actualizarDocente);
router.patch('/docentes/:id', altaController.actualizarDocenteParcial);
router.delete('/docentes/:id', altaController.eliminarDocente);
router.post('/docentes/:id/restaurar', altaController.restaurarDocente);

// (Ruta de reseteo de pass que hicimos antes)
// router.post('/docente/:id/reset-password', altaController.restablecerPasswordDocente);

module.exports = router;