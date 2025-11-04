const consultaCurso = {
   obtenerAlumnosPorCurso: `
    -- 1. Usamos un CTE (Common Table Expression) para pre-calcular TODAS las asistencias
    -- Esta consulta se ejecuta UNA SOLA VEZ.
    WITH AsistenciaCounts AS (
        SELECT
            id_alumno,
            -- Usamos agregación condicional para contar todo en una pasada
            SUM(CASE WHEN estado = 'presente' THEN 1 ELSE 0 END) AS presentes,
            SUM(CASE WHEN estado = 'ausente' THEN 1 ELSE 0 END) AS ausentes,
            SUM(CASE WHEN estado = 'tarde' THEN 1 ELSE 0 END) AS tardes
        FROM 
            asistencia_alumno
        WHERE 
            id_materia = ?   -- <--- Param 1: id_materia
            AND anio_lectivo = ? -- <--- Param 2: anio_lectivo
        GROUP BY 
            id_alumno
    )
    -- 2. Esta es nuestra consulta principal
    SELECT 
        a.id_alumno,
        a.dni_alumno,
        a.nombre_alumno,
        a.apellido_alumno,
        
        -- Datos de Calificación
        cal.nota_1,
        cal.nota_2,
        cal.nota_3,
        cal.promedio_cuatrimestre,
        cal.id_calificacion,
      cal.periodo_complementario,    -- <-- NUEVO
      cal.calificacion_definitiva, -- <-- NUEVO
      cal.estado AS estado_calificacion,
      
        
        -- 3. Unimos los conteos pre-calculados.
        COALESCE(acounts.presentes, 0) AS presentes,
        COALESCE(acounts.ausentes, 0) AS ausentes,
        COALESCE(acounts.tardes, 0) AS tardes,

        -- === INICIO DE LA MODIFICACIÓN ===
        -- 4. Añadimos los datos del tutor principal
        t.email AS email_tutor,
        t.nombre AS nombre_tutor,
        t.apellido AS apellido_tutor
        -- === FIN DE LA MODIFICACIÓN ===
        
    FROM 
        alumno_curso ac
    JOIN 
        alumno a ON ac.id_alumno = a.id_alumno
        
    -- Unimos calificaciones (igual que antes)
    LEFT JOIN 
        calificacion cal ON a.id_alumno = cal.id_alumno 
        AND cal.id_curso = ac.id_curso 
        AND cal.id_materia = ?   -- <--- Param 3: id_materia
        AND cal.anio_lectivo = ? -- <--- Param 4: anio_lectivo
        AND cal.cuatrimestre = ? -- <--- Param 5: cuatrimestre
        
    -- 4. Unimos los resultados del CTE
    LEFT JOIN 
        AsistenciaCounts acounts ON a.id_alumno = acounts.id_alumno

    -- === INICIO DE LA MODIFICACIÓN ===
    -- 5. Añadimos los JOINs para traer al tutor
    LEFT JOIN 
        alumno_tutor at ON a.id_alumno = at.id_alumno AND at.es_principal = 1
    LEFT JOIN 
        tutor t ON at.id_tutor = t.id_tutor
    -- === FIN DE LA MODIFICACIÓN ===
        
      AND cal.deleted_at IS NULL
    WHERE 
        ac.id_curso = ?      -- <--- Param 6: id_curso
        AND ac.anio_lectivo = ?  -- <--- Param 7: anio_lectivo
        AND a.estado = 'activo'
        
    ORDER BY 
        a.apellido_alumno, a.nombre_alumno;
  `,
};
module.exports = consultaCurso;
