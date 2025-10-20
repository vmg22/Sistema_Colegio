const express = require('express');
const router = express.Router();

// Importar los enrutadores de cada módulo
// --- IMPORTACIÓN DE MÓDULOS 
const alumnoRoutes = require('../modules/alumnos/alumno.routes');
const docenteRoutes = require('../modules/docentes/docente.routes');
const cursoRoutes = require('../modules/cursos/curso.routes');
const materiaRoutes = require('../modules/materias/materia.routes');
const calificacionRoutes = require('../modules/calificaciones/calificacion.routes');
const anioLectivoRoutes = require('../modules/anios-lectivos/anio.routes');
const tutorRoutes = require('../modules/tutores/tutor.routes');
const comunicacionRoutes = require('../modules/comunicaciones/comunicacion.routes');
const authRoutes = require('../modules/auth/auth.routes');

// Ruta principal de la API
router.get('/', (req, res) => {
  res.status(200).json({
    sistema: 'Sistema de Gestión Escolar SGGS - API',
    version: '1.0.0',
    endpoints: {
      alumnos: '/api/v1/alumnos',
      docentes: '/api/v1/docentes',
      cursos: '/api/v1/cursos',
      materias: '/api/v1/materias',
      calificaciones: '/api/v1/calificaciones',
      tutores: '/api/v1/tutores',
      comunicaciones: '/api/v1/comunicaciones',
      auth: '/api/v1/auth'
    }
  });
});

router.use('/alumnos', alumnoRoutes);
router.use('/docentes', docenteRoutes);
router.use('/cursos', cursoRoutes);
router.use('/materias', materiaRoutes);
router.use('/calificaciones', calificacionRoutes);
router.use('/anios-lectivos', anioLectivoRoutes);
router.use('/tutores', tutorRoutes);
router.use('/comunicaciones', comunicacionRoutes);
router.use('/auth', authRoutes);

// ... etc.

// No olvides tus rutas de diagnóstico
// const { healthRouter, diagnosticoRouter } = require('./system.routes'); // Idea: Moverlas a su propio archivo
// router.use('/health', healthRouter);
// router.use('/diagnostico', diagnosticoRouter);


module.exports = router;