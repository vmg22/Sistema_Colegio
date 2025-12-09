// modules/cursos/curso.routes.js
const express = require('express');
const router = express.Router();
const controlador = require('./curso.controller');

// GET
router.get('/', controlador.obtenerTodos);
router.get('/:id', controlador.obtenerPorId);

// POST
router.post('/', controlador.crear);

// PUT
router.put('/:id', controlador.actualizar);

// DELETE
router.delete('/:id', controlador.eliminar);

module.exports = router;