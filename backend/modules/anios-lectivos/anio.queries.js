// modules/anioLectivo/anioLectivo.queries.js

const consultasAnioLectivo = {
  obtenerTodos: `
    SELECT 
      id_anio_lectivo, anio, fecha_inicio, 
      fecha_fin, estado
    FROM anio_lectivo
    WHERE deleted_at IS NULL
    ORDER BY anio DESC
  `,
  
  obtenerPorId: `
    SELECT 
      id_anio_lectivo, anio, fecha_inicio, 
      fecha_fin, estado
    FROM anio_lectivo
    WHERE id_anio_lectivo = ? AND deleted_at IS NULL
  `,
  
  crear: `
    INSERT INTO anio_lectivo 
      (anio, fecha_inicio, fecha_fin, estado) 
    VALUES (?, ?, ?, ?)
  `,
  
  actualizar: `
    UPDATE anio_lectivo 
    SET 
      anio = ?, 
      fecha_inicio = ?, 
      fecha_fin = ?, 
      estado = ?
    WHERE id_anio_lectivo = ? AND deleted_at IS NULL
  `,
  
  eliminar: `
    UPDATE anio_lectivo 
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id_anio_lectivo = ? AND deleted_at IS NULL
  `,
  
  restaurar: `
    UPDATE anio_lectivo
    SET deleted_at = NULL
    WHERE id_anio_lectivo = ? AND deleted_at IS NOT NULL
  `,
  
  // Verificación para evitar duplicados al crear
  verificarAnioExistente: `
    SELECT id_anio_lectivo FROM anio_lectivo
    WHERE anio = ? AND deleted_at IS NULL
  `
};

module.exports = consultasAnioLectivo;