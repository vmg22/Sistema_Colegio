/**
 * =======================================
 * DOCENTE.ROUTES.JS
 * =======================================
 * Define los endpoints de la API para el módulo de docentes.
 */

const express = require('express');
const router = express.Router();
const controladorDocentes = require('./docente.controller');

// (Aquí importarías tus middlewares de auth y roles)
// const { authRequired } = require('../../middlewares/auth.middleware');
// const { checkRole } = require('../../middlewares/checkRole.middleware');

// --- RUTAS DE BÚSQUEDA ---
// (Proteger con authRequired y roles según corresponda)
router.get('/dni/:dni', controladorDocentes.obtenerPorDni);

// --- RUTAS CRUD PRINCIPALES ---
// (Proteger con authRequired y roles según corresponda)
// ej: router.get('/', authRequired, checkRole(['admin', 'secretario']), controladorDocentes.obtenerTodos);
router.get('/', controladorDocentes.obtenerTodos);
router.post('/', controladorDocentes.crear);
router.get('/:id', controladorDocentes.obtenerPorId);
router.put('/:id', controladorDocentes.actualizar);
router.delete('/:id', controladorDocentes.eliminar);

module.exports = router;