const consultasCursos = {
  // Obtener todos los cursos activos CON DATOS DEL TUTOR
  obtenerTodos: `
    SELECT 
      c.id_curso, 
      c.nombre, 
      c.anio, 
      c.division, 
      c.turno, 
      c.id_docente_tutor, 
      c.estado, 
      c.created_at, 
      c.updated_at,
      d.nombre AS tutor_nombre,
      d.apellido AS tutor_apellido
    FROM curso c
    LEFT JOIN docente d ON c.id_docente_tutor = d.id_docente
    WHERE c.deleted_at IS NULL
  `,

  // Obtener un curso por ID CON DATOS DEL TUTOR
  obtenerPorId: `
    SELECT 
      c.id_curso, 
      c.nombre, 
      c.anio, 
      c.division, 
      c.turno, 
      c.id_docente_tutor, 
      c.estado, 
      c.created_at, 
      c.updated_at,
      d.nombre AS tutor_nombre,
      d.apellido AS tutor_apellido
    FROM curso c
    LEFT JOIN docente d ON c.id_docente_tutor = d.id_docente
    WHERE c.id_curso = ? AND c.deleted_at IS NULL
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

  // Obtener cursos eliminados CON DATOS DEL TUTOR
  obtenerEliminados: `
    SELECT 
      c.id_curso, 
      c.nombre, 
      c.anio, 
      c.division, 
      c.turno, 
      c.id_docente_tutor, 
      c.estado, 
      c.created_at, 
      c.updated_at,
      c.deleted_at,
      d.nombre AS tutor_nombre,
      d.apellido AS tutor_apellido
    FROM curso c
    LEFT JOIN docente d ON c.id_docente_tutor = d.id_docente
    WHERE c.deleted_at IS NOT NULL
    ORDER BY c.deleted_at DESC
  `,

  // Restaurar un curso eliminado
  restaurar: `
    UPDATE curso 
    SET deleted_at = NULL 
    WHERE id_curso = ? AND deleted_at IS NOT NULL
  `,


obtenerValoresEnumTurno: `SHOW COLUMNS FROM curso LIKE 'turno'`,
  obtenerValoresEnumEstado: `SHOW COLUMNS FROM curso LIKE 'estado'`
};

module.exports = consultasCursos;