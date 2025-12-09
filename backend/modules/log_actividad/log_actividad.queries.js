// log_actividad.queries.js

const consultasLog = {
  // Obtener todos los registros de actividad
  obtenerTodos: `
    SELECT 
      id_log, id_usuario, accion, tabla_afectada, id_registro, ip_address, created_at
    FROM log_actividad
    ORDER BY created_at DESC
  `,

  // Obtener un registro por ID
  obtenerPorId: `
    SELECT 
      id_log, id_usuario, accion, tabla_afectada, id_registro, ip_address, created_at
    FROM log_actividad 
    WHERE id_log = ?
  `,

  // Crear un nuevo registro de actividad (log)
  crear: `
    INSERT INTO log_actividad 
      (id_usuario, accion, tabla_afectada, id_registro, ip_address)
    VALUES (?, ?, ?, ?, ?)
  `,
};

module.exports = consultasLog;