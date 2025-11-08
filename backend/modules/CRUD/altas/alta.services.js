// modules/altas/alta.services.js

const pool = require('../../../config/db'); // Cambiado de 'db' a 'pool'
const consultas = require('./alta.queries');
const bcrypt = require('bcrypt');

// --- (ObtenerDocentePorId - Corregido pool) ---
async function obtenerDocentePorId(id) {
  const [docentes] = await pool.query(consultas.obtenerDocentePorId, [id]);
  if (docentes.length === 0) {
    throw new Error('Docente no encontrado');
  }
  return docentes[0];
}

// --- (crearDocentePerfil - Corregido pool) ---
async function crearDocentePerfil(data) {
  const { dni_docente, nombre, apellido } = data;

  if (!dni_docente || !nombre || !apellido) {
    throw new Error('DNI, Nombre y Apellido son obligatorios');
  }

  const [docentesExistentes] = await pool.query(
    consultas.verificarDniDocenteExiste,
    [dni_docente]
  );

  if (docentesExistentes.length > 0) {
    throw new Error('El DNI ya está registrado');
  }

  const [docenteResult] = await pool.query(consultas.crearDocente, [
    null,
    dni_docente,
    nombre,
    apellido,
    data.email || null,
    data.telefono || null,
    data.especialidad || null,
    data.estado || 'activo'
  ]);

  return await obtenerDocentePorId(docenteResult.insertId);
}

// --- (crearUsuarioParaDocente - Corregido pool) ---
async function crearUsuarioParaDocente(id_docente, data) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const passwordHash = await bcrypt.hash(data.password, 10);

    const [userResult] = await connection.query(consultas.crearUsuario, [
      data.username,
      passwordHash,
      data.email,
      'docente',
      'activo'
    ]);

    await connection.query(consultas.vincularUsuarioADocente, [
      userResult.insertId,
      id_docente
    ]);

    await connection.commit();
    return await obtenerDocentePorId(id_docente);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

// --- (obtenerTodosDocentes - Corregido pool y lógica de query) ---
async function obtenerTodosDocentes(buscar) {
  let query = consultas.obtenerTodosDocentes;
  const params = [];

  if (buscar) {
    query = query.replace(
      'WHERE d.deleted_at IS NULL',
      'WHERE d.deleted_at IS NULL AND (d.nombre LIKE ? OR d.apellido LIKE ? OR d.dni_docente LIKE ?)'
    );
    const searchTerm = `%${buscar}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const [docentes] = await pool.query(query, params);
  return docentes;
}

// --- (actualizarDocente - Corregido pool y validación) ---
async function actualizarDocente(id, data) {
  const docenteExistente = await obtenerDocentePorId(id);
  const { nombre, apellido, email, telefono, especialidad, estado, dni_docente } = data;

  if (dni_docente && dni_docente !== docenteExistente.dni_docente) {
    const [existentes] = await pool.query(consultas.verificarDniDocenteExiste, [dni_docente]);
    if (existentes.length > 0) {
      throw new Error('El DNI ya está registrado en otro docente.');
    }
  }

  await pool.query(consultas.actualizarDocente, [
    nombre || docenteExistente.nombre,
    apellido || docenteExistente.apellido,
    email !== undefined ? email : docenteExistente.email,
    telefono !== undefined ? telefono : docenteExistente.telefono,
    especialidad !== undefined ? especialidad : docenteExistente.especialidad,
    estado || docenteExistente.estado,
    dni_docente || docenteExistente.dni_docente,
    id
  ]);

  return await obtenerDocentePorId(id);
}

// --- (actualizarDocenteParcial - NUEVA) ---
async function actualizarDocenteParcial(id, data) {
  const docenteExistente = await obtenerDocentePorId(id);

  if (data.dni_docente && data.dni_docente !== docenteExistente.dni_docente) {
    const [existentes] = await pool.query(consultas.verificarDniDocenteExiste, [data.dni_docente]);
    if (existentes.length > 0) {
      throw new Error('El DNI ya está registrado en otro docente.');
    }
  }

  const camposActualizar = {};
  const camposPermitidos = ['nombre', 'apellido', 'email', 'telefono', 'especialidad', 'estado', 'dni_docente'];

  camposPermitidos.forEach(campo => {
    if (data[campo] !== undefined) {
      camposActualizar[campo] = data[campo];
    }
  });

  if (Object.keys(camposActualizar).length === 0) {
    return docenteExistente;
  }

  const setClauses = Object.keys(camposActualizar).map(campo => `${campo} = ?`);
  const valores = Object.values(camposActualizar);

  const query = `
    UPDATE docente SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id_docente = ? AND deleted_at IS NULL
  `;
  valores.push(id);

  await pool.query(query, valores);
  return await obtenerDocentePorId(id);
}

// --- (eliminarDocente - Corregido pool) ---
async function eliminarDocente(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const docente = await obtenerDocentePorId(id);
    await connection.query(consultas.eliminarDocente, [id]);

    if (docente.id_usuario) {
      await connection.query(consultas.eliminarUsuario, [docente.id_usuario]);
    }

    await connection.commit();
    return {
      success: true,
      message: 'Docente y usuario eliminados correctamente',
      id_docente: id,
      id_usuario: docente.id_usuario
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

// --- (obtenerDocentesEliminados - Corregido pool) ---
async function obtenerDocentesEliminados() {
  const [docentes] = await pool.query(consultas.obtenerDocentesEliminados);
  return docentes;
}

// --- (restaurarDocente - Corregido pool) ---
async function restaurarDocente(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(consultas.restaurarDocente, [id]);

    const [docentes] = await connection.query(
      'SELECT id_usuario FROM docente WHERE id_docente = ?',
      [id]
    );

    if (docentes.length > 0 && docentes[0].id_usuario) {
      await connection.query(consultas.restaurarUsuario, [docentes[0].id_usuario]);
    }

    await connection.commit();
    return await obtenerDocentePorId(id);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

// --- (obtenerEstadosDocente - Corregido pool) ---
async function obtenerEstadosDocente() {
  const [rows] = await pool.query(consultas.obtenerValoresEnumEstado);
  return rows;
}

// --- (altaDocenteUsuario - Corregido pool) ---
async function altaDocenteUsuario(data) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // lógica original
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  altaDocenteUsuario,
  crearDocentePerfil,
  crearUsuarioParaDocente,
  obtenerTodosDocentes,
  obtenerDocentePorId,
  actualizarDocente,
  actualizarDocenteParcial,
  eliminarDocente,
  obtenerDocentesEliminados,
  restaurarDocente,
  obtenerEstadosDocente
};
