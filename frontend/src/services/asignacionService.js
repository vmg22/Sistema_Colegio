import axios from "axios";
import API from "../api/api"; // Tu string de URL base
const ASIGNACIONES_URL = `${API}/asignaciones`;

// Reutiliza tu manejador de errores de docenteService.js
const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  const message = error.response?.data?.message || error.response?.data?.error || defaultMessage;
  throw new Error(message); 
};

/**
 * @route GET /api/v1/asignaciones
 * @param params - Ej: { id_docente: 5 }
 */
export const getAsignaciones = async (params = {}) => {
  try {
    const response = await axios.get(ASIGNACIONES_URL, { params });
    return response.data.data || []; // Devuelve el array de asignaciones
  } catch (err) {
    handleError(err, "Error al obtener asignaciones");
  }
};

/**
 * @route POST /api/v1/asignaciones
 */
export const createAsignacion = async (asignacionData) => {
  try {
    const response = await axios.post(ASIGNACIONES_URL, asignacionData);
    return response.data.data; // Devuelve la asignación creada
  } catch (err) {
    handleError(err, "Error al crear asignación");
  }
};

/**
 * @route PATCH /api/v1/asignaciones/:id
 */
export const updateAsignacion = async (id, asignacionData) => {
  try {
    const response = await axios.patch(`${ASIGNACIONES_URL}/${id}`, asignacionData);
    return response.data.data; // Devuelve la asignación actualizada
  } catch (err) {
    handleError(err, "Error al actualizar asignación");
  }
};

/**
 * @route DELETE /api/v1/asignaciones/:id
 */
export const deleteAsignacion = async (id) => {
  try {
    const response = await axios.delete(`${ASIGNACIONES_URL}/${id}`);
    return response.data.data;
  } catch (err) {
    handleError(err, "Error al eliminar asignación");
  }
};

/**
 * --- ¡AÑADIR ESTA NUEVA FUNCIÓN! ---
 * @route GET /api/v1/asignaciones/estados
 */
export const getAsignacionEstados = async () => {
  try {
    const response = await axios.get(`${ASIGNACIONES_URL}/estados`);
    return response.data.data; // Devuelve el array ['activo', 'completado', 'inactivo']
  } catch (err) {
    handleError(err, "Error al obtener estados de asignación");
  }
};