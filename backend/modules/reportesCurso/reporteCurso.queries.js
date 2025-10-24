/**
 * Consultas SQL para el módulo de Consultas Académicas
 */

const consultaCurso = {
  /**
   * Obtiene la lista de alumnos con sus calificaciones y asistencias por curso
   * @params: id_materia, anio_lectivo (x6), id_curso, cuatrimestre
   */
  obtenerAlumnosPorCurso: `
    SELECT 
      a.id_alumno,
      a.dni_alumno,
      a.nombre_alumno,
      a.apellido_alumno,
      cal.nota_1,
      cal.nota_2,
      cal.nota_3,
      cal.promedio_cuatrimestre,
      cal.id_calificacion,
      (SELECT COUNT(*) 
       FROM asistencia_alumno aa 
       WHERE aa.id_alumno = a.id_alumno 
         AND aa.id_materia = ? 
         AND aa.anio_lectivo = ? 
         AND aa.estado = 'presente') AS presentes,
      (SELECT COUNT(*) 
       FROM asistencia_alumno aa 
       WHERE aa.id_alumno = a.id_alumno 
         AND aa.id_materia = ? 
         AND aa.anio_lectivo = ? 
         AND aa.estado = 'ausente') AS ausentes,
      (SELECT COUNT(*) 
       FROM asistencia_alumno aa 
       WHERE aa.id_alumno = a.id_alumno 
         AND aa.id_materia = ? 
         AND aa.anio_lectivo = ? 
         AND aa.estado = 'tarde') AS tardes
    FROM alumno_curso ac
    JOIN alumno a ON ac.id_alumno = a.id_alumno
    LEFT JOIN calificacion cal 
      ON a.id_alumno = cal.id_alumno 
      AND cal.id_curso = ac.id_curso 
      AND cal.id_materia = ? 
      AND cal.anio_lectivo = ? 
      AND cal.cuatrimestre = ?
    WHERE ac.id_curso = ? 
      AND ac.anio_lectivo = ? 
      AND a.estado = 'activo'
    ORDER BY a.apellido_alumno, a.nombre_alumno
  `
};

module.exports = consultaCurso;