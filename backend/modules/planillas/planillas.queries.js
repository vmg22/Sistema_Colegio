const pool = require('../../config/db');

const queriesPlanillas = {
    // --- NIVELACIÓN (MANUAL) ---
    crearPlanillaNivelacion: async (data) => {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const [resPlanilla] = await conn.query(
                `INSERT INTO planilla_nivelacion (fecha_examen, id_materia, id_curso, anio_lectivo, observaciones, folio, libro) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [data.fecha_examen, data.id_materia, data.id_curso, data.anio_lectivo, data.observaciones, data.folio, data.libro]
            );

            const idPlanilla = resPlanilla.insertId;

            if (data.detalles && data.detalles.length > 0) {
                const values = data.detalles.map(d => [
                    idPlanilla, d.nombre_completo, d.dni, d.nota_escrito, d.nota_oral, d.promedio
                ]);
                await conn.query(
                    `INSERT INTO planilla_nivelacion_det (id_planilla, nombre_completo, dni, nota_escrito, nota_oral, promedio) 
           VALUES ?`,
                    [values]
                );
            }

            await conn.commit();
            return idPlanilla;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    obtenerPlanillasNivelacion: async (anioLectivo, idCurso = null, idMateria = null) => {
        let query = `
      SELECT p.*, m.nombre_materia, c.anio, c.division 
      FROM planilla_nivelacion p
      JOIN materia m ON p.id_materia = m.id_materia
      LEFT JOIN curso c ON p.id_curso = c.id_curso
      WHERE p.deleted_at IS NULL
    `;
        const params = [];

        if (anioLectivo) {
            query += ` AND p.anio_lectivo = ?`;
            params.push(anioLectivo);
        }

        if (idCurso) {
            query += ` AND p.id_curso = ?`;
            params.push(idCurso);
        }
        if (idMateria) {
            query += ` AND p.id_materia = ?`;
            params.push(idMateria);
        }

        query += ` ORDER BY p.fecha_examen DESC`;

        const [rows] = await pool.query(query, params);
        return rows;
    },

    obtenerDetalleNivelacion: async (idPlanilla) => {
        const [rows] = await pool.query(
            `SELECT * FROM planilla_nivelacion_det WHERE id_planilla = ?`,
            [idPlanilla]
        );
        return rows;
    },

    // --- REGULAR (DESAPROBADOS DIC/FEB) ---
    obtenerCandidatosRegular: async (idCurso, idMateria, anioLectivo) => {
        // Buscar alumnos que cursaron esa materia en ese año (o anterior) y desaprobaron en Diciembre o Febrero
        // O simplemente tienen la materia pendiente pero NO es previa de años anteriores (es "regular" del año en curso/recién terminado)

        // NOTA: La lógica exacta de "Regular" vs "Previa" depende de si la materia es del año actual o anterior.
        // Asumiremos: 
        // - Regular: Alumnos del curso actual que deben rendir la materia (ej: se llevaron la materia a dic/feb).
        // - Previa: Alumnos que deben la materia de años ANTERIORES.

        const query = `
      SELECT 
        a.id_alumno,
        a.dni_alumno as dni,
        CONCAT(a.apellido_alumno, ', ', a.nombre_alumno) as nombre_completo,
        ame.calificacion_final,
        ame.estado
      FROM alumno_materia_estado ame
      JOIN alumno a ON ame.id_alumno = a.id_alumno
      WHERE ame.id_curso = ?
        AND ame.id_materia = ?
        AND ame.anio_lectivo = ?
        AND ame.estado IN ('desaprobada', 'regular') -- Estados que implican que debe rendir final
        AND ame.deleted_at IS NULL
        AND a.deleted_at IS NULL
      ORDER BY a.apellido_alumno, a.nombre_alumno
    `;
        const [rows] = await pool.query(query, [idCurso, idMateria, anioLectivo]);
        return rows;
    },

    // --- PREVIA (PENDIENTES DE AÑOS ANTERIORES) ---
    obtenerCandidatosPrevia: async (idCurso, idMateria, anioLectivo) => {
        // Alumnos en este curso que tienen esta materia como PREVIA (traída de años anteriores)
        const query = `
        SELECT 
            a.id_alumno,
            a.dni_alumno as dni,
            CONCAT(a.apellido_alumno, ', ', a.nombre_alumno) as nombre_completo,
            ame.calificacion_final,
            ame.estado,
             -- Intentar obtener la última nota si existe en la tabla de previas
            (SELECT nota_obtenida FROM previa p 
             WHERE p.id_alumno = a.id_alumno AND p.id_materia = ame.id_materia 
             ORDER BY p.fecha_examen DESC LIMIT 1) as ultima_nota
        FROM alumno_materia_estado ame
        JOIN alumno a ON ame.id_alumno = a.id_alumno
        WHERE ame.id_curso = ?
            AND ame.id_materia = ?
            AND ame.anio_lectivo = ?
            AND ame.estado = 'previa'
            AND ame.deleted_at IS NULL
            AND a.deleted_at IS NULL
        ORDER BY a.apellido_alumno, a.nombre_alumno
    `;
        const [rows] = await pool.query(query, [idCurso, idMateria, anioLectivo]);
        return rows;
    }
};

module.exports = queriesPlanillas;
