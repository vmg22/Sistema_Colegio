import axios from "axios";
import API from "../api/api"; // Tu string de URL base
const ALTAS_URL = `${API}/altas`;

/**
 * Función genérica para manejar errores y extraer el mensaje del backend.
 */
const handleError = (error, defaultMessage) => {
  console.error(defaultMessage, error);
  // Extraemos el 'message' de la respuesta de tu backend
  const message = error.response?.data?.message || error.response?.data?.error || defaultMessage;
  // ¡LANZAMOS el error para que el componente lo atrape!
  throw new Error(message); 
};

/**
 * @route GET /api/v1/altas/docentes
 */
export const getDocentes = async (params = {}) => {
  try {
    const response = await axios.get(`${ALTAS_URL}/docentes`, { params });
    // Corregido: Tu backend usa 'data', no 'datos'.
    return response.data.data.docentes || []; 
  } catch (err) {
    handleError(err, "Error al obtener docentes");
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


// --- ¡AQUÍ ESTÁN LAS FUNCIONES QUE FALTABAN! ---

/**
 * @route POST /api/v1/altas/docente/perfil
 * (Paso 1 del Wizard)
 */
export const createDocentePerfil = async (perfilData) => {
  try {
    const response = await axios.post(`${ALTAS_URL}/docente/perfil`, perfilData);
    return response.data.data; // Devuelve el docente creado (sin usuario)
  } catch (err) {
    handleError(err, "Error al crear perfil de docente");
  }
};

/**
 * @route POST /api/v1/altas/docente/:id/usuario
 * (Paso 2 del Wizard)
 */
export const createUsuarioParaDocente = async (id_docente, usuarioData) => {
  try {
    const response = await axios.post(`${ALTAS_URL}/docente/${id_docente}/usuario`, usuarioData);
    return response.data.data; // Devuelve el docente actualizado (con usuario)
  } catch (err) {
    handleError(err, "Error al crear y vincular usuario");
  }
};

export const getDocenteEstados = async () => {
  try {
    const response = await axios.get(`${ALTAS_URL}/docentes/estados`);
    return response.data.data; // Devuelve el array ['activo', 'licencia', 'inactivo']
  } catch (err) {
    handleError(err, "Error al obtener estados de docente");
  }
};