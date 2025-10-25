import API from "../api/api"
import axios from "axios";

const MATERIAS_URL = `${API}/materias`;

export const getMaterias = async () => {
  try {
    const response = await axios.get(MATERIAS_URL);
    // Devuelve el array que está DENTRO de la propiedad 'datos'
    return response.data.datos || []; 
  } catch (error) {
    console.error("Error al obtener materias:", error);
    return []; 
  }
};