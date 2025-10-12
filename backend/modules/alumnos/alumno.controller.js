// alumno.controller.js
const servicioAlumnos = require('./alumno.services');
const { exito, error } = require('../../utilidades/respuestas');

const controladorAlumnos = {
  // GET /api/alumnos
  obtenerTodos: async (solicitud, respuesta) => {
    try {
      const alumnos = await servicioAlumnos.obtenerTodosAlumnos();
      exito(respuesta, 'Alumnos obtenidos correctamente', alumnos);
    } catch (err) {
      error(respuesta, 'Error al obtener alumnos', 500, err.message);
    }
  },
  
  // GET /api/alumnos/paginados?pagina=1&limite=10
  obtenerPaginados: async (solicitud, respuesta) => {
    try {
      const { pagina = 1, limite = 10 } = solicitud.query;
      const resultado = await servicioAlumnos.obtenerAlumnosPaginados(pagina, limite);
      exito(respuesta, 'Alumnos obtenidos correctamente', resultado);
    } catch (err) {
      error(respuesta, 'Error al obtener alumnos', 500, err.message);
    }
  },
  
  // GET /api/alumnos/:id
  obtenerPorId: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const alumno = await servicioAlumnos.obtenerAlumnoPorId(id);
      
      if (!alumno) {
        return error(respuesta, 'Alumno no encontrado', 404);
      }
      
      exito(respuesta, 'Alumno obtenido correctamente', alumno);
    } catch (err) {
      error(respuesta, 'Error al obtener alumno', 500, err.message);
    }
  },
  
  // GET /api/alumnos/dni/:dni
  obtenerPorDni: async (solicitud, respuesta) => {
    try {
      const { dni } = solicitud.params;
      const alumno = await servicioAlumnos.obtenerAlumnoPorDni(dni);
      
      if (!alumno) {
        return error(respuesta, 'Alumno no encontrado', 404);
      }
      
      exito(respuesta, 'Alumno obtenido correctamente', alumno);
    } catch (err) {
      error(respuesta, 'Error al obtener alumno', 500, err.message);
    }
  },
  
  // GET /api/alumnos/buscar/:termino
  buscarAlumnos: async (solicitud, respuesta) => {
    try {
      const { termino } = solicitud.params;
      const alumnos = await servicioAlumnos.buscarAlumnos(termino);
      exito(respuesta, 'Búsqueda completada', alumnos);
    } catch (err) {
      error(respuesta, 'Error en la búsqueda', 500, err.message);
    }
  },
  
  // POST /api/alumnos
  crearAlumno: async (solicitud, respuesta) => {
    try {
      const datosAlumno = solicitud.body;
      
      // Validaciones básicas
      if (!datosAlumno.dni_alumno || !datosAlumno.nombre_alumno || !datosAlumno.apellido_alumno) {
        return error(respuesta, 'DNI, nombre y apellido son obligatorios', 400);
      }
      
      const alumnoCreado = await servicioAlumnos.crearAlumno(datosAlumno);
      exito(respuesta, 'Alumno creado exitosamente', alumnoCreado, 201);
    } catch (err) {
      error(respuesta, 'Error al crear alumno', 400, err.message);
    }
  },
  
  // PUT /api/alumnos/:id
  actualizarAlumno: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const alumnoActualizado = await servicioAlumnos.actualizarAlumno(id, datosActualizados);
      exito(respuesta, 'Alumno actualizado correctamente', alumnoActualizado);
    } catch (err) {
      error(respuesta, 'Error al actualizar alumno', 400, err.message);
    }
  },
  
  // PATCH /api/alumnos/:id
  actualizarAlumnoParcial: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosParciales = solicitud.body;
      
      const alumnoActualizado = await servicioAlumnos.actualizarAlumnoParcial(id, datosParciales);
      exito(respuesta, 'Alumno actualizado correctamente', alumnoActualizado);
    } catch (err) {
      error(respuesta, 'Error al actualizar alumno', 400, err.message);
    }
  },
  
  // PATCH /api/alumnos/:id/estado
  actualizarEstado: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const { estado } = solicitud.body;
      
      if (!estado) {
        return error(respuesta, 'El estado es requerido', 400);
      }
      
      const alumnoActualizado = await servicioAlumnos.actualizarEstadoAlumno(id, estado);
      exito(respuesta, 'Estado del alumno actualizado', alumnoActualizado);
    } catch (err) {
      error(respuesta, 'Error al actualizar estado', 400, err.message);
    }
  },
  
  // DELETE /api/alumnos/:id
  eliminarAlumno: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioAlumnos.eliminarAlumno(id);
      exito(respuesta, resultado.mensaje);
    } catch (err) {
      error(respuesta, 'Error al eliminar alumno', 400, err.message);
    }
  },
  
  // POST /api/alumnos/:id/restaurar
  restaurarAlumno: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const alumnoRestaurado = await servicioAlumnos.restaurarAlumno(id);
      exito(respuesta, 'Alumno restaurado correctamente', alumnoRestaurado);
    } catch (err) {
      error(respuesta, 'Error al restaurar alumno', 400, err.message);
    }
  },
  
  // GET /api/alumnos/estadisticas/generales
  obtenerEstadisticas: async (solicitud, respuesta) => {
    try {
      const estadisticas = await servicioAlumnos.obtenerEstadisticas();
      exito(respuesta, 'Estadísticas obtenidas', estadisticas);
    } catch (err) {
      error(respuesta, 'Error al obtener estadísticas', 500, err.message);
    }
  },
  
  // GET /api/alumnos/reporte/contacto-incompleto
  obtenerContactoIncompleto: async (solicitud, respuesta) => {
    try {
      const alumnos = await servicioAlumnos.obtenerAlumnosConContactoIncompleto();
      exito(respuesta, 'Alumnos con contacto incompleto', alumnos);
    } catch (err) {
      error(respuesta, 'Error al obtener reporte', 500, err.message);
    }
  },
  
  // GET /api/alumnos/reporte/por-edad?minima=10&maxima=18
  obtenerPorEdad: async (solicitud, respuesta) => {
    try {
      const { minima = 10, maxima = 18 } = solicitud.query;
      const alumnos = await servicioAlumnos.obtenerAlumnosPorEdad(parseInt(minima), parseInt(maxima));
      exito(respuesta, `Alumnos entre ${minima} y ${maxima} años`, alumnos);
    } catch (err) {
      error(respuesta, 'Error al obtener reporte por edad', 500, err.message);
    }
  }
};

module.exports = controladorAlumnos;