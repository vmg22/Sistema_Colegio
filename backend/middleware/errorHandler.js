const manejadorErrores = (error, solicitud, respuesta, siguiente) => {
  console.error('🔥 Error:', error);

  // Error de validación
  if (error.nombre === 'ErrorValidacion') {
    return respuesta.status(400).json({
      error: 'Error de validación',
      detalles: error.detalles || error.mensaje
    });
  }

  // Error de base de datos - entrada duplicada
  if (error.codigo === 'ER_DUP_ENTRY') {
    return respuesta.status(409).json({
      error: 'Registro duplicado',
      mensaje: 'El registro ya existe en la base de datos'
    });
  }

  // Error JWT
  if (error.nombre === 'JsonWebTokenError') {
    return respuesta.status(401).json({
      error: 'Token inválido'
    });
  }

  // Error genérico
  respuesta.status(error.estado || 500).json({
    error: process.env.NODE_ENV === 'development' ? error.mensaje : 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { pila: error.pila })
  });
};

module.exports = { manejadorErrores };