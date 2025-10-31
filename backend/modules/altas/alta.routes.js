const express = require('express');
const router = express.Router();
const altaController = require('./altas.controller');

/**
 * Rutas para gestión de Docentes y Usuarios
 * Base URL: /api/v1/altas
 */

// =============================================
// RUTAS DE CONSULTA (Sin cambios)
// =============================================

router.get('/docentes', altaController.obtenerTodosDocentes);
router.get('/docentes/eliminados/listar', altaController.obtenerDocentesEliminados);
router.get('/docentes/:id', altaController.obtenerDocentePorId);

// =============================================
// RUTAS DE CREACIÓN (Modificadas)
// =============================================

/**
 * @route   POST /api/v1/altas/docente
 * @desc    (Ruta Antigua) Crea un docente y usuario en 1 paso
 * @access  Private
 */
router.post('/docente', altaController.crearDocente);

/**
 * --- ¡CÓDIGO AÑADIDO PARA EL WIZARD! ---
 */

/**
 * @route   POST /api/v1/altas/docente/perfil
 * @desc    (Wizard Paso 1) Crea SOLO el perfil del docente
 * @access  Private
 */
router.post('/docente/perfil', altaController.crearDocentePerfil);

/**
 * @route   POST /api/v1/altas/docente/:id/usuario
 * @desc    (Wizard Paso 2) Crea el usuario y lo vincula al docente
 * @access  Private
 */
router.post('/docente/:id/usuario', altaController.crearUsuarioParaDocente);

// --- FIN DEL CÓDIGO AÑADIDO ---


// =============================================
// RUTAS DE ACTUALIZACIÓN (Sin cambios)
// =============================================

router.put('/docentes/:id', altaController.actualizarDocente);
router.patch('/docentes/:id', altaController.actualizarDocenteParcial);

// =============================================
// RUTAS DE ELIMINACIÓN Y RESTAURACIÓN (Sin cambios)
// =============================================

router.delete('/docentes/:id', altaController.eliminarDocente);
router.post('/docentes/:id/restaurar', altaController.restaurarDocente);

module.exports = router;