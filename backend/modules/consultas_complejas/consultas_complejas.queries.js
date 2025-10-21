const consultasComplejas = {
  // gestion y manejo de asistencias para alumnos / /
    // borrado de asistencia
  borrarAsistencia: `
UPDATE asistencia_alumno 
SET deleted_at = NOW() 
WHERE id_asistencia = ?`,

  // Reporte de Asistencia por Alumno (Detallado por Materia)
  reporteAsistenciaPorAlumno: `
SELECT 
    m.nombre AS materia,
    
    COUNT(CASE WHEN aa.estado = 'presente' THEN 1 END) AS presentes,
    COUNT(CASE WHEN aa.estado = 'ausente' THEN 1 END) AS ausentes,
    COUNT(CASE WHEN aa.estado = 'tarde' THEN 1 END) AS tardes,
    COUNT(CASE WHEN aa.estado = 'justificada' THEN 1 END) AS justificadas,
    
   
    (COUNT(CASE WHEN aa.estado IN ('presente', 'tarde', 'justificada') THEN 1 END) * 100.0) / COUNT(*) AS porcentaje_asistencia,
    
   
    COUNT(*) AS total_clases_registradas
FROM 
    asistencia_alumno aa
JOIN 
    materia m ON aa.id_materia = m.id_materia
WHERE 
    aa.id_alumno = ?       
    AND aa.anio_lectivo = ?  
    AND aa.deleted_at IS NULL  
GROUP BY 
    m.id_materia, m.nombre
ORDER BY 
    m.nombre;
`,

  // Lista de Asistencia por Curso/Materia (para Carga/Verificación)
  listaAsistenciaPorCursoMateria: `
SELECT 
    a.id_alumno,
    a.apellido_alumno,
    a.nombre_alumno,
    aa.id_asistencia, 
    aa.estado         
FROM 
    alumno_curso ac
JOIN 
    alumno a ON ac.id_alumno = a.id_alumno
LEFT JOIN 
    asistencia_alumno aa ON ac.id_alumno = aa.id_alumno
        AND aa.id_materia = ?     
        AND aa.fecha_clase = ?    
        AND aa.anio_lectivo = ?   
        AND aa.deleted_at IS NULL 
WHERE 
    ac.id_curso = ?           
    AND ac.anio_lectivo = ?   
    AND a.estado = 'activo'   
    AND a.deleted_at IS NULL  
ORDER BY 
    a.apellido_alumno, a.nombre_alumno;`,



//Gestión de Notas (Rutas de Docentes)// 
    // Actualizar Nota de Alumno para una Materia y Evaluación Específica


    actualizarNotaAlumno: `
    SELECT 
    a.id_alumno, 
    a.nombre_alumno, 
    a.apellido_alumno,
    cal.id_calificacion,
    cal.cuatrimestre,
    cal.nota_1,
    cal.nota_2,
    cal.nota_3,
    cal.promedio_cuatrimestre,
    cal.periodo_complementario,
    cal.calificacion_definitiva,
    cal.estado
FROM 
    alumno_curso ac
JOIN 
    alumno a ON ac.id_alumno = a.id_alumno
LEFT JOIN 
    calificacion cal ON ac.id_alumno = cal.id_alumno 
        AND cal.id_materia = ? 
        AND cal.id_curso = ? 
        AND cal.anio_lectivo = ?
WHERE 
    ac.id_curso = ? 
    AND ac.anio_lectivo = ? 
    AND a.deleted_at IS NULL
ORDER BY 
    a.apellido_alumno, a.nombre_alumno; `
 

};
