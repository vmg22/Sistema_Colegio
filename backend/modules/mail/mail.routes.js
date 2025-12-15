const express = require('express');
const router = express.Router();

// ✅ SEGURIDAD: Import middleware de autenticación
const { authenticateToken } = require('../../middleware/auth.middleware');

// IMPORTANTE: Importar desde el CONTROLLER, NO desde el SERVICE
const {
  TestMail,
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
  EnviarNotificacionGeneralPorCursosMultiples,
} = require('./mail.controller'); // ← Debe ser mail.controller, NO emails.service

// ==================== RUTAS DE PRUEBA ====================

// POST /api/mail/test - Enviar email de prueba
router.post('/test', authenticateToken, TestMail);

// ==================== RUTAS INDIVIDUALES ====================

// POST /api/mail/alerta-asistencia - Enviar alerta de asistencia a un alumno
router.post('/alerta-asistencia', authenticateToken, EnviarAlertaAsistencia);

// POST /api/mail/notificacion-reunion - Enviar notificación de reunión a un alumno
router.post('/notificacion-reunion', authenticateToken, EnviarNotificacionReunion);

// POST /api/mail/notificacion-general - Enviar notificación general a un alumno
router.post('/notificacion-general', authenticateToken, EnviarNotificacionGeneral);

// GET /api/mail/alumno/:dni/:anio - Obtener datos de un alumno
router.get('/alumno/:dni/:anio', ObtenerDatosAlumno);

// ==================== RUTAS MASIVAS ====================

// POST /api/mail/alerta-asistencia-masiva - Enviar alerta a múltiples alumnos
router.post('/alerta-asistencia-masiva', authenticateToken, EnviarAlertaAsistenciaMasiva);

// POST /api/mail/notificacion-reunion-masiva - Enviar notificación de reunión masiva
router.post('/notificacion-reunion-masiva', authenticateToken, EnviarNotificacionReunionMasiva);

// POST /api/mail/notificacion-general-masiva - Enviar notificación general masiva
router.post('/notificacion-general-masiva', authenticateToken, EnviarNotificacionGeneralMasiva);

// ==================== RUTAS POR CURSO ====================

// GET /api/mail/cursos/:anio - Obtener cursos disponibles
router.get('/cursos/:anio', ObtenerCursosDisponibles);

// GET /api/mail/curso/:anio_curso/:division/:anio_lectivo/alumnos - Obtener alumnos de un curso
router.get('/curso/:anio_curso/:division/:anio_lectivo/alumnos', ObtenerAlumnosPorCurso);

// POST /api/mail/curso/alerta-asistencia - Enviar alerta a un curso completo
router.post('/curso/alerta-asistencia', authenticateToken, EnviarAlertaAsistenciaPorCurso);

// POST /api/mail/curso/notificacion-reunion - Enviar notificación de reunión a un curso
router.post('/curso/notificacion-reunion', authenticateToken, EnviarNotificacionReunionPorCurso);

// POST /api/mail/curso/notificacion-general - Enviar notificación general a un curso
router.post('/curso/notificacion-general', authenticateToken, EnviarNotificacionGeneralPorCurso);

// POST /api/mail/cursos/notificacion-general - Enviar notificación a múltiples cursos
router.post('/cursos/notificacion-general', authenticateToken, EnviarNotificacionGeneralPorCursosMultiples);

module.exports = router;