const express = require('express');
const router = express.Router();
const controladorAlumnoTutor = require('./alumno_tutor.controller');

// Rutas para relaciones alumno-tutor


router.get('/', controladorAlumnoTutor.obtenerTodosAlumnoTutor);// Obtener todas las relaciones alumno-tutor activas
router.get('/eliminados', controladorAlumnoTutor.obtenerAlumnoTutorEliminados);// Obtener relaciones eliminadas
router.get('/:id', controladorAlumnoTutor.obtenerAlumnoTutorPorId);// Obtener una relación por ID
router.get('/alumno/:id_alumno', controladorAlumnoTutor.obtenerTutoresPorAlumno);// Obtener tutores de un alumno específico
router.get('/tutor/:id_tutor', controladorAlumnoTutor.obtenerAlumnosPorTutor);// Obtener alumnos de un tutor específico
router.post('/', controladorAlumnoTutor.crearAlumnoTutor);// Crear una nueva relación alumno-tutor
router.put('/:id', controladorAlumnoTutor.actualizarAlumnoTutor);// Actualizar una relación alumno-tutor completa (PUT)
router.patch('/:id', controladorAlumnoTutor.actualizarAlumnoTutorParcial);// Actualizar una relación alumno-tutor parcial (PATCH)
router.delete('/:id', controladorAlumnoTutor.eliminarAlumnoTutor);// Eliminar lógicamente una relación alumno-tutor
router.patch('/:id/restaurar', controladorAlumnoTutor.restaurarAlumnoTutor);// Restaurar una relación alumno-tutor eliminada

module.exports = router;