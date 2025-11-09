// const bcrypt = require("bcrypt");
// const queries = require("./usuario.queries");

// // --- SERVICIOS DE LECTURA ---

// /**
//  * Obtiene todos los usuarios activos
//  */
// exports.obtenerTodosUsuarios = async () => {
//   return await queries.obtenerTodosUsuarios();
// };

// /**
//  * Obtiene un usuario por ID (sin password)
//  */
// exports.obtenerUsuarioPorId = async (id) => {
//   return await queries.obtenerUsuarioPorId(id);
// };

// /**
//  * Obtiene usuarios eliminados
//  */
// exports.obtenerUsuariosEliminados = async () => {
//   return await queries.obtenerUsuariosEliminados();
// };

// /**
//  * ✅ Obtiene un usuario por email (sin password_hash)
//  * Usado en el login para obtener datos básicos del usuario
//  */
// exports.obtenerUsuarioPorEmail = async (email) => {
//   try {
//     const usuario = await queries.obtenerUsuarioPorEmail(email);
//     return usuario;
//   } catch (error) {
//     console.error('Error en obtenerUsuarioPorEmail:', error);
//     throw error;
//   }
// };

// /**
//  * ✅ Obtiene un usuario con su password_hash por ID
//  * Usado SOLO para validaciones internas de contraseña
//  * NUNCA exponer este método directamente en el controller
//  */
// exports.obtenerUsuarioConPassword = async (id_usuario) => {
//   try {
//     const usuario = await queries.obtenerUsuarioConPassword(id_usuario);
//     return usuario;
//   } catch (error) {
//     console.error('Error en obtenerUsuarioConPassword:', error);
//     throw error;
//   }
// };

// // --- SERVICIOS DE CREACIÓN ---

// /**
//  * Crea un nuevo usuario
//  * - Hashea la contraseña
//  * - Valida que no exista username/email duplicado
//  * - Inserta en la base de datos
//  */
// exports.crearUsuario = async (data) => {
//   const {
//     username,
//     password,
//     email_usuario,
//     rol,
//     estado = "activo",
//     ultimo_login = null,
//   } = data;

//   // Verificar si el username ya existe
//   const usuarioExistente = await queries.obtenerUsuarioPorUsername(username);
//   if (usuarioExistente) {
//     throw new Error("El username ya está en uso");
//   }

//   // Verificar si el email ya existe
//   const emailExistente = await queries.obtenerUsuarioPorEmail(email_usuario);
//   if (emailExistente) {
//     throw new Error("El email ya está en uso");
//   }

//   // Generar hash de la contraseña
//   const salt = await bcrypt.genSalt(10);
//   const password_hash = await bcrypt.hash(password, salt);

//   // Insertar usuario
//   const insertId = await queries.insertarUsuario(
//     username,
//     password_hash,
//     email_usuario,
//     rol,
//     estado,
//     ultimo_login
//   );

//   // Retornar el usuario creado
//   return await queries.obtenerUsuarioPorId(insertId);
// };

// // --- SERVICIOS DE ACTUALIZACIÓN ---

// /**
//  * Actualiza un usuario completo (PUT)
//  * - Construye la query dinámicamente
//  * - Hashea la contraseña si se está actualizando
//  * - Valida que no haya duplicados de username/email
//  */
// exports.actualizarUsuario = async (id, data) => {
//   const fields = [];
//   const values = [];

//   // Verificar que el usuario existe
//   const usuarioExistente = await queries.obtenerUsuarioPorId(id);
//   if (!usuarioExistente) {
//     return null;
//   }

//   for (const key in data) {
//     // Excluir campos no actualizables
//     if (key !== "id_usuario" && key !== "created_at" && key !== "deleted_at") {
      
//       if (key === "password") {
//         // Hashear la nueva contraseña
//         const salt = await bcrypt.genSalt(10);
//         const password_hash = await bcrypt.hash(data[key], salt);
//         fields.push("password_hash = ?");
//         values.push(password_hash);
//       } 
//       else if (key === "username") {
//         // Verificar que el nuevo username no esté en uso por otro usuario
//         const usuarioConUsername = await queries.obtenerUsuarioPorUsername(data[key]);
//         if (usuarioConUsername && usuarioConUsername.id_usuario !== parseInt(id)) {
//           throw new Error("El username ya está en uso por otro usuario");
//         }
//         fields.push("username = ?");
//         values.push(data[key]);
//       }
//       else if (key === "email_usuario") {
//         // Verificar que el nuevo email no esté en uso por otro usuario
//         const usuarioConEmail = await queries.obtenerUsuarioPorEmail(data[key]);
//         if (usuarioConEmail && usuarioConEmail.id_usuario !== parseInt(id)) {
//           throw new Error("El email ya está en uso por otro usuario");
//         }
//         fields.push("email_usuario = ?");
//         values.push(data[key]);
//       }
//       else {
//         // Otros campos
//         fields.push(`${key} = ?`);
//         values.push(data[key]);
//       }
//     }
//   }

//   if (fields.length === 0) {
//     return null;
//   }

//   // Agregar updated_at
//   fields.push("updated_at = CURRENT_TIMESTAMP");

//   // Ejecutar actualización
//   const affectedRows = await queries.actualizarUsuario(id, fields, values);

//   if (affectedRows === 0) {
//     return null;
//   }

//   return await queries.obtenerUsuarioPorId(id);
// };

// /**
//  * ✅ Actualiza parcialmente un usuario (PATCH)
//  * - Solo actualiza los campos enviados
//  * - No requiere todos los campos del usuario
//  * - Hashea la contraseña si se está actualizando
//  * - Valida que no haya duplicados de username/email
//  */
// exports.actualizarUsuarioParcial = async (id, data) => {
//   const fields = [];
//   const values = [];

//   // Verificar que el usuario existe
//   const usuarioExistente = await queries.obtenerUsuarioPorId(id);
//   if (!usuarioExistente) {
//     return null;
//   }

//   // Si no hay campos para actualizar
//   if (Object.keys(data).length === 0) {
//     throw new Error("No se proporcionaron campos para actualizar");
//   }

//   for (const key in data) {
//     // Excluir campos no actualizables
//     if (key !== "id_usuario" && key !== "created_at" && key !== "deleted_at") {
      
//       if (key === "password") {
//         // Hashear la nueva contraseña
//         const salt = await bcrypt.genSalt(10);
//         const password_hash = await bcrypt.hash(data[key], salt);
//         fields.push("password_hash = ?");
//         values.push(password_hash);
//       } 
//       else if (key === "username") {
//         // Verificar que el nuevo username no esté en uso por otro usuario
//         const usuarioConUsername = await queries.obtenerUsuarioPorUsername(data[key]);
//         if (usuarioConUsername && usuarioConUsername.id_usuario !== parseInt(id)) {
//           throw new Error("El username ya está en uso por otro usuario");
//         }
//         fields.push("username = ?");
//         values.push(data[key]);
//       }
//       else if (key === "email_usuario") {
//         // Verificar que el nuevo email no esté en uso por otro usuario
//         const usuarioConEmail = await queries.obtenerUsuarioPorEmail(data[key]);
//         if (usuarioConEmail && usuarioConEmail.id_usuario !== parseInt(id)) {
//           throw new Error("El email ya está en uso por otro usuario");
//         }
//         fields.push("email_usuario = ?");
//         values.push(data[key]);
//       }
//       else {
//         // Otros campos
//         fields.push(`${key} = ?`);
//         values.push(data[key]);
//       }
//     }
//   }

//   if (fields.length === 0) {
//     return null;
//   }

//   // Agregar updated_at
//   fields.push("updated_at = CURRENT_TIMESTAMP");

//   // Ejecutar actualización parcial
//   const affectedRows = await queries.actualizarUsuarioParcial(id, fields, values);

//   if (affectedRows === 0) {
//     return null;
//   }

//   return await queries.obtenerUsuarioPorId(id);
// };

// /**
//  * ✅ Actualiza la fecha de último login
//  * Llamada después de un login exitoso
//  */
// exports.actualizarUltimoLogin = async (id_usuario) => {
//   try {
//     await queries.actualizarUltimoLogin(id_usuario);
//   } catch (error) {
//     console.error("Error al actualizar último login:", error);
//     // No lanzamos error para no interrumpir el flujo de login
//   }
// };

// // --- SERVICIOS DE ELIMINACIÓN Y RESTAURACIÓN ---

// /**
//  * Elimina lógicamente un usuario
//  * - Marca deleted_at con timestamp actual
//  * - Cambia el estado a 'inactivo'
//  */
// exports.eliminarUsuario = async (id) => {
//   const affectedRows = await queries.marcarComoEliminado(id);
//   return affectedRows > 0;
// };

// /**
//  * Restaura un usuario eliminado
//  * - Limpia deleted_at (NULL)
//  * - Cambia el estado a 'activo'
//  */
// exports.restaurarUsuario = async (id) => {
//   const affectedRows = await queries.restaurarUsuarioEliminado(id);
  
//   if (affectedRows === 0) {
//     return null;
//   }

//   return await queries.obtenerUsuarioPorId(id);
// };

// // --- SERVICIOS DE AUTENTICACIÓN (LEGACY - NO SE USA EN EL NUEVO FLUJO) ---

// /**
//  * @deprecated Usar el nuevo flujo en auth.controller.js
//  * Valida las credenciales de un usuario por email
//  * - Busca el usuario por email
//  * - Compara la contraseña con bcrypt
//  * - Actualiza ultimo_login si es exitoso
//  */
// exports.validarCredencialesPorEmail = async (email, password) => {
//   const usuario = await queries.obtenerUsuarioPorEmail(email);
  
//   if (!usuario) {
//     return null;
//   }

//   // Verificar que el usuario esté activo
//   if (usuario.estado !== "activo") {
//     throw new Error("Usuario inactivo");
//   }

//   // Obtener password_hash
//   const usuarioConPassword = await queries.obtenerUsuarioConPassword(usuario.id_usuario);

//   // Comparar contraseñas
//   const passwordValida = await bcrypt.compare(password, usuarioConPassword.password_hash);
  
//   if (!passwordValida) {
//     return null;
//   }

//   // Actualizar último login
//   await queries.actualizarUltimoLogin(usuario.id_usuario);

//   // Retornar usuario sin el password_hash
//   return await queries.obtenerUsuarioPorId(usuario.id_usuario);
// };


const bcrypt = require("bcrypt");
const queries = require("./usuario.queries");

// --- SERVICIOS DE LECTURA ---

/**
 * Obtiene todos los usuarios activos
 */
exports.obtenerTodosUsuarios = async () => {
  return await queries.obtenerTodosUsuarios();
};

/**
 * Obtiene un usuario por ID (sin password)
 */
exports.obtenerUsuarioPorId = async (id) => {
  return await queries.obtenerUsuarioPorId(id);
};

/**
 * Obtiene usuarios eliminados
 */
exports.obtenerUsuariosEliminados = async () => {
  return await queries.obtenerUsuariosEliminados();
};

/**
 * ✅ Obtiene un usuario por email (sin password_hash)
 * Usado en el login para obtener datos básicos del usuario
 */
exports.obtenerUsuarioPorEmail = async (email) => {
  try {
    const usuario = await queries.obtenerUsuarioPorEmail(email);
    return usuario;
  } catch (error) {
    console.error('Error en obtenerUsuarioPorEmail:', error);
    throw error;
  }
};

/**
 * ✅ Obtiene un usuario con su password_hash por ID
 * Usado SOLO para validaciones internas de contraseña
 * NUNCA exponer este método directamente en el controller
 */
exports.obtenerUsuarioConPassword = async (id_usuario) => {
  try {
    const usuario = await queries.obtenerUsuarioConPassword(id_usuario);
    return usuario;
  } catch (error) {
    console.error('Error en obtenerUsuarioConPassword:', error);
    throw error;
  }
};

// --- SERVICIOS DE CREACIÓN ---

/**
 * Crea un nuevo usuario
 * - Hashea la contraseña
 * - Valida que no exista username/email duplicado
 * - Inserta en la base de datos
 */
exports.crearUsuario = async (data) => {
  const {
    username,
    password,
    email_usuario,
    rol,
    estado = "activo",
    ultimo_login = null,
  } = data;

  // Verificar si el username ya existe
  const usuarioExistente = await queries.obtenerUsuarioPorUsername(username);
  if (usuarioExistente) {
    throw new Error("El username ya está en uso");
  }

  // Verificar si el email ya existe
  const emailExistente = await queries.obtenerUsuarioPorEmail(email_usuario);
  if (emailExistente) {
    throw new Error("El email ya está en uso");
  }

  // Generar hash de la contraseña
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  // Insertar usuario
  const insertId = await queries.insertarUsuario(
    username,
    password_hash,
    email_usuario,
    rol,
    estado,
    ultimo_login
  );

  // Retornar el usuario creado
  return await queries.obtenerUsuarioPorId(insertId);
};

// --- SERVICIOS DE ACTUALIZACIÓN ---

/**
 * Actualiza un usuario completo (PUT)
 * - Construye la query dinámicamente
 * - Hashea la contraseña si se está actualizando
 * - Valida que no haya duplicados de username/email
 */
exports.actualizarUsuario = async (id, data) => {
  const fields = [];
  const values = [];

  // Verificar que el usuario existe
  const usuarioExistente = await queries.obtenerUsuarioPorId(id);
  if (!usuarioExistente) {
    return null;
  }

  for (const key in data) {
    // Excluir campos no actualizables
    if (key !== "id_usuario" && key !== "created_at" && key !== "deleted_at") {
      
      if (key === "password") {
        // Hashear la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(data[key], salt);
        fields.push("password_hash = ?");
        values.push(password_hash);
      } 
      else if (key === "username") {
        // Verificar que el nuevo username no esté en uso por otro usuario
        const usuarioConUsername = await queries.obtenerUsuarioPorUsername(data[key]);
        if (usuarioConUsername && usuarioConUsername.id_usuario !== parseInt(id)) {
          throw new Error("El username ya está en uso por otro usuario");
        }
        fields.push("username = ?");
        values.push(data[key]);
      }
      else if (key === "email_usuario") {
        // Verificar que el nuevo email no esté en uso por otro usuario
        const usuarioConEmail = await queries.obtenerUsuarioPorEmail(data[key]);
        if (usuarioConEmail && usuarioConEmail.id_usuario !== parseInt(id)) {
          throw new Error("El email ya está en uso por otro usuario");
        }
        fields.push("email_usuario = ?");
        values.push(data[key]);
      }
      else {
        // Otros campos
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }
  }

  if (fields.length === 0) {
    return null;
  }

  // Agregar updated_at
  fields.push("updated_at = CURRENT_TIMESTAMP");

  // Ejecutar actualización
  const affectedRows = await queries.actualizarUsuario(id, fields, values);

  if (affectedRows === 0) {
    return null;
  }

  return await queries.obtenerUsuarioPorId(id);
};

/**
 * ✅ Actualiza parcialmente un usuario (PATCH)
 * - Solo actualiza los campos enviados
 * - No requiere todos los campos del usuario
 * - Hashea la contraseña si se está actualizando
 * - Valida que no haya duplicados de username/email
 */
exports.actualizarUsuarioParcial = async (id, data) => {
  const fields = [];
  const values = [];

  // Verificar que el usuario existe
  const usuarioExistente = await queries.obtenerUsuarioPorId(id);
  if (!usuarioExistente) {
    return null;
  }

  // Si no hay campos para actualizar
  if (Object.keys(data).length === 0) {
    throw new Error("No se proporcionaron campos para actualizar");
  }

  for (const key in data) {
    // Excluir campos no actualizables
    if (key !== "id_usuario" && key !== "created_at" && key !== "deleted_at") {
      
      if (key === "password") {
        // Hashear la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(data[key], salt);
        fields.push("password_hash = ?");
        values.push(password_hash);
      } 
      else if (key === "username") {
        // Verificar que el nuevo username no esté en uso por otro usuario
        const usuarioConUsername = await queries.obtenerUsuarioPorUsername(data[key]);
        if (usuarioConUsername && usuarioConUsername.id_usuario !== parseInt(id)) {
          throw new Error("El username ya está en uso por otro usuario");
        }
        fields.push("username = ?");
        values.push(data[key]);
      }
      else if (key === "email_usuario") {
        // Verificar que el nuevo email no esté en uso por otro usuario
        const usuarioConEmail = await queries.obtenerUsuarioPorEmail(data[key]);
        if (usuarioConEmail && usuarioConEmail.id_usuario !== parseInt(id)) {
          throw new Error("El email ya está en uso por otro usuario");
        }
        fields.push("email_usuario = ?");
        values.push(data[key]);
      }
      else {
        // Otros campos
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }
  }

  if (fields.length === 0) {
    return null;
  }

  // Agregar updated_at
  fields.push("updated_at = CURRENT_TIMESTAMP");

  // Ejecutar actualización parcial
  const affectedRows = await queries.actualizarUsuarioParcial(id, fields, values);

  if (affectedRows === 0) {
    return null;
  }

  return await queries.obtenerUsuarioPorId(id);
};

/**
 * ✅ Actualiza la fecha de último login
 * Llamada después de un login exitoso
 */
exports.actualizarUltimoLogin = async (id_usuario) => {
  try {
    await queries.actualizarUltimoLogin(id_usuario);
  } catch (error) {
    console.error("Error al actualizar último login:", error);
    // No lanzamos error para no interrumpir el flujo de login
  }
};

// --- SERVICIOS DE ELIMINACIÓN Y RESTAURACIÓN ---

/**
 * Elimina lógicamente un usuario
 * - Marca deleted_at con timestamp actual
 * - Cambia el estado a 'inactivo'
 */
exports.eliminarUsuario = async (id) => {
  const affectedRows = await queries.marcarComoEliminado(id);
  return affectedRows > 0;
};

/**
 * Restaura un usuario eliminado
 * - Limpia deleted_at (NULL)
 * - Cambia el estado a 'activo'
 */
exports.restaurarUsuario = async (id) => {
  const affectedRows = await queries.restaurarUsuarioEliminado(id);
  
  if (affectedRows === 0) {
    return null;
  }

  return await queries.obtenerUsuarioPorId(id);
};

// --- SERVICIOS DE AUTENTICACIÓN (LEGACY - NO SE USA EN EL NUEVO FLUJO) ---

/**
 * @deprecated Usar el nuevo flujo en auth.controller.js
 * Valida las credenciales de un usuario por email
 * - Busca el usuario por email
 * - Compara la contraseña con bcrypt
 * - Actualiza ultimo_login si es exitoso
 */
exports.validarCredencialesPorEmail = async (email, password) => {
  const usuario = await queries.obtenerUsuarioPorEmail(email);
  
  if (!usuario) {
    return null;
  }

  // Verificar que el usuario esté activo
  if (usuario.estado !== "activo") {
    throw new Error("Usuario inactivo");
  }

  // Obtener password_hash
  const usuarioConPassword = await queries.obtenerUsuarioConPassword(usuario.id_usuario);

  // Comparar contraseñas
  const passwordValida = await bcrypt.compare(password, usuarioConPassword.password_hash);
  
  if (!passwordValida) {
    return null;
  }

  // Actualizar último login
  await queries.actualizarUltimoLogin(usuario.id_usuario);

  // Retornar usuario sin el password_hash
  return await queries.obtenerUsuarioPorId(usuario.id_usuario);
};