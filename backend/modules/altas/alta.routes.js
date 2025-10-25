const express = require('express');
const router = express.Router();
const altaController = require('./altas.controller');

/**
 * Rutas para gestión de Docentes y Usuarios
 * Base URL: /api/v1/altas
 */

// =============================================
// RUTAS DE CONSULTA
// =============================================

/**
 * @route   GET /api/v1/altas/docentes
 * @desc    Obtiene todos los docentes activos
 * @access  Private
 */
router.get('/docentes', altaController.obtenerTodosDocentes);

/**
 * @route   GET /api/v1/altas/docentes/eliminados/listar
 * @desc    Obtiene todos los docentes eliminados
 * @access  Private
 * @note    Esta ruta debe ir ANTES de /docentes/:id para evitar conflictos
 */
router.get('/docentes/eliminados/listar', altaController.obtenerDocentesEliminados);

/**
 * @route   GET /api/v1/altas/docentes/:id
 * @desc    Obtiene un docente específico por ID
 * @access  Private
 */
router.get('/docentes/:id', altaController.obtenerDocentePorId);

// =============================================
// RUTAS DE CREACIÓN
// =============================================

/**
 * @route   POST /api/v1/altas/docente
 * @desc    Crea un nuevo docente y su usuario asociado
 * @access  Private
 * @body    {
 *   username: string (requerido)
 *   email: string (requerido) - Se usa para usuario.email_usuario Y docente.email,
 *   password: string (requerido),
 *   dni_docente: string (requerido),
 *   nombre: string (requerido),
 *   apellido: string (requerido),
 *   telefono: string (opcional),
 *   especialidad: string (opcional),
 *   estado: enum('activo','licencia','inactivo') (opcional, default: 'activo')
 * }
 */
router.post('/docente', altaController.crearDocente);

// =============================================
// RUTAS DE ACTUALIZACIÓN
// =============================================

/**
 * @route   PUT /api/v1/altas/docentes/:id
 * @desc    Actualiza completamente un docente
 * @access  Private
 */
router.put('/docentes/:id', altaController.actualizarDocente);

/**
 * @route   PATCH /api/v1/altas/docentes/:id
 * @desc    Actualiza parcialmente un docente
 * @access  Private
 */
router.patch('/docentes/:id', altaController.actualizarDocenteParcial);

// =============================================
// RUTAS DE ELIMINACIÓN Y RESTAURACIÓN
// =============================================

/**
 * @route   DELETE /api/v1/altas/docentes/:id
 * @desc    Elimina un docente y su usuario (soft delete)
 * @access  Private
 */
router.delete('/docentes/:id', altaController.eliminarDocente);

/**
 * @route   POST /api/v1/altas/docentes/:id/restaurar
 * @desc    Restaura un docente y su usuario eliminados
 * @access  Private
 */
router.post('/docentes/:id/restaurar', altaController.restaurarDocente);

module.exports = router;