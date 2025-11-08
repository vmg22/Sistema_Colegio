import API from "../api/api"
import axios from "axios";

const CURSOS_URL = `${API}/cursos`;

/**
 * Obtiene todos los cursos (con nombre de tutor).
 */
export const getCursos = async () => {
  const response = await axios.get(CURSOS_URL);
  return response.data; // Espera { datos: [...] }
};

/**
 * Obtiene un curso por su ID (con nombre de tutor).
 */
export const getCursoById = async (id) => {
  const response = await axios.get(`${CURSOS_URL}/${id}`);
  return response.data;
};

/**
 * Crea un nuevo curso.
 * @param {object} datos - { nombre, anio, division, turno, id_docente_tutor, estado }
 */
export const createCurso = async (datos) => {
  const response = await axios.post(CURSOS_URL, datos);
  return response.data;
};

/**
 * Actualiza un curso existente.
 * @param {number} id - ID del curso
 * @param {object} datos
 */
export const updateCurso = async (id, datos) => {
  const response = await axios.put(`${CURSOS_URL}/${id}`, datos);
  return response.data;
};

/**
 * Elimina (borrado lógico) un curso.
 */
export const deleteCurso = async (id) => {
  const response = await axios.delete(`${CURSOS_URL}/${id}`);
  return response.data;
};

// --- (La función getMateriasPorCurso que hicimos sigue aquí) ---
export const getMateriasPorCurso = async (id_curso) => {
  try {
    const response = await axios.get(`${CURSOS_URL}/${id_curso}/materias`);
    return response.data.datos; 
  } catch (error) {
    console.error("Error al obtener materias por curso:", error);
    throw error;
  }
};