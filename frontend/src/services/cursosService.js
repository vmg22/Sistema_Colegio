import API from "../api/api"
import axios from "axios";

const CURSOS_URL = `${API}/cursos`;

export const getCursos = async () => {
  try {
    const response = await axios.get(CURSOS_URL);
    
    // Asumimos que la API de cursos devuelve la misma estructura { datos: [...] }
    // que la de materias.
    return response.data.datos || []; 
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    return []; 
  }
};