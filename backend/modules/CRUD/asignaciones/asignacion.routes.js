const express = require('express');
const router = express.Router();
const asignacionController = require('./asignacion.controller');

/**
 * Rutas para Asignaciones
 * Base URL: /api/v1/asignaciones
 */

/**
 * @route   GET /api/v1/asignaciones
 * @desc    Obtiene una lista de asignaciones (filtrable por query params)
 * @query   ?id_docente=X  (Filtra por docente)
 * @query   ?id_curso=Y    (Filtra por curso)
 * @query   ?anio_lectivo=Z (Filtra por año)
 * 
 */

router.get('/estados', asignacionController.obtenerEstadosAsignacion);
router.get('/', asignacionController.obtenerAsignaciones);

/**
 * @route   POST /api/v1/asignaciones
 * @desc    Crea una nueva asignación.
 * @body    { id_docente, id_curso, id_materia, anio_lectivo }
 */
router.post('/', asignacionController.crearAsignacion);

/**
 * @route   GET /api/v1/asignaciones/:id
 * @desc    Obtiene una asignación específica por su ID (con JOINs).
 */
router.get('/:id', asignacionController.obtenerAsignacionPorId);

/**
 * @route   PATCH /api/v1/asignaciones/:id
 * @desc    Actualiza parcialmente una asignación (ej: estado o año).
 * @body    { anio_lectivo, estado } (ambos opcionales)
 */
router.patch('/:id', asignacionController.actualizarAsignacion);

/**
 * @route   DELETE /api/v1/asignaciones/:id
 * @desc    Elimina (soft delete) una asignación por su ID.
 */
router.delete('/:id', asignacionController.eliminarAsignacion);

module.exports = router;