
const pool = require('../../../config/db');


// Ahora usa el objeto 'connection' que se le pasa
const findOrCreateTutor = async (connection, tutorData) => {
  const { dni_tutor } = tutorData;
  
  // 1. Intentamos encontrarlo
  const [rows] = await connection.query('SELECT id_tutor FROM tutor WHERE dni_tutor = ? AND deleted_at IS NULL', [dni_tutor]);
  
  if (rows.length > 0) {
    return rows[0].id_tutor; // Devuelve el ID existente
  }

  // 2. Si no existe, lo creamos
  const [tutorResult] = await connection.query('INSERT INTO tutor SET ?', [tutorData]);
  return tutorResult.insertId; // Devuelve el nuevo ID
};


// --- CONTROLADOR PRINCIPAL (CORREGIDO) ---
const crearInscripcion = async (req, res) => {
  // 1. Obtenemos el JSON del frontend
  const { alumnoData, tutorData, inscripcionData } = req.body;
  const { id_curso, anio_lectivo } = inscripcionData;

  // Obtenemos una conexión individual del pool
  const connection = await pool.getConnection();

  try {
    // 2. INICIAMOS LA TRANSACCIÓN (Usando 'connection')
    await connection.beginTransaction();

    // 3. Buscar o crear el tutor (Pasando 'connection')
    const tutorId = await findOrCreateTutor(connection, tutorData);

    // 4. Crear el alumno (Usando 'connection')
    const [alumnoResult] = await connection.query(
      'INSERT INTO alumno SET ?', [alumnoData]
    );
    const alumnoId = alumnoResult.insertId;

    // 5. Vincularlos en alumno_tutor (Usando 'connection')
    await connection.query(
      'INSERT INTO alumno_tutor (id_alumno, id_tutor, es_principal) VALUES (?, ?, 1)', 
      [alumnoId, tutorId]
    );

    // 6. Inscribirlo en el curso (Usando 'connection')
    await connection.query(
      'INSERT INTO alumno_curso (id_alumno, id_curso, anio_lectivo, estado, fecha_inscripcion) VALUES (?, ?, ?, ?, CURDATE())',
      [alumnoId, id_curso, anio_lectivo, 'regular']
    );

    // 7. [PASO EXTRA VITAL]: Inscribir al alumno en todas las materias de ese curso
    const sqlInscribirMaterias = `
      INSERT INTO alumno_materia_estado (id_alumno, id_materia, id_curso, anio_lectivo, estado)
      SELECT
        ? AS id_alumno,
        dcm.id_materia,
        dcm.id_curso,
        dcm.anio_lectivo,
        'cursando' AS estado
      FROM docente_curso_materia dcm
      WHERE dcm.id_curso = ? AND dcm.anio_lectivo = ? AND dcm.deleted_at IS NULL
    `;
    // (Usando 'connection')
    await connection.query(sqlInscribirMaterias, [alumnoId, id_curso, anio_lectivo]);

    // 8. ¡Éxito! Aplicamos todos los cambios (Usando 'connection')
    await connection.commit();

    res.status(201).json({ 
      message: 'Alumno inscrito con éxito', 
      id_alumno: alumnoId 
    });

  } catch (error) {
    // 9. ¡Error! Revertimos todos los cambios (Usando 'connection')
    await connection.rollback();
    console.error('Error en la transacción de inscripción:', error);
    res.status(500).json({ message: 'Error al inscribir al alumno', error: error.message });

  } finally {
    // 10. Devolvemos la conexión al pool (Usando 'connection')
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  crearInscripcion,
};