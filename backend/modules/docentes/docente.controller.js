/**
 * =======================================
 * DOCENTE.CONTROLLER.JS
 * =======================================
 * Maneja las solicitudes y respuestas HTTP (req, res) para docentes.
 * Llama al servicio correspondiente y usa los helpers de respuesta.
 */

const servicioDocentes = require('./docente.services');
const { exito, error } = require('../../utils/responses'); 

const controladorDocentes = {

  obtenerTodos: async (req, res) => {
    try {
      const resultado = await servicioDocentes.obtenerTodos();
      exito(res, 'Lista de docentes obtenida.', resultado);
    } catch (err) {
      error(res, 'Error al obtener docentes.', err.statusCode, err.message);
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const resultado = await servicioDocentes.obtenerPorId(req.params.id);
      exito(res, 'Docente encontrado.', resultado);
    } catch (err) {
      error(res, 'Error al buscar docente por ID.', err.statusCode, err.message);
    }
  },

  obtenerPorDni: async (req, res) => {
    try {
      const resultado = await servicioDocentes.obtenerPorDni(req.params.dni);
      exito(res, 'Docente encontrado por DNI.', resultado);
    } catch (err) {
      error(res, 'Error al buscar docente por DNI.', err.statusCode, err.message);
    }
  },

  crear: async (req, res) => {
    try {
      // Validación básica en el controlador
      const { dni_docente, nombre, apellido } = req.body;
      if (!dni_docente || !nombre || !apellido) {
        return error(res, 'DNI, nombre y apellido son obligatorios.', 400);
      }
      
      const resultado = await servicioDocentes.crear(req.body);
      exito(res, 'Docente creado exitosamente.', resultado, 201);
    } catch (err) {
      error(res, 'Error al crear el docente.', err.statusCode, err.message);
    }
  },

  actualizar: async (req, res) => {
    try {
      const { dni_docente, nombre, apellido } = req.body;
      if (!dni_docente || !nombre || !apellido) {
        return error(res, 'DNI, nombre y apellido son obligatorios.', 400);
      }

      const resultado = await servicioDocentes.actualizar(req.params.id, req.body);
      exito(res, 'Docente actualizado correctamente.', resultado);
    } catch (err) {
      error(res, 'Error al actualizar el docente.', err.statusCode, err.message);
    }
  },

  eliminar: async (req, res) => {
    try {
      const resultado = await servicioDocentes.eliminar(req.params.id);
      exito(res, resultado.mensaje); // No hay código 204 porque 'exito' envía JSON
    } catch (err) {
      error(res, 'Error al eliminar el docente.', err.statusCode, err.message);
    }
  }
};

module.exports = controladorDocentes;