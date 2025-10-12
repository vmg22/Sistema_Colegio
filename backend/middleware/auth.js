const jwt = require('jsonwebtoken');

const autenticarToken = (solicitud, respuesta, siguiente) => {
  const cabeceraAutorizacion = solicitud.headers['authorization'];
  const token = cabeceraAutorizacion && cabeceraAutorizacion.split(' ')[1];

  if (!token) {
    return respuesta.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, usuario) => {
    if (error) {
      return respuesta.status(403).json({ error: 'Token inválido' });
    }
    solicitud.usuario = usuario;
    siguiente();
  });
};

const autorizarRoles = (...rolesPermitidos) => {
  return (solicitud, respuesta, siguiente) => {
    if (!solicitud.usuario || !rolesPermitidos.includes(solicitud.usuario.rol)) {
      return respuesta.status(403).json({ error: 'No tiene permisos para esta acción' });
    }
    siguiente();
  };
};

module.exports = { autenticarToken, autorizarRoles };