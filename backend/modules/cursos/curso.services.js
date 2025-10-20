const db = require('../../config/db');
const consultas = require('./curso.queries');

// Obtener todos los cursos activos
exports.obtenerTodosCursos = async () => {
  const [rows] = await db.query(consultas.obtenerTodos);
  return rows;
};

// Obtener un curso por su ID
exports.obtenerCursoPorId = async (id) => {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  return rows[0];
};

// Crear un nuevo curso
exports.crearCurso = async (data) => {
  const {
    nombre,
    anio,
    division,
    turno,
    id_docente_tutor,
    estado
  } = data;

  // Validación adicional
  if (!nombre || !anio || !division || !turno) {
    throw new Error('Nombre, año, división y turno son obligatorios');
  }

  const [result] = await db.query(consultas.crear, [
    nombre,
    anio,
    division,
    turno,
    id_docente_tutor || null,
    estado || 'activo'
  ]);

  // Obtener el curso recién creado con todos sus campos
  const [cursoCreado] = await db.query(consultas.obtenerPorId, [result.insertId]);
  
  return cursoCreado[0];
};

// Actualizar un curso
exports.actualizarCurso = async (id, data) => {
  // Primero verificar que el curso existe
  const cursoExistente = await exports.obtenerCursoPorId(id);
  
  if (!cursoExistente) {
    throw new Error('Curso no encontrado');
  }

  const {
    nombre,
    anio,
    division,
    turno,
    id_docente_tutor,
    estado
  } = data;

  const [result] = await db.query(consultas.actualizarCompleto, [
    nombre || cursoExistente.nombre,
    anio || cursoExistente.anio,
    division || cursoExistente.division,
    turno || cursoExistente.turno,
    id_docente_tutor !== undefined ? id_docente_tutor : cursoExistente.id_docente_tutor,
    estado || cursoExistente.estado,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar el curso');
  }

  // Retornar el curso actualizado
  const [cursoActualizado] = await db.query(consultas.obtenerPorId, [id]);
  return cursoActualizado[0];
};

// Actualizar un curso parcialmente (PATCH)
exports.actualizarCursoParcial = async (id, data) => {
  // Primero verificar que el curso existe
  const cursoExistente = await exports.obtenerCursoPorId(id);
  
  if (!cursoExistente) {
    throw new Error('Curso no encontrado');
  }

  // Filtrar solo los campos que vienen en data
  const camposActualizar = {};
  const camposPermitidos = [
    'nombre',
    'anio',
    'division',
    'turno',
    'id_docente_tutor',
    'estado'
  ];

  camposPermitidos.forEach(campo => {
    if (data[campo] !== undefined) {
      camposActualizar[campo] = data[campo];
    }
  });

  // Si no hay campos para actualizar, retornar el curso actual
  if (Object.keys(camposActualizar).length === 0) {
    return cursoExistente;
  }

  // Construir la query dinámica
  const setClauses = Object.keys(camposActualizar).map(campo => `${campo} = ?`);
  const valores = Object.values(camposActualizar);
  
  const query = `
    UPDATE curso
    SET 
      ${setClauses.join(', ')},
      updated_at = CURRENT_TIMESTAMP
    WHERE id_curso = ? AND deleted_at IS NULL
  `;

  valores.push(id); // Agregar el ID al final

  const [result] = await db.query(query, valores);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar el curso');
  }

  // Retornar el curso actualizado
  const [cursoActualizado] = await db.query(consultas.obtenerPorId, [id]);
  return cursoActualizado[0];
};

// Eliminar lógicamente un curso
exports.eliminarCurso = async (id) => {
  // Verificar que existe antes de eliminar
  const cursoExistente = await exports.obtenerCursoPorId(id);
  
  if (!cursoExistente) {
    throw new Error('Curso no encontrado');
  }

  const [result] = await db.query(consultas.eliminarLogico, [id]);
  
  return { 
    mensaje: result.affectedRows > 0 ? 'Curso eliminado correctamente' : 'No se pudo eliminar el curso',
    id_curso: id
  };
};

// Obtener cursos eliminados
exports.obtenerCursosEliminados = async () => {
  const [rows] = await db.query(consultas.obtenerEliminados);
  return rows;
};

// Restaurar un curso eliminado
exports.restaurarCurso = async (id) => {
  const [result] = await db.query(consultas.restaurar, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error('Curso no encontrado o no está eliminado');
  }

  // Retornar el curso restaurado
  const [curso] = await db.query(consultas.obtenerPorId, [id]);
  return curso[0];
};