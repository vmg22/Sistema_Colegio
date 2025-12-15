import axios from "axios";

import API from "../api/api";

const PREVIAS_URL = `${API}/previas`;

/**
 * Obtiene alumnos en estado previa con su historial de intentos
 */
export const obtenerAlumnosPendientes = async (idCurso, idMateria, anioLectivo) => {
  try {
    const response = await axios.get(`${PREVIAS_URL}/alumnos-pendientes`, {
      params: {
        curso: idCurso,
        materia: idMateria,
        anioLectivo: anioLectivo
      }
    });
    return response.data.datos || [];
  } catch (error) {
    console.error('❌ Error en servicio:', error);
    throw error;
  }
};

/**
 * Obtiene alumnos que aprobaron por previa (historial)
 */
export const obtenerAlumnosAprobados = async (idCurso, idMateria, anioLectivo) => {
  try {
    const response = await axios.get(`${PREVIAS_URL}/alumnos-aprobados`, {
      params: {
        curso: idCurso,
        materia: idMateria,
        anioLectivo: anioLectivo
      }
    });
    return response.data.datos || [];
  } catch (error) {
    console.error('❌ Error en servicio:', error);
    throw error;
  }
};

/**
 * Registra un nuevo intento de previa
 */
export const registrarIntentoPrevia = async (datosPrevia) => {
  try {
    const response = await axios.post(`${PREVIAS_URL}/registrar`, datosPrevia);
    return response.data;
  } catch (error) {
    console.error('❌ Error en servicio:', error);
    throw error;
  }
};
