import API from "../api/api"
import axios from "axios";

// Ajusta el endpoint a tu API (ej: /anios-lectivos)
const ANIOS_URL = `${API}/anios-lectivos`; 


/**
 * Obtiene todos los años lectivos.
 * Devuelve el objeto de respuesta completo (ej: { datos: [...] })
 */
export const getAniosLectivos = async () => {
  const response = await axios.get(ANIOS_URL);
  return response.data;
};

/**
 * Obtiene un año lectivo por su ID.
 */
export const getAnioLectivoById = async (id) => {
  const response = await axios.get(`${ANIOS_URL}/${id}`);
  return response.data;
};

/**
 * Crea un nuevo año lectivo.
 * @param {object} datos - { anio, fecha_inicio, fecha_fin, estado }
 */
export const createAnioLectivo = async (datos) => {
  const response = await axios.post(ANIOS_URL, datos);
  return response.data;
};

/**
 * Actualiza un año lectivo existente.
 * @param {number} id - ID del año lectivo
 * @param {object} datos - { anio, fecha_inicio, fecha_fin, estado }
 */
export const updateAnioLectivo = async (id, datos) => {
  const response = await axios.put(`${ANIOS_URL}/${id}`, datos);
  return response.data;
};

/**
 * Elimina (borrado lógico) un año lectivo.
 * @param {number} id - ID del año lectivo
 */
export const deleteAnioLectivo = async (id) => {
  const response = await axios.delete(`${ANIOS_URL}/${id}`);
  return response.data;
};