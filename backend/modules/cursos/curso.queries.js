// curso.queries.js
const consultasCursos = {
  // Obtener todos los cursos activos
  obtenerTodos: `
    SELECT 
      id_curso, 
      nombre, 
      anio, 
      division, 
      turno, 
      id_docente_tutor, 
      estado, 
      created_at, 
      updated_at
    FROM curso
    WHERE deleted_at IS NULL
  `,

  // Obtener un curso por ID
  obtenerPorId: `
    SELECT 
      id_curso, 
      nombre, 
      anio, 
      division, 
      turno, 
      id_docente_tutor, 
      estado, 
      created_at, 
      updated_at
    FROM curso 
    WHERE id_curso = ? AND deleted_at IS NULL
  `,

  // Crear un nuevo curso
  crear: `
    INSERT INTO curso 
      (nombre, anio, division, turno, id_docente_tutor, estado)
    VALUES (?, ?, ?, ?, ?, ?)
  `,

  // Actualizar un curso completo
  actualizarCompleto: `
    UPDATE curso
    SET 
      nombre = ?, 
      anio = ?, 
      division = ?, 
      turno = ?, 
      id_docente_tutor = ?, 
      estado = ?, 
      updated_at = CURRENT_TIMESTAMP
    WHERE id_curso = ? AND deleted_at IS NULL
  `,

  // Eliminar lógicamente un curso
  eliminarLogico: `
    UPDATE curso 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_curso = ? AND deleted_at IS NULL
  `,

  // Obtener cursos eliminados
  obtenerEliminados: `
    SELECT 
      id_curso, 
      nombre, 
      anio, 
      division, 
      turno, 
      id_docente_tutor, 
      estado, 
      created_at, 
      updated_at,
      deleted_at
    FROM curso
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `,

  // Restaurar un curso eliminado
  restaurar: `
    UPDATE curso 
    SET deleted_at = NULL 
    WHERE id_curso = ? AND deleted_at IS NOT NULL
  `
};

module.exports = consultasCursos;