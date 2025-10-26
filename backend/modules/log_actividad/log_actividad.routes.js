// log_actividad.routes.js

const express = require('express');
const router = express.Router();
const logController = require('./log_actividad.controller');

// Obtener todos los logs (lectura)
router.get('/', logController.obtenerTodasActividades);

// Obtener un log específico
router.get('/:id', logController.obtenerActividadPorId);

// Crear un nuevo log (escritura)
router.post('/', logController.crearActividad);

// Se omiten PUT, PATCH, DELETE, y /eliminados/listar, ya que los logs son inmutables.
module.exports = router;