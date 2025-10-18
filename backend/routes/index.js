const express = require('express');
const router = express.Router();

// Importar los enrutadores de cada módulo
const alumnosRoutes = require('../modules/alumnos/alumno.routes');
// const anioLectivosRoutes = require('../modules/anios-lectivos/anio.routes');
// const authRoutes = require('../modules/auth/auth.routes'); 
// const calificacionesRoutes = require('../modules/calificaciones/calificacion.routes');
// const comunicacionesRoutes = require('../modules/comunicaciones/comunicacion.routes');
// const cursosRoutes = require('../modules/cursos/curso.routes');
const docentesRoutes = require('../modules/docentes/docente.routes');
// const materiasRoutes = require('../modules/materias/materia.routes');
// const reportesRoutes = require('../modules/reportes/reporte.routes');
// const tutoresRoutes = require('../modules/tutores/tutor.routes');
// ... y así con todos los demás módulos

// Ruta principal de la API
router.get('/', (req, res) => {
  res.json({
    sistema: 'Sistema de Gestión Escolar SGGS - API',
    version: '1.0.0'
  });
});

// Delegar las rutas a sus respectivos módulos
router.use('/alumnos', alumnosRoutes);
// router.use('/anios-lectivos', anioLectivosRoutes);
// router.use('/auth', authRoutes);
// router.use('/calificaciones', calificacionesRoutes);
// router.use('/comunicaciones', comunicacionesRoutes);
// router.use('cursos', cursosRoutes);
router.use('/docentes', docentesRoutes);
// router.use('/materias', materiasRoutes);
// router.use('/reportes', reportesRoutes);
// router.use('/tutores', tutoresRoutes);


// ... etc.

// No olvides tus rutas de diagnóstico
// const { healthRouter, diagnosticoRouter } = require('./system.routes'); // Idea: Moverlas a su propio archivo
// router.use('/health', healthRouter);
// router.use('/diagnostico', diagnosticoRouter);


module.exports = router;
