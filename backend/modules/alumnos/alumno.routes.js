const express = require('express');
const router = express.Router();
const controladorAlumnos = require('./alumno.controller');

// --- BÚSQUEDAS Y REPORTES (Las más específicas van primero) ---
router.get('/paginados', controladorAlumnos.obtenerPaginados);
router.get('/estadisticas', controladorAlumnos.obtenerEstadisticas);
router.get('/reportes/contacto-incompleto', controladorAlumnos.obtenerConContactoIncompleto);
router.get('/reportes/por-edad', controladorAlumnos.obtenerPorEdad);
router.get('/reportes/por-inscripcion', controladorAlumnos.obtenerPorRangoInscripcion);
router.get('/buscar/:termino', controladorAlumnos.buscarPorNombre);
router.get('/estado/:estado', controladorAlumnos.obtenerPorEstado);
router.get('/dni/:dni', controladorAlumnos.obtenerPorDni);

// --- CRUD PRINCIPAL (Las rutas con /:id van después de las específicas) ---
router.get('/', controladorAlumnos.obtenerTodos);
router.post('/', controladorAlumnos.crear);
router.get('/:id', controladorAlumnos.obtenerPorId); // <-- Ahora sí funciona correctamente
router.put('/:id', controladorAlumnos.actualizarCompleto);
router.patch('/:id', controladorAlumnos.actualizarParcial);
router.delete('/:id', controladorAlumnos.eliminar);

// --- ACCIONES ESPECIALES (También dependen de /:id, así que van al final) ---
router.patch('/:id/estado', controladorAlumnos.actualizarEstado);
router.patch('/:id/restaurar', controladorAlumnos.restaurar);

module.exports = router;