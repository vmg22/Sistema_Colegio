const Joi = require('joi');

/**
 * Middleware que valida el cuerpo de una solicitud (req.body) contra un esquema de Joi.
 * @param {Joi.Schema} schema El esquema de Joi para validar.
 */
const validarEsquema = (schema) => {
  return (req, res, next) => {
    // Validamos req.body con el esquema proporcionado.
    // { abortEarly: false } asegura que se reporten todos los errores, no solo el primero.
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      // Si hay un error de validación, formateamos los detalles y respondemos con un 400.
      const errores = error.details.map(detalle => ({
        mensaje: detalle.message.replace(/"/g, "'"), // Limpiamos las comillas dobles
        campo: detalle.context.key,
      }));
      
      return res.status(400).json({
        error: 'Error de Validación',
        detalles: errores,
      });
    }

    // Si la validación es exitosa, continuamos con el siguiente middleware o controlador.
    next();
  };
};

module.exports = { validarEsquema };

// --- Ejemplo de cómo se crearía un esquema en otro archivo (ej: alumno.schemas.js) ---
/*
const crearAlumnoEsquema = Joi.object({
  nombre_alumno: Joi.string().min(3).max(50).required(),
  apellido_alumno: Joi.string().min(3).max(50).required(),
  dni_alumno: Joi.string().pattern(/^[0-9]{7,8}$/).required(),
  email: Joi.string().email().optional().allow(null, ''),
  fecha_nacimiento: Joi.date().iso().required(),
  // ... y otros campos
});

// En alumno.routes.js se usaría así:
// router.post('/', validarEsquema(crearAlumnoEsquema), alumnoController.crear);
*/