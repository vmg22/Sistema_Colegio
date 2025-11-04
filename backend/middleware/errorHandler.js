/**
 * Middleware centralizado para el manejo de errores.
 * Captura todos los errores pasados por next(error) y envía una respuesta HTTP estandarizada.
 */
const manejadorErrores = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // Si ya respondió, no hagas nada
  }

  console.error('🔥 ERROR CAPTURADO:', err);
  const statusCode = err.statusCode || 500;

  // --- MANEJO DE ERRORES ESPECÍFICOS DE MYSQL ---
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ // 409 Conflict
      error: 'Conflicto de Datos',
      mensaje: 'El registro que intenta crear ya existe (por ejemplo, DNI o email duplicado).',
    });
  }

  // --- MANEJO DE ERRORES ESPECÍFICOS DE JWT ---
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ // 401 Unauthorized
      error: 'Token Inválido',
      mensaje: 'El token proporcionado no es válido o ha sido alterado.',
    });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ // 401 Unauthorized
        error: 'Token Expirado',
        mensaje: 'Su sesión ha expirado. Por favor, inicie sesión de nuevo.',
    });
  }

  // --- RESPUESTA GENÉRICA ---
  // Para un entorno de producción, no queremos filtrar detalles internos del error.
  const enProduccion = process.env.NODE_ENV === 'production';
  
  res.status(statusCode).json({
    error: err.name || 'ErrorInternoDelServidor',
    // Si el error tiene un mensaje y no estamos en producción, lo mostramos.
    // Si estamos en producción, mostramos un mensaje genérico.
    mensaje: !enProduccion || err.isOperational ? err.message : 'Ocurrió un error inesperado en el servidor.',
    // Solo mostramos el stack trace en desarrollo
    ...( !enProduccion && { stack: err.stack })
  });
};

module.exports = { manejadorErrores };