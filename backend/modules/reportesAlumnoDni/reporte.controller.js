const pool = require("../../config/db");
const { QUERY_REPORTE_ALUMNO } = require("./reporte.queries");

exports.getReporteAlumnoPorDNIyAnio = async (req, res) => {
  const { dni, anio } = req.params;

  try {
    const [rows] = await pool.execute(QUERY_REPORTE_ALUMNO, [dni, anio]);

    if (rows.length === 0)
      return res
        .status(404)
        .json({
          message: "Alumno no encontrado o sin datos para ese año lectivo.",
        });

    const alumno = {
      id: rows[0].id_alumno,
      dni: rows[0].dni_alumno,
      nombre: rows[0].nombre_alumno,
      apellido: rows[0].apellido_alumno,
      email: rows[0].email,
      estado: rows[0].estado,
      fecha_nacimiento: rows[0].fecha_nacimiento,
      fecha_inscripcion: rows[0].fecha_inscripcion,
      lugar_nacimiento: rows[0].lugar_nacimiento,
      direccion: rows[0].direccion,
      telefono: rows[0].telefono,
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

    rows.forEach((r) => {
      // 1. Agrupación de Materias
      if (r.nombre_materia) {
        if (!alumno.materias[r.nombre_materia]) {
          // Si es la primera vez que vemos la materia, la inicializamos
          alumno.materias[r.nombre_materia] = {
            id_materia: r.id_materia, // <-- Es bueno tener el ID
            estado_final: r.estado_final_materia,
            calificacion_final: r.calificacion_final_materia,
            calificaciones: [],
            asistencias: [],
            // --- AÑADIDO: Sets para deduplicar ---
            _calificacionesSet: new Set(),
            _asistenciasSet: new Set(),
          };
        }

        const materia = alumno.materias[r.nombre_materia];

        // 2. --- MODIFICADO: Agrupación de Calificaciones ---
        // Usamos el 'cuatrimestre' como clave única para deduplicar
        if (r.cuatrimestre && !materia._calificacionesSet.has(r.cuatrimestre)) {
          materia.calificaciones.push({
            cuatrimestre: r.cuatrimestre,
            notas: [r.nota_1, r.nota_2, r.nota_3],
            promedio: r.promedio_cuatrimestre,
            // --- AÑADIDO: Campos que faltaban ---
            periodo_complementario: r.periodo_complementario,
            calificacion_definitiva: r.calificacion_definitiva,
          });
          // Marcamos este cuatrimestre como "ya añadido"
          materia._calificacionesSet.add(r.cuatrimestre);
        }

        // 3. --- MODIFICADO: Agrupación de Asistencias ---
        // Usamos 'fecha_clase' como clave única para deduplicar
        if (r.fecha_clase && !materia._asistenciasSet.has(r.fecha_clase)) {
          materia.asistencias.push({
            fecha: r.fecha_clase,
            estado: r.estado_asistencia,
          });
          // Marcamos esta fecha como "ya añadida"
          materia._asistenciasSet.add(r.fecha_clase);
        }
      }

      // 4. Agrupación de Tutores (Tu lógica ya era correcta)
      if (r.id_tutor && !tutoresSet.has(r.id_tutor)) {
        alumno.tutores.push({
          id: r.id_tutor,
          nombre: r.nombre_tutor,
          apellido: r.apellido_tutor,
          dni_tutor: r.dni_tutor,
          direccion: r.direccion_tutor, // <-- Ojo con el alias de la SQL
          parentesco: r.parentesco,
          telefono: r.telefono_tutor,
          email: r.email_tutor,
        });
        tutoresSet.add(r.id_tutor);
      }
    });

    // --- AÑADIDO: Limpieza ---
    // Eliminamos los Sets temporales del objeto final
    Object.values(alumno.materias).forEach((materia) => {
      delete materia._calificacionesSet;
      delete materia._asistenciasSet;
    });

    res.status(200).json(alumno);
  } catch (error) {
    console.error("Error en reporte alumno:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al generar el reporte." });
  }
};