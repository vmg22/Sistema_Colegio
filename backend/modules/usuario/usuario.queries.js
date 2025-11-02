const db = require("../../config/db");
const bcrypt = require("bcrypt"); // Importar la librería para hashing

// Campos comunes para SELECT (excluye el sensible 'password_hash')
const CAMPOS_SELECT = `
id_usuario, 
username, 
email_usuario, 
rol, 
estado, 
ultimo_login, 
created_at, 
updated_at
`;

// --- READ (Lectura) ---

/**
 * Obtiene todos los usuarios que no han sido eliminados lógicamente.
 */
exports.obtenerTodosUsuarios = async () => {
  const [rows] = await db.query(`
      SELECT ${CAMPOS_SELECT}
      FROM usuario
      WHERE deleted_at IS NULL
 `);
  return rows;
};

/**
 * Obtiene un usuario activo por su ID.
 * @param {number} id - ID del usuario.
 * @returns {object|undefined} Usuario encontrado o undefined.
 */
exports.obtenerUsuarioPorId = async (id) => {
  const [rows] = await db.query(
    `SELECT ${CAMPOS_SELECT}
    FROM usuario 
    WHERE id_usuario = ? AND deleted_at IS NULL`,
    [id]
  );
  return rows[0];
};

/**
 * Obtiene todos los usuarios que han sido eliminados lógicamente.
 */
exports.obtenerUsuariosEliminados = async () => {
  const [rows] = await db.query(`
        SELECT ${CAMPOS_SELECT}, deleted_at
        FROM usuario
        WHERE deleted_at IS NOT NULL
        ORDER BY deleted_at DESC
   `);
  return rows;
};

// --- CREATE (Creación) ---

/**
 * Crea un nuevo usuario en la base de datos. Hashea la contraseña antes de guardar.
 * @param {object} data - Datos del nuevo usuario (username, password, email_usuario, rol, etc.).
 * @returns {object|null} El objeto del usuario creado (sin hash de password) o null si falla la inserción.
 */
exports.crearUsuario = async (data) => {
  // El controlador ya validó los campos esenciales y el formato.
  const {
    username,
    password, // Recibimos la contraseña en texto plano
    email_usuario,
    rol,
    estado = "activo",
    ultimo_login = null,
  } = data; // 1. Generar el hash de la contraseña

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const [result] = await db.query(
    `INSERT INTO usuario 
        (username, password_hash, email_usuario, rol, estado, ultimo_login)
        VALUES (?, ?, ?, ?, ?, ?)`,
    [username, password_hash, email_usuario, rol, estado, ultimo_login] // Insertamos el hash
  );

  return exports.obtenerUsuarioPorId(result.insertId);
};

// --- UPDATE (Actualización) ---

/**
 * Actualiza dinámicamente los campos de un usuario.
 * @param {number} id - ID del usuario a actualizar.
 * @param {object} data - Objeto con los campos a actualizar.
 * @returns {object|null} El objeto del usuario actualizado o null si no se encuentra/actualiza.
 */
exports.actualizarUsuario = async (id, data) => {
  const fields = [];
  const values = []; // Construir la consulta dinámicamente con los campos presentes en 'data'

  for (const key in data) {
    // Excluimos campos no actualizables o que se manejan aparte
    if (key !== "id_usuario" && key !== "created_at" && key !== "deleted_at") {
      if (key === "password") {
        // 1. Si el campo es 'password', hashearlo antes de guardarlo
        const salt = await bcrypt.genSalt(10);
        const new_hash = await bcrypt.hash(data[key], salt);

        fields.push(`password_hash = ?`); // Cambiamos el nombre de la columna a actualizar
        values.push(new_hash);
      } else {
        // 2. Otros campos se pasan directamente
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }
  }

  if (fields.length === 0) {
    return null; // No hay campos válidos para actualizar
  } // Añadir la marca de tiempo de actualización y el ID para el WHERE

  fields.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id);

  const setClause = fields.join(", ");

  const [result] = await db.query(
    `UPDATE usuario
      SET ${setClause}
      WHERE id_usuario = ? AND deleted_at IS NULL`,
    values
  );

  if (result.affectedRows === 0) {
    return null; // El usuario no fue encontrado (ID incorrecto o ya eliminado)
  } // Retorna el objeto actualizado para que el controller pueda usarlo en la respuesta

  return exports.obtenerUsuarioPorId(id);
};

/**
 * Restaura un usuario eliminado lógicamente.
 * @param {number} id - ID del usuario a restaurar.
 * @returns {object|null} El objeto del usuario restaurado o null si no se encuentra/restaura.
 */
exports.restaurarUsuario = async (id) => {
  const [result] = await db.query(
    `UPDATE usuario 
    SET deleted_at = NULL 
    WHERE id_usuario = ? AND deleted_at IS NOT NULL`,
    [id]
  );
  if (result.affectedRows === 0) {
    return null; // Usuario no encontrado o no estaba eliminado
  } // Retorna el objeto usuario restaurado

  return exports.obtenerUsuarioPorId(id);
};

// --- DELETE (Eliminación) ---

/**
 * Elimina lógicamente un usuario (soft delete).
 * @param {number} id - ID del usuario a eliminar.
 * @returns {boolean} True si se afectó una fila, False si no.
 */
exports.eliminarUsuario = async (id) => {
  const [result] = await db.query(
    `UPDATE usuario 
      SET deleted_at = CURRENT_TIMESTAMP 
      WHERE id_usuario = ? AND deleted_at IS NULL`,
    [id]
  );

  return result.affectedRows > 0;
};
