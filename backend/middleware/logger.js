// middleware/logger.js
const logger = (solicitud, respuesta, siguiente) => {
  const marcaTiempo = new Date().toISOString();
  const metodo = solicitud.method;
  const url = solicitud.url;
  const ip = solicitud.ip || solicitud.connection.remoteAddress;

  console.log(`[${marcaTiempo}] ${metodo} ${url} - IP: ${ip}`);

  respuesta.on('finish', () => {
    const duracion = new Date() - solicitud._startTime;
    console.log(`[${marcaTiempo}] ${metodo} ${url} - ${respuesta.statusCode} - ${duracion}ms`);
  });

  solicitud._startTime = new Date();
  siguiente();
};

module.exports = { logger };