import axios from "axios";
import API from "../api/api";

const TUTORES_URL = `${API}/tutores`;

// --- AÑADIDO: Manejador de errores ---
const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  const message = error.response?.data?.message || defaultMessage;
  throw new Error(message);
};

export const editarTutorPorId = async (id, datosTutor) => {
  try {
    const response = await axios.put(`${TUTORES_URL}/${id}`, datosTutor);
    // Tu backend de tutor devuelve { success: true, data: {...} }
    return response.data.data;
  } catch (err) {
    handleError(err, "Error al editar tutor");
  }
};
