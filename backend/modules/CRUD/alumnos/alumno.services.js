// src/modules/alumno/alumno.services.js
const pool = require('../../../config/db');
const consultas = require('./alumno.queries');
const consultasTutores = require("../../CRUD/tutores/tutor.queries");
const consultasAlumnoTutor = require('../alumno_tutor/alumno_tutor.query');
const consultasUsuario = require('../../usuario/usuario.queries');
const bcrypt = require('bcrypt');

async function _verificarDniAlumnoExistente(connection, dni) {
  const [rows] = await connection.query(consultas.verificarDniExistente, [dni]);
  if (rows.length > 0) throw Object.assign(new Error('Ya existe un alumno con este DNI.'), { statusCode: 409 });
}

async function _verificarEmailAlumnoExistente(connection, email) {
  if (!email) return;
  const [rows] = await connection.query(consultas.verificarEmailExistente, [email]);
  if (rows.length > 0) throw Object.assign(new Error('Ya existe un alumno con este email.'), { statusCode: 409 });
}

async function _verificarDniTutorExistente(connection, dni) {
  const [rows] = await connection.query(consultas.verificarDniTutorExistente, [dni]);
  if (rows.length > 0) throw Object.assign(new Error('Ya existe un tutor con este DNI.'), { statusCode: 409 });
}

async function _verificarUsernameExistente(connection, username) {
  const [rows] = await connection.query(consultas.verificarUsernameExistente, [username]);
  if (rows.length > 0) throw Object.assign(new Error('El username ya está en uso.'), { statusCode: 409 });
}

async function _verificarEmailUsuarioExistente(connection, email) {
  const [rows] = await connection.query(consultas.verificarEmailUsuarioExistente, [email]);
  if (rows.length > 0) throw Object.assign(new Error('El email de usuario ya está en uso.'), { statusCode: 409 });
}

async function _crearUsuarioParaTutor(connection, datosUsuario) {
  const password_hash = await bcrypt.hash(datosUsuario.password || '123456', 10);
  const [result] = await connection.query(consultas.crearUsuario, [
    datosUsuario.username, password_hash, datosUsuario.email_usuario
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
  await connection.query(consultasAlumnoTutor.crear, [id_alumno, id_tutor, es_principal]);
}

async function _obtenerAlumnoCompleto(connection, id_alumno) {
  const [rows] = await connection.query(consultas.obtenerAlumnoCompleto, [id_alumno]);
  return rows[0];
}

async function _obtenerAlumnoPorId(id) {
  const [rows] = await pool.query(consultas.obtenerPorId, [id]);
  if (rows.length === 0) {
    const error = new Error('El alumno con el ID proporcionado no fue encontrado.');
    error.statusCode = 404;
    throw error;
  }
  return rows[0];
}

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
      await _verificarDniAlumnoExistente(connection, datos.alumno.dni_alumno);
      await _verificarEmailAlumnoExistente(connection, datos.alumno.email);
      await _verificarDniTutorExistente(connection, datos.tutor.dni_tutor);
      let id_usuario = null;
      if (datos.tutor.crear_usuario && datos.tutor.username && datos.tutor.email_usuario) {
        await _verificarUsernameExistente(connection, datos.tutor.username);
        await _verificarEmailUsuarioExistente(connection, datos.tutor.email_usuario);
        id_usuario = await _crearUsuarioParaTutor(connection, datos.tutor);
      }
      const id_tutor = await _crearTutor(connection, datos.tutor, id_usuario);
      const id_alumno = await _crearAlumno(connection, datos.alumno);
      await _vincularAlumnoTutor(connection, id_alumno, id_tutor);
      await connection.commit();
      const alumnoCompleto = await _obtenerAlumnoCompleto(connection, id_alumno);
      return { alumno: alumnoCompleto, id_tutor, id_usuario, mensaje: 'Alumno y tutor creados exitosamente' };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  matricularEnCurso: async (id_alumno, id_curso, anio_lectivo) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Inscribir en 'alumno_curso' (Ignora si ya existe)
      await connection.query(
        `INSERT IGNORE INTO alumno_curso 
           (id_alumno, id_curso, anio_lectivo, estado, fecha_inscripcion) 
         VALUES (?, ?, ?, 'regular', CURDATE())`,
        [id_alumno, id_curso, anio_lectivo]
      );

      // Obtener materias del plan de estudios
      const [materias] = await connection.query(consultas.obtenerMateriasDeCurso, [id_curso]);
      if (materias.length === 0) {
        throw Object.assign(new Error('Este curso no tiene materias en su plan de estudios.'), { statusCode: 404 });
      }

      // Preparar bulk insert
      const valoresMaterias = materias.map(materia => [
        id_alumno,
        materia.id_materia,
        id_curso,
        anio_lectivo,
        'cursando'
      ]);

      // Insertar/Actualizar en 'alumno_materia_estado'
      await connection.query(
        `${consultas.inscribirEnMaterias}
         ON DUPLICATE KEY UPDATE 
           estado = VALUES(estado), 
           deleted_at = NULL`,
        [valoresMaterias]
      );

      await connection.commit();
      
      return { 
        mensaje: 'Alumno matriculado exitosamente', 
        id_alumno, id_curso, anio_lectivo,
        materias_inscritas: materias.length 
      };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // --- 2. FUNCIÓN DE PERFIL (AÑADIDA) ---
 obtenerCursoYMateriasActual: async (id_alumno, anio_lectivo) => {
 await _obtenerAlumnoPorId(id_alumno); 
 
 const [rows] = await pool.query(consultas.obtenerCursoYMateriasActual, [id_alumno, anio_lectivo]);

 if (rows.length === 0 || !rows[0].id_curso) { 
const error = new Error('El alumno no está inscrito en ningún curso para el año lectivo actual.');
 error.statusCode = 404;
      throw error;
}

 const primerFila = rows[0];
 const resultado = {
curso: {
id_curso: primerFila.id_curso,
 nombre_curso: primerFila.nombre_curso,
 division: primerFila.division,
 turno: primerFila.turno,
 anio_curso: primerFila.anio_curso,
 anio_lectivo: primerFila.anio_lectivo
 },
 alumno: {
 id_alumno: primerFila.id_alumno,
 nombre_alumno: primerFila.nombre_alumno,
 apellido_alumno: primerFila.apellido_alumno
 },
 materias: rows
 .filter(row => row.id_materia)
 .map(row => ({
id_materia: row.id_materia,
 nombre_materia: row.nombre_materia,
 descripcion_materia: row.descripcion_materia,
 estado_materia: row.estado_materia || 'cursando',
 calificacion_final: row.calificacion_final || null
 }))
 };
 return resultado;
 },

  obtenerPorDni: async (dni) => {
    const [rows] = await pool.query(consultas.obtenerPorDni, [dni]);
    if (rows.length === 0) throw Object.assign(new Error('No se encontró ningún alumno con ese DNI.'), { statusCode: 404 });
    return rows[0];
  },

  obtenerPorId: async (id) => {
    const [rows] = await pool.query(consultas.obtenerPorId, [id]);
    if (rows.length === 0) throw Object.assign(new Error('No se encontró ningún alumno con ese id.'), { statusCode: 404 });
    return rows[0];
  },

  eliminar: async (id) => {
    await _obtenerAlumnoPorId(id);
    await pool.query(consultas.eliminarLogico, [id]);
    return { mensaje: `Alumno con ID ${id} eliminado correctamente.` };
  },

  restaurar: async (id) => {
    await pool.query(consultas.restaurar, [id]);
    return await _obtenerAlumnoPorId(id);
  }
};

module.exports = servicioAlumnos;
