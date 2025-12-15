const pool = require('../../config/db');

const queriesExamenFinal = {
  
  /**
   * Obtiene alumnos que están en estado 'final' para un curso y materia específicos
   */
  obtenerAlumnosEnEstadoFinal: async (idCurso, idMateria, anioLectivo) => {
    const query = `
      SELECT 
        a.id_alumno,
        a.dni_alumno as dni,
        CONCAT(a.apellido_alumno, ', ', a.nombre_alumno) as nombreCompleto,
        ame.estado,
        ame.calificacion_final,
        ame.fecha_estado
      FROM alumno a
      INNER JOIN alumno_materia_estado ame 
        ON a.id_alumno = ame.id_alumno
      WHERE ame.id_curso = ?
        AND ame.id_materia = ?
        AND ame.anio_lectivo = ?
        AND ame.estado = 'final'
        AND a.deleted_at IS NULL
        AND ame.deleted_at IS NULL
      ORDER BY a.apellido_alumno, a.nombre_alumno
    `;
    
    const [rows] = await pool.query(query, [idCurso, idMateria, anioLectivo]);
    return rows;
  },

  /**
   * Obtiene historial completo de alumnos que rindieron exámenes finales
   * Incluye tanto los que aprobaron como los que pasaron a previa
   */
  obtenerAlumnosAprobadosPorFinal: async (idCurso, idMateria, anioLectivo) => {
    const query = `
      SELECT 
        a.id_alumno,
        a.dni_alumno as dni,
        CONCAT(a.apellido_alumno, ', ', a.nombre_alumno) as nombreCompleto,
        ame.estado,
        ame.calificacion_final,
        ame.fecha_estado,
        efDic.nota_obtenida as nota_diciembre,
        efDic.aprobada as aprobada_diciembre,
        efDic.fecha_examen as fecha_diciembre,
        efFeb.nota_obtenida as nota_febrero,
        efFeb.aprobada as aprobada_febrero,
        efFeb.fecha_examen as fecha_febrero,
        efMar.nota_obtenida as nota_marzo,
        efMar.aprobada as aprobada_marzo,
        efMar.fecha_examen as fecha_marzo
      FROM alumno a
      INNER JOIN alumno_materia_estado ame 
        ON a.id_alumno = ame.id_alumno
      LEFT JOIN examen_final efDic
        ON a.id_alumno = efDic.id_alumno
        AND ame.id_materia = efDic.id_materia
        AND ame.id_curso = efDic.id_curso
        AND ame.anio_lectivo = efDic.anio_lectivo
        AND efDic.instancia = 'diciembre'
        AND efDic.deleted_at IS NULL
      LEFT JOIN examen_final efFeb
        ON a.id_alumno = efFeb.id_alumno
        AND ame.id_materia = efFeb.id_materia
        AND ame.id_curso = efFeb.id_curso
        AND ame.anio_lectivo = efFeb.anio_lectivo
        AND efFeb.instancia = 'febrero'
        AND efFeb.deleted_at IS NULL
      LEFT JOIN examen_final efMar
        ON a.id_alumno = efMar.id_alumno
        AND ame.id_materia = efMar.id_materia
        AND ame.id_curso = efMar.id_curso
        AND ame.anio_lectivo = efMar.anio_lectivo
        AND efMar.instancia = 'marzo'
        AND efMar.deleted_at IS NULL
      WHERE ame.id_curso = ?
        AND ame.id_materia = ?
        AND ame.anio_lectivo = ?
        AND (ame.estado = 'aprobada' OR ame.estado = 'previa')
        AND (efDic.id_examen_final IS NOT NULL 
             OR efFeb.id_examen_final IS NOT NULL 
             OR efMar.id_examen_final IS NOT NULL)
        AND a.deleted_at IS NULL
        AND ame.deleted_at IS NULL
      ORDER BY ame.fecha_estado DESC, a.apellido_alumno, a.nombre_alumno
    `;
    
    const [rows] = await pool.query(query, [idCurso, idMateria, anioLectivo]);
    return rows;
  },

  /**
   * Inserta un nuevo registro de examen final
   */
  insertarExamenFinal: async (datosExamen) => {
    const query = `
      INSERT INTO examen_final 
        (id_alumno, id_materia, id_curso, anio_lectivo, instancia, 
         fecha_examen, id_docente, nota_obtenida, aprobada)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const aprobada = datosExamen.nota_obtenida >= 6 ? 1 : 0;
    
    const [result] = await pool.query(query, [
      datosExamen.id_alumno,
      datosExamen.id_materia,
      datosExamen.id_curso,
      datosExamen.anio_lectivo,
      datosExamen.instancia,
      datosExamen.fecha_examen,
      datosExamen.id_docente,
      datosExamen.nota_obtenida,
      aprobada
    ]);
    
    return result.insertId;
  },

  /**
   * Obtiene el historial de exámenes finales de un alumno en una materia
   */
  obtenerHistorialExamenes: async (idAlumno, idMateria, anioLectivo) => {
    const query = `
      SELECT 
        id_examen_final,
        instancia,
        fecha_examen,
        nota_obtenida,
        aprobada,
        created_at
      FROM examen_final
      WHERE id_alumno = ?
        AND id_materia = ?
        AND anio_lectivo = ?
        AND deleted_at IS NULL
      ORDER BY 
        FIELD(instancia, 'diciembre', 'febrero', 'marzo'),
        created_at ASC
    `;
    
    const [rows] = await pool.query(query, [idAlumno, idMateria, anioLectivo]);
    return rows;
  },

  /**
   * Verifica si ya existe un examen para una instancia específica
   */
  verificarExamenExistente: async (idAlumno, idMateria, anioLectivo, instancia) => {
    const query = `
      SELECT COUNT(*) as count
      FROM examen_final
      WHERE id_alumno = ?
        AND id_materia = ?
        AND anio_lectivo = ?
        AND instancia = ?
        AND deleted_at IS NULL
    `;
    
    const [rows] = await pool.query(query, [idAlumno, idMateria, anioLectivo, instancia]);
    return rows[0].count > 0;
  },

  /**
   * Actualiza el estado de alumno_materia_estado
   */
  actualizarEstadoMateria: async (idAlumno, idMateria, anioLectivo, nuevoEstado, calificacionFinal = null) => {
    let query;
    let params;
    
    if (calificacionFinal !== null) {
      query = `
        UPDATE alumno_materia_estado
        SET estado = ?,
            calificacion_final = ?,
            fecha_estado = CURDATE(),
            updated_at = NOW()
        WHERE id_alumno = ?
          AND id_materia = ?
          AND anio_lectivo = ?
      `;
      params = [nuevoEstado, calificacionFinal, idAlumno, idMateria, anioLectivo];
    } else {
      query = `
        UPDATE alumno_materia_estado
        SET estado = ?,
            fecha_estado = CURDATE(),
            updated_at = NOW()
        WHERE id_alumno = ?
          AND id_materia = ?
          AND anio_lectivo = ?
      `;
      params = [nuevoEstado, idAlumno, idMateria, anioLectivo];
    }
    
    const [result] = await pool.query(query, params);
    return result.affectedRows > 0;
  },

  /**
   * Cuenta cuántos exámenes finales ha rendido un alumno en una materia
   */
  contarExamenesRendidos: async (idAlumno, idMateria, anioLectivo) => {
    const query = `
      SELECT COUNT(*) as count
      FROM examen_final
      WHERE id_alumno = ?
        AND id_materia = ?
        AND anio_lectivo = ?
        AND deleted_at IS NULL
    `;
    
    const [rows] = await pool.query(query, [idAlumno, idMateria, anioLectivo]);
    return rows[0].count;
  }
};

module.exports = queriesExamenFinal;
