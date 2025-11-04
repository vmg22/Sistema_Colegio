const pool = require("../../config/db");
const consultaCurso = require("./reporteCurso.queries"); // <-- Asegúrate que aquí esté la NUEVA query

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
      // 1. Extraer y validar parámetros (SIN CAMBIOS)
      const { id_curso, id_materia, anio_lectivo, cuatrimestre } = req.query;

      if (!id_curso || !id_materia || !anio_lectivo || !cuatrimestre) {
        return res.status(400).json({
          success: false,
          message:
            "Faltan parámetros requeridos: id_curso, id_materia, anio_lectivo, cuatrimestre",
        });
      }

      if (
        isNaN(id_curso) ||
        isNaN(id_materia) ||
        isNaN(anio_lectivo) ||
        isNaN(cuatrimestre)
      ) {
        return res.status(400).json({
          success: false,
          message: "Los parámetros deben ser números válidos",
        });
      }

      if (cuatrimestre !== "1" && cuatrimestre !== "2") {
        return res.status(400).json({
          success: false,
          message: "El cuatrimestre debe ser 1 o 2",
        });
      }

      // 2. Preparar parámetros (SIMPLIFICADO)
      // El orden debe coincidir con los '?' de la nueva consulta (CTE + Query Principal)
      const params = [
        id_materia, // 1. CTE: id_materia
        anio_lectivo, // 2. CTE: anio_lectivo
        id_materia, // 3. JOIN cal: id_materia
        anio_lectivo, // 4. JOIN cal: anio_lectivo
        cuatrimestre, // 5. JOIN cal: cuatrimestre
        id_curso, // 6. WHERE: id_curso
        anio_lectivo, // 7. WHERE: anio_lectivo
      ];

      // 3. Ejecutar consulta (SIN CAMBIOS)
      const [alumnos] = await pool.query(
        consultaCurso.obtenerAlumnosPorCurso, // <- (Debe tener la query con CTE)
        params
      );

      // 4. Transformar datos a formato JSON estructurado (LEVEMENTE SIMPLIFICADO)
      const alumnosFormateados = alumnos.map((alumno) => ({
        alumno: {
          id: alumno.id_alumno,
          dni: alumno.dni_alumno,
          nombre: alumno.nombre_alumno,
          apellido: alumno.apellido_alumno,
          nombreCompleto: `${alumno.apellido_alumno}, ${alumno.nombre_alumno}`,
        },
        calificaciones: alumno.id_calificacion ? {
          id: alumno.id_calificacion,
          nota1: alumno.nota_1,
          nota2: alumno.nota_2,
          nota3: alumno.nota_3,
          promedio: alumno.promedio_cuatrimestre,
          periodoComplementario: alumno.periodo_complementario, // <-- NUEVO
          definitiva: alumno.calificacion_definitiva,       // <-- NUEVO
          estado: alumno.estado_calificacion
        } : null,
        asistencias: {
          // Usamos parseInt por si mysql2 devuelve strings,
          // pero ya no necesitamos '|| 0' gracias a COALESCE
          presentes: parseInt(alumno.presentes),
          ausentes: parseInt(alumno.ausentes),
          tardes: parseInt(alumno.tardes),
          total:
            parseInt(alumno.presentes) +
            parseInt(alumno.ausentes) +
            parseInt(alumno.tardes),
        },

        // --- AQUÍ ESTÁ LA MODIFICACIÓN ---
        // Añadimos un objeto 'tutor'
        // Es condicional: si 'email_tutor' no es null, crea el objeto.
        tutor: alumno.email_tutor
          ? {
              email: alumno.email_tutor,
              nombre: alumno.nombre_tutor,
              apellido: alumno.apellido_tutor,
              nombreCompleto: `${alumno.apellido_tutor || ""}, ${
                alumno.nombre_tutor || ""
              }`
                .replace(/^, /, "")
                .replace(/, $/, ""), // Maneja nulos
            }
          : null,
      }));

      // 5. Enviar respuesta exitosa (SIN CAMBIOS)
      res.status(200).json({
        success: true,
        data: {
          filtros: {
            curso: parseInt(id_curso),
            materia: parseInt(id_materia),
            anioLectivo: parseInt(anio_lectivo),
            cuatrimestre: parseInt(cuatrimestre),
          },
          totalAlumnos: alumnosFormateados.length,
          alumnos: alumnosFormateados,
        },
      });
    } catch (error) {
      // 1. Muestra el error COMPLETO en la consola de Node.js
      console.error("Error en obtenerAlumnosPorCurso:", error);

      res.status(500).json({
        success: false,
        message: "Error al obtener los alumnos del curso",

        // 2. Envía el mensaje de error de SQL al frontend
        // (SOLO EN DESARROLLO)
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
        sqlError:
          process.env.NODE_ENV === "development" ? error.sqlMessage : undefined, // <-- ¡ESTE ES EL IMPORTANTE!
      });
    }
  },
};

module.exports = consultaController;
