const express = require("express");
const router = express.Router();
//algo
// IMPORTACIÓN DE MÓDULOS
const alumnoRoutes = require("../modules/CRUD/alumnos/alumno.routes.js");
const docenteRoutes = require("../modules/docentes/docente.routes");
const cursoRoutes = require("../modules/cursos/curso.routes");
const cursoCrudRoutes = require("../modules/CRUD/curso/curso.routes.js");
const materiaRoutes = require("../modules/materias/materia.routes");
const calificacionRoutes = require("../modules/calificaciones/calificacion.routes");
const anioLectivoRoutes = require("../modules/anios-lectivos/anio.routes");
const tutorRoutes = require("../modules/CRUD/tutores/tutor.routes.js");
const comunicacionRoutes = require("../modules/comunicaciones/comunicacion.routes");
const asistenciaRoutes = require('../modules/asistencia_alumno/asistencia_alumno.routes');
const reportesAlumnoRoutes = require("../modules/reportesAlumnoDni/reporte.routes");
const reportesCursoRoutes = require("../modules/reportesCurso/reporteCurso.routes");
const inscripcionesRoutes = require("../modules/CRUD/inscripcion/inscripcionRoutes.js");
const mailRoutes = require('../modules/mail/mail.routes');
const materiaCorrelativaRoutes = require("../modules/materia_correlativa/materia_correlativa.routes");
const destinatarioRoutes = require("../modules/comunicacion_destinatario/comunicacion_destinatario.routes");
const logActividadRoutes = require("../modules/log_actividad/log_actividad.routes");
const alumnoTutorRoutes = require("../modules/CRUD/alumno_tutor/alumno_tutor.routes.js");
const usuarioRoutes = require("../modules/usuario/usuario.routes.js");
const authRoutes = require('../modules/usuario/auth.routes.js');
const asignacionRoutes = require("../modules/CRUD/asignaciones/asignacion.routes");
const cursoMateriaRoutes = require("../modules/CRUD/curso-materia/curso-materia.routes.js");
const examenesFinalesRoutes = require("../modules/examenes_finales/examenFinal.routes");
const previasRoutes = require('../modules/previas/previas.routes');
const planillasRoutes = require('../modules/planillas/planillas.routes');



// Módulo de altas (Docente + Usuario)
const altasRoutesDocentes = require("../modules/CRUD/altas/alta.routes.js");

const altasmateriasRoutes = require("../modules/CRUD/altasmaterias/altasmaterias.routes.js")
// Registrar rutas de los módulos
router.use("/alumnos", alumnoRoutes);
router.use("/docentes", docenteRoutes);
router.use("/cursos", cursoRoutes);
router.use("/cursos-crud", cursoCrudRoutes);
router.use("/materias", materiaRoutes);
router.use("/calificaciones", calificacionRoutes);
router.use("/anios-lectivos", anioLectivoRoutes);
router.use("/tutores", tutorRoutes);
router.use("/comunicaciones", comunicacionRoutes);
router.use('/asistencias', asistenciaRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/auth', authRoutes);

// Rutas de reportes
router.use("/reportes/alumnos", reportesAlumnoRoutes);
router.use('/materia-correlativa', materiaCorrelativaRoutes);
router.use('/destinatarios', destinatarioRoutes);
router.use('/actividades', logActividadRoutes);
//rutas de reportes
router.use("/reportes/alumno", reportesAlumnoRoutes);
router.use("/reportes/curso", reportesCursoRoutes);
router.use('/alumno-tutor', alumnoTutorRoutes);
router.use('/mail', mailRoutes);


//  Ruta de altas
router.use("/altas-docentes", altasRoutesDocentes);
router.use("/altasmaterias", altasmateriasRoutes);
router.use("/curso-materia", cursoMateriaRoutes);

// RUTAS PARA INCRIPCIONES /CRUD INSCRIPCION
router.use('/inscripciones', inscripcionesRoutes);

// CRUD ASIGNAR MATERIA A DOCENTE 

router.use("/asignaciones", asignacionRoutes);

// EXÁMENES FINALES
router.use("/examenes-finales", examenesFinalesRoutes);

// PREVIAS
router.use("/previas", previasRoutes);

// PLANILLAS (Exámenes)
router.use("/planillas", planillasRoutes);





// Ruta principal de la API
router.get("/", (req, res) => {
  res.status(200).json({
    sistema: "Sistema de Gestión Escolar SGGS - API",
    version: "1.0.0",
    endpoints: {
      alumnos: "/api/v1/alumnos",
      cursos: "/api/v1/cursos",
      cursosCrud: "/api/v1/cursos-crud",
      materias: "/api/v1/materias",
      cursoMateria: "/api/v1/curso-materia",
      calificaciones: "/api/v1/calificaciones",
      aniosLectivos: "/api/v1/anios-lectivos",
      tutores: "/api/v1/tutores",
      comunicaciones: "/api/v1/comunicaciones",
      auth: "/api/v1/auth",
      asistencia: "/api/v1/asistencias",
      reportesAlumno: "/api/v1/reportes/alumno?dni_alumno=X&anio_lectivo=Y",
      reportesCurso: "/api/v1/reportes/curso?id_curso=X&id_materia=Y&anio_lectivo=Z&cuatrimestre=N",
      //  NUEVO: Endpoint de altas para crar docentes y usuarios ya que sin usuario no se puede crear docente
      altasRoutesDocentes: "/api/v1/altas-docentes",
      usuarios: "/api/v1/usuarios",
      auth: "/api/v1/auth",
      altasmateriasRoutes: "/api/v1/altasmaterias",
    },
  });
});




// ... etc.

// No olvides tus rutas de diagnóstico
// const { healthRouter, diagnosticoRouter } = require('./system.routes'); // Idea: Moverlas a su propio archivo
// router.use('/health', healthRouter);
// router.use('/diagnostico', diagnosticoRouter);

module.exports = router;