import axios from "axios";      
import API from "../api/api"; 
const ALTAS_URL = `${API}/altas`;

/**
 * Función genérica para manejar errores y extraer el mensaje del backend.
 */
const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  // Extraemos el 'message' de la respuesta de tu backend
  const message = error.response?.data?.message || error.response?.data?.error || defaultMessage;
  throw new Error(message); // Lanzamos el error para que el componente lo atrape
};

/**
 * @route GET /api/v1/altas/docentes
 */
export const getDocentes = async (params = {}) => {
  try {
    // 4. Usamos 'axios.get' y la URL completa
    const response = await axios.get(`${ALTAS_URL}/docentes`, { params });
    // Tu backend devuelve { data: { total, docentes } }
    return response.data.data.docentes || []; 
  } catch (err) {
    handleError(err, "Error al obtener docentes");
  }
};

/**
 * @route POST /api/v1/altas/docente
 */
export const createDocente = async (docenteData) => {
  try {
    const response = await axios.post(`${ALTAS_URL}/docente`, docenteData);
    // Tu backend devuelve { data: { docenteCreado } }
    return response.data.data; 
  } catch (err) {
    handleError(err, "Error al crear docente");
  }
};

/**
 * @route PUT /api/v1/altas/docentes/:id
 */
export const updateDocente = async (id, docenteData) => {
  try {
    const response = await axios.put(`${ALTAS_URL}/docentes/${id}`, docenteData);
    return response.data.data;
  } catch (err) {
    handleError(err, "Error al actualizar docente");
  }
};

/**
 * @route PATCH /api/v1/altas/docentes/:id
 */
export const updateDocenteParcial = async (id, docenteData) => {
  try {
    const response = await axios.patch(`${ALTAS_URL}/docentes/${id}`, docenteData);
    return response.data.data;
  } catch (err) {
    handleError(err, "Error al actualizar docente");
  }
};

/**
 * @route DELETE /api/v1/altas/docentes/:id
 */
export const deleteDocente = async (id) => {
  try {
    const response = await axios.delete(`${ALTAS_URL}/docentes/${id}`);
    return response.data.data;
  } catch (err) {
    handleError(err, "Error al eliminar docente");
  }
};

/**
 * @route GET /api/v1/altas/docentes/eliminados/listar
 */
export const getDocentesEliminados = async () => {
  try {
    const response = await axios.get(`${ALTAS_URL}/docentes/eliminados/listar`);
    return response.data.data.docentes || [];
  } catch (err) {
    handleError(err, "Error al obtener docentes eliminados");
  }
};

/**
 * @route POST /api/v1/altas/docentes/:id/restaurar
 */
export const restaurarDocente = async (id) => {
  try {
    const response = await axios.post(`${ALTAS_URL}/docentes/${id}/restaurar`, null);
    return response.data.data;
  } catch (err) {
    handleError(err, "Error al restaurar docente");
  }
};

/**
 * @route GET /api/v1/altas/docentes/:id
 */
export const getDocenteById = async (id) => {
  try {
    const response = await axios.get(`${ALTAS_URL}/docentes/${id}`);
    return response.data.data; 
  } catch (err) {
    handleError(err, "Error al obtener docente");
  }
};