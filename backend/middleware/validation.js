// middleware/validation.js
const validarCamposRequeridos = (camposRequeridos) => {
  return (solicitud, respuesta, siguiente) => {
    const errores = [];
    const datos = { ...solicitud.body, ...solicitud.params, ...solicitud.query };

    camposRequeridos.forEach(campo => {
      if (datos[campo] === undefined || datos[campo] === null || datos[campo] === '') {
        errores.push(`El campo '${campo}' es requerido`);
      }
    });

    if (errores.length > 0) {
      return respuesta.status(400).json({
        error: 'Error de validación',
        detalles: errores
      });
    }

    siguiente();
  };
};

const validarTipos = (esquema) => {
  return (solicitud, respuesta, siguiente) => {
    const errores = [];
    const datos = solicitud.body;

    for (const [campo, tipo] of Object.entries(esquema)) {
      if (datos[campo] !== undefined) {
        switch (tipo) {
          case 'string':
            if (typeof datos[campo] !== 'string') {
              errores.push(`El campo '${campo}' debe ser una cadena de texto`);
            }
            break;
          case 'number':
            if (typeof datos[campo] !== 'number' || isNaN(datos[campo])) {
              errores.push(`El campo '${campo}' debe ser un número válido`);
            }
            break;
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(datos[campo])) {
              errores.push(`El campo '${campo}' debe ser un email válido`);
            }
            break;
        }
      }
    }

    if (errores.length > 0) {
      return respuesta.status(400).json({
        error: 'Error de validación',
        detalles: errores
      });
    }

    siguiente();
  };
};

module.exports = { validarCamposRequeridos, validarTipos };