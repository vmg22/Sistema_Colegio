const servicioDocentes = require('./docente.services');
const { exito, error } = require('../../utils/responses');

const controladorDocentes = {
 
  obtenerTodosDocentes: async (solicitud, respuesta) => {
    try {
      const docentes = await servicioDocentes.obtenerTodosDocentes();
      exito(respuesta, 'Docentes obtenidos correctamente', docentes);
    } catch (err) {
      error(respuesta, 'Error al obtener docentes', 500, err.message);
    }
  },

  
  obtenerDocentePorId: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const docente = await servicioDocentes.obtenerDocentePorId(id);
      
      if (!docente) {
        return error(respuesta, 'Docente no encontrado', 404);
      }
      
      exito(respuesta, 'Docente obtenido correctamente', docente);
    } catch (err) {
      error(respuesta, 'Error al obtener docente', 500, err.message);
    }
  },


  crearDocente: async (solicitud, respuesta) => {
    try {
      const datosDocente = solicitud.body;
      
      // La validación ya está en el service, pero dejamos esta por si acaso
      if (!datosDocente.dni_docente || !datosDocente.nombre || !datosDocente.apellido) {
        return error(respuesta, 'DNI, nombre y apellido son obligatorios', 400);
      }
      
      const docenteCreado = await servicioDocentes.crearDocente(datosDocente);
      
      // Ahora el service retorna el objeto completo del docente
      exito(respuesta, 'Docente creado exitosamente', docenteCreado, 201);
    } catch (err) {
      // Manejo de errores más específico
      if (err.message.includes('obligatorios')) {
        return error(respuesta, err.message, 400);
      }
      if (err.code === 'ER_DUP_ENTRY') {
        return error(respuesta, 'El DNI ya está registrado', 409, err.message);
      }
      error(respuesta, 'Error al crear docente', 500, err.message);
    }
  },


  actualizarDocente: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const docenteActualizado = await servicioDocentes.actualizarDocente(id, datosActualizados);
      
      // Ahora el service retorna el docente actualizado completo
      exito(respuesta, 'Docente actualizado correctamente', docenteActualizado);
    } catch (err) {
      // Manejo de errores más específico
      if (err.message === 'Docente no encontrado') {
        return error(respuesta, 'Docente no encontrado', 404);
      }
      if (err.code === 'ER_DUP_ENTRY') {
        return error(respuesta, 'El DNI ya está registrado', 409, err.message);
      }
      error(respuesta, 'Error al actualizar docente', 500, err.message);
    }
  },
actualizarDocenteParcial: async (solicitud, respuesta) => {
  try {
    const { id } = solicitud.params;
    const datosActualizados = solicitud.body;
    
    const docenteActualizado = await servicioDocentes.actualizarDocenteParcial(id, datosActualizados);
    exito(respuesta, 'Docente actualizado correctamente', docenteActualizado);
  } catch (err) {
    // Manejo de errores más específico
    if (err.message === 'Docente no encontrado') {
      return error(respuesta, 'Docente no encontrado', 404);
    }
    if (err.code === 'ER_DUP_ENTRY') {
      return error(respuesta, 'El DNI ya está registrado', 409, err.message);
    }
    error(respuesta, 'Error al actualizar docente', 500, err.message);
  }
},

  eliminarDocente: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioDocentes.eliminarDocente(id);
      
      // El service ahora retorna { mensaje, id_docente }
      exito(respuesta, resultado.mensaje, { id_docente: resultado.id_docente });
    } catch (err) {
      // Manejo de error específico
      if (err.message === 'Docente no encontrado') {
        return error(respuesta, 'Docente no encontrado', 404);
      }
      error(respuesta, 'Error al eliminar docente', 500, err.message);
    }
  },


  obtenerDocentesEliminados: async (solicitud, respuesta) => {
    try {
      const docentesEliminados = await servicioDocentes.obtenerDocentesEliminados();
      exito(respuesta, 'Docentes eliminados obtenidos', docentesEliminados);
    } catch (err) {
      error(respuesta, 'Error al obtener docentes eliminados', 500, err.message);
    }
  },


  restaurarDocente: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const docenteRestaurado = await servicioDocentes.restaurarDocente(id);
      
      // El service retorna el docente completo restaurado
      exito(respuesta, 'Docente restaurado correctamente', docenteRestaurado);
    } catch (err) {
      // Manejo de error específico
      if (err.message.includes('no encontrado') || err.message.includes('no está eliminado')) {
        return error(respuesta, err.message, 404);
      }
      error(respuesta, 'Error al restaurar docente', 500, err.message);
    }
  }
};

module.exports = controladorDocentes;