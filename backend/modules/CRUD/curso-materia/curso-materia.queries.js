// modules/curso-materia/curso-materia.queries.js

const consultasCursoMateria = {

  /**
   * Obtiene la lista de materias (id, nombre, nivel)
   * que están asignadas a un curso específico.
   */
  obtenerMateriasPorCurso: `
    SELECT 
      m.id_materia, 
      m.nombre, 
      m.nivel
    FROM curso_materia cm
    JOIN materia m ON cm.id_materia = m.id_materia
    WHERE cm.id_curso = ? 
      AND cm.deleted_at IS NULL
      AND m.deleted_at IS NULL
    ORDER BY m.nombre
  `,
  
  /**
   * Desactiva (borrado lógico) todas las materias de un curso
   * que NO estén en la nueva lista proporcionada.
   * Params: [id_curso, [array_de_ids_materia]]
   */
  desactivarMateriasAntiguas: `
    UPDATE curso_materia
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id_curso = ? 
      AND id_materia NOT IN (?)
      AND deleted_at IS NULL
  `,

  /**
   * Inserta las nuevas asignaciones.
   * Si una asignación ya existía y estaba borrada (deleted_at IS NOT NULL),
   * la restaura (ON DUPLICATE KEY UPDATE).
   * Params: [ array de [id_curso, id_materia] ]
   */
  activarNuevasMaterias: `
    INSERT INTO curso_materia (id_curso, id_materia)
    VALUES ?
    ON DUPLICATE KEY UPDATE deleted_at = NULL
  `
};

module.exports = consultasCursoMateria;