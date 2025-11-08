const matriculaServices = require('./matriculacion.services');

// (Copia tus funciones 'exito' y 'error' aquí si no las importas de utils)
const exito = (res, mensaje, datos = null, statusCode = 200) => {
  res.status(statusCode).json({ success: true, message: mensaje, data: datos });
};
const error = (res, mensaje, statusCode = 500, detalles = null) => {
  res.status(statusCode).json({ success: false, message: mensaje, error: detalles });
};

const matriculaController = {

  obtenerTodasMatriculas: async (req, res) => {
    try {
      const matriculas = await matriculaServices.obtenerTodasMatriculas(req.query);
      exito(res, 'Matrículas obtenidas correctamente', matriculas);
    } catch (err) {
      error(res, 'Error al obtener matrículas', 500, err.message);
    }
  },

  obtenerMatriculaPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const matricula = await matriculaServices.obtenerMatriculaPorId(id);
      exito(res, 'Matrícula obtenida correctamente', matricula);
    } catch (err) {
      if (err.message === 'Matrícula no encontrada') {
        return error(res, err.message, 404);
      }
      error(res, 'Error al obtener la matrícula', 500, err.message);
    }
  },

  crearMatricula: async (req, res) => {
    try {
      const nuevaMatricula = await matriculaServices.crearMatricula(req.body);
      exito(res, 'Alumno matriculado exitosamente', nuevaMatricula, 201);
    } catch (err) {
      if (err.message.includes('obligatorios')) {
        return error(res, err.message, 400);
      }
      if (err.message.includes('ya está matriculado') || err.message.includes('Conflicto')) {
        return error(res, err.message, 409);
      }
      error(res, 'Error al crear la matrícula', 500, err.message);
    }
  },

  actualizarMatricula: async (req, res) => {
    try {
      const { id } = req.params;
      const matriculaActualizada = await matriculaServices.actualizarMatricula(id, req.body);
      exito(res, 'Matrícula actualizada correctamente', matriculaActualizada);
    } catch (err) {
      if (err.message === 'Matrícula no encontrada') {
        return error(res, err.message, 404);
      }
      if (err.message.includes('Conflicto')) {
        return error(res, err.message, 409);
      }
      error(res, 'Error al actualizar la matrícula', 500, err.message);
    }
  },

  eliminarMatricula: async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await matriculaServices.eliminarMatricula(id);
      exito(res, resultado.message, resultado);
    } catch (err) {
      if (err.message === 'Matrícula no encontrada') {
        return error(res, err.message, 404);
      }
      error(res, 'Error al dar de baja la matrícula', 500, err.message);
    }
  },

  obtenerMatriculasEliminadas: async (req, res) => {
    try {
      const eliminadas = await matriculaServices.obtenerMatriculasEliminadas();
      exito(res, 'Matrículas dadas de baja obtenidas', eliminadas);
    } catch (err) {
      error(res, 'Error al obtener matrículas dadas de baja', 500, err.message);
    }
  },

  restaurarMatricula: async (req, res) => {
    try {
      const { id } = req.params;
      const restaurada = await matriculaServices.restaurarMatricula(id);
      exito(res, 'Matrícula restaurada correctamente', restaurada);
    } catch (err) {
      error(res, 'Error al restaurar matrícula', 500, err.message);
    }
  }
};

module.exports = matriculaController;