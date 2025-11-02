const db = require("../../config/db");
const bcrypt = require("bcrypt"); // 1. Importar bcrypt

// Campos comunes para SELECT (para evitar seleccionar password_hash innecesariamente)
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

// --- READ ---

// Obtener todos los usuarios activos
exports.obtenerTodosUsuarios = async () => {
  const [rows] = await db.query(`
    SELECT ${CAMPOS_SELECT}
    FROM usuario
    WHERE deleted_at IS NULL
  `);
  return rows;
};

// Obtener un usuario por su ID
exports.obtenerUsuarioPorId = async (id) => {
  const [rows] = await db.query(
    `SELECT ${CAMPOS_SELECT}
        FROM usuario 
        WHERE id_usuario = ? AND deleted_at IS NULL`,
    [id]
  );
  return rows[0]; // Devuelve el objeto usuario o undefined
};

// Obtener usuarios eliminados
exports.obtenerUsuariosEliminados = async () => {
  const [rows] = await db.query(`
    SELECT ${CAMPOS_SELECT}, deleted_at
    FROM usuario
    WHERE deleted_at IS NOT NULL
    ORDER BY deleted_at DESC
  `);
  return rows;
};

// --- CREATE ---

// Crear un nuevo usuario
exports.crearUsuario = async (data) => {
  // El controller ya garantizó que los campos esenciales están presentes y validados.
  const {
    username,
    password, // El controller ahora envía 'password' en texto plano
    email_usuario,
    rol,
    estado = "activo", // Usamos un valor por defecto si no se pasa
    ultimo_login = null,
  } = data; // 2. Generar el hash de la contraseña antes de guardarla

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const [result] = await db.query(
    `INSERT INTO usuario 
        (username, password_hash, email_usuario, rol, estado, ultimo_login)
        VALUES (?, ?, ?, ?, ?, ?)`,
    [username, password_hash, email_usuario, rol, estado, ultimo_login]
  ); // 3. Devolvemos el usuario creado (sin la password_hash, idealmente)

  const usuarioCreado = await exports.obtenerUsuarioPorId(result.insertId);
  return usuarioCreado;
};

// --- UPDATE ---

// Actualizar un usuario
exports.actualizarUsuario = async (id, data) => {
  // 1. Construir la query SET dinámicamente
  const fields = [];
  const values = []; // Iterar sobre los campos que se desean actualizar en 'data'

  for (const key in data) {
    // Excluimos campos que no deben actualizarse o que se manejan aparte
    if (key !== "id_usuario" && key !== "created_at") {
      // 1a. Si el campo a actualizar es 'password', lo hasheamos
      if (key === "password") {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(data[key], salt);
        fields.push(`password_hash = ?`); // Guardamos como password_hash
        values.push(password_hash);
      } else {
        // 1b. Otros campos se pasan directamente
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }
  }

  if (fields.length === 0) {
    // Si no hay campos válidos, devolvemos null para indicar que no se hizo nada
    return null;
  } // 2. Añadir la actualización de la marca de tiempo y el ID

  fields.push("updated_at = CURRENT_TIMESTAMP");
  values.push(id); // El ID es el último valor para la cláusula WHERE

  const setClause = fields.join(", ");

  const [result] = await db.query(
    `UPDATE usuario
      SET ${setClause}
      WHERE id_usuario = ? AND deleted_at IS NULL`,
      values
  ); // 3. Devolver el usuario actualizado o null

  if (result.affectedRows === 0) {
    // El usuario no fue encontrado (o ya estaba eliminado)
    return null;
  } // Retorna el objeto actualizado para que el controller pueda usarlo en la respuesta

  return exports.obtenerUsuarioPorId(id);
};

// --- DELETE / RESTORE ---

// Eliminar (lógicamente) un usuario
exports.eliminarUsuario = async (id) => {
  const [result] = await db.query(
    `UPDATE usuario 
 SET deleted_at = CURRENT_TIMESTAMP 
 WHERE id_usuario = ? AND deleted_at IS NULL`,
    [id]
  ); // Devolvemos simplemente si se afectaron filas o no

  return result.affectedRows > 0;
};

// Restaurar un usuario eliminado
exports.restaurarUsuario = async (id) => {
  const [result] = await db.query(
    `UPDATE usuario 
        SET deleted_at = NULL 
        WHERE id_usuario = ? AND deleted_at IS NOT NULL`,
    [id]
  );
  if (result.affectedRows === 0) {
    return null; // Devolvemos null para que el controller sepa que falló la operación
  } // Retorna el objeto usuario restaurado

  const [usuario] = await db.query(
    `SELECT ${CAMPOS_SELECT}
        FROM usuario 
        WHERE id_usuario = ?`,
    [id]
  );

  return usuario[0];
};
