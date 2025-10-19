// calificacion.queries.js
const consultasCalificaciones = {
  // Obtener todas las calificaciones activas
  obtenerTodas: `
    SELECT 
      id_calificacion,
      id_alumno,
      id_materia,
      id_docente,
      id_curso,
      anio_lectivo,
      cuatrimestre,
      nota_1,
      nota_2,
      nota_3,
      promedio_cuatrimestre,
      periodo_complementario,
      calificacion_definitiva,
      estado,
      created_at,
      updated_at
    FROM calificacion
    WHERE deleted_at IS NULL
  `,

  // Obtener una calificación por ID
  obtenerPorId: `
    SELECT 
      id_calificacion,
      id_alumno,
      id_materia,
      id_docente,
      id_curso,
      anio_lectivo,
      cuatrimestre,
      nota_1,
      nota_2,
      nota_3,
      promedio_cuatrimestre,
      periodo_complementario,
      calificacion_definitiva,
      estado,
      created_at,
      updated_at
    FROM calificacion 
    WHERE id_calificacion = ? AND deleted_at IS NULL
  `,

  // Crear una nueva calificación
  crear: `
    INSERT INTO calificacion 
      (id_alumno, id_materia, id_docente, id_curso, anio_lectivo, cuatrimestre, 
       nota_1, nota_2, nota_3, promedio_cuatrimestre, periodo_complementario, 
       calificacion_definitiva, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  // Actualizar una calificación completa
  actualizarCompleto: `
    UPDATE calificacion
    SET 
      id_alumno = ?,
      id_materia = ?,
      id_docente = ?,
      id_curso = ?,
      anio_lectivo = ?,
      cuatrimestre = ?,
      nota_1 = ?,
      nota_2 = ?,
      nota_3 = ?,
      promedio_cuatrimestre = ?,
      periodo_complementario = ?,
      calificacion_definitiva = ?,
      estado = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id_calificacion = ? AND deleted_at IS NULL
  `,

// Agregar después de actualizarCompleto:

actualizarParcial: `
  UPDATE calificacion
  SET 
    nota_1 = COALESCE(?, nota_1),
    nota_2 = COALESCE(?, nota_2),
    nota_3 = COALESCE(?, nota_3),
    promedio_cuatrimestre = COALESCE(?, promedio_cuatrimestre),
    periodo_complementario = COALESCE(?, periodo_complementario),
    calificacion_definitiva = COALESCE(?, calificacion_definitiva),
    estado = COALESCE(?, estado),
    updated_at = CURRENT_TIMESTAMP
  WHERE id_calificacion = ? AND deleted_at IS NULL
`,

  // Eliminar lógicamente una calificación
  eliminarLogico: `
    UPDATE calificacion 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_calificacion = ? AND deleted_at IS NULL
  `,

  // Obtener calificaciones eliminadas
  obtenerEliminadas: `
    SELECT 
      id_calificacion,
      id_alumno,
      id_materia,
      id_docente,
      id_curso,
      anio_lectivo,
      cuatrimestre,
      nota_1,
      nota_2,
      nota_3,
      promedio_cuatrimestre,
      periodo_complementario,
      calificacion_definitiva,
      estado,
      created_at,
      updated_at,
      deleted_at
    FROM calificacion
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `,

  // Restaurar una calificación eliminada
  restaurar: `
    UPDATE calificacion 
    SET deleted_at = NULL 
    WHERE id_calificacion = ? AND deleted_at IS NOT NULL
  `
};

module.exports = consultasCalificaciones;