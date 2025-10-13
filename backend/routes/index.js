const express = require('express');
const router = express.Router();

// Importar los enrutadores de cada módulo
const alumnoRoutes = require('../modules/alumnos/alumno.routes');
// const anioLectivoRoutes = require('../modules/anios-lectivos/anio.routes');
// const authRoutes = require('../modules/auth/auth.routes'); 
// const cursoRoutes = require('../modules/cursos/curso.routes');
// ... y así con todos los demás módulos

// Ruta principal de la API
router.get('/', (req, res) => {
  res.json({
    sistema: 'Sistema de Gestión Escolar SGGS - API',
    version: '1.0.0'
  });
});

// Delegar las rutas a sus respectivos módulos
router.use('/alumnos', alumnoRoutes);

// ... etc.

// No olvides tus rutas de diagnóstico
// const { healthRouter, diagnosticoRouter } = require('./system.routes'); // Idea: Moverlas a su propio archivo
// router.use('/health', healthRouter);
// router.use('/diagnostico', diagnosticoRouter);


module.exports = router;
