// alumno_tutor.queries.js
const consultasAlumnoTutor = {
  // Obtener todas las relaciones alumno-tutor activas
  obtenerTodos: `
    SELECT 
      id_alumno_tutor,
      id_alumno,
      id_tutor,
      es_principal,
      created_at,
      updated_at
    FROM alumno_tutor
    WHERE deleted_at IS NULL
  `,

  // Obtener una relación por ID
  obtenerPorId: `
    SELECT 
      id_alumno_tutor,
      id_alumno,
      id_tutor,
      es_principal,
      created_at,
      updated_at
    FROM alumno_tutor 
    WHERE id_alumno_tutor = ? AND deleted_at IS NULL
  `,

  // Obtener tutores de un alumno específico
  obtenerPorAlumno: `
    SELECT 
      id_alumno_tutor,
      id_alumno,
      id_tutor,
      es_principal,
      created_at,
      updated_at
    FROM alumno_tutor
    WHERE id_alumno = ? AND deleted_at IS NULL
  `,

  // Obtener alumnos de un tutor específico
  obtenerPorTutor: `
    SELECT 
      id_alumno_tutor,
      id_alumno,
      id_tutor,
      es_principal,
      created_at,
      updated_at
    FROM alumno_tutor
    WHERE id_tutor = ? AND deleted_at IS NULL
  `,

  // Crear una nueva relación alumno-tutor
  crear: `
    INSERT INTO alumno_tutor 
      (id_alumno, id_tutor, es_principal)
    VALUES (?, ?, ?)
  `,

  // Actualizar una relación completa
  actualizarCompleto: `
    UPDATE alumno_tutor
    SET 
      id_alumno = ?,
      id_tutor = ?,
      es_principal = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id_alumno_tutor = ? AND deleted_at IS NULL
  `,

  // Eliminar lógicamente una relación
  eliminarLogico: `
    UPDATE alumno_tutor 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_alumno_tutor = ? AND deleted_at IS NULL
  `,

  // Obtener relaciones eliminadas
  obtenerEliminados: `
    SELECT 
      id_alumno_tutor,
      id_alumno,
      id_tutor,
      es_principal,
      created_at,
      updated_at,
      deleted_at
    FROM alumno_tutor
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `,

  // Restaurar una relación eliminada
  restaurar: `
    UPDATE alumno_tutor 
    SET deleted_at = NULL 
    WHERE id_alumno_tutor = ? AND deleted_at IS NOT NULL
  `,

  // Verificar si ya existe una relación activa
  verificarExistente: `
    SELECT id_alumno_tutor
    FROM alumno_tutor
    WHERE id_alumno = ? AND id_tutor = ? AND deleted_at IS NULL
  `
};

module.exports = consultasAlumnoTutor;