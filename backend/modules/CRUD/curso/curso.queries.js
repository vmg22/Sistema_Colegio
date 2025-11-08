// modules/cursos/curso.queries.js

const consultasCursos = {
  obtenerTodos: `
    SELECT 
      id_curso, nombre, anio, division, 
      turno, estado
    FROM curso
    WHERE deleted_at IS NULL
    ORDER BY anio, division, turno
  `,
  
  obtenerPorId: `
    SELECT 
      id_curso, nombre, anio, division, 
      turno, estado
    FROM curso
    WHERE id_curso = ? AND deleted_at IS NULL
  `,
  
  crear: `
    INSERT INTO curso 
      (nombre, anio, division, turno, estado) 
    VALUES (?, ?, ?, ?, ?)
  `,
  
  actualizar: `
    UPDATE curso 
    SET 
      nombre = ?, 
      anio = ?, 
      division = ?, 
      turno = ?, 
      estado = ?
    WHERE id_curso = ? AND deleted_at IS NULL
  `,
  
  eliminar: `
    UPDATE curso 
    SET deleted_at = CURRENT_TIMESTAMP, estado = 'inactivo'
    WHERE id_curso = ? AND deleted_at IS NULL
  `,
  
  verificarDuplicado: `
    SELECT id_curso FROM curso
    WHERE anio = ? AND division = ? AND turno = ? AND deleted_at IS NULL
  `
};

module.exports = consultasCursos;