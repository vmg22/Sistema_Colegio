import { api } from "../api/fetchConfig";

// Nota: ya no necesitamos MAIL_URL porque fetchConfig usa BASE_URL
// y nosotros pasamos los path relativos "/mail/..."

// Envío individual (existentes)
export const enviarAlertaAsistencia = async (dni, anio, faltasMaximas = 20) => {
  return await api.post("/mail/alerta-asistencia", {
    dni,
    anio,
    faltasMaximas
  });
};

export const enviarNotificacionReunion = async (dni, anio, reunionData) => {
  return await api.post("/mail/notificacion-reunion", {
    dni,
    anio,
    reunionData
  });
};

export const enviarNotificacionGeneral = async (dni, anio, notificacionData) => {
  return await api.post("/mail/notificacion-general", {
    dni,
    anio,
    notificacionData
  });
};

// ========================================
// ENVÍO MASIVO (nuevas funciones)
// ========================================

export const enviarAlertaAsistenciaMasiva = async (dnis, anio, faltasMaximas = 20) => {
  return await api.post("/mail/alerta-asistencia/masivo", {
    dnis,
    anio,
    faltasMaximas
  });
};

export const enviarNotificacionReunionMasiva = async (dnis, anio, reunionData) => {
  return await api.post("/mail/notificacion-reunion/masivo", {
    dnis,
    anio,
    reunionData
  });
};

export const enviarNotificacionGeneralMasiva = async (dnis, anio, notificacionData) => {
  return await api.post("/mail/notificacion-general/masivo", {
    dnis,
    anio,
    notificacionData
  });
};

export const obtenerDatosAlumno = async (dni, anio) => {
  return await api.get(`/mail/alumno/${dni}/${anio}`);
};


// ... funciones existentes ...

// ========================================
// FUNCIONES POR CURSO
// ========================================

// Obtener cursos disponibles
export const obtenerCursosDisponibles = async (anio) => {
  return await api.get(`/mail/cursos/${anio}`);
};

// Obtener alumnos de un curso
export const obtenerAlumnosPorCurso = async (idCurso, anio) => {
  return await api.get(`/mail/cursos/${idCurso}/${anio}/alumnos`);
};

// Enviar alerta de asistencia a un curso
export const enviarAlertaAsistenciaPorCurso = async (idCurso, anio, faltasMaximas = 20) => {
  return await api.post("/mail/alerta-asistencia/curso", {
    idCurso,
    anio,
    faltasMaximas
  });
};

// Enviar notificación de reunión a un curso
export const enviarNotificacionReunionPorCurso = async (idCurso, anio, reunionData) => {
  return await api.post("/mail/notificacion-reunion/curso", {
    idCurso,
    anio,
    reunionData
  });
};

// Enviar notificación general a un curso
export const enviarNotificacionGeneralPorCurso = async (idCurso, anio, notificacionData) => {
  return await api.post("/mail/notificacion-general/curso", {
    idCurso,
    anio,
    notificacionData
  });
};

// Enviar notificación a múltiples cursos
export const enviarNotificacionGeneralPorCursosMultiples = async (idsCursos, anio, notificacionData) => {
  return await api.post("/mail/notificacion-general/cursos-multiples", {
    idsCursos,
    anio,
    notificacionData
  });
};