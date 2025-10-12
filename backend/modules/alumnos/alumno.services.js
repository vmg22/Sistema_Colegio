// alumno.services.js
const { ejecutarConsulta } = require('../../configuracion/baseDeDatos');
const consultasAlumnos = require('./alumno.queries');

const servicioAlumnos = {
  // OBTENER ALUMNOS
  obtenerTodosAlumnos: async () => {
    return await ejecutarConsulta(consultasAlumnos.obtenerTodos);
  },
  
  obtenerAlumnoPorId: async (idAlumno) => {
    const alumnos = await ejecutarConsulta(consultasAlumnos.obtenerPorId, [idAlumno]);
    return alumnos[0] || null;
  },
  
  obtenerAlumnoPorDni: async (dni) => {
    const alumnos = await ejecutarConsulta(consultasAlumnos.obtenerPorDni, [dni]);
    return alumnos[0] || null;
  },
  
  obtenerAlumnosPorEstado: async (estado) => {
    return await ejecutarConsulta(consultasAlumnos.obtenerPorEstado, [estado]);
  },
  
  buscarAlumnos: async (termino) => {
    const terminoBusqueda = `%${termino}%`;
    return await ejecutarConsulta(consultasAlumnos.buscarPorNombre, [
      terminoBusqueda, terminoBusqueda
    ]);
  },
  
  // CREAR ALUMNO
  crearAlumno: async (datosAlumno) => {
    const {
      dni_alumno,
      nombre_alumno,
      apellido_alumno,
      fecha_nacimiento,
      lugar_nacimiento,
      direccion,
      telefono,
      email,
      fecha_inscripcion,
      estado
    } = datosAlumno;
    
    // Validar DNI único
    const dniExistente = await ejecutarConsulta(
      consultasAlumnos.verificarDniExistente, 
      [dni_alumno]
    );
    
    if (dniExistente.length > 0) {
      throw new Error('Ya existe un alumno con este DNI');
    }
    
    // Validar email único si se proporciona
    if (email) {
      const emailExistente = await ejecutarConsulta(
        consultasAlumnos.verificarEmailExistente, 
        [email]
      );
      
      if (emailExistente.length > 0) {
        throw new Error('Ya existe un alumno con este email');
      }
    }
    
    // Validar fecha de nacimiento (edad mínima 3 años, máxima 25)
    const fechaNacimiento = new Date(fecha_nacimiento);
    const edad = new Date().getFullYear() - fechaNacimiento.getFullYear();
    if (edad < 3 || edad > 25) {
      throw new Error('La edad del alumno debe estar entre 3 y 25 años');
    }
    
    // Crear alumno
    const resultado = await ejecutarConsulta(consultasAlumnos.crear, [
      dni_alumno,
      nombre_alumno,
      apellido_alumno,
      fecha_nacimiento,
      lugar_nacimiento || null,
      direccion || null,
      telefono || null,
      email || null,
      fecha_inscripcion || new Date(),
      estado || 'ACTIVO'
    ]);
    
    return await servicioAlumnos.obtenerAlumnoPorId(resultado.insertId);
  },
  
  // ACTUALIZAR ALUMNO
  actualizarAlumno: async (idAlumno, datosActualizados) => {
    // Verificar que el alumno existe
    const alumnoExiste = await ejecutarConsulta(
      consultasAlumnos.verificarAlumnoExiste, 
      [idAlumno]
    );
    
    if (alumnoExiste.length === 0) {
      throw new Error('Alumno no encontrado');
    }
    
    // Si se actualiza DNI, verificar que no esté en uso
    if (datosActualizados.dni_alumno) {
      const dniExistente = await ejecutarConsulta(
        consultasAlumnos.verificarDniExistente, 
        [datosActualizados.dni_alumno]
      );
      
      if (dniExistente.length > 0 && dniExistente[0].id_alumno !== parseInt(idAlumno)) {
        throw new Error('Ya existe otro alumno con este DNI');
      }
    }
    
    // Si se actualiza email, verificar que no esté en uso
    if (datosActualizados.email) {
      const emailExistente = await ejecutarConsulta(
        consultasAlumnos.verificarEmailExistente, 
        [datosActualizados.email]
      );
      
      if (emailExistente.length > 0 && emailExistente[0].id_alumno !== parseInt(idAlumno)) {
        throw new Error('Ya existe otro alumno con este email');
      }
    }
    
    // Actualizar alumno
    const {
      dni_alumno,
      nombre_alumno,
      apellido_alumno,
      fecha_nacimiento,
      lugar_nacimiento,
      direccion,
      telefono,
      email,
      fecha_inscripcion,
      estado
    } = datosActualizados;
    
    await ejecutarConsulta(consultasAlumnos.actualizarCompleto, [
      dni_alumno,
      nombre_alumno,
      apellido_alumno,
      fecha_nacimiento,
      lugar_nacimiento,
      direccion,
      telefono,
      email,
      fecha_inscripcion,
      estado,
      idAlumno
    ]);
    
    return await servicioAlumnos.obtenerAlumnoPorId(idAlumno);
  },
  
  actualizarAlumnoParcial: async (idAlumno, datosParciales) => {
    // Verificar que el alumno existe
    const alumnoExiste = await ejecutarConsulta(
      consultasAlumnos.verificarAlumnoExiste, 
      [idAlumno]
    );
    
    if (alumnoExiste.length === 0) {
      throw new Error('Alumno no encontrado');
    }
    
    const {
      nombre_alumno,
      apellido_alumno,
      direccion,
      telefono,
      email
    } = datosParciales;
    
    await ejecutarConsulta(consultasAlumnos.actualizarParcial, [
      nombre_alumno,
      apellido_alumno,
      direccion,
      telefono,
      email,
      idAlumno
    ]);
    
    return await servicioAlumnos.obtenerAlumnoPorId(idAlumno);
  },
  
  actualizarEstadoAlumno: async (idAlumno, nuevoEstado) => {
    const alumnoExiste = await ejecutarConsulta(
      consultasAlumnos.verificarAlumnoExiste, 
      [idAlumno]
    );
    
    if (alumnoExiste.length === 0) {
      throw new Error('Alumno no encontrado');
    }
    
    await ejecutarConsulta(consultasAlumnos.actualizarEstado, [nuevoEstado, idAlumno]);
    return await servicioAlumnos.obtenerAlumnoPorId(idAlumno);
  },
  
  // ELIMINAR ALUMNO
  eliminarAlumno: async (idAlumno) => {
    const alumnoExiste = await ejecutarConsulta(
      consultasAlumnos.verificarAlumnoExiste, 
      [idAlumno]
    );
    
    if (alumnoExiste.length === 0) {
      throw new Error('Alumno no encontrado');
    }
    
    await ejecutarConsulta(consultasAlumnos.eliminarLogico, [idAlumno]);
    return { mensaje: 'Alumno eliminado correctamente' };
  },
  
  restaurarAlumno: async (idAlumno) => {
    await ejecutarConsulta(consultasAlumnos.restaurar, [idAlumno]);
    return await servicioAlumnos.obtenerAlumnoPorId(idAlumno);
  },
  
  // ESTADÍSTICAS Y REPORTES
  obtenerEstadisticas: async () => {
    const [total, porEstado, recientes] = await Promise.all([
      ejecutarConsulta(consultasAlumnos.contarTotal),
      ejecutarConsulta(consultasAlumnos.contarPorEstado),
      ejecutarConsulta(consultasAlumnos.obtenerRecientes, [5])
    ]);
    
    return {
      total: total[0].total_alumnos,
      por_estado: porEstado,
      recientes_inscritos: recientes
    };
  },
  
  obtenerAlumnosPaginados: async (pagina = 1, limite = 10) => {
    const offset = (pagina - 1) * limite;
    
    const [alumnos, total] = await Promise.all([
      ejecutarConsulta(consultasAlumnos.obtenerPaginados, [limite, offset]),
      ejecutarConsulta(consultasAlumnos.contarPaginados)
    ]);
    
    return {
      alumnos,
      paginacion: {
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        total: total[0].total,
        totalPaginas: Math.ceil(total[0].total / limite)
      }
    };
  },
  
  obtenerAlumnosPorEdad: async (edadMinima, edadMaxima) => {
    return await ejecutarConsulta(consultasAlumnos.obtenerPorEdad, [edadMinima, edadMaxima]);
  },
  
  obtenerAlumnosConContactoIncompleto: async () => {
    return await ejecutarConsulta(consultasAlumnos.obtenerConContactoIncompleto);
  }
};

module.exports = servicioAlumnos;