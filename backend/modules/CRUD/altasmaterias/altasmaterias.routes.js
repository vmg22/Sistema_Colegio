const express = require('express');
const router = express.Router();
const materiaController = require('./altasmaterias.controller');

// Rutas base: /api/v1/materias

// --- Rutas de ENUMs (deben ir primero) ---
router.get('/estados', materiaController.obtenerEstadosMateria);
router.get('/ciclos', materiaController.obtenerCiclosMateria);

// --- Rutas de Papelera (deben ir antes de /:id) ---
router.get('/eliminados/listar', materiaController.obtenerMateriasEliminadas);

// --- Rutas CRUD estándar ---
router.get('/', materiaController.obtenerTodasMaterias);
router.get('/:id', materiaController.obtenerMateriaPorId);
router.post('/', materiaController.crearMateria);

// Tu ruta 'actualizarMateriaParcial' es la correcta para PATCH
router.patch('/:id', materiaController.actualizarMateriaParcial); 
// Mantenemos PUT por si lo usas, pero recomiendo PATCH
router.put('/:id', materiaController.actualizarMateria); 

router.delete('/:id', materiaController.eliminarMateria);
router.post('/:id/restaurar', materiaController.restaurarMateria);

module.exports = router;