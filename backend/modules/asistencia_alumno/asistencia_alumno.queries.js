const consultasAsistencia = {
  // --- CRUD Básico ---
  obtenerPorId: `
    SELECT * FROM asistencia_alumno 
    WHERE id_asistencia = ? AND deleted_at IS NULL
  `,

  crear: `
    INSERT INTO asistencia_alumno (
      id_alumno, id_materia, id_curso, id_docente, 
      anio_lectivo, fecha_clase, estado
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,

  actualizar: `
    UPDATE asistencia_alumno 
    SET estado = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id_asistencia = ? AND deleted_at IS NULL
  `,

  eliminarLogico: `
    UPDATE asistencia_alumno 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_asistencia = ? AND deleted_at IS NULL
  `,

  obtenerEliminados: `
    SELECT * FROM asistencia_alumno 
    WHERE deleted_at IS NOT NULL 
    ORDER BY deleted_at DESC
  `,

  restaurar: `
    UPDATE asistencia_alumno 
    SET deleted_at = NULL 
    WHERE id_asistencia = ? AND deleted_at IS NOT NULL
  `,

  // --- Negocio ---
  listaClasePorDia: `
    SELECT 
      a.id_alumno,
      a.apellido_alumno,
      a.nombre_alumno,
      aa.id_asistencia, 
      aa.estado
    FROM 
      alumno_curso ac
    JOIN 
      alumno a ON ac.id_alumno = a.id_alumno
    LEFT JOIN 
      asistencia_alumno aa ON ac.id_alumno = aa.id_alumno
        AND aa.id_materia = ?
        AND aa.fecha_clase = ?
        AND aa.anio_lectivo = ?
        AND aa.deleted_at IS NULL
    WHERE 
      ac.id_curso = ?
      AND ac.anio_lectivo = ?
      AND a.estado = 'activo'
      AND a.deleted_at IS NULL
    ORDER BY 
      a.apellido_alumno, a.nombre_alumno
  `,

  reportePorAlumno: `
    SELECT 
      m.nombre AS materia,
      COUNT(CASE WHEN aa.estado = 'presente' THEN 1 END) AS presentes,
      COUNT(CASE WHEN aa.estado = 'ausente' THEN 1 END) AS ausentes,
      COUNT(CASE WHEN aa.estado = 'tarde' THEN 1 END) AS tardes,
      COUNT(CASE WHEN aa.estado = 'justificada' THEN 1 END) AS justificadas,
      (COUNT(CASE WHEN aa.estado IN ('presente','tarde','justificada') THEN 1 END)*100)/COUNT(*) AS porcentaje_asistencia,
      COUNT(*) AS total_clases_registradas
    FROM asistencia_alumno aa
    JOIN materia m ON aa.id_materia = m.id_materia
    WHERE aa.id_alumno = ? AND aa.anio_lectivo = ? AND aa.deleted_at IS NULL
    GROUP BY m.id_materia, m.nombre
    ORDER BY m.nombre
  `,

  upsertMasivo: `
    INSERT INTO asistencia_alumno (
      id_alumno, id_materia, id_curso, id_docente, 
      anio_lectivo, fecha_clase, estado, deleted_at
    ) 
    VALUES ?
    ON DUPLICATE KEY UPDATE 
      estado = VALUES(estado), 
      updated_at = CURRENT_TIMESTAMP,
      deleted_at = NULL
  `
};

module.exports = consultasAsistencia;
