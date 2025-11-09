const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const servicioUsuarios = require('./usuario.services');
const { exito, error } = require('../../utils/responses');
const { enviarRecuperacionPassword } = require('../../services/emails.service');
const dotenv = require('dotenv');
dotenv.config();

// Roles válidos según el esquema de la tabla usuario
const ROLES_VALIDOS = ["admin", "docente", "preceptor", "secretario", "tutor"];

// Blacklist de tokens en memoria (en producción usar Redis)
const tokenBlacklist = new Set();

// ==================== FUNCIONES AUXILIARES ====================

const esEmailValido = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const esIdValido = (id) => {
  const numId = parseInt(id, 10);
  return !isNaN(numId) && numId > 0;
};

const esPasswordSeguro = (password) => {
  if (!password || password.length < 8) return false;
  
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneMinuscula = /[a-z]/.test(password);
  const tieneNumero = /\d/.test(password);
  
  return tieneMayuscula && tieneMinuscula && tieneNumero;
};

const generarToken = (usuario, tipo = 'auth') => {
  const payload = {
    id: usuario.id_usuario,
    username: usuario.username,
    email: usuario.email_usuario,
    rol: usuario.rol,
    tipo: tipo
  };

  const options = {
    expiresIn: tipo === 'reset_password' ? '15m' : (process.env.JWT_EXPIRES_IN || '24h')
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const agregarTokenABlacklist = (token) => {
  tokenBlacklist.add(token);
};

const estaEnBlacklist = (token) => {
  return tokenBlacklist.has(token);
};

const extraerToken = (solicitud) => {
  const authHeader = solicitud.headers['authorization'];
  return authHeader && authHeader.split(' ')[1];
};

// ==================== CONTROLADOR DE AUTENTICACIÓN ====================

const controladorAuth = {
  
  /**
   * POST /api/auth/login
   * Inicio de sesión de usuario con email y contraseña
   * Flujo de seguridad mejorado
   */
  login: async (solicitud, respuesta) => {
    try {
      const { email_usuario, password } = solicitud.body;

      // 1. Validación de campos obligatorios
      if (!email_usuario || !password) {
        return error(
          respuesta,
          "Email y contraseña son obligatorios",
          400
        );
      }

      // 2. Validar formato de email
      if (!esEmailValido(email_usuario)) {
        return error(respuesta, "El formato del email no es válido", 400);
      }

      // 3. Buscar usuario por email (sin password)
      const usuario = await servicioUsuarios.obtenerUsuarioPorEmail(email_usuario);

      // 4. Si no existe, mensaje genérico (no revelar si el email existe)
      if (!usuario) {
        return error(respuesta, "Credenciales inválidas", 401);
      }

      // 5. Verificar estado ANTES de validar contraseña (seguridad)
      if (usuario.estado !== 'activo') {
        return error(
          respuesta, 
          "Cuenta inactiva. Contacte al administrador", 
          403
        );
      }

      // 6. Obtener usuario con password para validación
      const usuarioConPassword = await servicioUsuarios.obtenerUsuarioConPassword(
        usuario.id_usuario
      );

      if (!usuarioConPassword || !usuarioConPassword.password_hash) {
        return error(respuesta, "Error en la autenticación", 500);
      }

      // 7. Validar contraseña
      const passwordValido = await bcrypt.compare(
        password, 
        usuarioConPassword.password_hash
      );

      if (!passwordValido) {
        return error(respuesta, "Credenciales inválidas", 401);
      }

      // 8. Actualizar último login
      await servicioUsuarios.actualizarUltimoLogin(usuario.id_usuario);

      // 9. Generar token JWT
      const token = generarToken(usuario);

      // 10. Respuesta exitosa con rol y estado incluidos
      exito(respuesta, "Inicio de sesión exitoso", {
        token,
        usuario: {
          id_usuario: usuario.id_usuario,
          username: usuario.username,
          email_usuario: usuario.email_usuario,
          rol: usuario.rol,
          estado: usuario.estado,
          ultimo_login: new Date().toISOString()
        },
      });
    } catch (err) {
      console.error("Error en login:", err);
      error(respuesta, "Error al iniciar sesión", 500, err.message);
    }
  },

  /**
   * POST /api/auth/register
   * Registro de nuevo usuario
   */
  register: async (solicitud, respuesta) => {
    try {
      const { username, password, email_usuario, rol } = solicitud.body;

      if (!username || !password || !email_usuario || !rol) {
        return error(
          respuesta,
          "Username, password, email y rol son obligatorios",
          400
        );
      }

      if (!esEmailValido(email_usuario)) {
        return error(respuesta, "El formato del email no es válido", 400);
      }

      if (!esPasswordSeguro(password)) {
        return error(
          respuesta,
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
          400
        );
      }

      if (!ROLES_VALIDOS.includes(rol.toLowerCase())) {
        return error(
          respuesta,
          `El rol no es válido. Roles permitidos: ${ROLES_VALIDOS.join(", ")}`,
          400
        );
      }

      const usuarioCreado = await servicioUsuarios.crearUsuario({
        username,
        password,
        email_usuario,
        rol: rol.toLowerCase(),
      });

      const token = generarToken(usuarioCreado);

      exito(respuesta, "Usuario registrado exitosamente", {
        token,
        usuario: usuarioCreado,
      }, 201);
    } catch (err) {
      if (err.message.includes("ya está en uso")) {
        return error(respuesta, err.message, 409);
      }
      error(respuesta, "Error al registrar usuario", 400, err.message);
    }
  },

  /**
   * POST /api/auth/logout
   * Cierre de sesión (invalida el token)
   */
  logout: async (solicitud, respuesta) => {
    try {
      const token = extraerToken(solicitud);
      
      if (token) {
        agregarTokenABlacklist(token);
      }

      exito(respuesta, "Sesión cerrada correctamente", null);
    } catch (err) {
      error(respuesta, "Error al cerrar sesión", 500, err.message);
    }
  },

  /**
   * GET /api/auth/perfil
   * Obtiene el perfil del usuario autenticado
   */
  obtenerPerfil: async (solicitud, respuesta) => {
    try {
      const usuario = await servicioUsuarios.obtenerUsuarioPorId(
        solicitud.user.id
      );

      if (!usuario) {
        return error(respuesta, "Usuario no encontrado", 404);
      }

      exito(respuesta, "Perfil obtenido correctamente", usuario);
    } catch (err) {
      error(respuesta, "Error al obtener perfil", 500, err.message);
    }
  },

  /**
   * PATCH /api/auth/perfil
   * Actualiza el perfil del usuario autenticado
   */
  actualizarPerfil: async (solicitud, respuesta) => {
    try {
      const datosActualizados = solicitud.body;
      
      if (Object.keys(datosActualizados).length === 0) {
        return error(
          respuesta,
          "No se proporcionaron datos para actualizar",
          400
        );
      }

      if (datosActualizados.email_usuario && !esEmailValido(datosActualizados.email_usuario)) {
        return error(respuesta, "El formato del email no es válido", 400);
      }

      if (datosActualizados.password && !esPasswordSeguro(datosActualizados.password)) {
        return error(
          respuesta,
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
          400
        );
      }

      if (datosActualizados.rol) {
        return error(
          respuesta,
          "No puedes cambiar tu propio rol. Contacta a un administrador",
          403
        );
      }

      const usuarioActualizado = await servicioUsuarios.actualizarUsuarioParcial(
        solicitud.user.id,
        datosActualizados
      );

      if (!usuarioActualizado) {
        return error(respuesta, "Error al actualizar perfil", 400);
      }

      exito(respuesta, "Perfil actualizado correctamente", usuarioActualizado);
    } catch (err) {
      const statusCode = err.message.includes("ya está en uso") ? 409 : 400;
      error(respuesta, err.message, statusCode);
    }
  },

  /**
   * GET /api/auth/verificar
   * Verifica si el token actual es válido
   */
  verificarToken: async (solicitud, respuesta) => {
    try {
      exito(respuesta, "Token válido", {
        usuario: {
          id: solicitud.user.id,
          username: solicitud.user.username,
          email: solicitud.user.email,
          rol: solicitud.user.rol
        }
      });
    } catch (err) {
      error(respuesta, "Error al verificar token", 500, err.message);
    }
  },

  /**
   * POST /api/auth/solicitar-reset
   * Solicita reset de contraseña (envía email con token)
   */
  solicitarReset: async (solicitud, respuesta) => {
    try {
      const { email_usuario } = solicitud.body;

      if (!email_usuario) {
        return error(respuesta, "El email es obligatorio", 400);
      }

      if (!esEmailValido(email_usuario)) {
        return error(respuesta, "El formato del email no es válido", 400);
      }

      const mensajeGenerico = "Si el email existe, recibirás un correo con instrucciones para recuperar tu contraseña";

      const usuario = await servicioUsuarios.obtenerUsuarioPorEmail(email_usuario);

      if (!usuario) {
        console.log('📭 Usuario no encontrado para email:', email_usuario);
        return exito(respuesta, mensajeGenerico, null);
      }

      if (usuario.estado !== "activo") {
        console.log('🚫 Usuario inactivo:', usuario.email_usuario);
        return exito(respuesta, mensajeGenerico, null);
      }

      console.log('✅ Usuario encontrado y activo:', usuario.email_usuario);

      const token = jwt.sign(
        {
          id: usuario.id_usuario,
          email: usuario.email_usuario,
          tipo: "reset_password",
        },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      const encodedToken = encodeURIComponent(token);
      const resetLink = `http://localhost:5173/reset-password?token=${encodedToken}`;

      console.log('🔐 Token original:', token);
      console.log('🔐 Token encoded:', encodedToken);
      console.log('🔗 Reset link:', resetLink);

      await enviarRecuperacionPassword(
        usuario.email_usuario, 
        resetLink, 
        usuario.username
      );

      console.log('✅ Email enviado exitosamente');
      exito(respuesta, mensajeGenerico, null);
    } catch (err) {
      console.error("❌ Error completo en solicitud de reset:", err);
      console.error("Stack:", err.stack);
      error(
        respuesta,
        "Error al procesar solicitud de recuperación",
        500,
        err.message
      );
    }
  },

  /**
   * GET /api/auth/validar-token-reset/:token
   * Valida si el token de recuperación es válido
   */
  validarTokenReset: async (solicitud, respuesta) => {
    try {
      const { token } = solicitud.params;

      if (!token) {
        return error(respuesta, "Token no proporcionado", 400);
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.tipo !== "reset_password") {
        return error(respuesta, "Token inválido", 401);
      }

      const usuario = await servicioUsuarios.obtenerUsuarioPorId(decoded.id);

      if (!usuario || usuario.estado !== "activo") {
        return error(respuesta, "Token inválido o expirado", 401);
      }

      exito(respuesta, "Token válido", {
        valid: true,
        email: decoded.email,
      });
    } catch (err) {
      if (err.name === "JsonWebTokenError") {
        return error(respuesta, "Token inválido", 401);
      }
      if (err.name === "TokenExpiredError") {
        return error(respuesta, "El token ha expirado. Solicita uno nuevo", 401);
      }
      error(respuesta, "Error al validar token", 500, err.message);
    }
  },

  /**
   * POST /api/auth/reset-password
   * Cambia la contraseña usando el token de recuperación
   */
  resetPassword: async (solicitud, respuesta) => {
    try {
      const { token, newPassword } = solicitud.body;

      if (!token || !newPassword) {
        return error(
          respuesta,
          "Token y nueva contraseña son obligatorios",
          400
        );
      }

      if (!esPasswordSeguro(newPassword)) {
        return error(
          respuesta,
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
          400
        );
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.tipo !== "reset_password") {
        return error(respuesta, "Token inválido", 401);
      }

      const usuario = await servicioUsuarios.obtenerUsuarioPorId(decoded.id);

      if (!usuario || usuario.estado !== "activo") {
        return error(respuesta, "Token inválido o expirado", 401);
      }

      await servicioUsuarios.actualizarUsuarioParcial(decoded.id, { 
        password: newPassword 
      });

      exito(respuesta, "Contraseña actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña", null);
    } catch (err) {
      if (err.name === "JsonWebTokenError") {
        return error(respuesta, "Token inválido", 401);
      }
      if (err.name === "TokenExpiredError") {
        return error(respuesta, "El token ha expirado. Solicita uno nuevo", 401);
      }
      error(respuesta, "Error al cambiar contraseña", 500, err.message);
    }
  },

  /**
   * POST /api/auth/cambiar-password-autenticado
   * Cambia la contraseña del usuario autenticado
   */
  cambiarPasswordAutenticado: async (solicitud, respuesta) => {
    try {
      const { currentPassword, newPassword } = solicitud.body;

      if (!currentPassword || !newPassword) {
        return error(
          respuesta,
          "Contraseña actual y nueva contraseña son obligatorias",
          400
        );
      }

      if (!esPasswordSeguro(newPassword)) {
        return error(
          respuesta,
          "La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
          400
        );
      }

      const usuario = await servicioUsuarios.obtenerUsuarioPorId(solicitud.user.id);
      
      if (!usuario) {
        return error(respuesta, "Usuario no encontrado", 404);
      }

      const usuarioConPassword = await servicioUsuarios.obtenerUsuarioConPassword(solicitud.user.id);
      
      const passwordValido = await bcrypt.compare(currentPassword, usuarioConPassword.password_hash);

      if (!passwordValido) {
        return error(respuesta, "La contraseña actual es incorrecta", 401);
      }

      await servicioUsuarios.actualizarUsuarioParcial(solicitud.user.id, { 
        password: newPassword 
      });

      const token = extraerToken(solicitud);
      if (token) {
        agregarTokenABlacklist(token);
      }

      exito(respuesta, "Contraseña actualizada exitosamente. Por seguridad, inicia sesión nuevamente", null);
    } catch (err) {
      error(respuesta, "Error al cambiar contraseña", 500, err.message);
    }
  },

  verificarBlacklist: (token) => {
    return estaEnBlacklist(token);
  }
};

module.exports = controladorAuth;