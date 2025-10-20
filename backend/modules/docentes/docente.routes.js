/**
 * =======================================
 * DOCENTE.ROUTES.JS
 * =======================================
 * Define los endpoints de la API para el módulo de docentes.
 */

const express = require('express');
const router = express.Router();
const controladorDocentes = require('./docente.controller');

router.get('/', docenteController.obtenerTodosDocentes);
router.get('/eliminados/listar', docenteController.obtenerDocentesEliminados);
router.get('/:id', docenteController.obtenerDocentePorId);
router.post('/', docenteController.crearDocente);
router.post('/:id/restaurar', docenteController.restaurarDocente);
router.put('/:id', docenteController.actualizarDocente);
router.patch('/:id', docenteController.actualizarDocenteParcial);
router.delete('/:id', docenteController.eliminarDocente);

module.exports = router;