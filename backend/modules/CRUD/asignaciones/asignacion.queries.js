
const asignacionQueries = {

  /**
   * Crea una nueva asignación
   * @params: id_docente, id_curso, id_materia, anio_lectivo
   */
  crear: `
    INSERT INTO docente_curso_materia 
      (id_docente, id_curso, id_materia, anio_lectivo, estado)
    VALUES (?, ?, ?, ?, 'activo')
  `,

  /**
   * Obtiene todas las asignaciones, con JOINs para ver los nombres.
   * La cláusula WHERE se construirá dinámicamente en el servicio.
   */
  obtenerBase: `
    SELECT 
      asig.id_asignacion,
      asig.anio_lectivo,
      asig.estado,
      d.id_docente,
      d.nombre AS docente_nombre,
      d.apellido AS docente_apellido,
      c.id_curso,
      c.nombre AS curso_nombre,
      c.anio AS curso_anio,
      c.division AS curso_division,
      m.id_materia,
      m.nombre AS materia_nombre
    FROM docente_curso_materia AS asig
    JOIN docente AS d ON asig.id_docente = d.id_docente
    JOIN curso AS c ON asig.id_curso = c.id_curso
    JOIN materia AS m ON asig.id_materia = m.id_materia
  `,

  /**
   * Obtiene una asignación por ID (simple, sin JOINs)
   * Se usa para obtener el estado actual antes de actualizar.
   * @params: id_asignacion
   */
  obtenerPorIdSimple: `
    SELECT * FROM docente_curso_materia
    WHERE id_asignacion = ? 
      AND deleted_at IS NULL
  `,

  /**
   * Verifica si una asignación ya existe (para evitar duplicados)
   * @params: id_docente, id_curso, id_materia, anio_lectivo
   */
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
   * Actualiza los campos editables de una asignación
   * @params: anio_lectivo, estado, id_asignacion
   */
  actualizar: `
    UPDATE docente_curso_materia
    SET 
      anio_lectivo = ?,
      estado = ?
    WHERE id_asignacion = ? 
      AND deleted_at IS NULL
  `,

  /**
   * Elimina (soft delete) una asignación por su ID
   * @params: id_asignacion
   */
  eliminar: `
    UPDATE docente_curso_materia 
    SET deleted_at = CURRENT_TIMESTAMP 
    WHERE id_asignacion = ? 
      AND deleted_at IS NULL
  `
};

module.exports = asignacionQueries;