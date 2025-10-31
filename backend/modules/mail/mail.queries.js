// Obtener todos los DNIs de alumnos de un curso específico (MODIFICADO)
exports.QUERY_ALUMNOS_POR_CURSO = `
SELECT 
    a.id_alumno,
    a.dni_alumno,
    a.nombre_alumno,
    a.apellido_alumno,
    a.email,
    c.id_curso,
    c.nombre AS nombre_curso,
    c.division,
    c.turno,
    c.anio AS anio_curso
FROM alumno a
JOIN alumno_curso ac ON a.id_alumno = ac.id_alumno
JOIN curso c ON ac.id_curso = c.id_curso
WHERE 
    c.anio = ?          -- El año del curso (1ro, 2do, etc.)
    AND c.division = ?  -- La división (A, B, turno mañana, etc.)
    AND ac.anio_lectivo = ? -- El año lectivo (ej: 2025)
    AND a.estado = 'activo'
ORDER BY a.apellido_alumno, a.nombre_alumno;
`;

// Obtener todos los cursos disponibles (Se mantiene igual, anio es anio_lectivo)
exports.QUERY_CURSOS_DISPONIBLES = `
SELECT 
    c.id_curso,
    c.nombre AS nombre_curso,
    c.division,
    c.turno,
    c.anio AS anio_curso,
    c.estado,
    COUNT(DISTINCT ac.id_alumno) as cantidad_alumnos
FROM curso c
LEFT JOIN alumno_curso ac ON c.id_curso = ac.id_curso AND ac.anio_lectivo = ?
WHERE c.estado = 'activo'
GROUP BY c.id_curso
ORDER BY c.anio, c.nombre, c.division;
`;

// Obtener alumnos de múltiples cursos (ESTA QUERY YA NO SE USARÁ, se generará dinámicamente en el servicio, 
// o se podría adaptar para usar un array de IDs de curso obtenidos previamente, pero el enfoque dinámico es mejor con los nuevos parámetros).
// Se deja COMENTADA para evitar conflictos con la nueva implementación en el servicio.

/*
exports.QUERY_ALUMNOS_POR_CURSOS_MULTIPLES = `
SELECT DISTINCT
    a.id_alumno,
    a.dni_alumno,
    a.nombre_alumno,
    a.apellido_alumno,
    a.email,
    c.id_curso,
    c.nombre AS nombre_curso,
    c.division,
    c.turno,
    c.anio AS anio_curso
FROM alumno a
JOIN alumno_curso ac ON a.id_alumno = ac.id_alumno
JOIN curso c ON ac.id_curso = c.id_curso
WHERE 
    c.id_curso IN (?)
    AND c.anio = ?          -- Año del curso (por ejemplo: 1, 2, 3)
    AND ac.anio_lectivo = ?   -- Año lectivo (por ejemplo: 2025)
    AND a.estado = 'activo'
ORDER BY c.nombre, c.division, a.apellido_alumno, a.nombre_alumno;
`;
*/