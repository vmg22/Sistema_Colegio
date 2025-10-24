const  pool  = require("../../config/db");
const { QUERY_REPORTE_ALUMNO } = require("./reporte.queries");

exports.getReporteAlumnoPorDNIyAnio = async (req, res) => {
  const { dni, anio } = req.params;

  try {
    const [rows] = await pool.execute(QUERY_REPORTE_ALUMNO, [dni, anio]);

    if (rows.length === 0)
      return res.status(404).json({ message: "Alumno no encontrado o sin datos para ese año lectivo." });

    const alumno = {
      id: rows[0].id_alumno,
      dni: rows[0].dni_alumno,
      nombre: rows[0].nombre_alumno,
      apellido: rows[0].apellido_alumno,
      email: rows[0].email,
      estado:rows[0].estado,
      curso: {
        id: rows[0].id_curso,
        nombre: rows[0].nombre_curso,
        division: rows[0].division,
        turno: rows[0].turno,
        anio_curso: rows[0].anio_curso,
        anio_lectivo: rows[0].anio_lectivo,
      },
      materias: {},
      tutores: [],
    };

    const tutoresSet = new Set();

    rows.forEach(r => {
      if (r.nombre_materia) {
        if (!alumno.materias[r.nombre_materia]) {
          alumno.materias[r.nombre_materia] = {
            estado_final: r.estado_final_materia,
            calificacion_final: r.calificacion_final_materia,
            calificaciones: [],
            asistencias: []
          };
        }

        if (r.cuatrimestre)
          alumno.materias[r.nombre_materia].calificaciones.push({
            cuatrimestre: r.cuatrimestre,
            notas: [r.nota_1, r.nota_2, r.nota_3],
            promedio: r.promedio_cuatrimestre
          });

        if (r.fecha_clase)
          alumno.materias[r.nombre_materia].asistencias.push({
            fecha: r.fecha_clase,
            estado: r.estado_asistencia
          });
      }

      if (r.id_tutor && !tutoresSet.has(r.id_tutor)) {
        alumno.tutores.push({
          id: r.id_tutor,
          nombre: r.nombre_tutor,
          apellido: r.apellido_tutor,
          parentesco: r.parentesco,
          telefono: r.telefono_tutor,
          email: r.email_tutor
        });
        tutoresSet.add(r.id_tutor);
      }
    });

    res.status(200).json(alumno);
  } catch (error) {
    console.error("Error en reporte alumno:", error);
    res.status(500).json({ message: "Error interno del servidor al generar el reporte." });
  }
};
