const db = require('../../config/db');

// Obtener todas las comunicaciones activas
exports.obtenerTodasComunicaciones = async () => {
  const [rows] = await db.query(`
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
  `);
  return rows;
};

// Obtener una comunicación por su ID
exports.obtenerComunicacionPorId = async (id) => {
  const [rows] = await db.query(
    `SELECT 
      id_comunicacion,
      asunto,
      contenido,
      fecha_envio,
      id_usuario,
      destinatario_tipo,
      created_at
     FROM comunicacion 
     WHERE id_comunicacion = ? AND deleted_at IS NULL`,
    [id]
  );
  return rows[0];
};

// Crear una nueva comunicación
exports.crearComunicacion = async (data) => {
  const {
    asunto,
    contenido,
    id_usuario,
    destinatario_tipo,
    fecha_envio
  } = data;

  const [result] = await db.query(
    `INSERT INTO comunicacion 
      (asunto, contenido, id_usuario, destinatario_tipo, fecha_envio)
     VALUES (?, ?, ?, ?, ?)`,
    [
      asunto,
      contenido,
      id_usuario,
      destinatario_tipo,
      fecha_envio || null
    ]
  );

  return { id_comunicacion: result.insertId, ...data };
};

// Actualizar una comunicación
exports.actualizarComunicacion = async (id, data) => {
  const {
    asunto,
    contenido,
    id_usuario,
    destinatario_tipo,
    fecha_envio
  } = data;

  const [result] = await db.query(
    `UPDATE comunicacion
     SET 
       asunto = ?,
       contenido = ?,
       id_usuario = ?,
       destinatario_tipo = ?,
       fecha_envio = ?
     WHERE id_comunicacion = ? AND deleted_at IS NULL`,
    [
      asunto,
      contenido,
      id_usuario,
      destinatario_tipo,
      fecha_envio,
      id
    ]
  );

  return result.affectedRows > 0;
};

// Eliminar (lógicamente) una comunicación
exports.eliminarComunicacion = async (id) => {
  const [result] = await db.query(
    `UPDATE comunicacion 
     SET deleted_at = CURRENT_TIMESTAMP 
     WHERE id_comunicacion = ? AND deleted_at IS NULL`,
    [id]
  );
  return { 
    mensaje: result.affectedRows > 0 ? 'Comunicación eliminada correctamente' : 'Comunicación no encontrada' 
  };
};

// Obtener comunicaciones eliminadas
exports.obtenerComunicacionesEliminadas = async () => {
  const [rows] = await db.query(`
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
  `);
  return rows;
};

// Restaurar una comunicación eliminada
exports.restaurarComunicacion = async (id) => {
  const [result] = await db.query(
    `UPDATE comunicacion 
     SET deleted_at = NULL 
     WHERE id_comunicacion = ? AND deleted_at IS NOT NULL`,
    [id]
  );
  
  if (result.affectedRows === 0) {
    throw new Error('Comunicación no encontrada o no está eliminada');
  }

  const [comunicacion] = await db.query(
    `SELECT 
      id_comunicacion,
      asunto,
      contenido,
      fecha_envio,
      id_usuario,
      destinatario_tipo
     FROM comunicacion 
     WHERE id_comunicacion = ?`,
    [id]
  );

  return comunicacion[0];
};