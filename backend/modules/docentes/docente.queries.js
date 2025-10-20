<<<<<<< HEAD
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
=======
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
>>>>>>> origin/medina_marcelo
    FROM docente 
    WHERE id_docente = ? AND deleted_at IS NULL
  `,

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/medina_marcelo
      updated_at = CURRENT_TIMESTAMP
    WHERE id_docente = ? AND deleted_at IS NULL
  `,

<<<<<<< HEAD
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
=======
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
>>>>>>> origin/medina_marcelo
};

module.exports = consultasDocentes;