const pool = require('../../config/db');

const queriesPrevias = {

  /**
   * Obtiene alumnos en estado 'previa' con su historial de intentos
   */
  obtenerAlumnosPreviasPorCurso: async (idCurso, idMateria, anioLectivo) => {
    const query = `
      SELECT 
        a.id_alumno,
        a.dni_alumno as dni,
        CONCAT(a.apellido_alumno, ', ', a.nombre_alumno) as nombreCompleto,
        ame.calificacion_final,
        ame.fecha_estado,
        GROUP_CONCAT(
          CONCAT(
            p.id_previa, '|',
            p.fecha_examen, '|',
            p.nota_obtenida, '|',
            p.aprobada
          ) 
          ORDER BY p.fecha_examen DESC
          SEPARATOR ';;'
        ) as intentos
      FROM alumno a
      INNER JOIN alumno_materia_estado ame 
        ON a.id_alumno = ame.id_alumno
      LEFT JOIN previa p
        ON a.id_alumno = p.id_alumno
        AND ame.id_materia = p.id_materia
        AND ame.id_curso = p.id_curso
        AND ame.anio_lectivo = p.anio_lectivo
        AND p.deleted_at IS NULL
      WHERE ame.id_curso = ?
        AND ame.id_materia = ?
        AND ame.anio_lectivo = ?
        AND ame.estado = 'previa'
        AND a.deleted_at IS NULL
        AND ame.deleted_at IS NULL
      GROUP BY a.id_alumno, a.dni_alumno, a.apellido_alumno, a.nombre_alumno, 
               ame.calificacion_final, ame.fecha_estado
      ORDER BY a.apellido_alumno, a.nombre_alumno
    `;
    
    const [rows] = await pool.query(query, [idCurso, idMateria, anioLectivo]);
    
    // Procesar los intentos concatenados
    return rows.map(alumno => {
      let intentos = [];
      if (alumno.intentos) {
        intentos = alumno.intentos.split(';;').map(intento => {
          const [id, fecha, nota, aprobada] = intento.split('|');
          return {
            id_previa: parseInt(id),
            fecha_examen: fecha,
            nota_obtenida: parseFloat(nota),
            aprobada: parseInt(aprobada) === 1
          };
        });
      }
      
      return {
        ...alumno,
        intentos
      };
    });
  },

  /**
   * Inserta un nuevo intento de previa
   */
  insertarIntentoPrevia: async (datosPrevia) => {
    const query = `
      INSERT INTO previa 
        (id_alumno, id_materia, id_curso, id_docente, anio_lectivo, 
         fecha_examen, nota_obtenida, aprobada, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const aprobada = datosPrevia.nota_obtenida >= 6 ? 1 : 0;
    
    const [result] = await pool.query(query, [
      datosPrevia.id_alumno,
      datosPrevia.id_materia,
      datosPrevia.id_curso,
      datosPrevia.id_docente,
      datosPrevia.anio_lectivo,
      datosPrevia.fecha_examen,
      datosPrevia.nota_obtenida,
      aprobada
    ]);
    
    return result.insertId;
  },

  /**
   * Obtiene alumnos que aprobaron por previa (historial)
   */
  obtenerAlumnosAprobadosPorPrevia: async (idCurso, idMateria, anioLectivo) => {
    const query = `
      SELECT 
        a.id_alumno,
        a.dni_alumno as dni,
        CONCAT(a.apellido_alumno, ', ', a.nombre_alumno) as nombreCompleto,
        ame.calificacion_final as nota_final,
        ame.fecha_estado as fecha_aprobacion,
        p.fecha_examen as fecha_ultimo_intento,
        p.nota_obtenida as nota_aprobacion,
        COUNT(p2.id_previa) as total_intentos
      FROM alumno a
      INNER JOIN alumno_materia_estado ame 
        ON a.id_alumno = ame.id_alumno
      LEFT JOIN previa p
        ON a.id_alumno = p.id_alumno
        AND ame.id_materia = p.id_materia
        AND ame.id_curso = p.id_curso
        AND ame.anio_lectivo = p.anio_lectivo
        AND p.aprobada = 1
        AND p.deleted_at IS NULL
      LEFT JOIN previa p2
        ON a.id_alumno = p2.id_alumno
        AND ame.id_materia = p2.id_materia
        AND ame.id_curso = p2.id_curso
        AND ame.anio_lectivo = p2.anio_lectivo
        AND p2.deleted_at IS NULL
      WHERE ame.id_curso = ?
        AND ame.id_materia = ?
        AND ame.anio_lectivo = ?
        AND ame.estado = 'aprobada'
        AND p.id_previa IS NOT NULL
        AND a.deleted_at IS NULL
        AND ame.deleted_at IS NULL
      GROUP BY a.id_alumno, a.dni_alumno, a.apellido_alumno, a.nombre_alumno,
               ame.calificacion_final, ame.fecha_estado, p.fecha_examen, p.nota_obtenida
      ORDER BY ame.fecha_estado DESC, a.apellido_alumno, a.nombre_alumno
    `;
    
    const [rows] = await pool.query(query, [idCurso, idMateria, anioLectivo]);
    return rows;
  },

  /**
   * Actualiza estado de alumno_materia_estado
   */
  actualizarEstadoMateria: async (idAlumno, idMateria, idCurso, anioLectivo, estado, calificacionFinal = null) => {
    let query = `
      UPDATE alumno_materia_estado
      SET estado = ?, updated_at = NOW()
    `;
    
    const params = [estado];
    
    if (calificacionFinal !== null) {
      query += `, calificacion_final = ?`;
      params.push(calificacionFinal);
    }
    
    query += `
      WHERE id_alumno = ?
        AND id_materia = ?
        AND id_curso = ?
        AND anio_lectivo = ?
        AND deleted_at IS NULL
    `;
    
    params.push(idAlumno, idMateria, idCurso, anioLectivo);
    
    const [result] = await pool.query(query, params);
    return result.affectedRows;
  }
};

module.exports = queriesPrevias;
