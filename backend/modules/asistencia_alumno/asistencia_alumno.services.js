const db = require('../../config/db');
const consultas = require('./asistencia_alumno.queries');

exports.obtenerAsistenciaPorId = async (id) => {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  return rows[0];
};

exports.crearAsistencia = async (data) => {
  const { id_alumno, id_materia, id_curso, id_docente, anio_lectivo, fecha_clase, estado } = data;
  if (!id_alumno || !id_materia || !id_curso || !id_docente || !anio_lectivo || !fecha_clase || !estado) {
    throw new Error('Todos los campos son obligatorios');
  }

  const [result] = await db.query(consultas.crear, [id_alumno, id_materia, id_curso, id_docente, anio_lectivo, fecha_clase, estado]);
  const [rows] = await db.query(consultas.obtenerPorId, [result.insertId]);
  return rows[0];
};

exports.actualizarAsistencia = async (id, data) => {
  const asistencia = await exports.obtenerAsistenciaPorId(id);
  if (!asistencia) throw new Error('Registro de asistencia no encontrado');
  if (!data.estado) throw new Error('El campo "estado" es obligatorio');

  await db.query(consultas.actualizar, [data.estado, id]);
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  return rows[0];
};

exports.eliminarAsistencia = async (id) => {
  const asistencia = await exports.obtenerAsistenciaPorId(id);
  if (!asistencia) throw new Error('Registro de asistencia no encontrado');
  const [result] = await db.query(consultas.eliminarLogico, [id]);
  return { mensaje: result.affectedRows ? 'Registro eliminado correctamente' : 'No se pudo eliminar', id_asistencia: id };
};

exports.obtenerAsistenciasEliminadas = async () => {
  const [rows] = await db.query(consultas.obtenerEliminados);
  return rows;
};

exports.restaurarAsistencia = async (id) => {
  const [result] = await db.query(consultas.restaurar, [id]);
  if (result.affectedRows === 0) throw new Error('Registro no encontrado o no está eliminado');
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  return rows[0];
};

// --- Negocio ---
exports.obtenerListaClase = async (filtros) => {
  const { id_materia, fecha_clase, id_curso, anio_lectivo } = filtros;
  if (!id_materia || !fecha_clase || !id_curso || !anio_lectivo)
    throw new Error('id_materia, fecha_clase, id_curso y anio_lectivo son obligatorios');

  const params = [id_materia, fecha_clase, anio_lectivo, id_curso, anio_lectivo];
  const [rows] = await db.query(consultas.listaClasePorDia, params);
  return rows;
};

exports.obtenerReportePorAlumno = async (dni_alumno, anio_lectivo) => {
  if (!dni_alumno || !anio_lectivo) throw new Error('dni_alumno y anio_lectivo son obligatorios');
  const [rows] = await db.query(consultas.reportePorAlumno, [dni_alumno, anio_lectivo]);
  return rows;
};

exports.obtenerAsistenciaPorDNI = async (dni_alumno) => {
  if (!dni_alumno) throw new Error('dni_alumno es obligatorio');
  const [rows] = await db.query(consultas.obtenerPorDNI, [dni_alumno]);
  return rows;
};

exports.guardarAsistenciasClase = async (data) => {
  const { id_materia, id_curso, id_docente, anio_lectivo, fecha_clase, alumnos } = data;

  if (!id_materia || !id_curso || !id_docente || !anio_lectivo || !fecha_clase || !alumnos)
    throw new Error('Faltan datos principales');

  if (!Array.isArray(alumnos) || alumnos.length === 0)
    throw new Error('La lista de alumnos debe ser un array no vacío');

  const values = alumnos.map(a => [
    a.id_alumno,
    id_materia,
    id_curso,
    id_docente,
    anio_lectivo,
    fecha_clase,
    a.estado,
    null
  ]);

  const [result] = await db.query(consultas.upsertMasivo, [values]);
  return { mensaje: `Se procesaron ${alumnos.length} registros.`, resultado: result };
};
