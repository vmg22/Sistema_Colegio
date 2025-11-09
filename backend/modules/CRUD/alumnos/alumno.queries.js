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

  obtenerAlumnoCompleto: `
    SELECT 
      a.*,
      t.id_tutor,
      t.nombre as tutor_nombre,
      t.apellido as tutor_apellido,
      t.dni_tutor,
      t.parentesco,
      t.telefono as tutor_telefono,
      t.email as tutor_email
    FROM alumno a
    LEFT JOIN alumno_tutor at ON a.id_alumno = at.id_alumno AND at.deleted_at IS NULL
    LEFT JOIN tutor t ON at.id_tutor = t.id_tutor AND t.deleted_at IS NULL
    WHERE a.id_alumno = ?`,

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
    SELECT id_alumno, estado FROM alumno 
    WHERE id_alumno = ? AND deleted_at IS NULL
  `,
  // Para verificar si una fila existe en la BD
  verificarEmailExistente: `
    SELECT id_alumno FROM alumno
    WHERE email = ? AND deleted_at IS NULL
  `,
  // Para verificar si una fila existe en la BD, sin importar si está "eliminada"
  verificarFilaExiste: `
  SELECT id_alumno FROM alumno 
  WHERE id_alumno = ?
`,

// ====================
  // CONSULTAS PARA TUTOR (Usadas en crearConTutor)
  // ====================

  verificarDniTutorExistente: `
    SELECT id_tutor FROM tutor 
    WHERE dni_tutor = ? AND deleted_at IS NULL
  `,

  // ====================
  // CONSULTAS PARA USUARIO (Usadas en crearConTutor)
  // ====================

  verificarUsernameExistente: `
    SELECT id_usuario FROM usuario 
    WHERE username = ? AND deleted_at IS NULL
  `,

  verificarEmailUsuarioExistente: `
    SELECT id_usuario FROM usuario 
    WHERE email_usuario = ? AND deleted_at IS NULL
  `,

  crearUsuario: `
    INSERT INTO usuario (username, password_hash, email_usuario, rol, estado)
    VALUES (?, ?, ?, 'tutor', 'activo')
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
  `,
  inscribirEnCurso: `
 INSERT INTO alumno_curso
 (id_alumno, id_curso, anio_lectivo, estado, fecha_inscripcion)
 VALUES (?, ?, ?, 'regular', CURDATE())
 `,

 /**
   * Obtiene la lista de IDs de materias del plan de estudios de un curso
   * Params: [id_curso]
   */
 obtenerMateriasDeCurso: `
 SELECT id_materia FROM curso_materia
 WHERE id_curso = ? AND deleted_at IS NULL
 `,

 /**
   * Crea los registros iniciales en 'alumno_materia_estado'
   * (Bulk Insert)
   * Params: [ [id_alumno, id_materia, id_curso, anio_lectivo, 'cursando'], [...] ]
   */
 inscribirEnMaterias: `
 INSERT INTO alumno_materia_estado
 (id_alumno, id_materia, id_curso, anio_lectivo, estado)
 VALUES ?
 `,
 obtenerCursoYMateriasActual: `
    -- 1. Obtenemos el curso actual del alumno
    WITH AlumnoCursoActual AS (
      SELECT 
        a.id_alumno,
        a.nombre_alumno,
        a.apellido_alumno,
        c.id_curso,
        c.nombre AS nombre_curso,
        c.division,
        c.turno,
        c.anio AS anio_curso,
        ac.anio_lectivo
      FROM alumno a
      JOIN alumno_curso ac ON a.id_alumno = ac.id_alumno
      JOIN curso c ON ac.id_curso = c.id_curso
      WHERE 
        a.id_alumno = ? 
        AND ac.anio_lectivo = ? -- (Ej: 2025)
        AND a.deleted_at IS NULL
        AND ac.deleted_at IS NULL
    ),
    -- 2. Obtenemos las materias del plan de estudios DE ESE curso
    MateriasDelPlan AS (
      SELECT 
        cm.id_materia,
        m.nombre AS nombre_materia,
        m.descripcion AS descripcion_materia
      FROM curso_materia cm
      JOIN materia m ON cm.id_materia = m.id_materia
      -- Usamos un subquery para obtener el id_curso (maneja si AlumnoCursoActual está vacío)
      WHERE cm.id_curso = (SELECT id_curso FROM AlumnoCursoActual)
        AND cm.deleted_at IS NULL
        AND m.deleted_at IS NULL
    )
    -- 3. Unimos todo
    SELECT 
      acc.*, -- Datos del Alumno y Curso
      
      -- Datos de la Materia (del Plan)
      mp.id_materia,
      mp.nombre_materia,
      mp.descripcion_materia,
      
      -- Datos del ESTADO (del Alumno)
      ame.estado AS estado_materia,
      ame.calificacion_final
      
    FROM AlumnoCursoActual acc
    -- LEFT JOIN: Crucial para mostrar el curso aunque no tenga materias
    LEFT JOIN MateriasDelPlan mp ON 1=1
    -- LEFT JOIN: Crucial para obtener el estado de CADA materia
    LEFT JOIN alumno_materia_estado ame 
      ON ame.id_alumno = acc.id_alumno
      AND ame.id_materia = mp.id_materia
      AND ame.anio_lectivo = acc.anio_lectivo
      AND ame.deleted_at IS NULL
    ORDER BY mp.nombre_materia
 `,
};

module.exports = consultasAlumnos;