// comunicacion_destinatario.queries.js

const consultasDestinatarios = {
  // Obtener todos los destinatarios activos
  obtenerTodos: `
    SELECT 
      id_destinatario, id_comunicacion, id_alumno, id_docente, 
      id_curso, id_tutor, email, asistio, created_at
    FROM comunicacion_destinatario
    WHERE deleted_at IS NULL
  `,

  // Obtener un destinatario por ID
  obtenerPorId: `
    SELECT 
      id_destinatario, id_comunicacion, id_alumno, id_docente, 
      id_curso, id_tutor, email, asistio, created_at
    FROM comunicacion_destinatario 
    WHERE id_destinatario = ? AND deleted_at IS NULL
  `,

  // Crear un nuevo destinatario
  crear: `
    INSERT INTO comunicacion_destinatario 
      (id_comunicacion, id_alumno, id_docente, id_curso, id_tutor, email, asistio)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,

  // Actualizar un destinatario (solo asistio, email y/o la comunicación padre)
  actualizarCompleto: `
    UPDATE comunicacion_destinatario
    SET 
      id_comunicacion = ?, 
      id_alumno = ?, 
      id_docente = ?, 
      id_curso = ?, 
      id_tutor = ?, 
      email = ?,
      asistio = ?
    WHERE id_destinatario = ? AND deleted_at IS NULL
  `,

  // Actualizar destinatario parcial
  actualizarParcial: `
    UPDATE comunicacion_destinatario
    SET 
      email = COALESCE(?, email),
      asistio = COALESCE(?, asistio)
    WHERE id_destinatario = ? AND deleted_at IS NULL
  `,

  // Eliminar lógicamente un destinatario
  eliminarLogico: `
    UPDATE comunicacion_destinatario 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_destinatario = ? AND deleted_at IS NULL
  `,

  // Obtener destinatarios eliminados
  obtenerEliminados: `
    SELECT id_destinatario, id_comunicacion, email, deleted_at
    FROM comunicacion_destinatario
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `,

  // Restaurar un destinatario eliminado
  restaurar: `
    UPDATE comunicacion_destinatario 
    SET deleted_at = NULL 
    WHERE id_destinatario = ? AND deleted_at IS NOT NULL
  `
};

module.exports = consultasDestinatarios;