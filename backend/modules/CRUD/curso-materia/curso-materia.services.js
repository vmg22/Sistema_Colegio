// modules/cursoMateria/cursoMateria.service.js
const pool = require('../../../config/db');
const consultas = require('./curso-materia.queries');

const servicioCursoMateria = {

  /**
   * Obtiene la lista de materias asignadas a un curso.
   */
  obtenerMateriasPorCurso: async (id_curso) => {
    const [rows] = await pool.query(consultas.obtenerMateriasPorCurso, [id_curso]);
    // Devuelve un array simple de objetos materia
    return rows;
  },

  /**
   * Sincroniza la lista de materias de un curso.
   * Elimina las que ya no están y agrega/restaura las nuevas.
   * @param {number} id_curso - El ID del curso a modificar.
   * @param {Array<number>} idMaterias - Un array de IDs de materias (ej: [1, 5, 12]).
   */
  actualizarAsignaciones: async (id_curso, idMaterias) => {
    
    // Es crucial que 'idMaterias' sea un array, incluso si está vacío.
    if (!Array.isArray(idMaterias)) {
      const error = new Error("Se esperaba un array de IDs de materias.");
      error.statusCode = 400; // Bad Request
      throw error;
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      if (idMaterias.length === 0) {
        // --- Caso 1: La lista está vacía ---
        // Simplemente borramos (lógicamente) todas las materias de este curso.
        await connection.query(
          `UPDATE curso_materia SET deleted_at = CURRENT_TIMESTAMP 
           WHERE id_curso = ? AND deleted_at IS NULL`,
          [id_curso]
        );
        
      } else {
        // --- Caso 2: La lista tiene materias ---
        
        // 1. Desactivamos las que ya no están en la lista
        await connection.query(consultas.desactivarMateriasAntiguas, [id_curso, idMaterias]);

        // 2. Preparamos los datos para el INSERT...ON DUPLICATE
        // Debe ser un array de arrays, ej: [ [1, 10], [1, 12] ]
        const valoresInsert = idMaterias.map(id_materia => [id_curso, id_materia]);

        // 3. Insertamos las nuevas y/o restauramos las antiguas
        await connection.query(consultas.activarNuevasMaterias, [valoresInsert]);
      }

      await connection.commit();
      
      // Devolvemos la lista actualizada de materias
      return await servicioCursoMateria.obtenerMateriasPorCurso(id_curso);

    } catch (error) {
      await connection.rollback();
      console.error('Error en la transacción de curso_materia:', error);
      throw new Error(error.message || 'Error al actualizar asignaciones.');
    } finally {
      connection.release();
    }
  }
};

module.exports = servicioCursoMateria;