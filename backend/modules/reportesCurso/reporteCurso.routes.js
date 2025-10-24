const express = require('express');
const router = express.Router();
const consultaController = require('./reporteCurso.controller');


 // Rutas para el módulo de Consultas Académicas  Base URL: /api/consultas

  //GET /api/consultas/curso
 //   Obtiene alumnos con calificaciones y asistencias por curso
 //   id_curso, id_materia, anio_lectivo, cuatrimestre
 
//http://localhost:3000/api/v1/reportes/curso?id_curso=1&id_materia=1&anio_lectivo=2025&cuatrimestre=1

router.get('/', consultaController.obtenerAlumnosPorCurso);



module.exports = router;