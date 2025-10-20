const express = require('express');
const router = express.Router();

// Importar los enrutadores de cada módulo
const alumnoRoutes = require('../modules/alumnos/alumno.routes');
// const docenteRoutes = require('../modules/docentes/docente.routes');
// const docentesTestRoutes = require('../modules/docentes/docente.routes');
//const docenteRoutes = require('../modules/docentes/docente.routes');
const cursoRoutes = require('../modules/cursos/curso.routes');
const materiaRoutes = require('../modules/materias/materia.routes');
const calificacionRoutes = require('../modules/calificaciones/calificacion.routes');
const anioLectivoRoutes = require('../modules/anios-lectivos/anio.routes');
const tutorRoutes = require('../modules/tutores/tutor.routes');
const comunicacionRoutes = require('../modules/comunicaciones/comunicacion.routes');
const authRoutes = require('../modules/auth/auth.routes');
// const authRoutes = require('../modules/auth/auth.routes'); 
// ... y así con todos los demás módulos

// Ruta principal de la API
router.get('/', (req, res) => {
  res.json({
    sistema: 'Sistema de Gestión Escolar SGGS - API',
    version: '1.0.0'
  });
});

// Delegar las rutas a sus respectivos módulos
router.use('/anios-lectivos', anioLectivoRoutes);
router.use('/alumnos', alumnoRoutes);
//router.use('/docentes', docenteRoutes);
// router.use('/docentes', docentesTestRoutes);
router.use('/cursos', cursoRoutes);
router.use('/materias', materiaRoutes);
router.use('/calificaciones', calificacionRoutes);
router.use('/tutores', tutorRoutes);
router.use('/comunicaciones', comunicacionRoutes);
router.use('/auth', authRoutes);

// ... etc.

// No olvides tus rutas de diagnóstico
// const { healthRouter, diagnosticoRouter } = require('./system.routes'); // Idea: Moverlas a su propio archivo
// router.use('/health', healthRouter);
// router.use('/diagnostico', diagnosticoRouter);


module.exports = router;