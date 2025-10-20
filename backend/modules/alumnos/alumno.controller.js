// src/modules/alumnos/alumno.controller.js

const servicioAlumnos = require('./alumno.services');

// Helper para manejar errores de forma centralizada
const manejarError = (res, error, mensajeDefault) => {
  console.error(error);
  const statusCode = error.statusCode || 500;
  const mensaje = error.message || mensajeDefault;
  res.status(statusCode).json({ mensaje });
};

const controladorAlumnos = {
  // --- CRUD PRINCIPAL ---
  obtenerTodos: async (req, res) => {
    try {
      const alumnos = await servicioAlumnos.obtenerTodos();
      res.status(200).json(alumnos);
    } catch (error) {
      manejarError(res, error, 'Error al obtener los alumnos.');
    }
  },

  crear: async (req, res) => {
    try {
      const alumnoCreado = await servicioAlumnos.crear(req.body);
      res.status(201).json({ mensaje: 'Alumno creado exitosamente.', data: alumnoCreado });
    } catch (error) {
      manejarError(res, error, 'Error al crear el alumno.');
    }
  },
  
  obtenerPorId: async (req, res) => {
    try {
      const alumno = await servicioAlumnos.obtenerPorId(req.params.id);
      res.status(200).json(alumno);
    } catch (error) {
      manejarError(res, error, 'Error al obtener el alumno.');
    }
  },

  actualizarCompleto: async (req, res) => {
    try {
      const alumnoActualizado = await servicioAlumnos.actualizarCompleto(req.params.id, req.body);
      res.status(200).json({ mensaje: 'Alumno actualizado correctamente.', data: alumnoActualizado });
    } catch (error) {
      manejarError(res, error, 'Error al actualizar el alumno.');
    }
  },

  actualizarParcial: async (req, res) => {
    try {
      const alumnoActualizado = await servicioAlumnos.actualizarParcial(req.params.id, req.body);
      res.status(200).json({ mensaje: 'Alumno actualizado parcialmente.', data: alumnoActualizado });
    } catch (error) {
      manejarError(res, error, 'Error en la actualización parcial.');
    }
  },
  
  eliminar: async (req, res) => {
    try {
      const resultado = await servicioAlumnos.eliminar(req.params.id);
      res.status(200).json(resultado);
    } catch (error) {
      manejarError(res, error, 'Error al eliminar el alumno.');
    }
  },

  // --- ACCIONES ESPECIALES ---
  actualizarEstado: async (req, res) => {
    try {
      const { estado } = req.body;
      if (!estado) return res.status(400).json({ mensaje: 'El campo "estado" es requerido.' });
      const alumnoActualizado = await servicioAlumnos.actualizarEstado(req.params.id, estado);
      res.status(200).json({ mensaje: 'Estado del alumno actualizado.', data: alumnoActualizado });
    } catch (error) {
      manejarError(res, error, 'Error al actualizar el estado.');
    }
  },

  restaurar: async (req, res) => {
    try {
      const alumnoRestaurado = await servicioAlumnos.restaurar(req.params.id);
      res.status(200).json({ mensaje: 'Alumno restaurado con éxito.', data: alumnoRestaurado });
    } catch (error) {
      manejarError(res, error, 'Error al restaurar el alumno.');
    }
  },
  
  // --- REPORTES Y BÚSQUEDAS ---
  obtenerPorDni: async (req, res) => {
    try {
      const alumno = await servicioAlumnos.obtenerPorDni(req.params.dni);
      res.status(200).json(alumno);
    } catch (error) {
      manejarError(res, error, 'Error al buscar por DNI.');
    }
  },

  buscarPorNombre: async (req, res) => {
    try {
        const alumnos = await servicioAlumnos.buscarPorNombre(req.params.termino);
        res.status(200).json(alumnos);
    } catch (error) {
        manejarError(res, error, 'Error al buscar alumnos.');
    }
  },

  obtenerPorEstado: async (req, res) => {
    try {
        const alumnos = await servicioAlumnos.obtenerPorEstado(req.params.estado);
        res.status(200).json(alumnos);
    } catch (error) {
        manejarError(res, error, 'Error al filtrar por estado.');
    }
  },
  
  obtenerPaginados: async (req, res) => {
    try {
      const pagina = parseInt(req.query.pagina || 1, 10);
      const limite = parseInt(req.query.limite || 10, 10);
      const resultado = await servicioAlumnos.obtenerPaginados(pagina, limite);
      res.status(200).json(resultado);
    } catch (error) {
      manejarError(res, error, 'Error al obtener la paginación.');
    }
  },

  obtenerEstadisticas: async (req, res) => {
    try {
      const estadisticas = await servicioAlumnos.obtenerEstadisticas();
      res.status(200).json(estadisticas);
    } catch (error) {
      manejarError(res, error, 'Error al obtener las estadísticas.');
    }
  },
  obtenerConContactoIncompleto: async (req, res) => {
  try {
    const alumnos = await servicioAlumnos.obtenerConContactoIncompleto();
    res.status(200).json(alumnos);
  } catch (error) {
    manejarError(res, error, 'Error al obtener alumnos con contacto incompleto.');
  }
},

obtenerPorEdad: async (req, res) => {
  try {
    const { edadMin, edadMax } = req.query;
    const alumnos = await servicioAlumnos.obtenerPorEdad(edadMin, edadMax);
    res.status(200).json(alumnos);
  } catch (error) {
    manejarError(res, error, 'Error al obtener alumnos por edad.');
  }
},

obtenerPorRangoInscripcion: async (req, res) => {
  try {
    const { inicio, fin } = req.query;
    const alumnos = await servicioAlumnos.obtenerPorRangoInscripcion(inicio, fin);
    res.status(200).json(alumnos);
  } catch (error) {
    manejarError(res, error, 'Error al obtener alumnos por rango de inscripción.');
  }
},
  // ... (SE puede agregar el resto de controladores para reportes de la misma manera)
};

module.exports = controladorAlumnos;