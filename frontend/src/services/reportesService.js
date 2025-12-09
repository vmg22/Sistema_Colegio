import axios from "axios";
import API from "../api/api";

const REPORTES_URL = `${API}/reportes`;

// Obtener reporte completo de un alumno por DNI y año
export const getReporteAlumno = async (dni, anio) => {
  try {
    const response = await axios.get(`${REPORTES_URL}/alumnos/${dni}/${anio}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener reporte del alumno:", error);
    throw error.response?.data || { message: "Error al obtener reporte del alumno" };
  }
  
// Obtener reporte de asistencia de un curso en un mes específico

};
export const getReporteCurso = async (id_curso, id_materia, anio_lectivo, cuatrimestre) => {
  try {
    // Construimos los parámetros de la URL
    const params = new URLSearchParams({
      id_curso,
      id_materia,
      anio_lectivo,
      cuatrimestre
    });

    // Usamos la URL base de tu router: /api/v1/reportes
    // Y le añadimos la ruta /curso
    const response = await axios.get(`${API}/reportes/curso?${params.toString()}`);
    
    // Tu API devuelve { success: true, data: {...} }
    return response.data.data; 

  } catch (error) {
    console.error("Error al obtener el reporte del curso:", error);
    // Lanzamos el error para que el componente lo atrape
    throw error.response?.data || new Error("Error en el servidor al buscar reporte de curso");
  }
};