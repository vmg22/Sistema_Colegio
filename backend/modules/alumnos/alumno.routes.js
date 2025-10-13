const express = require('express');
// Se crea el enrutador con el nombre convencional 'router'
const router = express.Router(); 
const controladorAlumnos = require('./alumno.controller');

// Middleware de autenticación (opcional, actualmente comentado)
// const { autenticarToken } = require('../../middleware/autenticacion');
// router.use(autenticarToken);

// --- DEFINICIÓN DE RUTAS PARA ALUMNOS ---

// Rutas GET
router.get('/', controladorAlumnos.obtenerTodos);
router.get('/paginados', controladorAlumnos.obtenerPaginados);
router.get('/estadisticas/generales', controladorAlumnos.obtenerEstadisticas);
router.get('/buscar/:termino', controladorAlumnos.buscarAlumnos);
router.get('/dni/:dni', controladorAlumnos.obtenerPorDni);
router.get('/reporte/contacto-incompleto', controladorAlumnos.obtenerContactoIncompleto);
router.get('/reporte/por-edad', controladorAlumnos.obtenerPorEdad);
router.get('/:id', controladorAlumnos.obtenerPorId);

// Rutas POST
router.post('/', controladorAlumnos.crearAlumno);
router.post('/:id/restaurar', controladorAlumnos.restaurarAlumno);

// Rutas PUT y PATCH
router.put('/:id', controladorAlumnos.actualizarAlumno);
router.patch('/:id', controladorAlumnos.actualizarAlumnoParcial);
router.patch('/:id/estado', controladorAlumnos.actualizarEstado);

// Ruta DELETE
router.delete('/:id', controladorAlumnos.eliminarAlumno);

// Se exporta la variable 'router'
module.exports = router;
