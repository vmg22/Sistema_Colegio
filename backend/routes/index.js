const express = require("express");
const router = express.Router();


//  IMPORTACIÓN DE MÓDULOS
const alumnoRoutes = require("../modules/alumnos/alumno.routes");
const docenteRoutes = require("../modules/docentes/docente.routes");
const cursoRoutes = require("../modules/cursos/curso.routes");
const materiaRoutes = require("../modules/materias/materia.routes");
const calificacionRoutes = require("../modules/calificaciones/calificacion.routes");
const anioLectivoRoutes = require("../modules/anios-lectivos/anio.routes");
const tutorRoutes = require("../modules/tutores/tutor.routes");
const comunicacionRoutes = require("../modules/comunicaciones/comunicacion.routes");
const authRoutes = require("../modules/auth/auth.routes");
const asistenciaRoutes = require('../modules/asistencia_alumno/asistencia_alumno.routes');
const reportesAlumnoRoutes = require("../modules/reportesAlumnoDni/reporte.routes");
const reportesCursoRoutes = require("../modules/reportesCurso/reporteCurso.routes");




// Registrar rutas de los módulos
router.use("/alumnos", alumnoRoutes);
router.use("/docentes", docenteRoutes);
router.use("/cursos", cursoRoutes);
router.use("/materias", materiaRoutes);
router.use("/calificaciones", calificacionRoutes);
router.use("/anios-lectivos", anioLectivoRoutes);
router.use("/tutores", tutorRoutes);
router.use("/comunicaciones", comunicacionRoutes);
router.use("/auth", authRoutes);
router.use('/asistencias', asistenciaRoutes);

//rutas de reportes
router.use("/reportes/alumno", reportesAlumnoRoutes);
router.use("/reportes/curso", reportesCursoRoutes);
router.use('/alumno-tutor', alumnoTutorRoutes);

const alumnoTutorRoutes = require('../modules/alumno_tutor/alumno_tutor.routes');


// Ruta principal de la API
router.get("/", (req, res) => {
  res.status(200).json({
    sistema: "Sistema de Gestión Escolar SGGS - API",
    version: "1.0.0",
    endpoints: {
      alumnos: "/api/v1/alumnos",
      docentes: "/api/v1/docentes",
      cursos: "/api/v1/cursos",
      materias: "/api/v1/materias",
      calificaciones: "/api/v1/calificaciones",
      aniosLectivos: "/api/v1/anios-lectivos",
      tutores: "/api/v1/tutores",
      comunicaciones: "/api/v1/comunicaciones",
      auth: "/api/v1/auth",
      asistencia: "/api/v1/asistencias",
      reportesAlumno: "/api/v1/reportes/alumno?dni_alumno=X&anio_lectivo=Y",
      reportesCurso: "/api/v1/reportes/curso?id_curso=X&id_materia=Y&anio_lectivo=Z&cuatrimestre=N",
      asistencia: "/api/v1/asistencia",
     alumnoTutor: "/api/v1/alumno-tutor",
    },
  });
});




// ... etc.

// No olvides tus rutas de diagnóstico
// const { healthRouter, diagnosticoRouter } = require('./system.routes'); // Idea: Moverlas a su propio archivo
// router.use('/health', healthRouter);
// router.use('/diagnostico', diagnosticoRouter);

module.exports = router;