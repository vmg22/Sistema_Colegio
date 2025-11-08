import API from "../api/api";
import axios from "axios";

const ALUMNO_TUTOR_URL = `${API}/alumno-tutor`;
const TUTOR_URL = `${API}/tutores`; // Ya lo tienes en tutoresService, pero lo dejo por si acaso

// --- AÑADIDO: Manejador de errores ---
const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  const message = error.response?.data?.message || defaultMessage;
  throw new Error(message);
};

export const getAlumnoTutorId = async (id_alumno) => {
  try {
    const response = await axios.get(`${ALUMNO_TUTOR_URL}/alumno/${id_alumno}`);
    // Tu backend de alumno-tutor devuelve { success: true, datos: [...] }
    return response.data; // Tu componente espera la respuesta completa
  } catch (err) {
    handleError(err, "Error al obtener tutores del alumno");
  }
};

export const getTutor = async (id) => {
  try {
    const response = await axios.get(`${TUTOR_URL}/${id}`);
    // Tu backend de tutor devuelve { success: true, datos: {...} }
    return response.data; // Tu componente espera la respuesta completa
  } catch (err) {
    handleError(err, "Error al obtener datos del tutor");
  }
};
