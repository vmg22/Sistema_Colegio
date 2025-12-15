import axios from "axios";
import API from "../api/api"; 

const CM_URL = `${API}/curso-materia`; 

/**
 * Obtiene solo las materias que SÍ están asignadas a un curso.
 * @param {number} id_curso - ID del curso
 * @returns {Promise<Array>} Un array de objetos de materia (ej: [{id_materia: 1, ...}])
 */
export const getMateriasAsignadas = async (id_curso) => {
  try {
    const response = await axios.get(`${CM_URL}/${id_curso}`);
    // Tu backend devuelve { exito: true, datos: [...] }
    return response.data.datos || []; 
  } catch (error) {
    console.error(`Error al obtener materias para el curso ${id_curso}:`, error);
    throw error.response?.data || error;
  }
};

/**
 * Sincroniza/Reemplaza la lista de materias de un curso.
 * @param {number} id_curso - ID del curso
 * @param {Array<number>} idMaterias - Un array de IDs de materias (ej: [1, 5, 12])
 * @returns {Promise<Array>} La nueva lista de materias asignadas
 */
export const actualizarAsignaciones = async (id_curso, idMaterias) => {
  try {
    const response = await axios.put(`${CM_URL}/${id_curso}`, {
      idMaterias: idMaterias // El body debe ser { idMaterias: [...] }
    });
    return response.data.datos || [];
  } catch (error) {
    console.error(`Error al actualizar asignaciones para el curso ${id_curso}:`, error);
    throw error.response?.data || error;
  }
};