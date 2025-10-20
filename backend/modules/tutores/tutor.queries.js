// tutor.queries.js
const consultasTutores = {
  // Obtener todos los tutores activos
  obtenerTodos: `
    SELECT 
      id_tutor,
      id_usuario,
      dni_tutor,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      parentesco,
      estado,
      created_at,
      updated_at
    FROM tutor
    WHERE deleted_at IS NULL
  `,

  // Obtener un tutor por ID
  obtenerPorId: `
    SELECT 
      id_tutor,
      id_usuario,
      dni_tutor,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      parentesco,
      estado,
      created_at,
      updated_at
    FROM tutor 
    WHERE id_tutor = ? AND deleted_at IS NULL
  `,

  // Crear un nuevo tutor
  crear: `
    INSERT INTO tutor 
      (id_usuario, dni_tutor, nombre, apellido, email, telefono, direccion, parentesco, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,

  // Actualizar un tutor completo
  actualizarCompleto: `
    UPDATE tutor
    SET 
      id_usuario = ?,
      dni_tutor = ?,
      nombre = ?,
      apellido = ?,
      email = ?,
      telefono = ?,
      direccion = ?,
      parentesco = ?,
      estado = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id_tutor = ? AND deleted_at IS NULL
  `,




  // Actualizar tutor parcial 
  actualizarParcial: `
    UPDATE tutor
    SET 
      nombre = COALESCE(?, nombre),
      apellido = COALESCE(?, apellido),
      email = COALESCE(?, email),
      telefono = COALESCE(?, telefono),
      direccion = COALESCE(?, direccion),
      parentesco = COALESCE(?, parentesco),
      estado = COALESCE(?, estado),
      updated_at = CURRENT_TIMESTAMP
    WHERE id_tutor = ? AND deleted_at IS NULL
  `,

  
  // Eliminar lógicamente un tutor
  eliminarLogico: `
    UPDATE tutor 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_tutor = ? AND deleted_at IS NULL
  `,

  // Obtener tutores eliminados
  obtenerEliminados: `
    SELECT 
      id_tutor,
      id_usuario,
      dni_tutor,
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      parentesco,
      estado,
      created_at,
      updated_at,
      deleted_at
    FROM tutor
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `,

  // Restaurar un tutor eliminado
  restaurar: `
    UPDATE tutor 
    SET deleted_at = NULL 
    WHERE id_tutor = ? AND deleted_at IS NOT NULL
  `
};

module.exports = consultasTutores;