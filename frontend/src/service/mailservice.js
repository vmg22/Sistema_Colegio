import axios from "axios";
import API from "../api/api";

const MAIL_URL = `${API}/mail`;

// Envío individual (existentes)
export const enviarAlertaAsistencia = async (dni, anio, faltasMaximas = 20) => {
  try {
    const response = await axios.post(`${MAIL_URL}/alerta-asistencia`, {
      dni,
      anio,
      faltasMaximas
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al enviar alerta de asistencia:", error);
    throw error.response?.data || { message: "Error al enviar alerta de asistencia" };
  }
};

export const enviarNotificacionReunion = async (dni, anio, reunionData) => {
  try {
    const response = await axios.post(`${MAIL_URL}/notificacion-reunion`, {
      dni,
      anio,
      reunionData
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al enviar notificación de reunión:", error);
    throw error.response?.data || { message: "Error al enviar notificación de reunión" };
  }
};

export const enviarNotificacionGeneral = async (dni, anio, notificacionData) => {
  try {
    const response = await axios.post(`${MAIL_URL}/notificacion-general`, {
      dni,
      anio,
      notificacionData
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al enviar notificación general:", error);
    throw error.response?.data || { message: "Error al enviar notificación general" };
  }
};

// ========================================
// ENVÍO MASIVO (nuevas funciones)
// ========================================

export const enviarAlertaAsistenciaMasiva = async (dnis, anio, faltasMaximas = 20) => {
  try {
    const response = await axios.post(`${MAIL_URL}/alerta-asistencia/masivo`, {
      dnis,
      anio,
      faltasMaximas
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al enviar alerta masiva:", error);
    throw error.response?.data || { message: "Error al enviar alerta masiva" };
  }
};

export const enviarNotificacionReunionMasiva = async (dnis, anio, reunionData) => {
  try {
    const response = await axios.post(`${MAIL_URL}/notificacion-reunion/masivo`, {
      dnis,
      anio,
      reunionData
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al enviar notificación masiva:", error);
    throw error.response?.data || { message: "Error al enviar notificación masiva" };
  }
};

export const enviarNotificacionGeneralMasiva = async (dnis, anio, notificacionData) => {
  try {
    const response = await axios.post(`${MAIL_URL}/notificacion-general/masivo`, {
      dnis,
      anio,
      notificacionData
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al enviar notificación masiva:", error);
    throw error.response?.data || { message: "Error al enviar notificación masiva" };
  }
};

export const obtenerDatosAlumno = async (dni, anio) => {
  try {
    const response = await axios.get(`${MAIL_URL}/alumno/${dni}/${anio}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener datos del alumno:", error);
    throw error.response?.data || { message: "Error al obtener datos del alumno" };
  }
};


// ... funciones existentes ...

// ========================================
// FUNCIONES POR CURSO
// ========================================

// Obtener cursos disponibles
export const obtenerCursosDisponibles = async (anio) => {
  try {
    const response = await axios.get(`${MAIL_URL}/cursos/${anio}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener cursos:", error);
    throw error.response?.data || { message: "Error al obtener cursos" };
  }
};

// Obtener alumnos de un curso
export const obtenerAlumnosPorCurso = async (idCurso, anio) => {
  try {
    const response = await axios.get(`${MAIL_URL}/cursos/${idCurso}/${anio}/alumnos`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener alumnos del curso:", error);
    throw error.response?.data || { message: "Error al obtener alumnos del curso" };
  }
};

// Enviar alerta de asistencia a un curso
export const enviarAlertaAsistenciaPorCurso = async (idCurso, anio, faltasMaximas = 20) => {
  try {
    const response = await axios.post(`${MAIL_URL}/alerta-asistencia/curso`, {
      idCurso,
      anio,
      faltasMaximas
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al enviar alerta por curso:", error);
    throw error.response?.data || { message: "Error al enviar alerta por curso" };
  }
};

// Enviar notificación de reunión a un curso
export const enviarNotificacionReunionPorCurso = async (idCurso, anio, reunionData) => {
  try {
    const response = await axios.post(`${MAIL_URL}/notificacion-reunion/curso`, {
      idCurso,
      anio,
      reunionData
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al enviar reunión por curso:", error);
    throw error.response?.data || { message: "Error al enviar reunión por curso" };
  }
};

// Enviar notificación general a un curso
export const enviarNotificacionGeneralPorCurso = async (idCurso, anio, notificacionData) => {
  try {
    const response = await axios.post(`${MAIL_URL}/notificacion-general/curso`, {
      idCurso,
      anio,
      notificacionData
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al enviar notificación por curso:", error);
    throw error.response?.data || { message: "Error al enviar notificación por curso" };
  }
};

// Enviar notificación a múltiples cursos
export const enviarNotificacionGeneralPorCursosMultiples = async (idsCursos, anio, notificacionData) => {
  try {
    const response = await axios.post(`${MAIL_URL}/notificacion-general/cursos-multiples`, {
      idsCursos,
      anio,
      notificacionData
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error al enviar notificación a múltiples cursos:", error);
    throw error.response?.data || { message: "Error al enviar notificación a múltiples cursos" };
  }
};