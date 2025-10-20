// anio_lectivo.queries.js
const consultasAniosLectivos = {
  // Obtener todos los años lectivos activos
  obtenerTodos: `
    SELECT 
      id_anio_lectivo,
      anio,
      fecha_inicio,
      fecha_fin,
      estado,
      created_at,
      updated_at
    FROM anio_lectivo
    WHERE deleted_at IS NULL
  `,

  // Obtener un año lectivo por ID
  obtenerPorId: `
    SELECT 
      id_anio_lectivo,
      anio,
      fecha_inicio,
      fecha_fin,
      estado,
      created_at,
      updated_at
    FROM anio_lectivo 
    WHERE id_anio_lectivo = ? AND deleted_at IS NULL
  `,

  // Crear un nuevo año lectivo
  crear: `
    INSERT INTO anio_lectivo 
      (anio, fecha_inicio, fecha_fin, estado)
    VALUES (?, ?, ?, ?)
  `,

  // Actualizar un año lectivo completo
  actualizarCompleto: `
    UPDATE anio_lectivo
    SET 
      anio = ?, 
      fecha_inicio = ?, 
      fecha_fin = ?, 
      estado = ?, 
      updated_at = CURRENT_TIMESTAMP
    WHERE id_anio_lectivo = ? AND deleted_at IS NULL
  `,
// Actualizar año lectivo parcial 
  actualizarParcial: `
    UPDATE anio_lectivo
    SET 
      fecha_inicio = COALESCE(?, fecha_inicio),
      fecha_fin = COALESCE(?, fecha_fin),
      estado = COALESCE(?, estado),
      updated_at = CURRENT_TIMESTAMP
    WHERE id_anio_lectivo = ? AND deleted_at IS NULL
  `,
  // Eliminar lógicamente un año lectivo
  eliminarLogico: `
    UPDATE anio_lectivo 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_anio_lectivo = ? AND deleted_at IS NULL
  `,

  // Obtener años lectivos eliminados
  obtenerEliminados: `
    SELECT 
      id_anio_lectivo,
      anio,
      fecha_inicio,
      fecha_fin,
      estado,
      created_at,
      updated_at,
      deleted_at
    FROM anio_lectivo
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `,

  // Restaurar un año lectivo eliminado
  restaurar: `
    UPDATE anio_lectivo 
    SET deleted_at = NULL 
    WHERE id_anio_lectivo = ? AND deleted_at IS NOT NULL
  `
};

module.exports = consultasAniosLectivos;