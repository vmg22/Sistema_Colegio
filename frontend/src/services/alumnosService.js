import API from "../api/api";
import axios from "axios";

const ALUMNOS_URL = `${API}/alumnos`;

// --- AÑADIDO: Manejador de errores ---
const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  const message =
    error.response?.data?.mensaje ||
    error.response?.data?.message ||
    defaultMessage;
  throw new Error(message);
};

export const getAlumnoDni = async (dni) => {
  try {
    const response = await axios.get(`${ALUMNOS_URL}/dni/${dni}`);
    // Tu backend devuelve el objeto alumno directamente (sin 'datos')
    return response.data;
  } catch (err) {
    handleError(err, "Error al obtener alumno por DNI");
  }
};

export const getAllAlumnos = async () => {
  try {
    const response = await axios.get(ALUMNOS_URL);
    // Tu backend devuelve el array de alumnos directamente (sin 'datos')
    return response.data;
  } catch (err) {
    handleError(err, "Error al obtener todos los alumnos");
  }
};

export const getAlumnoId = async (id) => {
  try {
    const response = await axios.get(`${ALUMNOS_URL}/${id}`);
    // Tu backend devuelve el objeto alumno directamente (sin 'datos')
    return response.data;
  } catch (err) {
    handleError(err, "Error al obtener alumno por ID");
  }
};

export const deleteAlumno = async (id) => {
  try {
    const response = await axios.delete(`${ALUMNOS_URL}/${id}`);
    // Devuelve el objeto { mensaje: "..." }
    return response.data;
  } catch (err) {
    handleError(err, "Error al eliminar alumno");
  }
};

export const editAlumno = async (id, data) => {
  try {
    const response = await axios.put(`${ALUMNOS_URL}/${id}`, data);
    // Devuelve { mensaje: "...", data: {...} }
    return response.data;
  } catch (err) {
    handleError(err, "Error al actualizar alumno");
  }
};

export const createAlumnoConTutor = async (data) => {
  try {
    const response = await axios.post(`${ALUMNOS_URL}/con-tutor`, data);
    // Devuelve { mensaje: "...", data: {...} }
    return response.data;
  } catch (err) {
    handleError(err, "Error al crear alumno con tutor");
  }
};


/**
 * @route GET /api/v1/alumnos/:id/curso-materias-actual
 * Obtiene el curso actual del alumno y sus materias (si tiene)
 */
export const getCursoYMateriasActual = async (id_alumno) => {
  try {
    const response = await axios.get(`${ALUMNOS_URL}/${id_alumno}/curso-materias-actual`);
    // El backend devuelve { curso: {...}, materias: [...] } o un 404
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      console.warn("El alumno no está inscrito en un curso para este año.");
      return { curso: null, materias: [] }; // Devuelve un objeto vacío si no se encuentra
    }
    handleError(err, "Error al obtener el curso del alumno");
  }
};

/**
 * @route POST /api/v1/alumnos/:id/matricular
 * Asigna un alumno a un curso y lo inscribe en todas las materias
 */
export const matricularAlumnoEnCurso = async (id_alumno, id_curso, anio_lectivo) => {
  try {
    const response = await axios.post(`${ALUMNOS_URL}/${id_alumno}/matricular`, {
      id_curso,
      anio_lectivo
    });
    return response.data; // Devuelve { mensaje: "...", data: {...} }
  } catch (err) {
    handleError(err, "Error al matricular al alumno");
  }
};