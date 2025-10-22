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
  `
};

module.exports = consultasDocentes;