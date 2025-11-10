// modules/anioLectivo/anioLectivo.routes.js
const express = require('express');
const router = express.Router();
const controlador = require('./anio.controller');

// GET
router.get('/', controlador.obtenerTodos);
router.get('/:id', controlador.obtenerPorId);

// POST
router.post('/', controlador.crear);

// PUT
router.put('/:id', controlador.actualizar);

// DELETE
router.delete('/:id', controlador.eliminar);

// PATCH (para restaurar)
router.patch('/:id/restaurar', controlador.restaurar);

module.exports = router;