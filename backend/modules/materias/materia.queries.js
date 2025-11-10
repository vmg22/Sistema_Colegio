// materia.queries.js
const consultasMaterias = {
  // Obtener todas las materias activas
  obtenerTodos: `
    SELECT 
      id_materia, 
      nombre, 
      descripcion, 
      carga_horaria, 
      nivel, 
      ciclo, 
      estado, 
      created_at, 
      updated_at
    FROM materia
    WHERE deleted_at IS NULL
  `,

  // Obtener una materia por ID
  obtenerPorId: `
    SELECT 
      id_materia, 
      nombre, 
      descripcion, 
      carga_horaria, 
      nivel, 
      ciclo, 
      estado, 
      created_at, 
      updated_at
    FROM materia 
    WHERE id_materia = ? AND deleted_at IS NULL
  `,

  // Crear una nueva materia
  crear: `
    INSERT INTO materia 
      (nombre, descripcion, carga_horaria, nivel, ciclo, estado)
    VALUES (?, ?, ?, ?, ?, ?)
  `,

  // Actualizar una materia completa
  actualizarCompleto: `
    UPDATE materia
    SET 
      nombre = ?, 
      descripcion = ?, 
      carga_horaria = ?, 
      nivel = ?, 
      ciclo = ?, 
      estado = ?, 
      updated_at = CURRENT_TIMESTAMP
    WHERE id_materia = ? AND deleted_at IS NULL
  `,

  // Eliminar lógicamente una materia
  eliminarLogico: `
    UPDATE materia 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_materia = ? AND deleted_at IS NULL
  `,

  // Obtener materias eliminadas
  obtenerEliminados: `
    SELECT 
      id_materia, 
      nombre, 
      descripcion, 
      carga_horaria, 
      nivel, 
      ciclo, 
      estado, 
      created_at, 
      updated_at,
      deleted_at
    FROM materia
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `,

  // Restaurar una materia eliminada
  restaurar: `
    UPDATE materia 
    SET deleted_at = NULL 
    WHERE id_materia = ? AND deleted_at IS NOT NULL
  `
};

module.exports = consultasMaterias;