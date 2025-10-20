// comunicacion.queries.js
const consultasComunicaciones = {
  // Obtener todas las comunicaciones activas
  obtenerTodas: `
    SELECT 
      id_comunicacion,
      asunto,
      contenido,
      fecha_envio,
      id_usuario,
      destinatario_tipo,
      created_at
    FROM comunicacion
    WHERE deleted_at IS NULL
  `,

  // Obtener una comunicación por ID
  obtenerPorId: `
    SELECT 
      id_comunicacion,
      asunto,
      contenido,
      fecha_envio,
      id_usuario,
      destinatario_tipo,
      created_at
    FROM comunicacion 
    WHERE id_comunicacion = ? AND deleted_at IS NULL
  `,

  // Crear una nueva comunicación
  crear: `
    INSERT INTO comunicacion 
      (asunto, contenido, id_usuario, destinatario_tipo, fecha_envio)
    VALUES (?, ?, ?, ?, ?)
  `,

  // Actualizar una comunicación completa
  actualizarCompleto: `
    UPDATE comunicacion
    SET 
      asunto = ?,
      contenido = ?,
      id_usuario = ?,
      destinatario_tipo = ?,
      fecha_envio = ?
    WHERE id_comunicacion = ? AND deleted_at IS NULL
  `,

  // Actualizar comunicación parcial
  actualizarParcial: `
    UPDATE comunicacion
    SET 
      asunto = COALESCE(?, asunto),
      contenido = COALESCE(?, contenido),
      destinatario_tipo = COALESCE(?, destinatario_tipo),
      fecha_envio = COALESCE(?, fecha_envio)
    WHERE id_comunicacion = ? AND deleted_at IS NULL
  `,

  // Eliminar lógicamente una comunicación
  eliminarLogico: `
    UPDATE comunicacion 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_comunicacion = ? AND deleted_at IS NULL
  `,

  // Obtener comunicaciones eliminadas
  obtenerEliminadas: `
    SELECT 
      id_comunicacion,
      asunto,
      contenido,
      fecha_envio,
      id_usuario,
      destinatario_tipo,
      created_at,
      deleted_at
    FROM comunicacion
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `,

  // Restaurar una comunicación eliminada
  restaurar: `
    UPDATE comunicacion 
    SET deleted_at = NULL 
    WHERE id_comunicacion = ? AND deleted_at IS NOT NULL
  `
};

module.exports = consultasComunicaciones;