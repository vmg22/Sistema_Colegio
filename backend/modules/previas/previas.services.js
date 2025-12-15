const queriesPrevias = require('./previas.queries');
const pool = require('../../config/db');

const serviciosPrevias = {

  /**
   * Obtiene alumnos con previas y su historial
   */
  obtenerAlumnosPreviasPorCurso: async (idCurso, idMateria, anioLectivo) => {
    if (!idCurso || !idMateria || !anioLectivo) {
      throw new Error('Curso, materia y año lectivo son obligatorios');
    }

    const alumnos = await queriesPrevias.obtenerAlumnosPreviasPorCurso(
      idCurso,
      idMateria,
      anioLectivo
    );

    return alumnos;
  },

  /**
   * Obtiene alumnos que aprobaron por previa
   */
  obtenerAlumnosAprobadosPorPrevia: async (idCurso, idMateria, anioLectivo) => {
    if (!idCurso || !idMateria || !anioLectivo) {
      throw new Error('Curso, materia y año lectivo son obligatorios');
    }

    const alumnos = await queriesPrevias.obtenerAlumnosAprobadosPorPrevia(
      idCurso,
      idMateria,
      anioLectivo
    );

    return alumnos;
  },

  /**
   * Registra un intento de previa y actualiza el estado si aprueba
   */
  registrarIntentoPrevia: async (datosPrevia) => {
    // Validaciones
    const camposRequeridos = [
      'id_alumno', 'id_materia', 'id_curso', 'anio_lectivo',
      'fecha_examen', 'nota_obtenida', 'id_docente'
    ];

    for (const campo of camposRequeridos) {
      if (datosPrevia[campo] === undefined || datosPrevia[campo] === null) {
        throw new Error(`El campo ${campo} es obligatorio`);
      }
    }

    // Validar nota
    if (datosPrevia.nota_obtenida < 0 || datosPrevia.nota_obtenida > 10) {
      throw new Error('La nota debe estar entre 0 y 10');
    }

    // Insertar el intento
    const idPreviaCreado = await queriesPrevias.insertarIntentoPrevia(datosPrevia);

    // Determinar si aprobó
    const aprobo = datosPrevia.nota_obtenida >= 6;

    let mensajeEstado = '';
    let nuevoEstado = null;

    if (aprobo) {
      // Actualizar estado a 'aprobada' en alumno_materia_estado
      await queriesPrevias.actualizarEstadoMateria(
        datosPrevia.id_alumno,
        datosPrevia.id_materia,
        datosPrevia.id_curso,
        datosPrevia.anio_lectivo,
        'aprobada',
        datosPrevia.nota_obtenida
      );

      // TAMBIÉN ACTUALIZAR LA TABLA CALIFICACION
      console.log('📝 Actualizando calificacion_definitiva por previa:', {
        id_alumno: datosPrevia.id_alumno,
        id_materia: datosPrevia.id_materia,
        id_curso: datosPrevia.id_curso,
        anio_lectivo: datosPrevia.anio_lectivo,
        nueva_nota: datosPrevia.nota_obtenida
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
        datosPrevia.nota_obtenida,
        datosPrevia.id_alumno,
        datosPrevia.id_materia,
        datosPrevia.id_curso,
        datosPrevia.anio_lectivo
      ]);

      console.log('✅ Filas afectadas en calificacion:', resultado[0].affectedRows);

      nuevoEstado = 'aprobada';
      mensajeEstado = '¡Aprobado! El estado del alumno se cambió a "aprobada" y la nota final se actualizó.';
    } else {
      // No aprobó, solo se registra el intento
      nuevoEstado = 'previa';
      mensajeEstado = 'Intento registrado. El alumno sigue en estado de previa.';
    }

    return {
      id_previa: idPreviaCreado,
      nuevoEstado,
      mensajeEstado
    };
  }
};

module.exports = serviciosPrevias;
