const express = require('express');
const router = express.Router();
const docenteController = require('./docente.controller');

router.get('/', docenteController.obtenerTodosDocentes);
router.get('/eliminados/listar', docenteController.obtenerDocentesEliminados);
router.get('/:id', docenteController.obtenerDocentePorId);
router.post('/', docenteController.crearDocente);
router.post('/:id/restaurar', docenteController.restaurarDocente);
router.put('/:id', docenteController.actualizarDocente);
router.patch('/:id', docenteController.actualizarDocenteParcial);
router.delete('/:id', docenteController.eliminarDocente);

// ============================================================
// NUEVAS RUTAS PARA FILTRADO POR DOCENTE
// ============================================================

// Obtener materias asignadas a un docente
router.get('/:id/materias', docenteController.obtenerMateriasPorDocente);

// Obtener cursos asignados a un docente (opcionalmente filtrado por materia con query param)
router.get('/:id/cursos', docenteController.obtenerCursosPorDocente);

// Obtener alumnos de los cursos donde el docente dicta (opcionalmente filtrado por curso con query param)
router.get('/:id/alumnos', docenteController.obtenerAlumnosPorDocente);

// Verificar accesos
router.get('/:id/verificar-acceso/alumno/:id_alumno', docenteController.verificarAccesoAlumno);
router.get('/:id/verificar-acceso/curso/:id_curso', docenteController.verificarAccesoCurso);
router.get('/:id/verificar-acceso/materia/:id_materia', docenteController.verificarAccesoMateria);

module.exports = router;
