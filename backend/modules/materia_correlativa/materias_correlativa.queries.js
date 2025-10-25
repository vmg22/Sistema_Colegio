// materia_correlativa.queries.js

const consultasCorrelativas = {
  // Obtener todas las correlativas activas (deleted_at IS NULL)
  // Nota: Devolvemos ambas claves y el tipo.
  obtenerTodos: `
    SELECT 
      id_correlativa, 
      id_materia, 
      id_materia_correlativa, 
      tipo, 
      created_at, 
      updated_at
    FROM materia_correlativa
    WHERE deleted_at IS NULL
  `,

  // Obtener una correlativa por ID (id_correlativa)
  obtenerPorId: `
    SELECT 
      id_correlativa, 
      id_materia, 
      id_materia_correlativa, 
      tipo, 
      created_at, 
      updated_at
    FROM materia_correlativa 
    WHERE id_correlativa = ? AND deleted_at IS NULL
  `,

  // Crear una nueva correlativa
  crear: `
    INSERT INTO materia_correlativa 
      (id_materia, id_materia_correlativa, tipo)
    VALUES (?, ?, ?)
  `,

  // Actualizar una correlativa (solo se puede actualizar el tipo)
  actualizarCompleto: `
    UPDATE materia_correlativa
    SET 
      tipo = ?, 
      updated_at = CURRENT_TIMESTAMP
    WHERE id_correlativa = ? AND deleted_at IS NULL
  `,

  // Eliminar lógicamente una correlativa
  eliminarLogico: `
    UPDATE materia_correlativa 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_correlativa = ? AND deleted_at IS NULL
  `,

  // Obtener correlativas eliminadas
  obtenerEliminados: `
    SELECT 
      id_correlativa, 
      id_materia, 
      id_materia_correlativa, 
      tipo, 
      deleted_at
    FROM materia_correlativa
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `,

  // Restaurar una correlativa eliminada
  restaurar: `
    UPDATE materia_correlativa 
    SET deleted_at = NULL 
    WHERE id_correlativa = ? AND deleted_at IS NOT NULL
  `
};

module.exports = consultasCorrelativas;