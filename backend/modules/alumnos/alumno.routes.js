/**
 * =======================================
 * ALUMNO.ROUTES.JS (VERSIÓN FINAL)
 * =======================================
 * Define todos los endpoints de la API para el módulo de alumnos,
 * asociando cada ruta a su respectivo controlador.
 */

const express = require('express');
const router = express.Router();
const controladorAlumnos = require('./alumno.controller');

// --- CRUD PRINCIPAL ---
router.get('/', controladorAlumnos.obtenerTodos);
router.post('/', controladorAlumnos.crear);
router.get('/:id', controladorAlumnos.obtenerPorId);
router.put('/:id', controladorAlumnos.actualizarCompleto);
router.patch('/:id', controladorAlumnos.actualizarParcial);
router.delete('/:id', controladorAlumnos.eliminar);

// --- ACCIONES ESPECIALES ---
router.patch('/:id/estado', controladorAlumnos.actualizarEstado);
router.patch('/:id/restaurar', controladorAlumnos.restaurar);

// --- REPORTES Y BÚSQUEDAS ---
router.get('/paginados', controladorAlumnos.obtenerPaginados);
router.get('/estadisticas', controladorAlumnos.obtenerEstadisticas);
router.get('/reportes/contacto-incompleto', controladorAlumnos.obtenerConContactoIncompleto);
router.get('/reportes/por-edad', controladorAlumnos.obtenerPorEdad);
router.get('/reportes/por-inscripcion', controladorAlumnos.obtenerPorRangoInscripcion);
router.get('/buscar/:termino', controladorAlumnos.buscarPorNombre);
router.get('/estado/:estado', controladorAlumnos.obtenerPorEstado);
router.get('/dni/:dni', controladorAlumnos.obtenerPorDni);

module.exports = router;
