const db = require('../../config/db');
const consultas = require('./docente.queries'); 

// Obtener todos los docentes activos
exports.obtenerTodosDocentes = async () => {
  const [rows] = await db.query(consultas.obtenerTodos);
  return rows;
};

// Obtener un docente por su ID
exports.obtenerDocentePorId = async (id) => {
  const [rows] = await db.query(consultas.obtenerPorId, [id]);
  return rows[0];
};

// Crear un nuevo docente
exports.crearDocente = async (data) => {
  const {
    id_usuario,
    dni_docente,
    nombre,
    apellido,
    email,
    telefono,
    especialidad,
    estado
  } = data;

  // Validación adicional
  if (!dni_docente || !nombre || !apellido) {
    throw new Error('DNI, nombre y apellido son obligatorios');
  }

  const [result] = await db.query(consultas.crear, [
    id_usuario || null,
    dni_docente,
    nombre,
    apellido,
    email || null,
    telefono || null,
    especialidad || null,
    estado || 'activo'
  ]);

  // Obtener el docente recién creado con todos sus campos
  const [docenteCreado] = await db.query(consultas.obtenerPorId, [result.insertId]);
  
  return docenteCreado[0];
};

// Actualizar un docente
exports.actualizarDocente = async (id, data) => {
  // Primero verificar que el docente existe
  const docenteExistente = await exports.obtenerDocentePorId(id);
  
  if (!docenteExistente) {
    throw new Error('Docente no encontrado');
  }

  const {
    id_usuario,
    dni_docente,
    nombre,
    apellido,
    email,
    telefono,
    especialidad,
    estado
  } = data;

  const [result] = await db.query(consultas.actualizarCompleto, [
    id_usuario !== undefined ? id_usuario : docenteExistente.id_usuario,
    dni_docente || docenteExistente.dni_docente,
    nombre || docenteExistente.nombre,
    apellido || docenteExistente.apellido,
    email !== undefined ? email : docenteExistente.email,
    telefono !== undefined ? telefono : docenteExistente.telefono,
    especialidad !== undefined ? especialidad : docenteExistente.especialidad,
    estado || docenteExistente.estado,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar el docente');
  }

  // Retornar el docente actualizado
  const [docenteActualizado] = await db.query(consultas.obtenerPorId, [id]);
  return docenteActualizado[0];
};

exports.actualizarDocenteParcial = async (id, data) => {
  // Primero verificar que el docente existe
  const docenteExistente = await exports.obtenerDocentePorId(id);
  
  if (!docenteExistente) {
    throw new Error('Docente no encontrado');
  }

  // Filtrar solo los campos que vienen en data
  const camposActualizar = {};
  const camposPermitidos = [
    'id_usuario',
    'dni_docente',
    'nombre',
    'apellido',
    'email',
    'telefono',
    'especialidad',
    'estado'
  ];

  camposPermitidos.forEach(campo => {
    if (data[campo] !== undefined) {
      camposActualizar[campo] = data[campo];
    }
  });

  // Si no hay campos para actualizar, retornar el docente actual
  if (Object.keys(camposActualizar).length === 0) {
    return docenteExistente;
  }

  // Construir la query dinámica
  const setClauses = Object.keys(camposActualizar).map(campo => `${campo} = ?`);
  const valores = Object.values(camposActualizar);
  
  const query = `
    UPDATE docente
    SET 
      ${setClauses.join(', ')},
      updated_at = CURRENT_TIMESTAMP
    WHERE id_docente = ? AND deleted_at IS NULL
  `;

  valores.push(id); // Agregar el ID al final

  const [result] = await db.query(query, valores);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar el docente');
  }

  // Retornar el docente actualizado
  const [docenteActualizado] = await db.query(consultas.obtenerPorId, [id]);
  return docenteActualizado[0];
};

// Eliminar lógicamente un docente
exports.eliminarDocente = async (id) => {
  // Verificar que existe antes de eliminar
  const docenteExistente = await exports.obtenerDocentePorId(id);
  
  if (!docenteExistente) {
    throw new Error('Docente no encontrado');
  }

  const [result] = await db.query(consultas.eliminarLogico, [id]);
  
  return { 
    mensaje: result.affectedRows > 0 ? 'Docente eliminado correctamente' : 'No se pudo eliminar el docente',
    id_docente: id
  };
};

// Obtener docentes eliminados
exports.obtenerDocentesEliminados = async () => {
  const [rows] = await db.query(consultas.obtenerEliminados);
  return rows;
};

// Restaurar un docente eliminado
exports.restaurarDocente = async (id) => {
  const [result] = await db.query(consultas.restaurar, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error('Docente no encontrado o no está eliminado');
>>>>>>> origin/medina_marcelo
  }
  return rows[0];
}

<<<<<<< HEAD
const servicioDocentes = {
  obtenerTodos: async () => {
    const [rows] = await pool.query(consultas.obtenerTodos);
    return rows;
  },

  obtenerPorId: async (id) => {
    return await _obtenerDocentePorId(id);
  },

  obtenerPorDni: async (dni) => {
    const [rows] = await pool.query(consultas.obtenerPorDni, [dni]);
    if (rows.length === 0) {
      const error = new Error('No se encontró ningún docente con ese DNI.');
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  },

  crear: async (datos) => {
    const { dni_docente, email } = datos;

    // 1. Validar DNI duplicado
    const [dniExistente] = await pool.query(consultas.verificarDniExistente, [dni_docente]);
    if (dniExistente.length > 0) {
      const error = new Error('Ya existe un docente con este DNI.');
      error.statusCode = 409; // 409 Conflict
      throw error;
    }

    // 2. Validar Email duplicado (si se provee)
    if (email) {
      const [emailExistente] = await pool.query(consultas.verificarEmailExistente, [email]);
      if (emailExistente.length > 0) {
        const error = new Error('Ya existe un docente con este email.');
        error.statusCode = 409;
        throw error;
      }
    }

    // 3. Preparar parámetros y ejecutar inserción
    const params = [
      datos.id_usuario || null, // Acepta nulo si no se asigna usuario
      datos.dni_docente,
      datos.nombre,
      datos.apellido,
      datos.email || null,
      datos.telefono || null,
      datos.especialidad || null,
      datos.estado?.toUpperCase() || 'ACTIVO'
    ];

    const [resultado] = await pool.query(consultas.crear, params);
    
    // Retornar el objeto creado
    return { id_docente: resultado.insertId, ...datos };
  },

  actualizar: async (id, datos) => {
    // 1. Verificar que el docente exista
    await _obtenerDocentePorId(id);

    // 2. Opcional: Validar DNI/Email si han cambiado y pertenecen a OTRO docente
    // (Esta lógica se puede añadir aquí si es necesaria)

    // 3. Preparar parámetros y ejecutar actualización
    const params = [
      datos.id_usuario || null,
      datos.dni_docente,
      datos.nombre,
      datos.apellido,
      datos.email || null,
      datos.telefono || null,
      datos.especialidad || null,
      datos.estado?.toUpperCase() || 'ACTIVO',
      id // id para el WHERE
    ];

    await pool.query(consultas.actualizar, params);

    // 4. Retornar el docente actualizado
    return await _obtenerDocentePorId(id);
  },

  eliminar: async (id) => {
    // 1. Verificar que el docente exista
    const docente = await _obtenerDocentePorId(id);
    
    // 2. Ejecutar borrado lógico
    const [resultado] = await pool.query(consultas.eliminarLogico, [id]);

    if (resultado.affectedRows === 0) {
      // Esto podría pasar si hay una condición de carrera, aunque _obtener... ya lo valida
      const error = new Error(`No se encontró un docente activo con ID ${id}.`);
      error.statusCode = 404;
      throw error;
    }

    return { mensaje: `Docente con ID ${id} dado de baja correctamente.` };
  }
};

module.exports = servicioDocentes;
=======
  }

  // Retornar el docente restaurado
  const [docente] = await db.query(consultas.obtenerPorId, [id]);
  return docente[0];
};
