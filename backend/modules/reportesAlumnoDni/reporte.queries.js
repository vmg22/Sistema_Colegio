exports.QUERY_REPORTE_ALUMNO = `
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
    al.anio AS anio_lectivo,
    m.id_materia,
    m.nombre AS nombre_materia,
    ame.estado AS estado_final_materia,
    ame.calificacion_final AS calificacion_final_materia,
    cal.cuatrimestre,
    cal.nota_1,
    cal.nota_2,
    cal.nota_3,
    cal.promedio_cuatrimestre,
    cal.periodo_complementario,
    cal.calificacion_definitiva,
    asi.fecha_clase,
    asi.estado AS estado_asistencia,
    t.id_tutor,
    t.nombre AS nombre_tutor,
    t.apellido AS apellido_tutor,
    t.dni_tutor,
    t.direccion,
    t.parentesco,
    t.telefono AS telefono_tutor,
    t.email AS email_tutor
FROM alumno a
JOIN alumno_curso ac 
    ON a.id_alumno = ac.id_alumno
JOIN curso c 
    ON ac.id_curso = c.id_curso
JOIN anio_lectivo al 
    ON ac.anio_lectivo = al.anio
LEFT JOIN alumno_materia_estado ame 
    ON a.id_alumno = ame.id_alumno 
    AND ame.anio_lectivo = al.anio
LEFT JOIN materia m 
    ON ame.id_materia = m.id_materia
LEFT JOIN calificacion cal 
    ON a.id_alumno = cal.id_alumno 
    AND cal.id_materia = m.id_materia 
    AND cal.id_curso = c.id_curso 
    AND cal.anio_lectivo = al.anio
LEFT JOIN asistencia_alumno asi 
    ON a.id_alumno = asi.id_alumno 
    AND asi.id_materia = m.id_materia 
    AND asi.id_curso = c.id_curso 
    AND asi.anio_lectivo = al.anio
LEFT JOIN alumno_tutor at 
    ON a.id_alumno = at.id_alumno
LEFT JOIN tutor t 
    ON at.id_tutor = t.id_tutor
WHERE 
    a.dni_alumno = ? 
    AND al.anio = ?
ORDER BY 
    m.nombre, cal.cuatrimestre, asi.fecha_clase;
`;
