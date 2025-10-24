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
};
