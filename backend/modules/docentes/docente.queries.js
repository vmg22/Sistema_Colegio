/**
 * =======================================
 * DOCENTE.QUERIES.JS
 * =======================================
 * Almacén de strings de consultas SQL para el módulo de docentes.
 */

const consultasDocentes = {
  // ====================
  // CONSULTAS DE LECTURA
  // ====================

  obtenerTodos: `
    SELECT 
      id_docente, id_usuario, dni_docente, nombre, apellido, 
      email, telefono, especialidad, estado
    FROM docente 
    WHERE deleted_at IS NULL
    ORDER BY id_docente ASC 
  `,

  obtenerPorId: `
    SELECT 
      id_docente, id_usuario, dni_docente, nombre, apellido, 
      email, telefono, especialidad, estado,
      created_at, updated_at
    FROM docente 
    WHERE id_docente = ? AND deleted_at IS NULL
  `,

  obtenerPorDni: `
    SELECT 
      id_docente, id_usuario, dni_docente, nombre, apellido, 
      email, estado
    FROM docente 
    WHERE dni_docente = ? AND deleted_at IS NULL
  `,

  // ====================
  // CONSULTAS DE CREACIÓN
  // ====================

  crear: `
    INSERT INTO docente (
      id_usuario, dni_docente, nombre, apellido, 
      email, telefono, especialidad, estado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,

  // ====================
  // CONSULTAS DE ACTUALIZACIÓN
  // ====================

  actualizar: `
    UPDATE docente 
    SET 
      id_usuario = ?, dni_docente = ?, nombre = ?, apellido = ?,
      email = ?, telefono = ?, especialidad = ?, estado = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id_docente = ? AND deleted_at IS NULL
  `,

  // ====================
  // CONSULTAS DE ELIMINACIÓN
  // ====================

  eliminarLogico: `
    UPDATE docente 
    SET deleted_at = CURRENT_TIMESTAMP, estado = 'inactivo'
    WHERE id_docente = ? AND deleted_at IS NULL
  `,

  // ====================
  // CONSULTAS DE VERIFICACIÓN
  // ====================

  verificarDniExistente: `
    SELECT id_docente FROM docente 
    WHERE dni_docente = ? AND deleted_at IS NULL
  `,

  verificarEmailExistente: `
    SELECT id_docente FROM docente 
    WHERE email = ? AND deleted_at IS NULL
  `,
};

module.exports = consultasDocentes;