// modules/cursoMateria/curso-materia.routes.js
const express = require('express');
const router = express.Router();
const controlador = require('./curso-materia.controller');

// GET: Obtiene las materias de un curso específico
router.get('/:id_curso', controlador.obtenerMateriasPorCurso);

// PUT: Reemplaza/Sincroniza todas las materias de un curso
router.put('/:id_curso', controlador.actualizarAsignaciones);

module.exports = router;