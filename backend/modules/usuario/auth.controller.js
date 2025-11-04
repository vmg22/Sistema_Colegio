const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const servicioUsuarios = require('./usuario.services');
const { exito, error } = require('../../utils/responses');
const { enviarRecuperacionPassword } = require('../../services/emails.service');
const dotenv = require('dotenv');
dotenv.config();

console.log('✅ enviarRecuperacionPassword importado:', typeof enviarRecuperacionPassword);

// Roles válidos según el esquema de la tabla usuario
const ROLES_VALIDOS = ["admin", "docente", "preceptor", "secretario", "tutor"];

// Blacklist de tokens en memoria (en producción usar Redis)
const tokenBlacklist = new Set();

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Función auxiliar para verificar formato de email.
 */
const esEmailValido = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Función auxiliar para verificar si un ID es un entero positivo
 */
const esIdValido = (id) => {
  const numId = parseInt(id, 10);
  return !isNaN(numId) && numId > 0;
};

/**
 * Función auxiliar para validar fortaleza de contraseña
 * Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número
 */
const esPasswordSeguro = (password) => {
  if (!password || password.length < 8) return false;
  
  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneMinuscula = /[a-z]/.test(password);
  const tieneNumero = /\d/.test(password);
  
  return tieneMayuscula && tieneMinuscula && tieneNumero;
};

/**
 * Genera un token JWT para un usuario
 */
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

/**
 * Agrega un token a la blacklist
 */
const agregarTokenABlacklist = (token) => {
  tokenBlacklist.add(token);
  // En producción: guardar en Redis con TTL igual a la expiración del token
  // await redisClient.setex(`blacklist:${token}`, ttl, 'true');
};

/**
 * Verifica si un token está en la blacklist
 */
const estaEnBlacklist = (token) => {
  return tokenBlacklist.has(token);
  // En producción: verificar en Redis
  // return await redisClient.exists(`blacklist:${token}`);
};

/**
 * Extrae el token de la cabecera Authorization
 */
const extraerToken = (solicitud) => {
  const authHeader = solicitud.headers['authorization'];
  return authHeader && authHeader.split(' ')[1];
};

// ==================== CONTROLADOR DE AUTENTICACIÓN ====================

const controladorAuth = {
  
  // ==================== LOGIN Y REGISTRO ====================

  /**
   * POST /api/auth/login
   * Inicio de sesión de usuario con email y contraseña
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

      // 3. Validar credenciales usando el servicio
      const usuario = await servicioUsuarios.validarCredencialesPorEmail(
        email_usuario, 
        password
      );

      if (!usuario) {
        return error(respuesta, "Credenciales inválidas", 401);
      }

      // 4. Generar token JWT
      const token = generarToken(usuario);

      // 5. Respuesta exitosa (sin enviar password_hash)
      exito(respuesta, "Inicio de sesión exitoso", {
        token,
        usuario: {
          id_usuario: usuario.id_usuario,
          username: usuario.username,
          email_usuario: usuario.email_usuario,
          rol: usuario.rol,
          estado: usuario.estado,
          ultimo_login: usuario.ultimo_login
        },
      });
    } catch (err) {
      // Manejo de errores específicos
      if (err.message === "Usuario inactivo") {
        return error(respuesta, "Usuario inactivo. Contacte al administrador", 403);
      }
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

      // 1. Validación de campos obligatorios
      if (!username || !password || !email_usuario || !rol) {
        return error(
          respuesta,
          "Username, password, email y rol son obligatorios",
          400
        );
      }

      // 2. Validar formato de email
      if (!esEmailValido(email_usuario)) {
        return error(respuesta, "El formato del email no es válido", 400);
      }

      // 3. Validar fortaleza de contraseña
      if (!esPasswordSeguro(password)) {
        return error(
          respuesta,
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
          400
        );
      }

      // 4. Validar rol
      if (!ROLES_VALIDOS.includes(rol.toLowerCase())) {
        return error(
          respuesta,
          `El rol no es válido. Roles permitidos: ${ROLES_VALIDOS.join(", ")}`,
          400
        );
      }

      // 5. Crear usuario
      const usuarioCreado = await servicioUsuarios.crearUsuario({
        username,
        password,
        email_usuario,
        rol: rol.toLowerCase(),
      });

      // 6. Generar token JWT para login automático
      const token = generarToken(usuarioCreado);

      exito(respuesta, "Usuario registrado exitosamente", {
        token,
        usuario: usuarioCreado,
      }, 201);
    } catch (err) {
      // Errores de duplicados
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
        // Agregar token a la blacklist
        agregarTokenABlacklist(token);
      }

      exito(respuesta, "Sesión cerrada correctamente", null);
    } catch (err) {
      error(respuesta, "Error al cerrar sesión", 500, err.message);
    }
  },

  // ==================== PERFIL DE USUARIO ====================

  /**
   * GET /api/auth/perfil
   * Obtiene el perfil del usuario autenticado
   * Requiere: authenticateToken middleware
   */
  obtenerPerfil: async (solicitud, respuesta) => {
    try {
      // req.user viene del middleware authenticateToken
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
   * Requiere: authenticateToken middleware
   */
  actualizarPerfil: async (solicitud, respuesta) => {
    try {
      const datosActualizados = solicitud.body;
      
      // Validar que se envió al menos un campo
      if (Object.keys(datosActualizados).length === 0) {
        return error(
          respuesta,
          "No se proporcionaron datos para actualizar",
          400
        );
      }

      // Validar email si está presente
      if (datosActualizados.email_usuario && !esEmailValido(datosActualizados.email_usuario)) {
        return error(respuesta, "El formato del email no es válido", 400);
      }

      // Validar password si está presente
      if (datosActualizados.password && !esPasswordSeguro(datosActualizados.password)) {
        return error(
          respuesta,
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
          400
        );
      }

      // No permitir cambio de rol desde el perfil
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
   * Requiere: authenticateToken middleware
   */
  verificarToken: async (solicitud, respuesta) => {
    try {
      // Si llega aquí, el token ya fue validado por el middleware
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

  // ==================== RECUPERACIÓN DE CONTRASEÑA ====================

  /**
   * POST /api/auth/solicitar-reset
   * Solicita reset de contraseña (envía email con token)
   */
  solicitarReset: async (solicitud, respuesta) => {
    try {
      const { email_usuario } = solicitud.body;

      // 1. Validación de campo obligatorio
      if (!email_usuario) {
        return error(respuesta, "El email es obligatorio", 400);
      }

      // 2. Validar formato de email
      if (!esEmailValido(email_usuario)) {
        return error(respuesta, "El formato del email no es válido", 400);
      }

      // Mensaje genérico por seguridad
      const mensajeGenerico = "Si el email existe, recibirás un correo con instrucciones para recuperar tu contraseña";

      // 3. Buscar usuario por email
      const usuario = await servicioUsuarios.obtenerUsuarioPorEmail(email_usuario);

      if (!usuario) {
        console.log('📭 Usuario no encontrado para email:', email_usuario);
        return exito(respuesta, mensajeGenerico, null);
      }

      // 4. Verificar que el usuario esté activo
      if (usuario.estado !== "activo") {
        console.log('🚫 Usuario inactivo:', usuario.email_usuario);
        return exito(respuesta, mensajeGenerico, null);
      }

      console.log('✅ Usuario encontrado y activo:', usuario.email_usuario);

      // 5. Generar token de recuperación (válido por 15 minutos)
      const token = jwt.sign(
  {
    id: usuario.id_usuario,
    email: usuario.email_usuario,
    tipo: "reset_password",
  },
  process.env.JWT_SECRET,
  { expiresIn: "15m" }
);

// CODIFICAR CORRECTAMENTE el token para URL
const encodedToken = encodeURIComponent(token);

// Construir el link
const resetLink = `http://localhost:5173/reset-password?token=${encodedToken}`;

console.log('🔐 Token original:', token);
console.log('🔐 Token encoded:', encodedToken);
console.log('🔗 Reset link:', resetLink);
      // 9. Enviar email usando el servicio de emails
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

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verificar que sea un token de reset
      if (decoded.tipo !== "reset_password") {
        return error(respuesta, "Token inválido", 401);
      }

      // Verificar que el usuario siga existiendo y activo
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

      // 1. Validación de campos obligatorios
      if (!token || !newPassword) {
        return error(
          respuesta,
          "Token y nueva contraseña son obligatorios",
          400
        );
      }

      // 2. Validar fortaleza de contraseña
      if (!esPasswordSeguro(newPassword)) {
        return error(
          respuesta,
          "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
          400
        );
      }

      // 3. Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Verificar que sea un token de reset
      if (decoded.tipo !== "reset_password") {
        return error(respuesta, "Token inválido", 401);
      }

      // 5. Verificar que el usuario siga existiendo y activo
      const usuario = await servicioUsuarios.obtenerUsuarioPorId(decoded.id);

      if (!usuario || usuario.estado !== "activo") {
        return error(respuesta, "Token inválido o expirado", 401);
      }

      // 6. Actualizar contraseña usando el servicio (que la hasheará)
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
   * Cambia la contraseña del usuario autenticado (sin token de recuperación)
   * Requiere: authenticateToken middleware
   */
  cambiarPasswordAutenticado: async (solicitud, respuesta) => {
    try {
      const { currentPassword, newPassword } = solicitud.body;

      // 1. Validación de campos obligatorios
      if (!currentPassword || !newPassword) {
        return error(
          respuesta,
          "Contraseña actual y nueva contraseña son obligatorias",
          400
        );
      }

      // 2. Validar fortaleza de nueva contraseña
      if (!esPasswordSeguro(newPassword)) {
        return error(
          respuesta,
          "La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
          400
        );
      }

      // 3. Obtener usuario con password_hash
      const usuario = await servicioUsuarios.obtenerUsuarioPorId(solicitud.user.id);
      
      if (!usuario) {
        return error(respuesta, "Usuario no encontrado", 404);
      }

      // 4. Verificar contraseña actual (necesitamos el password_hash)
      // Nota: Esto requiere una query especial que incluya password_hash
      const usuarioConPassword = await servicioUsuarios.obtenerUsuarioConPassword(solicitud.user.id);
      
      const passwordValido = await bcrypt.compare(currentPassword, usuarioConPassword.password_hash);

      if (!passwordValido) {
        return error(respuesta, "La contraseña actual es incorrecta", 401);
      }

      // 5. Actualizar contraseña
      await servicioUsuarios.actualizarUsuarioParcial(solicitud.user.id, { 
        password: newPassword 
      });

      // 6. Invalidar el token actual (opcional - forzar re-login)
      const token = extraerToken(solicitud);
      if (token) {
        agregarTokenABlacklist(token);
      }

      exito(respuesta, "Contraseña actualizada exitosamente. Por seguridad, inicia sesión nuevamente", null);
    } catch (err) {
      error(respuesta, "Error al cambiar contraseña", 500, err.message);
    }
  },

  // ==================== UTILIDADES ====================

  /**
   * Verifica si un token está en la blacklist
   * Usado por el middleware
   */
  verificarBlacklist: (token) => {
    return estaEnBlacklist(token);
  }
};

module.exports = controladorAuth;