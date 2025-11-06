// src/modules/alumno/alumno.services.js (VERSIÓN FINAL REFACTORIZADA)
const pool = require('../../config/db');
const consultas = require('./alumno.queries');
const consultasTutores = require("../tutores/tutor.queries")
const consultasAlumnoTutor = require('../alumno_tutor/alumno_tutor.query');
const consultasUsuario = require('../usuario/usuario.queries'); 
const bcrypt = require('bcrypt');

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

    // 1. VALIDACIONES PREVIAS - Alumno
    const [dniExistente] = await connection.query(
      consultas.verificarDniExistente, 
      [datos.alumno.dni_alumno]
    );
    if (dniExistente.length > 0) {
      throw Object.assign(
        new Error('Ya existe un alumno con este DNI.'), 
        { statusCode: 409 }
      );
    }

    if (datos.alumno.email) {
      const [emailExistente] = await connection.query(
        consultas.verificarEmailExistente, 
        [datos.alumno.email]
      );
      if (emailExistente.length > 0) {
        throw Object.assign(
          new Error('Ya existe un alumno con este email.'), 
          { statusCode: 409 }
        );
      }
    }

    // 2. VALIDACIONES PREVIAS - Tutor
    const [dniTutorExistente] = await connection.query(
      `SELECT id_tutor FROM tutor WHERE dni_tutor = ? AND deleted_at IS NULL`,
      [datos.tutor.dni_tutor]
    );
    if (dniTutorExistente.length > 0) {
      throw Object.assign(
        new Error('Ya existe un tutor con este DNI.'), 
        { statusCode: 409 }
      );
    }

    // 3. CREAR USUARIO (si se solicita)
    let id_usuario = null;
    if (datos.tutor.crear_usuario && datos.tutor.username && datos.tutor.email_usuario) {
      // Verificar que no exista el username
      const [usernameExistente] = await connection.query(
        `SELECT id_usuario FROM usuario WHERE username = ? AND deleted_at IS NULL`,
        [datos.tutor.username]
      );
      if (usernameExistente.length > 0) {
        throw Object.assign(
          new Error('El username ya está en uso.'), 
          { statusCode: 409 }
        );
      }

      // Verificar que no exista el email
      const [emailUsuarioExistente] = await connection.query(
        `SELECT id_usuario FROM usuario WHERE email_usuario = ? AND deleted_at IS NULL`,
        [datos.tutor.email_usuario]
      );
      if (emailUsuarioExistente.length > 0) {
        throw Object.assign(
          new Error('El email de usuario ya está en uso.'), 
          { statusCode: 409 }
        );
      }

      const password_hash = await bcrypt.hash(
        datos.tutor.password || '123456', 
        10
      );
      
      const [resultUsuario] = await connection.query(
        `INSERT INTO usuario (username, password_hash, email_usuario, rol, estado)
         VALUES (?, ?, ?, 'tutor', 'activo')`,
        [datos.tutor.username, password_hash, datos.tutor.email_usuario]
      );
      id_usuario = resultUsuario.insertId;
    }

    // 4. CREAR TUTOR
    const [resultTutor] = await connection.query(consultasTutores.crear, [
      id_usuario,
      datos.tutor.dni_tutor,
      datos.tutor.nombre,
      datos.tutor.apellido,
      datos.tutor.email || null,
      datos.tutor.telefono || null,
      datos.tutor.direccion || null,
      datos.tutor.parentesco,
      'activo'
    ]);
    const id_tutor = resultTutor.insertId;

    // 5. CREAR ALUMNO
    const paramsAlumno = [
      datos.alumno.dni_alumno,
      datos.alumno.nombre_alumno,
      datos.alumno.apellido_alumno,
      _formatDate(datos.alumno.fecha_nacimiento),
      datos.alumno.lugar_nacimiento || null,
      datos.alumno.direccion || null,
      datos.alumno.telefono || null,
      datos.alumno.email || null,
      _formatDate(datos.alumno.fecha_inscripcion) || _formatDate(new Date()),
      datos.alumno.estado?.toUpperCase() || 'ACTIVO'
    ];

    const [resultAlumno] = await connection.query(consultas.crear, paramsAlumno);
    const id_alumno = resultAlumno.insertId;

    // 6. CREAR RELACIÓN ALUMNO-TUTOR
    await connection.query(consultasAlumnoTutor.crear, [
      id_alumno,
      id_tutor,
      1 // es_principal = true
    ]);

    // 7. COMMIT DE LA TRANSACCIÓN
    await connection.commit();

    // 8. OBTENER Y RETORNAR EL ALUMNO COMPLETO CON RELACIONES
    const [alumnoCompleto] = await connection.query(
      `SELECT 
        a.*,
        t.id_tutor,
        t.nombre as tutor_nombre,
        t.apellido as tutor_apellido,
        t.dni_tutor,
        t.parentesco,
        t.telefono as tutor_telefono,
        t.email as tutor_email
      FROM alumno a
      LEFT JOIN alumno_tutor at ON a.id_alumno = at.id_alumno AND at.deleted_at IS NULL
      LEFT JOIN tutor t ON at.id_tutor = t.id_tutor AND t.deleted_at IS NULL
      WHERE a.id_alumno = ?`,
      [id_alumno]
    );

    return {
      alumno: alumnoCompleto[0],
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