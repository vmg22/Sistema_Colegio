import API from "../api/api"; 
import axios from "axios";

// Endpoint específico ( http://localhost:3000/api/v1/inscripciones)
const INSCRIPCIONES_URL = `${API}/inscripciones`;

/**
 * Envía el payload completo para crear una nueva inscripción.
 * {object} alumnoData - Objeto con datos del alumno
 * {object} tutorData - Objeto con datos del tutor
 * {object} inscripcionData - Objeto con { id_curso, anio_lectivo }
 * {Promise<object>} - La respuesta del backend (ej: { message: '...', id_alumno: ... })
 * {Error} - Lanza un error con el mensaje del backend si la petición falla
 */
export const crearInscripcion = async (alumnoData, tutorData, inscripcionData) => {
  try {
    //  Preparamos el payload exacto que espera el backend
    const payload = {
      alumnoData,
      tutorData,
      inscripcionData
    };

    //  petición POST
    const response = await axios.post(INSCRIPCIONES_URL, payload);

    //  Devolvemos la data exitosa ( { message: '...', id_alumno: ... })
    return response.data;

  } catch (error) {
    // Si el backend nos da un error ( DNI duplicado), lo capturamos aquí
    console.error("Error en el servicio de inscripción:", error.response ? error.response.data : error.message);
    
    // Lanzamos un error para que el componente (el Wizard) pueda
    // atraparlo en su propio try...catch y mostrarlo al usuario.
    const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Error desconocido al crear la inscripción";
                         
    throw new Error(errorMessage);
  }
};

