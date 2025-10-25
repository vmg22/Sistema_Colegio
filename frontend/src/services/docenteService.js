// src/services/docenteService.js (¡ESTE ES EL ARCHIVO CORREGIDO!)

// 1. Importamos la instancia de Axios (que ahora sí tiene .get, .post, etc.)
// (Asegúrate de que la ruta sea correcta)
import apiClient from "../API CRUD/apinuevo"; 

// 2. El endpoint es relativo, la URL base ya está en apiClient
const ENDPOINT = "/docentes";

export const getDocentes = async (params = {}) => {
  // 3. Ahora llamamos a apiClient.get (o como lo llames al importar)
  // y usamos la ruta relativa
  const data = await apiClient.get(ENDPOINT, { params });
  return data; // 'data' ya es el array gracias al interceptor
};

export const getDocentesEliminados = async () => {
  const data = await apiClient.get(`${ENDPOINT}/eliminados/listar`);
  return data;
};

export const getDocenteById = async (id) => {
  const data = await apiClient.get(`${ENDPOINT}/${id}`);
  return data;
};

export const createDocente = async (docenteData) => {
  const data = await apiClient.post(ENDPOINT, docenteData);
  return data;
};

export const restaurarDocente = async (id) => {
  const data = await apiClient.post(`${ENDPOINT}/${id}/restaurar`, null);
  return data;
};

export const updateDocente = async (id, docenteData) => {
  const data = await apiClient.put(`${ENDPOINT}/${id}`, docenteData);
  return data;
};

export const updateDocenteParcial = async (id, docenteData) => {
  const data = await apiClient.patch(`${ENDPOINT}/${id}`, docenteData);
  return data;
};

export const deleteDocente = async (id) => {
  const data = await apiClient.delete(`${ENDPOINT}/${id}`);
  return data;
};