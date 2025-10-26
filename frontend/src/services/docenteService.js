import API from "../api/api";
import axios from "axios";


const ALTASDOCENTES_URL = `${API}/docentes`;


export const getDocentes = async (params = {}) => {
  try {
    // Se llama a 'axios.get' (el paquete importado)
    const response = await axios.get(ALTASDOCENTES_URL, { params });
    // Devuelve el array que está DENTRO de la propiedad 'datos'
    return response.data.datos || [];
  } catch (error) {
    // Mensaje de error corregido
    console.error("Error al obtener docentes:", error);
    return [];
  }
};


export const getDocentesEliminados = async () => {
  try {
    const response = await axios.get(`${ALTASDOCENTES_URL}/eliminados/listar`);
    return response.data.datos || [];
  } catch (error) {
    console.error("Error al obtener docentes eliminados:", error);
    return [];
  }
};


export const getDocenteById = async (id) => {
  try {
    // Se llama a 'axios.get'
    const response = await axios.get(`${ALTASDOCENTES_URL}/${id}`);
    // Un 'getById' suele devolver el objeto directamente
    return response.data.datos; 
  } catch (error) {
    console.error(`Error al obtener el docente ${id}:`, error);
    return null; // Devolver null es una mejor práctica si no se encuentra
  }
};


export const createDocente = async (docenteData) => {
  try {
    const response = await axios.post(ALTASDOCENTES_URL, docenteData);
    return response.data;
  } catch (error) {
    console.error("Error al crear docente:", error);
    throw error; // Lanzamos el error para que el formulario lo pueda manejar
  }
};


export const restaurarDocente = async (id) => {
  try {
    const response = await axios.post(`${ALTASDOCENTES_URL}/${id}/restaurar`, null);
    return response.data;
  } catch (error) {
    console.error(`Error al restaurar docente ${id}:`, error);
    throw error;
  }
};


export const updateDocente = async (id, docenteData) => {
  try {
    const response = await axios.put(`${ALTASDOCENTES_URL}/${id}`, docenteData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar docente ${id}:`, error);
    throw error;
  }
};


export const updateDocenteParcial = async (id, docenteData) => {
  try {
    const response = await axios.patch(`${ALTASDOCENTES_URL}/${id}`, docenteData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar parcialmente docente ${id}:`, error);
    throw error;
  }
};


export const deleteDocente = async (id) => {
  try {
    const response = await axios.delete(`${ALTASDOCENTES_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar docente ${id}:`, error);
    throw error;
  }
};