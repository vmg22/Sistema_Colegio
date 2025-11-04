import API from "../api/api"
import axios from "axios";


const CALIFICACIONES_URL = `${API}/calificaciones`;

/**
 * Manejador de errores centralizado para los servicios de calificación.
 * Lanza un error con el mensaje específico del backend si está disponible.
 */
const handleError = (error, functionName) => {
  console.error(`Error en ${functionName}:`, error);
  
  // Prioriza el mensaje de error enviado por tu API (desde tu helper 'error')
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  }
  
  // Error genérico si no hay mensaje del backend
  throw new Error(`Error en el servidor al intentar ${functionName}`);
};

// --- FUNCIONES PRINCIPALES PARA TU MODAL ---

/**
 * (POST /) Crea un nuevo registro de calificación.
 * Se usa cuando guardas las notas de un alumno por PRIMERA VEZ.
 * (Corresponde a 'crearCalificacion' en tu controller)
 *
 * @param {object} datosCalificacion - Objeto con { id_alumno, id_materia, id_docente, id_curso, anio_lectivo, cuatrimestre, nota_1, ... }
 * @returns {object} La calificación recién creada.
 */
export const crearCalificacion = async (datosCalificacion) => {
  try {
    // Tu API devuelve { success: true, data: {...} }
    const response = await axios.post(CALIFICACIONES_URL, datosCalificacion);
    return response.data.data; // Devolvemos solo los datos
  } catch (error) {
    handleError(error, 'crear la calificación');
  }
};

/**
 * (PATCH /:id) Actualiza parcialmente un registro de calificación existente.
 * Se usa cuando editas las notas de un alumno que YA TENÍA notas cargadas.
 * (Corresponde a 'actualizarCalificacionParcial' en tu controller)
 *
 * @param {number} id - El id_calificacion a editar.
 * @param {object} datosActualizados - Objeto SOLO con los campos a cambiar (ej: { nota_1: 8, nota_2: 7 })
 * @returns {object} La calificación actualizada.
 */
export const actualizarCalificacionParcial = async (id, datosActualizados) => {
  try {
    // ESTA ES LA FORMA CORRECTA (FRONTEND)
    // Simplemente envía la petición PATCH al backend.
    // Tu backend (Node.js) se encargará de validar, filtrar y llamar a la query.
    const response = await axios.patch(`${CALIFICACIONES_URL}/${id}`, datosActualizados);
    
    // Tu API devuelve { success: true, data: {...} }
    return response.data.data; // Devolvemos solo los datos
    
  } catch (error) {
    // Tu handleError ya se encarga de mostrar "Calificación no encontrada" si el backend lo dice
    handleError(error, 'actualizar la calificación');
  }
};


// --- RESTO DE FUNCIONES CRUD (para otras secciones de tu app) ---

/**
 * (GET /) Obtiene todas las calificaciones.
 * (Corresponde a 'obtenerTodasCalificaciones')
 */
export const obtenerTodasCalificaciones = async () => {
  try {
    const response = await axios.get(CALIFICACIONES_URL);
    return response.data.data;
  } catch (error) {
    handleError(error, 'obtener todas las calificaciones');
  }
};

/**
 * (GET /:id) Obtiene una calificación por su ID.
 * (Corresponde a 'obtenerCalificacionPorId')
 */
export const obtenerCalificacionPorId = async (id) => {
  try {
    const response = await axios.get(`${CALIFICACIONES_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    handleError(error, 'obtener la calificación por ID');
  }
};

/**
 * (PUT /:id) Actualiza completamente una calificación.
 * (Corresponde a 'actualizarCalificacion')
 */
export const actualizarCalificacion = async (id, datosCompletos) => {
  try {
    const response = await axios.put(`${CALIFICACIONES_URL}/${id}`, datosCompletos);
    return response.data.data;
  } catch (error) {
    handleError(error, 'actualizar la calificación (completo)');
  }
};

/**
 * (DELETE /:id) Elimina (lógicamente) una calificación.
 * (Corresponde a 'eliminarCalificacion')
 */
export const eliminarCalificacion = async (id) => {
  try {
    const response = await axios.delete(`${CALIFICACIONES_URL}/${id}`);
    return response.data.data; // Devuelve { id_calificacion: ... }
  } catch (error) {
    handleError(error, 'eliminar la calificación');
  }
};

/**
 * (GET /eliminados/listar) Obtiene las calificaciones eliminadas.
 * (Corresponde a 'obtenerCalificacionesEliminadas')
 */
export const obtenerCalificacionesEliminadas = async () => {
  try {
    const response = await axios.get(`${CALIFICACIONES_URL}/eliminados/listar`);
    return response.data.data;
  } catch (error) {
    handleError(error, 'obtener las calificaciones eliminadas');
  }
};

/**
 * (POST /:id/restaurar) Restaura una calificación eliminada lógicamente.
 * (Corresponde a 'restaurarCalificacion')
 */
export const restaurarCalificacion = async (id) => {
  try {
    const response = await axios.post(`${CALIFICACIONES_URL}/${id}/restaurar`);
    return response.data.data;
  } catch (error) {
    handleError(error, 'restaurar la calificación');
  }
};