// alumno.queries.js
const consultasAlumnos = {
  // ====================
  // CONSULTAS DE LECTURA
  // ====================
  
  obtenerTodos: `
    SELECT 
      id_alumno, dni_alumno, nombre_alumno, apellido_alumno,
      fecha_nacimiento, lugar_nacimiento, direccion, telefono,
      email, fecha_inscripcion, estado, created_at, updated_at
    FROM alumno 
    WHERE deleted_at IS NULL
    ORDER BY apellido_alumno, nombre_alumno
  `,
  
  obtenerPorId: `
    SELECT 
      id_alumno, dni_alumno, nombre_alumno, apellido_alumno,
      fecha_nacimiento, lugar_nacimiento, direccion, telefono,
      email, fecha_inscripcion, estado, created_at, updated_at
    FROM alumno 
    WHERE id_alumno = ? AND deleted_at IS NULL
  `,
  
  obtenerPorDni: `
    SELECT 
      id_alumno, dni_alumno, nombre_alumno, apellido_alumno,
      email, estado, fecha_inscripcion
    FROM alumno 
    WHERE dni_alumno = ? AND deleted_at IS NULL
  `,
  
  obtenerPorEstado: `
    SELECT 
      id_alumno, dni_alumno, nombre_alumno, apellido_alumno, 
      email, estado, fecha_inscripcion
    FROM alumno 
    WHERE estado = ? AND deleted_at IS NULL
    ORDER BY apellido_alumno, nombre_alumno
  `,
  
  buscarPorNombre: `
    SELECT 
      id_alumno, dni_alumno, nombre_alumno, apellido_alumno, 
      email, estado, telefono
    FROM alumno 
    WHERE (nombre_alumno LIKE ? OR apellido_alumno LIKE ?) 
      AND deleted_at IS NULL
    ORDER BY apellido_alumno, nombre_alumno
  `,
  
  obtenerPorRangoInscripcion: `
    SELECT 
      id_alumno, dni_alumno, nombre_alumno, apellido_alumno, 
      fecha_inscripcion, estado, email
    FROM alumno 
    WHERE fecha_inscripcion BETWEEN ? AND ? 
      AND deleted_at IS NULL
    ORDER BY fecha_inscripcion DESC
  `,
  
  // ====================
  // CONSULTAS DE CREACIÓN
  // ====================
  
  crear: `
    INSERT INTO alumno (
      dni_alumno, nombre_alumno, apellido_alumno, 
      fecha_nacimiento, lugar_nacimiento, direccion, 
      telefono, email, fecha_inscripcion, estado
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  
  // ====================
  // CONSULTAS DE ACTUALIZACIÓN
  // ====================
  
  actualizarCompleto: `
    UPDATE alumno 
    SET 
      dni_alumno = ?, nombre_alumno = ?, apellido_alumno = ?,
      fecha_nacimiento = ?, lugar_nacimiento = ?, direccion = ?,
      telefono = ?, email = ?, fecha_inscripcion = ?, estado = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id_alumno = ? AND deleted_at IS NULL
  `,
  
  actualizarParcial: `
    UPDATE alumno 
    SET 
      nombre_alumno = ?, apellido_alumno = ?,
      direccion = ?, telefono = ?, email = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id_alumno = ? AND deleted_at IS NULL
  `,
  
  actualizarEstado: `
    UPDATE alumno 
    SET estado = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id_alumno = ? AND deleted_at IS NULL
  `,
  
  // ====================
  // CONSULTAS DE ELIMINACIÓN
  // ====================
  
 eliminarLogico: `
  UPDATE alumno
  SET deleted_at = CURRENT_TIMESTAMP, estado = 'inactivo'
  WHERE id_alumno = ? AND deleted_at IS NULL
`,

restaurar: `
  UPDATE alumno
  SET deleted_at = NULL, estado = 'activo'
  WHERE id_alumno = ?
`,
  
  // ====================
  // CONSULTAS DE VERIFICACIÓN
  // ====================
  
  verificarDniExistente: `
    SELECT id_alumno FROM alumno 
    WHERE dni_alumno = ? AND deleted_at IS NULL
  `,
  
verificarAlumnoExiste: `
  SELECT id_alumno, estado, deleted_at FROM alumno 
  WHERE id_alumno = ?
`,

  
  verificarAlumnoExiste: `
    SELECT id_alumno, estado FROM alumno 
    WHERE id_alumno = ? AND deleted_at IS NULL
  `,
  verificarEmailExistente: `
    SELECT id_alumno FROM alumno
    WHERE email = ? AND deleted_at IS NULL
  `,

 
  // ====================
  // CONSULTAS ESTADÍSTICAS
  // ====================
  
  contarTotal: `
    SELECT COUNT(*) as total_alumnos
    FROM alumno 
    WHERE deleted_at IS NULL
  `,
  
  contarPorEstado: `
    SELECT estado, COUNT(*) as cantidad
    FROM alumno 
    WHERE deleted_at IS NULL
    GROUP BY estado
    ORDER BY cantidad DESC
  `,
  
  obtenerRecientes: `
    SELECT 
      id_alumno, dni_alumno, nombre_alumno, apellido_alumno, 
      fecha_inscripcion, estado
    FROM alumno 
    WHERE deleted_at IS NULL
    ORDER BY created_at DESC
    LIMIT ?
  `,
  
  // ====================
  // CONSULTAS ESPECIALIZADAS
  // ====================
  
  obtenerPorEdad: `
    SELECT 
      id_alumno, dni_alumno, nombre_alumno, apellido_alumno,
      fecha_nacimiento,
      TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) as edad
    FROM alumno 
    WHERE deleted_at IS NULL
      AND TIMESTAMPDIFF(YEAR, fecha_nacimiento, CURDATE()) BETWEEN ? AND ?
    ORDER BY edad, apellido_alumno
  `,
  
  obtenerConContactoIncompleto: `
    SELECT 
      id_alumno, dni_alumno, nombre_alumno, apellido_alumno, 
      telefono, email, direccion
    FROM alumno 
    WHERE deleted_at IS NULL 
      AND (telefono IS NULL OR telefono = '' OR email IS NULL OR email = '')
    ORDER BY apellido_alumno
  `,
  
  // ====================
  // CONSULTAS PARA PAGINACIÓN
  // ====================
  
  obtenerPaginados: `
    SELECT 
      id_alumno, dni_alumno, nombre_alumno, apellido_alumno,
      email, fecha_inscripcion, estado, telefono
    FROM alumno 
    WHERE deleted_at IS NULL
    ORDER BY apellido_alumno, nombre_alumno
    LIMIT ? OFFSET ?
  `,
  
  contarPaginados: `
    SELECT COUNT(*) as total
    FROM alumno 
    WHERE deleted_at IS NULL
  `
};

module.exports = consultasAlumnos;