const express = require('express');
const router = express.Router();
const {
  TestMail,
  EnviarRecuperacion,
  EnviarAlertaAsistencia,
  EnviarNotificacionReunion,
  EnviarNotificacionGeneral,
  ObtenerDatosAlumno,
  EnviarAlertaAsistenciaMasiva,
  EnviarNotificacionReunionMasiva,
  EnviarNotificacionGeneralMasiva,
  ObtenerCursosDisponibles,
    ObtenerAlumnosPorCurso,
    EnviarAlertaAsistenciaPorCurso,
    EnviarNotificacionReunionPorCurso,
    EnviarNotificacionGeneralPorCurso,
    EnviarNotificacionGeneralPorCursosMultiples
} = require('../mail/mail.controller');


router.post('/test', TestMail);
router.post('/recuperacion', EnviarRecuperacion);
router.post('/alerta-asistencia', EnviarAlertaAsistencia);
router.post('/notificacion-reunion', EnviarNotificacionReunion);
router.post('/notificacion-general', EnviarNotificacionGeneral);
router.get('/datos-alumno', ObtenerDatosAlumno);
router.post('/alerta-asistencia/masiva', EnviarAlertaAsistenciaMasiva);
router.post('/notificacion-reunion/masiva', EnviarNotificacionReunionMasiva);
router.post('/notificacion-general/masiva', EnviarNotificacionGeneralMasiva);


// Envío por curso único
router.post('/alerta-asistencia/curso', EnviarAlertaAsistenciaPorCurso);
router.post('/notificacion-reunion/curso', EnviarNotificacionReunionPorCurso);
router.post('/notificacion-general/curso', EnviarNotificacionGeneralPorCurso);

// Envío a múltiples cursos
router.post('/notificacion-general/cursos-multiples', EnviarNotificacionGeneralPorCursosMultiples);

router.get('/alumno/:dni/:anio', ObtenerDatosAlumno);// Ruta para obtener datos del alumno para testing

// Obtener cursos y alumnos
router.get('/cursos/:anio', ObtenerCursosDisponibles);
router.get('/cursos/:anio_curso/:division/:anio_lectivo/alumnos', ObtenerAlumnosPorCurso);

module.exports = router;