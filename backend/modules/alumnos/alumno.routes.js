// alumno.routes.js
const express = require('express');
const enrutador = express.Router();
const controladorAlumnos = require('./alumno.controller');

// Middleware de autenticación (opcional)
// const { autenticarToken } = require('../../middleware/autenticacion');
// enrutador.use(autenticarToken);

// Rutas de alumnos
enrutador.get('/', controladorAlumnos.obtenerTodos);
enrutador.get('/paginados', controladorAlumnos.obtenerPaginados);
enrutador.get('/estadisticas/generales', controladorAlumnos.obtenerEstadisticas);
enrutador.get('/buscar/:termino', controladorAlumnos.buscarAlumnos);
enrutador.get('/dni/:dni', controladorAlumnos.obtenerPorDni);
enrutador.get('/reporte/contacto-incompleto', controladorAlumnos.obtenerContactoIncompleto);
enrutador.get('/reporte/por-edad', controladorAlumnos.obtenerPorEdad);
enrutador.get('/:id', controladorAlumnos.obtenerPorId);

enrutador.post('/', controladorAlumnos.crearAlumno);
enrutador.post('/:id/restaurar', controladorAlumnos.restaurarAlumno);

enrutador.put('/:id', controladorAlumnos.actualizarAlumno);
enrutador.patch('/:id', controladorAlumnos.actualizarAlumnoParcial);
enrutador.patch('/:id/estado', controladorAlumnos.actualizarEstado);

enrutador.delete('/:id', controladorAlumnos.eliminarAlumno);

module.exports = enrutador;