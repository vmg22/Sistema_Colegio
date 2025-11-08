// modules/cursos/curso.service.js
const pool = require('../../../config/db');
const consultas = require('./curso.queries');

const servicioCursos = {

  obtenerTodos: async () => {
    const [rows] = await pool.query(consultas.obtenerTodos);
    return rows;
  },

  obtenerPorId: async (id) => {
    const [rows] = await pool.query(consultas.obtenerPorId, [id]);
    if (rows.length === 0) {
      const error = new Error('Curso no encontrado.');
      error.statusCode = 404;
      throw error;
    }
    return rows[0];
  },

  crear: async (datos) => {
    const { nombre, anio, division, turno, estado } = datos;

    const [existente] = await pool.query(consultas.verificarDuplicado, [anio, division, turno]);
    if (existente.length > 0) {
      const error = new Error('Ya existe un curso para ese año, división y turno.');
      error.statusCode = 409;
      throw error;
    }

    const params = [
      nombre,
      anio,
      division,
      turno,
      estado || 'activo'
    ];
    
    const [resultado] = await pool.query(consultas.crear, params);
    return await servicioCursos.obtenerPorId(resultado.insertId);
  },

  actualizar: async (id, datos) => {
    const existente = await servicioCursos.obtenerPorId(id);
    const { nombre, anio, division, turno, estado } = datos;

    if (anio !== existente.anio || division !== existente.division || turno !== existente.turno) {
      const [duplicado] = await pool.query(consultas.verificarDuplicado, [anio, division, turno]);
      if (duplicado.length > 0 && duplicado[0].id_curso !== parseInt(id)) {
        const error = new Error('Ya existe otro curso con ese año, división y turno.');
        error.statusCode = 409;
        throw error;
      }
    }
    
    const params = [
      nombre || existente.nombre,
      anio || existente.anio,
      division || existente.division,
      turno || existente.turno,
      estado || existente.estado,
      id
    ];

    await pool.query(consultas.actualizar, params);
    return await servicioCursos.obtenerPorId(id);
  },

  eliminar: async (id) => {
    await servicioCursos.obtenerPorId(id);
    await pool.query(consultas.eliminar, [id]);
    return { mensaje: `Curso con ID ${id} eliminado.` };
  }
};

module.exports = servicioCursos;