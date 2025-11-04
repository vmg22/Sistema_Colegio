import API from "../api/api";
import axios from "axios";

const MATERIAS_URL = `${API}/materias`;

const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  const message =
    error.response?.data?.mensaje ||
    error.response?.data?.error ||
    defaultMessage;
  throw new Error(message);
};

// ✅ Siempre devolver un array plano de materias
export const getMaterias = async (params = {}) => {
  try {
    const response = await axios.get(MATERIAS_URL, { params });
    const materias = response.data.datos?.materias;
    return Array.isArray(materias) ? materias : [];
  } catch (err) {
    handleError(err, "Error al obtener materias");
    return [];
  }
};

// ✅ Devuelve solo el objeto materia
export const getMateriasId = async (id) => {
  try {
    const response = await axios.get(`${MATERIAS_URL}/${id}`);
    return response.data.datos;
  } catch (err) {
    handleError(err, "Error al obtener materia por ID");
  }
};

// ✅ Devuelve el objeto materia creada
export const createMateria = async (materiaData) => {
  try {
    const response = await axios.post(MATERIAS_URL, materiaData);
    return response.data.datos;
  } catch (err) {
    handleError(err, "Error al crear materia");
  }
};

// ✅ Devuelve el objeto materia actualizada
export const updateMateria = async (id, materiaData) => {
  try {
    const response = await axios.patch(`${MATERIAS_URL}/${id}`, materiaData);
    return response.data.datos;
  } catch (err) {
    handleError(err, "Error al actualizar materia");
  }
};

// ✅ Devuelve confirmación o la materia eliminada
export const deleteMateria = async (id) => {
  try {
    const response = await axios.delete(`${MATERIAS_URL}/${id}`);
    return response.data.datos;
  } catch (err) {
    handleError(err, "Error al eliminar materia");
  }
};

// ✅ Siempre devuelve array de materias eliminadas
export const getMateriasEliminadas = async () => {
  try {
    const response = await axios.get(`${MATERIAS_URL}/eliminados/listar`);
    const materias = response.data.datos?.materias;
    return Array.isArray(materias) ? materias : [];
  } catch (err) {
    handleError(err, "Error al obtener materias eliminadas");
    return [];
  }
};

// ✅ Devuelve la materia restaurada
export const restaurarMateria = async (id) => {
  try {
    const response = await axios.post(`${MATERIAS_URL}/${id}/restaurar`, null);
    return response.data.datos;
  } catch (err) {
    handleError(err, "Error al restaurar materia");
  }
};

// ✅ ENUMs devuelven listas simples
export const getEstadosMateria = async () => {
  try {
    const response = await axios.get(`${MATERIAS_URL}/estados`);
    return response.data.datos || [];
  } catch (err) {
    handleError(err, "Error al obtener estados de materia");
    return [];
  }
};

export const getCiclosMateria = async () => {
  try {
    const response = await axios.get(`${MATERIAS_URL}/ciclos`);
    return response.data.datos || [];
  } catch (err) {
    handleError(err, "Error al obtener ciclos de materia");
    return [];
  }
};
