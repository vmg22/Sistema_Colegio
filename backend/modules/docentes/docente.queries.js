// docente.queries.js
const consultasDocentes = {
  // Obtener todos los docentes activos
  obtenerTodos: `
    SELECT 
      id_docente, 
      id_usuario, 
      dni_docente, 
      nombre, 
      apellido, 
      email, 
      telefono, 
      especialidad, 
      estado, 
      created_at, 
      updated_at
    FROM docente
    WHERE deleted_at IS NULL
  `,

  // Obtener un docente por ID
  obtenerPorId: `
    SELECT 
      id_docente, 
      id_usuario, 
      dni_docente, 
      nombre, 
      apellido, 
      email, 
      telefono, 
      especialidad, 
      estado, 
      created_at, 
      updated_at
    FROM docente 
    WHERE id_docente = ? AND deleted_at IS NULL
  `,

  // Crear un nuevo docente
  crear: `
    INSERT INTO docente 
      (id_usuario, dni_docente, nombre, apellido, email, telefono, especialidad, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,

  // Actualizar un docente completo
  actualizarCompleto: `
    UPDATE docente
    SET 
      id_usuario = ?, 
      dni_docente = ?, 
      nombre = ?, 
      apellido = ?, 
      email = ?, 
      telefono = ?, 
      especialidad = ?, 
      estado = ?, 
      updated_at = CURRENT_TIMESTAMP
    WHERE id_docente = ? AND deleted_at IS NULL
  `,

  // Eliminar lógicamente un docente
  eliminarLogico: `
    UPDATE docente 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_docente = ? AND deleted_at IS NULL
  `,

  // Obtener docentes eliminados
  obtenerEliminados: `
    SELECT 
      id_docente, 
      id_usuario, 
      dni_docente, 
      nombre, 
      apellido, 
      email, 
      telefono, 
      especialidad, 
      estado, 
      created_at, 
      updated_at,
      deleted_at
    FROM docente
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `,

  // Restaurar un docente eliminado
  restaurar: `
    UPDATE docente 
    SET deleted_at = NULL 
    WHERE id_docente = ? AND deleted_at IS NOT NULL
  `,

  // ============================================================
  // NUEVOS QUERIES PARA FILTRADO POR DOCENTE
  // ============================================================

  // Obtener materias asignadas a un docente
  obtenerMateriasPorDocente: `
    SELECT DISTINCT 
      m.id_materia, 
      m.nombre AS materia_nombre,
      m.descripcion,
      m.carga_horaria,
      m.nivel,
      m.ciclo
    FROM docente_curso_materia dcm
    JOIN materia m ON dcm.id_materia = m.id_materia
    WHERE dcm.id_docente = ?
      AND dcm.estado = 'activo'
      AND dcm.deleted_at IS NULL
      AND m.deleted_at IS NULL
    ORDER BY m.nombre
  `,

  // Obtener cursos asignados a un docente
  obtenerCursosPorDocente: `
    SELECT DISTINCT 
      c.id_curso,
      c.nombre AS curso_nombre,
      c.anio,
      c.division,
      c.turno,
      dcm.id_materia,
      m.nombre AS materia_nombre
    FROM docente_curso_materia dcm
    JOIN curso c ON dcm.id_curso = c.id_curso
    JOIN materia m ON dcm.id_materia = m.id_materia
    WHERE dcm.id_docente = ?
      AND dcm.estado = 'activo'
    ORDER BY c.anio, c.division
  `,

  // Obtener cursos de un docente filtrados por materia
  obtenerCursosPorDocenteYMateria: `
    SELECT DISTINCT 
      c.id_curso,
      c.nombre AS curso_nombre,
      c.anio,
      c.division,
      c.turno
    FROM docente_curso_materia dcm
    JOIN curso c ON dcm.id_curso = c.id_curso
    WHERE dcm.id_docente = ?
      AND dcm.id_materia = ?
      AND dcm.estado = 'activo'
      AND dcm.deleted_at IS NULL
      AND c.deleted_at IS NULL
    ORDER BY c.anio, c.division
  `,

  // Obtener alumnos de los cursos donde el docente dicta
  obtenerAlumnosPorDocente: `
    SELECT DISTINCT 
      a.id_alumno,
      a.dni_alumno,
      a.nombre,
      a.apellido,
      a.email,
      a.telefono,
      a.fecha_nacimiento
    FROM alumno a
    JOIN alumno_curso ac ON a.id_alumno = ac.id_alumno
    JOIN docente_curso_materia dcm ON ac.id_curso = dcm.id_curso
    WHERE dcm.id_docente = ?
      AND dcm.estado = 'activo'
      AND dcm.deleted_at IS NULL
      AND ac.deleted_at IS NULL
      AND a.deleted_at IS NULL
    ORDER BY a.apellido, a.nombre
  `,

  // Obtener alumnos de un curso específico donde el docente dicta
  obtenerAlumnosPorDocenteYCurso: `
    SELECT DISTINCT 
      a.id_alumno,
      a.dni_alumno,
      a.nombre,
      a.apellido,
      a.email,
      a.telefono,
      a.fecha_nacimiento
    FROM alumno a
    JOIN alumno_curso ac ON a.id_alumno = ac.id_alumno
    JOIN docente_curso_materia dcm ON ac.id_curso = dcm.id_curso
    WHERE dcm.id_docente = ?
      AND dcm.id_curso = ?
      AND dcm.estado = 'activo'
      AND dcm.deleted_at IS NULL
      AND ac.deleted_at IS NULL
      AND a.deleted_at IS NULL
    ORDER BY a.apellido, a.nombre
  `,

  // Verificar si un docente tiene acceso a un alumno específico
  verificarAccesoAlumno: `
    SELECT COUNT(*) as tiene_acceso
    FROM alumno_curso ac
    JOIN docente_curso_materia dcm ON ac.id_curso = dcm.id_curso
    WHERE dcm.id_docente = ?
      AND ac.id_alumno = ?
      AND dcm.estado = 'activo'
      AND dcm.deleted_at IS NULL
      AND ac.deleted_at IS NULL
  `,

  // Verificar si un docente tiene acceso a un curso específico
  verificarAccesoCurso: `
    SELECT COUNT(*) as tiene_acceso
    FROM docente_curso_materia dcm
    WHERE dcm.id_docente = ?
      AND dcm.id_curso = ?
      AND dcm.estado = 'activo'
      AND dcm.deleted_at IS NULL
  `,

  // Verificar si un docente tiene acceso a una materia específica
  verificarAccesoMateria: `
    SELECT COUNT(*) as tiene_acceso
    FROM docente_curso_materia dcm
    WHERE dcm.id_docente = ?
      AND dcm.id_materia = ?
      AND dcm.estado = 'activo'
      AND dcm.deleted_at IS NULL
  `,

  // Obtener docente por id_usuario (para login)
  obtenerPorIdUsuario: `
    SELECT 
      id_docente, 
      id_usuario, 
      dni_docente, 
      nombre, 
      apellido, 
      email, 
      telefono, 
      especialidad, 
      estado
    FROM docente 
    WHERE id_usuario = ?
  `
};

module.exports = consultasDocentes;
