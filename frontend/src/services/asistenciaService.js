import API from "../api/api";
import axios from "axios";

const ASISTENCIA_URL = `${API}/asistencias`;

/**
 * Obtiene la lista de alumnos para la asistencia de una clase específica.
 * @param {object} filtros - Objeto con { id_materia, fecha_clase, id_curso, anio_lectivo }
 */
export const obtenerListaClase = async (filtros) => {
  // Usamos 'params' para que axios arme la URL query string
  const response = await axios.get(`${ASISTENCIA_URL}/clase`, {
    params: filtros,
  });
  // Asumiendo que tu wrapper 'exito' pone los datos en res.data.datos
  // Ajusta esto según la estructura de tu respuesta (ej: response.data.lista)
  return response.data.datos; 
};

/**
 * Guarda (Crea o Actualiza) las asistencias de una clase completa.
 * @param {object} payload - Objeto con { id_materia, id_curso, id_docente, anio_lectivo, fecha_clase, alumnos }
 */
export const guardarAsistenciasClase = async (payload) => {
  // Esta ruta es POST /clase según tu router
  const response = await axios.post(`${ASISTENCIA_URL}/clase`, payload);
  return response.data; // Devuelve la respuesta del backend (ej: "Asistencias guardadas")
};
