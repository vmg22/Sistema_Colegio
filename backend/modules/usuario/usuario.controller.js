const servicioUsuarios = require("./usuario.services"); // Corregido: Se asume que el archivo de servicio es 'auth.services.js'
const { exito, error } = require("../../utils/responses");

// Roles válidos según el esquema de la tabla usuario
const ROLES_VALIDOS = ["admin", "docente", "preceptor", "secretario", "tutor"];

/**
 * Función auxiliar para verificar formato de email.
 */
const esEmailValido = (email) => {
  // Regex simple para verificar la estructura básica de un email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Función auxiliar para verificar si un ID es un entero positivo
const esIdValido = (id) => {
  const numId = parseInt(id, 10);
  return !isNaN(numId) && numId > 0;
};

const controladorUsuarios = {
  // GET /api/auth
  obtenerTodosUsuarios: async (solicitud, respuesta) => {
    try {
      // NOTA: Aquí debería haber un middleware de AUTORIZACIÓN (ej. solo Admin)
      const usuarios = await servicioUsuarios.obtenerTodosUsuarios();
      exito(respuesta, "Usuarios obtenidos correctamente", usuarios);
    } catch (err) {
      error(respuesta, "Error al obtener usuarios", 500, err.message);
    }
  }, // GET /api/auth/:id

  obtenerUsuarioPorId: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params; // Validación simple de ID

      if (!esIdValido(id)) {
        return error(respuesta, "El ID proporcionado no es válido", 400);
      }

      const usuario = await servicioUsuarios.obtenerUsuarioPorId(id);

      if (!usuario) {
        return error(respuesta, "Usuario no encontrado", 404);
      }

      exito(respuesta, "Usuario obtenido correctamente", usuario);
    } catch (err) {
      error(respuesta, "Error al obtener usuario", 500, err.message);
    }
  }, // POST /api/auth

  crearUsuario: async (solicitud, respuesta) => {
    try {
      const datosUsuario = solicitud.body; // 1. Verificación de campos obligatorios // Se espera 'password' en texto plano.

      const { username, password, email_usuario, rol } = datosUsuario;

      if (!username || !password || !email_usuario || !rol) {
        return error(
          respuesta,
          "Username, password, email y rol son obligatorios",
          400
        );
      } // 2. Validación de formato de datos

      if (!esEmailValido(email_usuario)) {
        return error(respuesta, "El formato del email no es válido", 400);
      } // 3. Validación de Rol // NOTA: Se recomienda añadir validación de longitud/complejidad para username y password aquí.

      if (!ROLES_VALIDOS.includes(rol.toLowerCase())) {
        return error(
          respuesta,
          `El rol '${rol}' no es válido. Roles permitidos: ${ROLES_VALIDOS.join(
            ", "
          )}`,
          400
        );
      } // El servicio recibe 'password', la hashea y la guarda como 'password_hash'.

      const usuarioCreado = await servicioUsuarios.crearUsuario(datosUsuario);
      exito(respuesta, "Usuario creado exitosamente", usuarioCreado, 201);
    } catch (err) {
      // Manejo de errores que puede incluir duplicidad de UNIQUE KEY de la DB (username o email)
      error(
        respuesta,
        "Error al crear usuario. Posible duplicado de username/email o datos inválidos.",
        400,
        err.message
      );
    }
  }, // PUT /api/auth/:id

  actualizarUsuario: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body; // Validación simple de ID

      if (!esIdValido(id)) {
        return error(respuesta, "El ID proporcionado no es válido", 400);
      } // 1. Control si no hay datos para actualizar

      if (Object.keys(datosActualizados).length === 0) {
        return error(
          respuesta,
          "No se proporcionaron datos para actualizar",
          400
        );
      } // 2. Validación de formato de Email si está presente

      if (
        datosActualizados.email_usuario &&
        !esEmailValido(datosActualizados.email_usuario)
      ) {
        return error(
          respuesta,
          "El formato del email a actualizar no es válido",
          400
        );
      } // 3. Validación de Rol si está presente

      if (
        datosActualizados.rol &&
        !ROLES_VALIDOS.includes(datosActualizados.rol.toLowerCase())
      ) {
        return error(
          respuesta,
          `El rol a actualizar no es válido. Roles permitidos: ${ROLES_VALIDOS.join(
            ", "
          )}`,
          400
        );
      }

      // Nota: Si datosActualizados.password existe, el servicio la detectará y la hasheará.

      const usuarioActualizado = await servicioUsuarios.actualizarUsuario(
        id,
        datosActualizados
      ); // El servicio devuelve null si no encontró el usuario o si no se pudo actualizar

      if (!usuarioActualizado) {
        return error(respuesta, "Usuario no encontrado o ya eliminado", 404);
      }

      exito(respuesta, "Usuario actualizado correctamente", usuarioActualizado);
    } catch (err) {
      error(
        respuesta,
        "Error al actualizar usuario. Verifique el ID y los datos.",
        400,
        err.message
      );
    }
  }, 

  eliminarUsuario: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params; // Validación simple de ID

      if (!esIdValido(id)) {
        return error(respuesta, "El ID proporcionado no es válido", 400);
      }

      const fueEliminado = await servicioUsuarios.eliminarUsuario(id);

      if (!fueEliminado) {
        return error(
          respuesta,
          "Usuario no encontrado o ya estaba eliminado",
          404
        );
      }

      exito(respuesta, "Usuario eliminado correctamente", null, 200);
    } catch (err) {
      error(respuesta, "Error al eliminar usuario", 400, err.message);
    }
  }, // GET /api/usuarios/eliminados/listar

  obtenerUsuariosEliminados: async (solicitud, respuesta) => {
    try {
      // NOTA: Aquí debería haber un middleware de AUTORIZACIÓN (ej. solo Admin)
      const usuariosEliminados =
        await servicioUsuarios.obtenerUsuariosEliminados();
      exito(respuesta, "Usuarios eliminados obtenidos", usuariosEliminados);
    } catch (err) {
      error(
        respuesta,
        "Error al obtener usuarios eliminados",
        500,
        err.message
      );
    }
  }, 

  restaurarUsuario: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params; // Validación simple de ID

      if (!esIdValido(id)) {
        return error(respuesta, "El ID proporcionado no es válido", 400);
      }

      const usuarioRestaurado = await servicioUsuarios.restaurarUsuario(id);

      if (!usuarioRestaurado) {
        return error(
          respuesta,
          "Usuario no encontrado o no estaba eliminado",
          404
        );
      }

      exito(respuesta, "Usuario restaurado correctamente", usuarioRestaurado);
    } catch (err) {
      error(respuesta, "Error al restaurar usuario", 400, err.message);
    }
  },


// PATCH /api/usuarios/:id
 
  actualizarUsuarioParcial: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;

      if (!esIdValido(id)) {
        return error(respuesta, "El ID proporcionado no es válido", 400);
      }

      // 1. Verificar que se envió al menos un campo
      if (Object.keys(datosActualizados).length === 0) {
        return error(
          respuesta,
          "No se proporcionaron datos para actualizar",
          400
        );
      }

      // 2. Validación de formato de email si está presente
      if (datosActualizados.email_usuario && !esEmailValido(datosActualizados.email_usuario)) {
        return error(respuesta, "El formato del email no es válido", 400);
      }

      // 3. Validación de rol si está presente
      if (datosActualizados.rol && !ROLES_VALIDOS.includes(datosActualizados.rol.toLowerCase())) {
        return error(
          respuesta,
          `El rol no es válido. Roles permitidos: ${ROLES_VALIDOS.join(", ")}`,
          400
        );
      }

      const usuarioActualizado = await servicioUsuarios.actualizarUsuarioParcial(
        id,
        datosActualizados
      );

      if (!usuarioActualizado) {
        return error(respuesta, "Usuario no encontrado o ya eliminado", 404);
      }

      exito(respuesta, "Usuario actualizado parcialmente", usuarioActualizado);
    } catch (err) {
      const statusCode = err.message.includes("ya está en uso") ? 409 : 400;
      error(respuesta, err.message, statusCode);
    }
  },

// obtenerPorEmail: async (solicitud, respuesta) => {
//     try {
//       const { email } = solicitud.params;

//       if (!email) {
//         return error(respuesta, "Email es obligatorio", 400);
//       }

//       const usuario = await servicioUsuarios.obtenerUsuarioPorEmail(email);

//       if (!usuario) {
//         return error(respuesta, "Usuario no encontrado", 404);
//       }

//       // No enviar información sensible
//       const { password_hash, ...usuarioSinPassword } = usuario;

//       exito(respuesta, "Usuario encontrado", usuarioSinPassword);
//     } catch (err) {
//       error(respuesta, "Error al obtener usuario por email", 500, err.message);
//     }
//   }, // 
// };

obtenerPorEmail: async (solicitud, respuesta) => {
  try {
    const { email } = solicitud.params;

    if (!esEmailValido(email)) {
      return error(respuesta, "El formato del email no es válido", 400);
    }

    const usuario = await servicioUsuarios.obtenerUsuarioPorEmail(email);

    if (!usuario) {
      return error(respuesta, "Usuario no encontrado", 404);
    }

    exito(respuesta, "Usuario encontrado", usuario);
  } catch (err) {
    error(respuesta, "Error al obtener usuario por email", 500, err.message);
  }
}
 };
module.exports = controladorUsuarios;
