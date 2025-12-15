const queriesExamenFinal = require('./examenFinal.queries');
const pool = require('../../config/db');

const serviciosExamenFinal = {

  /**
   * Obtiene alumnos en estado 'final' para un curso/materia
   */
  obtenerAlumnosEnEstadoFinal: async (idCurso, idMateria, anioLectivo) => {
    if (!idCurso || !idMateria || !anioLectivo) {
      throw new Error('Curso, materia y año lectivo son obligatorios');
    }

    const alumnos = await queriesExamenFinal.obtenerAlumnosEnEstadoFinal(
      idCurso, 
      idMateria, 
      anioLectivo
    );

    // Para cada alumno, obtenemos su historial de exámenes
    const alumnosConHistorial = await Promise.all(
      alumnos.map(async (alumno) => {
        const historial = await queriesExamenFinal.obtenerHistorialExamenes(
          alumno.id_alumno,
          idMateria,
          anioLectivo
        );

        return {
          ...alumno,
          examenes: historial
        };
      })
    );

    return alumnosConHistorial;
  },

  /**
   * Obtiene alumnos que aprobaron por examen final
   */
  obtenerAlumnosAprobadosPorFinal: async (idCurso, idMateria, anioLectivo) => {
    if (!idCurso || !idMateria || !anioLectivo) {
      throw new Error('Curso, materia y año lectivo son obligatorios');
    }

    const alumnos = await queriesExamenFinal.obtenerAlumnosAprobadosPorFinal(
      idCurso, 
      idMateria, 
      anioLectivo
    );

    return alumnos;
  },

  /**
   * Registra un examen final y actualiza el estado según corresponda
   */
  registrarExamenFinal: async (datosExamen) => {
    // Validaciones
    const camposRequeridos = [
      'id_alumno', 'id_materia', 'id_curso', 'anio_lectivo', 
      'instancia', 'fecha_examen', 'nota_obtenida', 'id_docente'
    ];

    for (const campo of camposRequeridos) {
      if (datosExamen[campo] === undefined || datosExamen[campo] === null) {
        throw new Error(`El campo ${campo} es obligatorio`);
      }
    }

    // Validar instancia
    const instanciasValidas = ['diciembre', 'febrero', 'marzo'];
    if (!instanciasValidas.includes(datosExamen.instancia)) {
      throw new Error('Instancia inválida. Debe ser: diciembre, febrero o marzo');
    }

    // Validar nota
    if (datosExamen.nota_obtenida < 0 || datosExamen.nota_obtenida > 10) {
      throw new Error('La nota debe estar entre 0 y 10');
    }

    // Verificar que no exista ya un examen para esta instancia
    const existeExamen = await queriesExamenFinal.verificarExamenExistente(
      datosExamen.id_alumno,
      datosExamen.id_materia,
      datosExamen.anio_lectivo,
      datosExamen.instancia
    );

    if (existeExamen) {
      throw new Error(`Ya existe un examen registrado para la instancia de ${datosExamen.instancia}`);
    }

    // Insertar el examen
    const idExamenCreado = await queriesExamenFinal.insertarExamenFinal(datosExamen);

    // Determinar si aprobó o no
    const aprobo = datosExamen.nota_obtenida >= 6;

    let mensajeEstado = '';
    let nuevoEstado = null;

    if (aprobo) {
      // Si aprobó, actualizar estado a 'aprobada' con la nota del examen
      await queriesExamenFinal.actualizarEstadoMateria(
        datosExamen.id_alumno,
        datosExamen.id_materia,
        datosExamen.anio_lectivo,
        'aprobada',
        datosExamen.nota_obtenida
      );

      // TAMBIÉN ACTUALIZAR LA TABLA CALIFICACION
      // Para que la nota final se refleje en la vista de calificaciones
      console.log('📝 Actualizando calificacion_definitiva:', {
        id_alumno: datosExamen.id_alumno,
        id_materia: datosExamen.id_materia,
        id_curso: datosExamen.id_curso,
        anio_lectivo: datosExamen.anio_lectivo,
        nueva_nota: datosExamen.nota_obtenida
      });

      const resultado = await pool.query(`
        UPDATE calificacion
        SET calificacion_definitiva = ?,
            estado = 'aprobada',
            updated_at = NOW()
        WHERE id_alumno = ?
          AND id_materia = ?
          AND id_curso = ?
          AND anio_lectivo = ?
          AND deleted_at IS NULL
      `, [
        datosExamen.nota_obtenida,
        datosExamen.id_alumno,
        datosExamen.id_materia,
        datosExamen.id_curso,
        datosExamen.anio_lectivo
      ]);

      console.log('✅ Filas afectadas en calificacion:', resultado[0].affectedRows);

      nuevoEstado = 'aprobada';
      mensajeEstado = '¡Aprobado! El estado del alumno se cambió a "aprobada" y la nota final se actualizó.';
    } else {
      // Si no aprobó, verificar cuántos exámenes lleva
      const totalExamenes = await queriesExamenFinal.contarExamenesRendidos(
        datosExamen.id_alumno,
        datosExamen.id_materia,
        datosExamen.anio_lectivo
      );

      if (totalExamenes >= 3) {
        // Si ya rindió las 3 instancias y no aprobó ninguna, pasa a 'previa'
        await queriesExamenFinal.actualizarEstadoMateria(
          datosExamen.id_alumno,
          datosExamen.id_materia,
          datosExamen.anio_lectivo,
          'previa'
        );
        nuevoEstado = 'previa';
        mensajeEstado = 'El alumno no aprobó las 3 instancias. Estado cambiado a PREVIA';
      } else {
        // Sigue en estado 'final', puede rendir otra instancia
        nuevoEstado = 'final';
        mensajeEstado = `Examen registrado. El alumno puede rendir nuevamente (${totalExamenes}/3 instancias)`;
      }
    }

    return {
      id_examen_final: idExamenCreado,
      nuevoEstado,
      mensajeEstado
    };
  },

  /**
   * Obtiene el historial de exámenes de un alumno en una materia
   */
  obtenerHistorialExamenes: async (idAlumno, idMateria, anioLectivo) => {
    if (!idAlumno || !idMateria || !anioLectivo) {
      throw new Error('Alumno, materia y año lectivo son obligatorios');
    }

    const historial = await queriesExamenFinal.obtenerHistorialExamenes(
      idAlumno,
      idMateria,
      anioLectivo
    );

    return historial;
  }
};

module.exports = serviciosExamenFinal;
