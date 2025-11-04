exports.QUERY_REPORTE_ALUMNO = `
-- 1. Usamos un CTE (Common Table Expression) para obtener el CONTEXTO
--    (el alumno, su curso y el año lectivo)
WITH AlumnoContexto AS (
    SELECT 
        a.id_alumno,
        a.dni_alumno,
        a.nombre_alumno,
        a.apellido_alumno,
        a.email,
        a.estado,
        a.fecha_nacimiento,
        a.fecha_inscripcion,
        a.lugar_nacimiento,
        a.direccion,
        a.telefono,
        c.id_curso,
        c.nombre AS nombre_curso,
        c.division,
        c.turno,
        c.anio AS anio_curso,
        al.anio AS anio_lectivo
    FROM alumno a
    JOIN alumno_curso ac ON a.id_alumno = ac.id_alumno
    JOIN curso c ON ac.id_curso = c.id_curso
    JOIN anio_lectivo al ON ac.anio_lectivo = al.anio
    WHERE 
        a.dni_alumno = ? -- <--- Param 1: dni_alumno
        AND al.anio = ?   -- <--- Param 2: anio_lectivo
),
-- 2. Creamos la LISTA MAESTRA DE MATERIAS para ese curso.
--    Usamos UNION para asegurarnos de incluir materias de todas las fuentes.
MateriasDelCurso AS (
    SELECT DISTINCT id_materia FROM calificacion cal
    JOIN AlumnoContexto ctx ON cal.id_curso = ctx.id_curso AND cal.anio_lectivo = ctx.anio_lectivo
    
    UNION
    
    SELECT DISTINCT id_materia FROM asistencia_alumno asi
    JOIN AlumnoContexto ctx ON asi.id_curso = ctx.id_curso AND asi.anio_lectivo = ctx.anio_lectivo
    
    UNION
    
    SELECT DISTINCT id_materia FROM alumno_materia_estado ame
    JOIN AlumnoContexto ctx ON ame.id_alumno = ctx.id_alumno AND ame.anio_lectivo = ctx.anio_lectivo
)
-- 3. Ahora construimos el reporte final
SELECT 
    ctx.*, -- Todos los datos del alumno y curso del CTE
    
    -- Datos de la Materia
    m.id_materia,
    m.nombre AS nombre_materia,
    
    -- Datos del Estado Final (AME)
    ame.estado AS estado_final_materia,
    ame.calificacion_final AS calificacion_final_materia,
    
    -- Datos de Calificaciones
    cal.cuatrimestre,
    cal.nota_1,
    cal.nota_2,
    cal.nota_3,
    cal.promedio_cuatrimestre,
    cal.periodo_complementario,
    cal.calificacion_definitiva,
    
    -- Datos de Asistencias
    asi.fecha_clase,
    asi.estado AS estado_asistencia,
    
    -- Datos del Tutor
    t.id_tutor,
    t.nombre AS nombre_tutor,
    t.apellido AS apellido_tutor,
    t.dni_tutor,
    t.direccion AS direccion_tutor, -- Renombrado para evitar colisión
    t.parentesco,
    t.telefono AS telefono_tutor,
    t.email AS email_tutor
    
FROM 
    AlumnoContexto ctx
-- 4. Este es el JOIN principal que define las materias
JOIN 
    MateriasDelCurso mc ON 1=1
JOIN 
    materia m ON mc.id_materia = m.id_materia

-- 5. Ahora usamos LEFT JOIN para "adjuntar" los datos de ESTE alumno a CADA materia
LEFT JOIN 
    alumno_materia_estado ame 
    ON ame.id_alumno = ctx.id_alumno 
    AND ame.id_materia = m.id_materia 
    AND ame.anio_lectivo = ctx.anio_lectivo
LEFT JOIN 
    calificacion cal 
    ON cal.id_alumno = ctx.id_alumno 
    AND cal.id_materia = m.id_materia 
    AND cal.id_curso = ctx.id_curso 
    AND cal.anio_lectivo = ctx.anio_lectivo
LEFT JOIN 
    asistencia_alumno asi 
    ON asi.id_alumno = ctx.id_alumno 
    AND asi.id_materia = m.id_materia 
    AND asi.id_curso = ctx.id_curso 
    AND asi.anio_lectivo = ctx.anio_lectivo

-- 6. Los tutores se unen al alumno (igual que antes)
LEFT JOIN 
    alumno_tutor at ON ctx.id_alumno = at.id_alumno
LEFT JOIN 
    tutor t ON at.id_tutor = t.id_tutor

ORDER BY 
    m.nombre, cal.cuatrimestre, asi.fecha_clase;
`;