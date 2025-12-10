import axios from "axios";
import API from "../api/api";
const ALTAS_URL = `${API}/altas-docentes`;

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
    const response = await axios.get(`${ALTAS_URL}`, { params });
    
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

// ============================================================
// NUEVAS FUNCIONES PARA FILTRADO POR DOCENTE
// ============================================================

const DOCENTE_URL = `${API}/docentes`;

/**
 * Obtener materias asignadas a un docente
 * @param {number} idDocente - ID del docente
 * @returns {Promise} Lista de materias
 */
export const getMateriasPorDocente = async (idDocente) => {
  try {
    const response = await axios.get(`${DOCENTE_URL}/${idDocente}/materias`);
    return response.data.datos || [];
  } catch (err) {
    handleError(err, "Error al obtener materias del docente");
  }
};

/**
 * Obtener cursos asignados a un docente
 * @param {number} idDocente - ID del docente
 * @param {number|null} idMateria - ID de materia para filtrar (opcional)
 * @returns {Promise} Lista de cursos
 */
export const getCursosPorDocente = async (idDocente, idMateria = null) => {
  try {
    const url = idMateria 
      ? `${DOCENTE_URL}/${idDocente}/cursos?id_materia=${idMateria}`
      : `${DOCENTE_URL}/${idDocente}/cursos`;
    const response = await axios.get(url);
    return response.data.datos || [];
  } catch (err) {
    handleError(err, "Error al obtener cursos del docente");
  }
};

/**
 * Obtener alumnos de los cursos donde el docente dicta
 * @param {number} idDocente - ID del docente
 * @param {number|null} idCurso - ID de curso para filtrar (opcional)
 * @returns {Promise} Lista de alumnos
 */
export const getAlumnosPorDocente = async (idDocente, idCurso = null) => {
  try {
    const url = idCurso
      ? `${DOCENTE_URL}/${idDocente}/alumnos?id_curso=${idCurso}`
      : `${DOCENTE_URL}/${idDocente}/alumnos`;
    const response = await axios.get(url);
    return response.data.data || [];
  } catch (err) {
    handleError(err, "Error al obtener alumnos del docente");
  }
};

/**
 * Buscar un alumno por DNI y verificar acceso del docente
 * @param {number} idDocente - ID del docente
 * @param {string} dni - DNI del alumno
 * @returns {Promise} Datos del alumno si tiene acceso
 */
export const buscarAlumnoPorDNI = async (idDocente, dni) => {
  try {
    // Primero obtener el alumno
    const responseAlumno = await axios.get(`${API}/alumnos/dni/${dni}`);
    const alumno = responseAlumno.data;
    
    // Verificar acceso
    await axios.get(
      `${DOCENTE_URL}/${idDocente}/verificar-acceso/alumno/${alumno.id_alumno}`
    );
    
    return alumno;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('No tiene acceso a este alumno');
    }
    handleError(error, "Error al buscar alumno");
  }
};

/**
 * Verificar si un docente tiene acceso a un alumno
 * @param {number} idDocente - ID del docente
 * @param {number} idAlumno - ID del alumno
 * @returns {Promise<boolean>} true si tiene acceso
 */
export const verificarAccesoAlumno = async (idDocente, idAlumno) => {
  try {
    const response = await axios.get(
      `${DOCENTE_URL}/${idDocente}/verificar-acceso/alumno/${idAlumno}`
    );
    return response.data.data.tiene_acceso;
  } catch (error) {
    return false;
  }
};
