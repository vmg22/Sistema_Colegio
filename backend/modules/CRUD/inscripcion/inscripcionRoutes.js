const { Router } = require('express');

// CORRECCIÓN: Si ambos archivos están en la misma carpeta,
// la ruta debe ser local ('./')
const { crearInscripcion } = require('./inscripcionController.js');

const router = Router();

// La ruta base '/' se combina con el prefijo 
// '/api/v1/inscripciones' que definiste en 'routes/index.js'
router.post('/', crearInscripcion);

module.exports = router;