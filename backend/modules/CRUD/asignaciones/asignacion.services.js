const db = require('../../../config/db');
const consultas = require('./asignacion.queries');

// --- Definimos las funciones por separado para evitar errores de sintaxis ---

async function obtenerAsignacionPorId(id) {
  const query = `${consultas.obtenerBase} WHERE asig.id_asignacion = ? AND asig.deleted_at IS NULL`;
  const [rows] = await db.query(query, [id]);
  if (rows.length === 0) {
    throw new Error('Asignación no encontrada');
  }
  return rows[0];
}

async function obtenerAsignaciones(queryParams) {
  let query = consultas.obtenerBase;
  const whereClauses = ['asig.deleted_at IS NULL'];
  const params = [];

  if (queryParams.id_docente) {
    whereClauses.push('asig.id_docente = ?');
    params.push(queryParams.id_docente);
  }
  // ... (otros filtros si los necesitas) ...
  if (queryParams.anio_lectivo) {
    whereClauses.push('asig.anio_lectivo = ?');
    params.push(queryParams.anio_lectivo);
  }

  if (whereClauses.length > 0) {
    query += ` WHERE ${whereClauses.join(' AND ')}`;
  }
  query += ` ORDER BY asig.anio_lectivo DESC, c.anio, c.division, m.nombre`;

  const [asignaciones] = await db.query(query, params);
  return asignaciones;
}

async function crearAsignacion(data) {
  const { id_docente, id_curso, id_materia, anio_lectivo } = data;

  if (!id_docente || !id_curso || !id_materia || !anio_lectivo) {
    throw new Error('id_docente, id_curso, id_materia y anio_lectivo son obligatorios');
  }

  // --- LÓGICA DE SUPLENCIA/CONFLICTO ---
  // 1. Verificar si la "plaza" (Curso + Materia + Año) ya está ocupada por ALGUIEN.
  const [plazasOcupadas] = await db.query(consultas.verificarPlazaOcupada, [
    id_curso, id_materia, anio_lectivo
  ]);

  if (plazasOcupadas.length > 0) {
    // 2. Verificamos si alguna de esas asignaciones está ACTIVA.
    const hayAsignacionActiva = plazasOcupadas.some(plaza => 
      plaza.estado_docente === 'activo' && 
      plaza.estado_asignacion === 'activo'
    );

    if (hayAsignacionActiva) {
      // 3. ¡CONFLICTO REAL! La plaza está ocupada por un docente activo.
      const esElMismoDocente = plazasOcupadas.some(plaza => plaza.id_docente == id_docente);
      if (esElMismoDocente) {
         throw new Error('Esta asignación (docente, curso, materia) ya existe y está activa.');
      } else {
         throw new Error('Conflicto: Esta materia ya está siendo enseñada por otro docente activo.');
      }
    }
    // Si no hay asignación activa (ej. docente en licencia), se permite crear la suplencia.
  }
  
  // 4. Si llegamos aquí, la plaza está libre O está ocupada por alguien inactivo.
  const [result] = await db.query(consultas.crear, [
    id_docente, id_curso, id_materia, anio_lectivo
  ]);

  return await obtenerAsignacionPorId(result.insertId);
}

async function actualizarAsignacion(id, data) {
  const [rows] = await db.query(consultas.obtenerPorIdSimple, [id]);
  if (rows.length === 0) {
    throw new Error('Asignación no encontrada');
  }
  const existente = rows[0];

  const dataFinal = {
    anio_lectivo: data.anio_lectivo !== undefined ? data.anio_lectivo : existente.anio_lectivo,
    estado: data.estado !== undefined ? data.estado : existente.estado,
  };
  
  if (data.anio_lectivo !== undefined && data.anio_lectivo != existente.anio_lectivo) {
     const [duplicados] = await db.query(consultas.verificarExiste, [
        existente.id_docente, existente.id_curso, existente.id_materia,
        dataFinal.anio_lectivo
     ]);
     
     if (duplicados.length > 0 && duplicados[0].id_asignacion != id) {
        throw new Error('Conflicto: Esta asignación (docente, curso, materia) ya existe para el nuevo año lectivo.');
     }
  }

  await db.query(consultas.actualizar, [
    dataFinal.anio_lectivo,
    dataFinal.estado,
    id
  ]);

  return await obtenerAsignacionPorId(id);
}

async function eliminarAsignacion(id) {
  const asignacion = await obtenerAsignacionPorId(id); // Verifica que existe
  const [result] = await db.query(consultas.eliminar, [id]);
  if (result.affectedRows === 0) {
    throw new Error('No se pudo eliminar la asignación');
  }
  return { 
    message: 'Asignación eliminada correctamente', 
    id_asignacion: id 
  };
}

async function obtenerEstadosAsignacion() {
  try {
    const [rows] = await db.query(consultas.obtenerValoresEnumEstado);
    if (!rows || rows.length === 0) {
      throw new Error("No se pudo obtener la definición de la columna 'estado'.");
    }
    const enumString = rows[0].Type; 
    const valores = enumString
      .replace("enum(", "").replace(")", "").replaceAll("'", "").split(',');
    return valores;
  } catch (err) {
    console.error("Error al parsear ENUM 'estado':", err);
    throw new Error("Error del servidor al obtener estados.");
  }
}

// --- Exportamos todo junto al final ---
module.exports = {
  obtenerAsignaciones,
  obtenerAsignacionPorId,
  crearAsignacion,
  actualizarAsignacion,
  eliminarAsignacion,
  obtenerEstadosAsignacion,
};