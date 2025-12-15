import API from "../api/api";
import axios from "axios";

const EXAMENES_FINALES_URL = `${API}/examenes-finales`;

/**
 * Manejador de errores centralizado para los servicios de exámenes finales.
 */
const handleError = (error, functionName) => {
  console.error(`Error en ${functionName}:`, error);
  
  if (error.response && error.response.data && error.response.data.message) {
    throw new Error(error.response.data.message);
  }
  
  throw new Error(`Error en el servidor al intentar ${functionName}`);
};

/**
 * Obtiene alumnos en estado 'final' para un curso/materia/año lectivo
 */
export const obtenerAlumnosEnFinal = async (idCurso, idMateria, anioLectivo) => {
  try {
    const response = await axios.get(`${EXAMENES_FINALES_URL}/alumnos-en-final`, {
      params: {
        curso: idCurso,
        materia: idMateria,
        anioLectivo: anioLectivo
      }
    });
    console.log('📡 Respuesta completa del backend:', response.data);
    // El backend devuelve { exito: true, mensaje: "...", datos: [...] } - en español!
    return response.data.datos || [];
  } catch (error) {
    console.error('❌ Error en servicio:', error);
    handleError(error, 'obtener alumnos en estado final');
  }
};

/**
 * Obtiene alumnos que aprobaron por examen final
 */
export const obtenerAlumnosAprobados = async (idCurso, idMateria, anioLectivo) => {
  try {
    const response = await axios.get(`${EXAMENES_FINALES_URL}/alumnos-aprobados`, {
      params: {
        curso: idCurso,
        materia: idMateria,
        anioLectivo: anioLectivo
      }
    });
    return response.data.datos || [];
  } catch (error) {
    console.error('❌ Error en servicio:', error);
    handleError(error, 'obtener alumnos aprobados por examen final');
  }
};

/**
 * Registra un examen final
 * @param {object} datosExamen - { id_alumno, id_materia, id_curso, anio_lectivo, instancia, fecha_examen, nota_obtenida, id_docente }
 */
export const registrarExamenFinal = async (datosExamen) => {
  try {
    const response = await axios.post(`${EXAMENES_FINALES_URL}/registrar`, datosExamen);
    return response.data.datos;
  } catch (error) {
    handleError(error, 'registrar examen final');
  }
};

/**
 * Obtiene el historial de exámenes finales de un alumno en una materia
 */
export const obtenerHistorialExamenes = async (idAlumno, idMateria, anioLectivo) => {
  try {
    const response = await axios.get(
      `${EXAMENES_FINALES_URL}/historial/${idAlumno}/${idMateria}/${anioLectivo}`
    );
    return response.data.datos;
  } catch (error) {
    handleError(error, 'obtener historial de exámenes');
  }
};
