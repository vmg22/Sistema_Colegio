// utils/responses.js - VERSIÓN CORREGIDA
const exito = (respuesta, mensaje, datos = null, codigoEstado = 200) => {
  const respuestaEstandar = {
    exito: true,
    mensaje,
    datos,
    marcaTiempo: new Date().toISOString()
  };
  return respuesta.status(codigoEstado).json(respuestaEstandar);
};

const error = (respuesta, mensaje, codigoEstado = 500, detallesError = null) => {
  const respuestaEstandar = {
    exito: false,
    mensaje,
    ...(detallesError && process.env.NODE_ENV === 'development' && { detallesError }),
    marcaTiempo: new Date().toISOString()
  };
  return respuesta.status(codigoEstado).json(respuestaEstandar);
};

module.exports = { exito, error };