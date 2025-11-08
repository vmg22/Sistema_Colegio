/**
 * Consultas SQL para el módulo de Matrículas (tabla 'alumno_curso')
 */
const consultasMatriculas = {
  // Crear una nueva matrícula
  crear: `
    INSERT INTO alumno_curso 
      (id_alumno, id_curso, anio_lectivo, estado, fecha_inscripcion)
    VALUES (?, ?, ?, ?, CURDATE())
  `,

  // Obtener todas las matrículas (con datos de alumno y curso)
  obtenerTodos: `
    SELECT 
      i.id_alumno_curso, i.anio_lectivo, i.estado, i.fecha_inscripcion AS fecha_matricula,
      a.id_alumno, 
      a.nombre_alumno AS alumno_nombre,      /* <-- AJUSTADO */
      a.apellido_alumno AS alumno_apellido,  /* <-- AJUSTADO */
      a.dni_alumno AS alumno_dni,            /* <-- AJUSTADO */
      c.id_curso, c.anio AS curso_anio, c.division AS curso_division, c.turno AS curso_turno
    FROM alumno_curso i
    JOIN alumno a ON i.id_alumno = a.id_alumno
    JOIN curso c ON i.id_curso = c.id_curso
    WHERE i.deleted_at IS NULL
  `,

  // Obtener una matrícula por ID
  obtenerPorId: `
    SELECT 
      i.id_alumno_curso, i.anio_lectivo, i.estado, i.fecha_inscripcion AS fecha_matricula,
      a.id_alumno, 
      a.nombre_alumno AS alumno_nombre,      /* <-- AJUSTADO */
      a.apellido_alumno AS alumno_apellido,  /* <-- AJUSTADO */
      a.dni_alumno AS alumno_dni,            /* <-- AJUSTADO */
      c.id_curso, c.anio AS curso_anio, c.division AS curso_division
    FROM alumno_curso i
    JOIN alumno a ON i.id_alumno = a.id_alumno
    JOIN curso c ON i.id_curso = c.id_curso
    WHERE i.id_alumno_curso = ? AND i.deleted_at IS NULL
  `,

  // Verificar si un alumno ya está matriculado en un curso ese mismo año
  verificarExistencia: `
    SELECT id_alumno_curso 
    FROM alumno_curso 
    WHERE id_alumno = ? AND id_curso = ? AND anio_lectivo = ? AND deleted_at IS NULL
  `,

  // Actualizar estado o año de una matrícula
  actualizar: `
    UPDATE alumno_curso
    SET anio_lectivo = ?, estado = ?
    WHERE id_alumno_curso = ? AND deleted_at IS NULL
  `,

  // Soft delete (Dar de baja matrícula)
  eliminarLogico: `
    UPDATE alumno_curso 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_alumno_curso = ? AND deleted_at IS NULL
  `,

  // Restaurar matrícula
  restaurar: `
    UPDATE alumno_curso 
    SET deleted_at = NULL 
    WHERE id_alumno_curso = ?
  `,
  
  // Obtener matrículas dadas de baja
  obtenerEliminados: `
     SELECT 
        i.*, 
        a.nombre_alumno as alumno_nombre,      /* <-- AJUSTADO */
        a.apellido_alumno as alumno_apellido,  /* <-- AJUSTADO */
        c.anio, c.division
     FROM alumno_curso i
     JOIN alumno a ON i.id_alumno = a.id_alumno
     JOIN curso c ON i.id_curso = c.id_curso
     WHERE i.deleted_at IS NOT NULL
  `
};

module.exports = consultasMatriculas;