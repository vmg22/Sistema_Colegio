/**
 * Consultas SQL para la tabla 'docente_curso_materia' (Asignaciones)
 */
const asignacionQueries = {

  crear: `
    INSERT INTO docente_curso_materia 
      (id_docente, id_curso, id_materia, anio_lectivo, estado)
    VALUES (?, ?, ?, ?, 'activo')
  `,

  obtenerBase: `
    SELECT 
      asig.id_asignacion, asig.anio_lectivo, asig.estado,
      d.id_docente, d.nombre AS docente_nombre, d.apellido AS docente_apellido,
      c.id_curso, c.nombre AS curso_nombre, c.anio AS curso_anio, c.division AS curso_division,
      m.id_materia, m.nombre AS materia_nombre
    FROM docente_curso_materia AS asig
    JOIN docente AS d ON asig.id_docente = d.id_docente
    JOIN curso AS c ON asig.id_curso = c.id_curso
    JOIN materia AS m ON asig.id_materia = m.id_materia
  `,

  obtenerPorIdSimple: `
    SELECT * FROM docente_curso_materia
    WHERE id_asignacion = ? AND deleted_at IS NULL
  `,

  verificarExiste: `
    SELECT id_asignacion 
    FROM docente_curso_materia
    WHERE id_docente = ? 
      AND id_curso = ? 
      AND id_materia = ? 
      AND anio_lectivo = ?
      AND deleted_at IS NULL
  `,

  /**
   * --- ¡CONSULTA CLAVE AÑADIDA! ---
   * Verifica si una plaza (curso + materia + año) ya está ocupada
   * Y, si lo está, devuelve el ID y el ESTADO del docente que la ocupa.
   * @params: id_curso, id_materia, anio_lectivo
   */
  verificarPlazaOcupada: `
    SELECT 
      asig.id_asignacion, 
      asig.id_docente,
      asig.estado AS estado_asignacion,
      d.estado AS estado_docente
    FROM docente_curso_materia AS asig
    JOIN docente AS d ON asig.id_docente = d.id_docente
    WHERE asig.id_curso = ? 
      AND asig.id_materia = ? 
      AND asig.anio_lectivo = ?
      AND asig.deleted_at IS NULL
  `,
  // --- FIN DE LA ADICIÓN ---

  actualizar: `
    UPDATE docente_curso_materia
    SET 
      anio_lectivo = ?,
      estado = ?
    WHERE id_asignacion = ? 
      AND deleted_at IS NULL
  `,

  eliminar: `
    UPDATE docente_curso_materia 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_asignacion = ? 
      AND deleted_at IS NULL
  `,
  
  // (La consulta del ENUM que hicimos antes)
  obtenerValoresEnumEstado: `
    SHOW COLUMNS FROM docente_curso_materia LIKE 'estado'
  `
};

module.exports = asignacionQueries;