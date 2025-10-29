import { getReporteAlumno } from './reportesService';


// Obtiene los datos del alumno para generar una constancia
 // Reutiliza el endpoint de reportes que ya existe
 // dni - DNI del alumno
 // - Año lectivo
 // {Promise<Object>} Datos del alumno
 
export const getConstanciaAlumno = async (dni, anio) => {
  try {
    // Reutilizamos el servicio de reportes existente
    const response = await getReporteAlumno(dni, anio);
    
    // El servicio de reportes ya devuelve los datos procesados
    return response.data || response;
    
  } catch (error) {
    console.error('Error al obtener constancia del alumno:', {
      dni,
      anio,
      error: error.message,
      response: error.response?.data
    });
    
    // Re-lanzar con un mensaje más descriptivo
    throw new Error(
      error.message || 
      error.response?.data?.message || 
      'No se pudo obtener la información del alumno'
    );
  }
};

/**
 * Genera y guarda una constancia para un alumno
 //{string} dni - DNI del alumno
 // {Object} datosConstancia - Datos adicionales de la constancia
 //{Promise<Object>} Constancia generada
 */
export const generarConstancia = async (dni, datosConstancia) => {
  try {
    // TODO: Implementar endpoint para guardar constancias
    // Por ahora solo retorna los datos
    console.log('Guardando constancia para DNI:', dni, datosConstancia);
    
    return {
      success: true,
      message: 'Constancia generada',
      data: {
        dni,
        fecha_generacion: new Date(),
        ...datosConstancia
      }
    };
    
  } catch (error) {
    console.error('Error al generar constancia:', {
      dni,
      error: error.message
    });
    
    throw new Error(
      error.message || 
      'No se pudo generar la constancia'
    );
  }
};