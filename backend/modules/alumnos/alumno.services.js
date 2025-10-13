// 1. CORRECCIÓN: Importamos el pool directamente desde la ubicación correcta.
const pool = require('../../config/db'); 
const consultas = require('./alumno.queries');

// 2. MEJORA (DRY): Creamos una función helper interna para verificar la existencia.
// El guion bajo (_) es una convención para indicar que es una función privada del módulo.
async function _verificarExistenciaAlumno(idAlumno) {
  const [alumno] = await pool.query(consultas.obtenerPorId, [idAlumno]);
  if (!alumno || alumno.length === 0) {
    // 3. MEJORA (Errores): Lanzamos un error específico.
    // En tu manejador de errores global, podrías buscar este mensaje
    // y devolver un status 404 Not Found.
    const error = new Error('Alumno no encontrado');
    error.statusCode = 404;
    throw error;
  }
  return alumno[0];
}

const servicioAlumnos = {
  obtenerTodosAlumnos: async () => {
    const [rows] = await pool.query(consultas.obtenerTodos);
    return rows;
  },
  
  obtenerAlumnoPorId: async (idAlumno) => {
    return await _verificarExistenciaAlumno(idAlumno);
  },
  
  crearAlumno: async (datosAlumno) => {
    const { dni_alumno, email } = datosAlumno;
    
    // Validar DNI único
    const [dniExistente] = await pool.query(consultas.verificarDniExistente, [dni_alumno]);
    if (dniExistente.length > 0) {
      const error = new Error('Ya existe un alumno con este DNI');
      error.statusCode = 409; // 409 Conflict es ideal para recursos duplicados
      throw error;
    }
    
    // Validar email único si se proporciona
    if (email) {
      const [emailExistente] = await pool.query(consultas.verificarEmailExistente, [email]);
      if (emailExistente.length > 0) {
        const error = new Error('Ya existe un alumno con este email');
        error.statusCode = 409;
        throw error;
      }
    }
    
    // ... (otras validaciones como la edad) ...

    const params = [
      datosAlumno.dni_alumno,
      datosAlumno.nombre_alumno,
      datosAlumno.apellido_alumno,
      datosAlumno.fecha_nacimiento,
      datosAlumno.lugar_nacimiento || null,
      datosAlumno.direccion || null,
      datosAlumno.telefono || null,
      datosAlumno.email || null,
      datosAlumno.fecha_inscripcion || new Date(),
      datosAlumno.estado || 'ACTIVO'
    ];
    
    const [resultado] = await pool.query(consultas.crear, params);
    return await _verificarExistenciaAlumno(resultado.insertId);
  },
  
  actualizarAlumno: async (idAlumno, datosActualizados) => {
    // Usamos el helper para verificar que existe primero
    await _verificarExistenciaAlumno(idAlumno);
    
    // ... (lógica de validación para DNI y email duplicados al actualizar) ...

    const params = [
      datosActualizados.dni_alumno,
      datosActualizados.nombre_alumno,
      datosActualizados.apellido_alumno,
      // ... resto de los campos ...
      idAlumno
    ];
    
    await pool.query(consultas.actualizarCompleto, params);
    return await _verificarExistenciaAlumno(idAlumno);
  },
  
  eliminarAlumno: async (idAlumno) => {
    await _verificarExistenciaAlumno(idAlumno);
    await pool.query(consultas.eliminarLogico, [idAlumno]);
    return { mensaje: 'Alumno marcado como inactivo correctamente' };
  },

  // ... (puedes seguir refactorizando los otros métodos usando el pool y el helper) ...

  obtenerEstadisticas: async () => {
    // Esta función ya estaba muy bien con Promise.all
    const [totalResult, porEstadoResult, recientesResult] = await Promise.all([
      pool.query(consultas.contarTotal),
      pool.query(consultas.contarPorEstado),
      pool.query(consultas.obtenerRecientes, [5])
    ]);
    
    return {
      total: totalResult[0][0].total_alumnos,
      por_estado: porEstadoResult[0],
      recientes_inscritos: recientesResult[0]
    };
  }
};

module.exports = servicioAlumnos;