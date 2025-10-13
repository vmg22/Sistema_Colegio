const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar la validez de un token JWT en la cabecera de autorización.
 * Si el token es válido, añade la información del usuario decodificada a `req.user`.
 */
const authenticateToken = (req, res, next) => {
  // Obtenemos la cabecera 'Authorization', que debería tener el formato "Bearer TOKEN"
  const authHeader = req.headers['authorization'];
  // Extraemos el token, si la cabecera existe
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // 401 Unauthorized: El cliente no ha proporcionado un token.
    return res.status(401).json({ 
      error: 'Acceso Denegado',
      mensaje: 'Se requiere un token de autenticación para este recurso.' 
    });
  }

  // Verificamos el token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // 403 Forbidden: El cliente proporcionó un token, pero es inválido o ha expirado.
      // El error de JWT (err) será capturado por nuestro manejador de errores global.
      return next(err); 
    }
    // Si el token es válido, adjuntamos el payload del usuario al objeto de solicitud (req)
    req.user = user;
    // Continuamos con la siguiente función en la cadena de middlewares
    next();
  });
};

/**
 * Middleware de fábrica para autorizar el acceso basado en roles de usuario.
 * Debe usarse SIEMPRE DESPUÉS de `authenticateToken`.
 * @param {...string} allowedRoles - Una lista de roles permitidos para acceder al recurso.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Verificamos si el usuario (añadido por authenticateToken) tiene un rol incluido en la lista de permitidos.
    if (!req.user || !req.user.rol || !allowedRoles.includes(req.user.rol)) {
      // 403 Forbidden: El usuario está autenticado, pero no tiene los permisos necesarios.
      return res.status(403).json({ 
        error: 'Permiso Denegado',
        mensaje: 'No tiene los permisos necesarios para realizar esta acción.' 
      });
    }
    // Si el rol es válido, permitimos el acceso.
    next();
  };
};

module.exports = { 
  authenticateToken, 
  authorizeRoles 
};