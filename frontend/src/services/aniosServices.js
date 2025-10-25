import API from "../api/api"
import axios from "axios";

// Ajusta el endpoint a tu API (ej: /anios-lectivos)
const ANIOS_URL = `${API}/anios-lectivos`; 

export const getAniosLectivos = async () => {
  try {
    const response = await axios.get(ANIOS_URL);
    
    // Asumimos la misma estructura { datos: [...] }
    return response.data.datos || []; 
  } catch (error) {
    console.error("Error al obtener años lectivos:", error);
    return []; 
  }
};