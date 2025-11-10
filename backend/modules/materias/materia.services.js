const db = require('../../config/db');
const consultas = require('./materia.queries');

// Obtener todas las materias activas
exports.obtenerTodasMaterias = async () => {
  const [rows] = await db.query(consultas.obtenerTodos);
  return rows;
};

// Obtener una materia por su ID
exports.obtenerMateriaPorId = async (id) => {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  return rows[0];
};

// Crear una nueva materia
exports.crearMateria = async (data) => {
  const {
    nombre,
    descripcion,
    carga_horaria,
    nivel,
    ciclo,
    estado
  } = data;

  // Validación adicional
  if (!nombre || !nivel) {
    throw new Error('Nombre y nivel son obligatorios');
  }

  const [result] = await db.query(consultas.crear, [
    nombre,
    descripcion || null,
    carga_horaria || null,
    nivel,
    ciclo || 'basico',
    estado || 'activa'
  ]);

  // Obtener la materia recién creada con todos sus campos
  const [materiaCreada] = await db.query(consultas.obtenerPorId, [result.insertId]);
  
  return materiaCreada[0];
};

// Actualizar una materia
exports.actualizarMateria = async (id, data) => {
  // Primero verificar que la materia existe
  const materiaExistente = await exports.obtenerMateriaPorId(id);
  
  if (!materiaExistente) {
    throw new Error('Materia no encontrada');
  }

  const {
    nombre,
    descripcion,
    carga_horaria,
    nivel,
    ciclo,
    estado
  } = data;

  const [result] = await db.query(consultas.actualizarCompleto, [
    nombre || materiaExistente.nombre,
    descripcion !== undefined ? descripcion : materiaExistente.descripcion,
    carga_horaria !== undefined ? carga_horaria : materiaExistente.carga_horaria,
    nivel || materiaExistente.nivel,
    ciclo || materiaExistente.ciclo,
    estado || materiaExistente.estado,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar la materia');
  }

  // Retornar la materia actualizada
  const [materiaActualizada] = await db.query(consultas.obtenerPorId, [id]);
  return materiaActualizada[0];
};
// Actualizar una materia parcialmente (PATCH)
exports.actualizarMateriaParcial = async (id, data) => {
  // Primero verificar que la materia existe
  const materiaExistente = await exports.obtenerMateriaPorId(id);
  
  if (!materiaExistente) {
    throw new Error('Materia no encontrada');
  }

  // Filtrar solo los campos que vienen en data
  const camposActualizar = {};
  const camposPermitidos = [
    'nombre',
    'descripcion',
    'carga_horaria',
    'nivel',
    'ciclo',
    'estado'
  ];

  camposPermitidos.forEach(campo => {
    if (data[campo] !== undefined) {
      camposActualizar[campo] = data[campo];
    }
  });

  // Si no hay campos para actualizar, retornar la materia actual
  if (Object.keys(camposActualizar).length === 0) {
    return materiaExistente;
  }

  // Construir la query dinámica
  const setClauses = Object.keys(camposActualizar).map(campo => `${campo} = ?`);
  const valores = Object.values(camposActualizar);
  
  const query = `
    UPDATE materia
    SET 
      ${setClauses.join(', ')},
      updated_at = CURRENT_TIMESTAMP
    WHERE id_materia = ? AND deleted_at IS NULL
  `;

  valores.push(id); // Agregar el ID al final

  const [result] = await db.query(query, valores);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar la materia');
  }

  // Retornar la materia actualizada
  const [materiaActualizada] = await db.query(consultas.obtenerPorId, [id]);
  return materiaActualizada[0];
};
// Eliminar lógicamente una materia
exports.eliminarMateria = async (id) => {
  // Verificar que existe antes de eliminar
  const materiaExistente = await exports.obtenerMateriaPorId(id);
  
  if (!materiaExistente) {
    throw new Error('Materia no encontrada');
  }

  const [result] = await db.query(consultas.eliminarLogico, [id]);
  
  return { 
    mensaje: result.affectedRows > 0 ? 'Materia eliminada correctamente' : 'No se pudo eliminar la materia',
    id_materia: id
  };
};

// Obtener materias eliminadas
exports.obtenerMateriasEliminadas = async () => {
  const [rows] = await db.query(consultas.obtenerEliminados);
  return rows;
};

// Restaurar una materia eliminada
exports.restaurarMateria = async (id) => {
  const [result] = await db.query(consultas.restaurar, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error('Materia no encontrada o no está eliminada');
  }

  // Retornar la materia restaurada
  const [materia] = await db.query(consultas.obtenerPorId, [id]);
  return materia[0];
};