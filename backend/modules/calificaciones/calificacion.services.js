const db = require('../../config/db');
const consultas = require('./calificacion.queries'); 

// --- 1. PEGA ESTA FUNCIÓN HELPER ARRIBA DE TUS SERVICIOS ---
/**
 * Calcula el promedio de 3 notas, ignorando nulos o undefined.
 */
// --- 1. PEGA ESTA FUNCIÓN HELPER ARRIBA DE TUS SERVICIOS ---
/**
 * Calcula el promedio de 3 notas, ignorando nulos o undefined.
 */
const calcularPromedio = (n1, n2, n3) => {
  const notas = [];
  
  // Convierte a número y filtra nulos/undefined
  [n1, n2, n3].forEach(nota => {
    if (nota !== null && nota !== undefined) {
      const num = parseFloat(nota);
      if (!isNaN(num)) {
        notas.push(num);
      }
    }
  });

  if (notas.length === 0) return null; // No hay promedio si no hay notas

  const sum = notas.reduce((a, b) => a + b, 0);
  const avg = sum / notas.length;
  return parseFloat(avg.toFixed(2)); // Redondea a 2 decimales
};

// Obtener todas las calificaciones activas
exports.obtenerTodasCalificaciones = async () => {
  const [rows] = await db.query(consultas.obtenerTodas);
  return rows;
};

// Obtener una calificación por su ID
exports.obtenerCalificacionPorId = async (id) => {
  console.log("=== DEBUG obtenerCalificacionPorId ===");
  console.log("Buscando calificación con ID:", id);
  try {
    const [rows] = await db.query(consultas.obtenerPorId, [id]);
    console.log("Filas encontradas:", rows);
    console.log("Primera fila:", rows[0]);
    console.log("Campos de la primera fila:", rows[0] ? Object.keys(rows[0]) : 'No hay filas');
    return rows[0];
  } catch (error) {
    console.error("Error en obtenerCalificacionPorId:", error);
    throw error;
  }
};

// Crear una nueva calificación
// --- 3. HAZ LO MISMO PARA 'crearCalificacion' ---
exports.crearCalificacion = async (datosCalificacion) => {
  // 1. Calcula el promedio
  const promedio = calcularPromedio(
    datosCalificacion.nota_1,
    datosCalificacion.nota_2,
    datosCalificacion.nota_3
  );

  // 2. Prepara los 13 parámetros de la query 'crear'
  const params = [
    datosCalificacion.id_alumno,
    datosCalificacion.id_materia,
    datosCalificacion.id_docente,
    datosCalificacion.id_curso,
    datosCalificacion.anio_lectivo,
    datosCalificacion.cuatrimestre,
    datosCalificacion.nota_1 || null,
    datosCalificacion.nota_2 || null,
    datosCalificacion.nota_3 || null,
    promedio, // <-- El promedio calculado
    datosCalificacion.periodo_complementario || null,
    datosCalificacion.calificacion_definitiva || null,
    datosCalificacion.estado || 'Cursando'
  ];

  // 3. Ejecuta la query 'crear'
  const [result] = await db.query(consultas.crear, params);

  const [calificacionCreada] = await db.query(consultas.obtenerPorId, [result.insertId]);
  return calificacionCreada[0];
};

// Actualizar una calificación

exports.actualizarCalificacion = async (id, data) => {
  // Primero verificar que la calificación existe
  const calificacionExistente = await exports.obtenerCalificacionPorId(id);
  
  if (!calificacionExistente) {
    throw new Error('Calificación no encontrada');
  }

  const {
    id_alumno,
    id_materia,
    id_docente,
    id_curso,
    anio_lectivo,
    cuatrimestre,
    nota_1,
    nota_2,
    nota_3,
    promedio_cuatrimestre,
    periodo_complementario,
    calificacion_definitiva,
    estado
  } = data;

  // Usar los valores existentes si no se proporcionan nuevos
  const [result] = await db.query(consultas.actualizarCompleto, [
    id_alumno !== undefined ? id_alumno : calificacionExistente.id_alumno,
    id_materia !== undefined ? id_materia : calificacionExistente.id_materia,
    id_docente !== undefined ? id_docente : calificacionExistente.id_docente,
    id_curso !== undefined ? id_curso : calificacionExistente.id_curso,
    anio_lectivo !== undefined ? anio_lectivo : calificacionExistente.anio_lectivo,
    cuatrimestre !== undefined ? cuatrimestre : calificacionExistente.cuatrimestre,
    nota_1 !== undefined ? nota_1 : calificacionExistente.nota_1,
    nota_2 !== undefined ? nota_2 : calificacionExistente.nota_2,
    nota_3 !== undefined ? nota_3 : calificacionExistente.nota_3,
    promedio_cuatrimestre !== undefined ? promedio_cuatrimestre : calificacionExistente.promedio_cuatrimestre,
    periodo_complementario !== undefined ? periodo_complementario : calificacionExistente.periodo_complementario,
    calificacion_definitiva !== undefined ? calificacion_definitiva : calificacionExistente.calificacion_definitiva,
    estado !== undefined ? estado : calificacionExistente.estado,
    id
  ]);

  if (result.affectedRows === 0) {
    throw new Error('No se pudo actualizar la calificación');
  }

  // Retornar la calificación actualizada
  const [calificacionActualizada] = await db.query(consultas.obtenerPorId, [id]);
  return calificacionActualizada[0];
};

exports.actualizarCalificacionParcial = async (id, data) => {
  
  // --- DEBUG LOGS DEL BACKEND ---
  console.log('=== DEBUG BACKEND - ACTUALIZAR ===');
  console.log('ID Recibido:', id);
  console.log('Datos Recibidos (data):', data);
  // --- FIN DEBUG LOGS ---

  try {
    const calificacionExistente = await exports.obtenerCalificacionPorId(id);
    if (!calificacionExistente) {
      throw new Error('Calificación no encontrada');
    }

    const nota_1 = data.nota_1 !== undefined ? data.nota_1 : calificacionExistente.nota_1;
    const nota_2 = data.nota_2 !== undefined ? data.nota_2 : calificacionExistente.nota_2;
    const nota_3 = data.nota_3 !== undefined ? data.nota_3 : calificacionExistente.nota_3;

    const nuevoPromedio = calcularPromedio(nota_1, nota_2, nota_3);
    
    // --- DEBUG LOGS DEL BACKEND ---
    console.log('Nuevo Promedio Calculado:', nuevoPromedio);
    // --- FIN DEBUG LOGS ---

    const params = [
      data.nota_1 !== undefined ? data.nota_1 : null,
      data.nota_2 !== undefined ? data.nota_2 : null,
      data.nota_3 !== undefined ? data.nota_3 : null,
      nuevoPromedio, // 4to Parámetro
      data.periodo_complementario !== undefined ? data.periodo_complementario : null,
      data.calificacion_definitiva !== undefined ? data.calificacion_definitiva : null,
      data.estado !== undefined ? data.estado : null,
      id // 8vo Parámetro
    ];

    // --- DEBUG LOGS DEL BACKEND ---
    console.log('Parámetros para la Query:', params);
    // --- FIN DEBUG LOGS ---

    await db.query(consultas.actualizarParcial, params);

    console.log('🔍 DEBUG SYNC - Verificando sincronización con alumno_materia_estado');
    console.log('  data.estado:', data.estado);
    console.log('  data.calificacion_definitiva:', data.calificacion_definitiva);
    console.log('  ¿Debe sincronizar?', data.estado !== undefined || data.calificacion_definitiva !== undefined);

    // SINCRONIZAR con alumno_materia_estado
    // Si se actualizó el estado o la calificación definitiva, sincronizar con alumno_materia_estado
    if (data.estado !== undefined || data.calificacion_definitiva !== undefined) {
      console.log('✅ EJECUTANDO SINCRONIZACIÓN con alumno_materia_estado');
      
      const estadoFinal = data.estado !== undefined ? data.estado : calificacionExistente.estado;
      const notaFinal = data.calificacion_definitiva !== undefined ? data.calificacion_definitiva : calificacionExistente.calificacion_definitiva;
      
      console.log('  Estado final:', estadoFinal);
      console.log('  Nota final:', notaFinal);
      console.log('  id_alumno:', calificacionExistente.id_alumno);
      console.log('  id_materia:', calificacionExistente.id_materia);
      console.log('  id_curso:', calificacionExistente.id_curso);
      console.log('  anio_lectivo:', calificacionExistente.anio_lectivo);
      
      // Actualizar o crear en alumno_materia_estado (MySQL 8 compatible)
      const resultadoSync = await db.query(`
        INSERT INTO alumno_materia_estado 
          (id_alumno, id_materia, id_curso, anio_lectivo, estado, calificacion_final, fecha_estado)
        VALUES (?, ?, ?, ?, ?, ?, CURDATE())
        ON DUPLICATE KEY UPDATE
          estado = ?,
          calificacion_final = ?,
          fecha_estado = CURDATE(),
          updated_at = NOW()
      `, [
        calificacionExistente.id_alumno,
        calificacionExistente.id_materia,
        calificacionExistente.id_curso,
        calificacionExistente.anio_lectivo,
        estadoFinal,
        notaFinal,
        // Repetir para el UPDATE
        estadoFinal,
        notaFinal
      ]);
      
      console.log('✅ Resultado de sincronización:', resultadoSync[0]);
    } else {
      console.log('❌ NO se ejecutó sincronización (condición no cumplida)');
    }

    const [calificacionActualizada] = await db.query(consultas.obtenerPorId, [id]);
    return calificacionActualizada[0];

  } catch (err) {
    // --- DEBUG LOGS DEL BACKEND ---
    console.error('¡¡¡EL BACKEND SE ROMPIÓ AQUÍ!!!:', err.message);
    // --- FIN DEBUG LOGS ---
    throw err; // Lanza el error para que el controlador lo atrape
  }
};

// Eliminar lógicamente una calificación
exports.eliminarCalificacion = async (id) => {
  // Verificar que existe antes de eliminar
  const calificacionExistente = await exports.obtenerCalificacionPorId(id);
  
  if (!calificacionExistente) {
    throw new Error('Calificación no encontrada');
  }

  const [result] = await db.query(consultas.eliminarLogico, [id]);
  
  return { 
    mensaje: result.affectedRows > 0 ? 'Calificación eliminada correctamente' : 'No se pudo eliminar la calificación',
    id_calificacion: id
  };
};

// Obtener calificaciones eliminadas
exports.obtenerCalificacionesEliminadas = async () => {
  const [rows] = await db.query(consultas.obtenerEliminadas);
  return rows;
};

// Restaurar una calificación eliminada
exports.restaurarCalificacion = async (id) => {
  const [result] = await db.query(consultas.restaurar, [id]);
  
  if (result.affectedRows === 0) {
    throw new Error('Calificación no encontrada o no está eliminada');
  }

  // Retornar la calificación restaurada
  const [calificacion] = await db.query(consultas.obtenerPorId, [id]);
  return calificacion[0];
};