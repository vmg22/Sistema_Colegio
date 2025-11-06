// src/modules/alumno/alumno.services.js (VERSIÓN FINAL REFACTORIZADA)
const pool = require('../../config/db');
const consultas = require('./alumno.queries');
const consultasTutores = require("../tutores/tutor.queries")
const consultasAlumnoTutor = require('../alumno_tutor/alumno_tutor.query');
const consultasUsuario = require('../usuario/usuario.queries'); 
const bcrypt = require('bcrypt');

// ============================================
// HELPERS PRIVADOS PARA crearConTutor
// ============================================

async function _verificarDniAlumnoExistente(connection, dni) {
  const [rows] = await connection.query(consultas.verificarDniExistente, [dni]);
  if (rows.length > 0) {
    throw Object.assign(
      new Error('Ya existe un alumno con este DNI.'), 
      { statusCode: 409 }
    );
  }
}

async function _verificarEmailAlumnoExistente(connection, email) {
  if (!email) return;
  const [rows] = await connection.query(consultas.verificarEmailExistente, [email]);
  if (rows.length > 0) {
    throw Object.assign(
      new Error('Ya existe un alumno con este email.'), 
      { statusCode: 409 }
    );
  }
}

async function _verificarDniTutorExistente(connection, dni) {
  const [rows] = await connection.query(consultas.verificarDniTutorExistente, [dni]);
  if (rows.length > 0) {
    throw Object.assign(
      new Error('Ya existe un tutor con este DNI.'), 
      { statusCode: 409 }
    );
  }
}

async function _verificarUsernameExistente(connection, username) {
  const [rows] = await connection.query(consultas.verificarUsernameExistente, [username]);
  if (rows.length > 0) {
    throw Object.assign(
      new Error('El username ya está en uso.'), 
      { statusCode: 409 }
    );
  }
}

async function _verificarEmailUsuarioExistente(connection, email) {
  const [rows] = await connection.query(consultas.verificarEmailUsuarioExistente, [email]);
  if (rows.length > 0) {
    throw Object.assign(
      new Error('El email de usuario ya está en uso.'), 
      { statusCode: 409 }
    );
  }
}

async function _crearUsuarioParaTutor(connection, datosUsuario) {
  const password_hash = await bcrypt.hash(datosUsuario.password || '123456', 10);
  const [result] = await connection.query(consultas.crearUsuario, [
    datosUsuario.username, 
    password_hash, 
    datosUsuario.email_usuario
  ]);
  return result.insertId;
}

async function _crearTutor(connection, datosTutor, id_usuario = null) {
  const [result] = await connection.query(consultasTutores.crear, [
    id_usuario,
    datosTutor.dni_tutor,
    datosTutor.nombre,
    datosTutor.apellido,
    datosTutor.email || null,
    datosTutor.telefono || null,
    datosTutor.direccion || null,
    datosTutor.parentesco,
    'activo'
  ]);
  return result.insertId;
}

async function _crearAlumno(connection, datosAlumno) {
  const params = [
    datosAlumno.dni_alumno,
    datosAlumno.nombre_alumno,
    datosAlumno.apellido_alumno,
    _formatDate(datosAlumno.fecha_nacimiento),
    datosAlumno.lugar_nacimiento || null,
    datosAlumno.direccion || null,
    datosAlumno.telefono || null,
    datosAlumno.email || null,
    _formatDate(datosAlumno.fecha_inscripcion) || _formatDate(new Date()),
    datosAlumno.estado?.toUpperCase() || 'ACTIVO'
  ];

  const [result] = await connection.query(consultas.crear, params);
  return result.insertId;
}

async function _vincularAlumnoTutor(connection, id_alumno, id_tutor, es_principal = 1) {
  await connection.query(consultasAlumnoTutor.crear, [
    id_alumno,
    id_tutor,
    es_principal
  ]);
}

async function _obtenerAlumnoCompleto(connection, id_alumno) {
  const [rows] = await connection.query(consultas.obtenerAlumnoCompleto, [id_alumno]);
  return rows[0];
}

// Helper para obtener y verificar la existencia de un alumno
async function _obtenerAlumnoPorId(id) {
  const [rows] = await pool.query(consultas.obtenerPorId, [id]);
  if (rows.length === 0) {
    const error = new Error('El alumno con el ID proporcionado no fue encontrado.');
    error.statusCode = 404;
    throw error;
  }
  return rows[0];
}

// Helper para asegurar el formato de fecha YYYY-MM-DD
function _formatDate(date) {
  if (!date) return null;
  return new Date(date).toISOString().slice(0, 10);
}

const servicioAlumnos = {
  obtenerTodos: async () => {
    const [rows] = await pool.query(consultas.obtenerTodos);
    return rows;
  },

  crearConTutor: async (datos) => {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // 1. Validaciones de alumno
      await _verificarDniAlumnoExistente(connection, datos.alumno.dni_alumno);
      await _verificarEmailAlumnoExistente(connection, datos.alumno.email);

      // 2. Validaciones de tutor
      await _verificarDniTutorExistente(connection, datos.tutor.dni_tutor);

      // 3. Crear usuario si se solicita
      let id_usuario = null;
      if (datos.tutor.crear_usuario && datos.tutor.username && datos.tutor.email_usuario) {
        await _verificarUsernameExistente(connection, datos.tutor.username);
        await _verificarEmailUsuarioExistente(connection, datos.tutor.email_usuario);
        id_usuario = await _crearUsuarioParaTutor(connection, datos.tutor);
      }

      // 4. Crear tutor
      const id_tutor = await _crearTutor(connection, datos.tutor, id_usuario);

      // 5. Crear alumno
      const id_alumno = await _crearAlumno(connection, datos.alumno);

      // 6. Vincular alumno con tutor
      await _vincularAlumnoTutor(connection, id_alumno, id_tutor);

      // 7. Commit de la transacción
      await connection.commit();

      // 8. Obtener y retornar alumno completo
      const alumnoCompleto = await _obtenerAlumnoCompleto(connection, id_alumno);

      return {
        alumno: alumnoCompleto,
        id_tutor,
        id_usuario,
        mensaje: 'Alumno y tutor creados exitosamente'
      };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  

  obtenerPorDni: async (dni) => {
    const [rows] = await pool.query(consultas.obtenerPorDni, [dni]);
    if (rows.length === 0) {
      const error = new Error('No se encontró ningún alumno con ese DNI.');
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  },
   obtenerPorId: async (id) => {
    const [rows] = await pool.query(consultas.obtenerPorId, [id]);
    if (rows.length === 0) {
      const error = new Error('No se encontró ningún alumno con ese id.');
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  },

  crear: async (datos) => {
    const { dni_alumno, email } = datos;
    const [dniExistente] = await pool.query(consultas.verificarDniExistente, [dni_alumno]);
    if (dniExistente.length > 0) {
      throw Object.assign(new Error('Ya existe un alumno con este DNI.'), { statusCode: 409 });
    }
    if (email) {
      const [emailExistente] = await pool.query(consultas.verificarEmailExistente, [email]);
      if (emailExistente.length > 0) {
        throw Object.assign(new Error('Ya existe un alumno con este email.'), { statusCode: 409 });
      }
    }
    const params = [
      datos.dni_alumno, datos.nombre_alumno, datos.apellido_alumno,
      _formatDate(datos.fecha_nacimiento), datos.lugar_nacimiento || null,
      datos.direccion || null, datos.telefono || null, datos.email || null,
      _formatDate(datos.fecha_inscripcion) || _formatDate(new Date()),
      datos.estado?.toUpperCase() || 'ACTIVO'
    ];
    const [resultado] = await pool.query(consultas.crear, params);
    return { id_alumno: resultado.insertId, ...datos };
  },

  actualizarCompleto: async (id, datos) => {
    await _obtenerAlumnoPorId(id);
    const params = [
      datos.dni_alumno, datos.nombre_alumno, datos.apellido_alumno,
      _formatDate(datos.fecha_nacimiento), datos.lugar_nacimiento,
      datos.direccion, datos.telefono, datos.email,
      _formatDate(datos.fecha_inscripcion), datos.estado?.toUpperCase() || 'ACTIVO', id
    ];
    await pool.query(consultas.actualizarCompleto, params);
    return await _obtenerAlumnoPorId(id);
  },

  actualizarParcial: async (id, datosParciales) => {
    const alumnoActual = await _obtenerAlumnoPorId(id);
    const datosFusionados = { ...alumnoActual, ...datosParciales };
    const params = [
      datosFusionados.nombre_alumno, datosFusionados.apellido_alumno,
      datosFusionados.direccion, datosFusionados.telefono, datosFusionados.email, id
    ];
    await pool.query(consultas.actualizarParcial, params);
    return await _obtenerAlumnoPorId(id);
  },

  // CORREGIDO: Lógica simplificada y consistente con las otras funciones
  eliminar: async (id) => {
    await _obtenerAlumnoPorId(id); // Esto ya verifica si existe y está activo
    await pool.query(consultas.eliminarLogico, [id]);
    return { mensaje: `Alumno con ID ${id} eliminado correctamente.` };
  },

  restaurar: async (id) => {
    await pool.query(consultas.restaurar, [id]);
    return await _obtenerAlumnoPorId(id);
  },

  buscarPorNombre: async (termino) => {
    const pattern = `%${termino}%`;
    const [rows] = await pool.query(consultas.buscarPorNombre, [pattern, pattern]);
    return rows;
  },

  obtenerPaginados: async (pagina, limite) => {
    const offset = (pagina - 1) * limite;
    const [alumnos] = await pool.query(consultas.obtenerPaginados, [limite, offset]);
    const [[{ total }]] = await pool.query(consultas.contarPaginados); // Doble destructuring
    return {
      total_items: total,
      total_paginas: Math.ceil(total / limite),
      pagina_actual: parseInt(pagina, 10),
      items_por_pagina: parseInt(limite, 10),
      items: alumnos
    };
  },

  obtenerPorEstado: async (estado) => {
    const [rows] = await pool.query(consultas.obtenerPorEstado, [estado.toUpperCase()]);
    return rows;
  },

  obtenerPorRangoInscripcion: async (inicio, fin) => {
    const [rows] = await pool.query(consultas.obtenerPorRangoInscripcion, [_formatDate(inicio), _formatDate(fin)]);
    return rows;
  },

  obtenerPorEdad: async (edadMin, edadMax) => {
    const [rows] = await pool.query(consultas.obtenerPorEdad, [edadMin, edadMax]);
    return rows;
  },

  obtenerConContactoIncompleto: async () => {
    const [rows] = await pool.query(consultas.obtenerConContactoIncompleto);
    return rows;
  },

  actualizarEstado: async (id, estado) => {
    await _obtenerAlumnoPorId(id);
    const estadoUpper = estado.toUpperCase();
    await pool.query(consultas.actualizarEstado, [estadoUpper, id]);
    return await _obtenerAlumnoPorId(id);
  },

  // CORREGIDO: Destructuring más robusto para evitar errores si una consulta no devuelve resultados
  obtenerEstadisticas: async () => {
    const [totalResult, porEstadoResult, recientesResult] = await Promise.all([
      pool.query(consultas.contarTotal),
      pool.query(consultas.contarPorEstado),
      pool.query(consultas.obtenerRecientes, [5])
    ]);
    return {
      total_alumnos: totalResult[0][0]?.total_alumnos || 0,
      conteo_por_estado: porEstadoResult[0],
      ultimos_inscritos: recientesResult[0]
    };
  }
};

module.exports = servicioAlumnos;