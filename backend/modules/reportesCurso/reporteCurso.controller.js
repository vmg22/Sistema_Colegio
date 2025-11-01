const  pool  = require("../../config/db");
const consultaCurso = require('./reporteCurso.queries');

/**
 * Controlador para las consultas académicas
 */
const consultaController = {
  /**
   * Obtiene los alumnos con sus calificaciones y asistencias filtrados por curso
   * @route GET /api/consultas/curso
   * @query {number} id_curso - ID del curso
   * @query {number} id_materia - ID de la materia
   * @query {number} anio_lectivo - Año lectivo
   * @query {number} cuatrimestre - Cuatrimestre (1 o 2)
   */
  obtenerAlumnosPorCurso: async (req, res) => {
    try {
      // 1. Extraer y validar parámetros
      const { id_curso, id_materia, anio_lectivo, cuatrimestre } = req.query;

      // Validación de parámetros requeridos
      if (!id_curso || !id_materia || !anio_lectivo || !cuatrimestre) {
        return res.status(400).json({
          success: false,
          message: 'Faltan parámetros requeridos: id_curso, id_materia, anio_lectivo, cuatrimestre'
        });
      }

      // Validación de tipos y rangos
      if (isNaN(id_curso) || isNaN(id_materia) || isNaN(anio_lectivo) || isNaN(cuatrimestre)) {
        return res.status(400).json({
          success: false,
          message: 'Los parámetros deben ser números válidos'
        });
      }

      if (cuatrimestre !== '1' && cuatrimestre !== '2') {
        return res.status(400).json({
          success: false,
          message: 'El cuatrimestre debe ser 1 o 2'
        });
      }

      // 2. Preparar parámetros para la consulta
      // La consulta requiere: id_materia, anio_lectivo (x6 veces), id_curso, cuatrimestre
      const params = [
        id_materia,    // presentes
        anio_lectivo,  
        id_materia,    // ausentes
        anio_lectivo,  
        id_materia,    // tardes
        anio_lectivo,  
        id_materia,    // LEFT JOIN calificacion
        anio_lectivo,  
        cuatrimestre,  
        id_curso,      // WHERE
        anio_lectivo   
      ];

      // 3. Ejecutar consulta
      const [alumnos] = await pool.query(
        consultaCurso.obtenerAlumnosPorCurso,
        params
      );

      // 4. Transformar datos a formato JSON estructurado
      const alumnosFormateados = alumnos.map(alumno => ({
        alumno: {
          id: alumno.id_alumno,
          dni: alumno.dni_alumno,
          nombre: alumno.nombre_alumno,
          apellido: alumno.apellido_alumno,
          nombreCompleto: `${alumno.apellido_alumno}, ${alumno.nombre_alumno}`
        },
        calificaciones: alumno.id_calificacion ? {
          id: alumno.id_calificacion,
          nota1: alumno.nota_1,
          nota2: alumno.nota_2,
          nota3: alumno.nota_3,
          promedio: alumno.promedio_cuatrimestre
        } : null,
        asistencias: {
          presentes: parseInt(alumno.presentes) || 0,
          ausentes: parseInt(alumno.ausentes) || 0,
          tardes: parseInt(alumno.tardes) || 0,
          total: (parseInt(alumno.presentes) || 0) + 
                 (parseInt(alumno.ausentes) || 0) + 
                 (parseInt(alumno.tardes) || 0)
        }
      }));

      // 5. Enviar respuesta exitosa
      res.status(200).json({
        success: true,
        data: {
          filtros: {
            curso: parseInt(id_curso),
            materia: parseInt(id_materia),
            anioLectivo: parseInt(anio_lectivo),
            cuatrimestre: parseInt(cuatrimestre)
          },
          totalAlumnos: alumnosFormateados.length,
          alumnos: alumnosFormateados
        }
      });

    } catch (error) {
      console.error('Error en obtenerAlumnosPorCurso:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los alumnos del curso',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};



module.exports = consultaController;