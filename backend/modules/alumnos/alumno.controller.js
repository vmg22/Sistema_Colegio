/**
 * =======================================
 * ALUMNO.CONTROLLER.JS (VERSIÓN COMPLETA)
 * =======================================
 * Maneja las solicitudes y respuestas HTTP, llamando a la función
 * de servicio apropiada para cada endpoint.
 */

const servicioAlumnos = require('./alumno.services');
const { exito, error } = require('../../utils/responses');

const controladorAlumnos = {

    // --- CRUD ---
    obtenerTodos: async (req, res) => {
        try {
            const resultado = await servicioAlumnos.obtenerTodos();
            exito(res, 'Lista de alumnos obtenida.', resultado);
        } catch (err) {
            error(res, 'Error al obtener alumnos.', err.statusCode, err.message);
        }
    },
    obtenerPorId: async (req, res) => {
        try {
            const resultado = await servicioAlumnos.obtenerPorId(req.params.id);
            exito(res, 'Alumno encontrado.', resultado);
        } catch (err) {
            error(res, 'Error al buscar alumno por ID.', err.statusCode, err.message);
        }
    },
    obtenerPorDni: async (req, res) => {
        try {
            const resultado = await servicioAlumnos.obtenerPorDni(req.params.dni);
            exito(res, 'Alumno encontrado por DNI.', resultado);
        } catch (err) {
            error(res, 'Error al buscar alumno por DNI.', err.statusCode, err.message);
        }
    },
    crear: async (req, res) => {
    try {
        if (!req.body.dni_alumno || !req.body.nombre_alumno || !req.body.apellido_alumno) {
            return error(res, 'DNI, nombre y apellido son obligatorios.', 400);
        }
        const resultado = await servicioAlumnos.crear(req.body);
        exito(res, 'Alumno creado exitosamente.', resultado, 201);
    } catch (err) {
        // Esta línea ahora recibirá el 'err.statusCode' (409) del servicio
        error(res, 'Error al crear el alumno.', err.statusCode, err.message);
    }
},
    actualizarCompleto: async (req, res) => {
        try {
            const resultado = await servicioAlumnos.actualizarCompleto(req.params.id, req.body);
            exito(res, 'Alumno actualizado correctamente.', resultado);
        } catch (err) {
            error(res, 'Error al actualizar el alumno.', err.statusCode, err.message);
        }
    },
    actualizarParcial: async (req, res) => {
        try {
            const resultado = await servicioAlumnos.actualizarParcial(req.params.id, req.body);
            exito(res, 'Alumno actualizado parcialmente.', resultado);
        } catch (err) {
            error(res, 'Error en la actualización parcial.', err.statusCode, err.message);
        }
    },
    actualizarEstado: async (req, res) => {
        try {
            if (!req.body.estado) {
                return error(res, 'El campo "estado" es requerido.', 400);
            }
            const resultado = await servicioAlumnos.actualizarEstado(req.params.id, req.body.estado);
            exito(res, 'Estado del alumno actualizado.', resultado);
        } catch (err) {
            error(res, 'Error al actualizar el estado.', err.statusCode, err.message);
        }
    },
    eliminar: async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const resultado = await servicioAlumnos.eliminar(id);
    exito(res, resultado.mensaje);
  } catch (err) {
    console.error('❌ ERROR al eliminar alumno:', err.message);
    error(res, 'Error al eliminar el alumno.', err.statusCode || 500, err.message);
  }
},
    restaurar: async (req, res) => {
        try {
            const resultado = await servicioAlumnos.restaurar(req.params.id);
            exito(res, 'Alumno restaurado correctamente.', resultado);
        } catch (err) {
            error(res, 'Error al restaurar el alumno.', err.statusCode, err.message);
        }
    },

    // --- REPORTES Y BÚSQUEDAS ---
    buscarPorNombre: async (req, res) => {
        try {
            const resultado = await servicioAlumnos.buscarPorNombre(req.params.termino);
            exito(res, 'Búsqueda de alumnos completada.', resultado);
        } catch (err) {
            error(res, 'Error en la búsqueda.', err.statusCode, err.message);
        }
    },
    obtenerPaginados: async (req, res) => {
        try {
            const { pagina = 1, limite = 10 } = req.query;
            const resultado = await servicioAlumnos.obtenerPaginados(pagina, limite);
            exito(res, 'Alumnos paginados obtenidos.', resultado);
        } catch (err) {
            error(res, 'Error al obtener alumnos paginados.', err.statusCode, err.message);
        }
    },
    obtenerPorEstado: async (req, res) => {
        try {
            const resultado = await servicioAlumnos.obtenerPorEstado(req.params.estado);
            exito(res, `Alumnos con estado "${req.params.estado}" obtenidos.`, resultado);
        } catch (err) {
            error(res, 'Error al filtrar por estado.', err.statusCode, err.message);
        }
    },
    obtenerPorRangoInscripcion: async (req, res) => {
        try {
            const { inicio, fin } = req.query;
            if (!inicio || !fin) {
                return error(res, 'Los parámetros "inicio" y "fin" son requeridos (YYYY-MM-DD).', 400);
            }
            const resultado = await servicioAlumnos.obtenerPorRangoInscripcion(inicio, fin);
            exito(res, 'Alumnos por rango de inscripción obtenidos.', resultado);
        } catch (err) {
            error(res, 'Error al filtrar por rango de inscripción.', err.statusCode, err.message);
        }
    },
    obtenerPorEdad: async (req, res) => {
        try {
            const { minima = 0, maxima = 100 } = req.query;
            const resultado = await servicioAlumnos.obtenerPorEdad(minima, maxima);
            exito(res, 'Alumnos por rango de edad obtenidos.', resultado);
        } catch (err) {
            error(res, 'Error al filtrar por edad.', err.statusCode, err.message);
        }
    },
    obtenerConContactoIncompleto: async (req, res) => {
        try {
            const resultado = await servicioAlumnos.obtenerConContactoIncompleto();
            exito(res, 'Reporte de contacto incompleto obtenido.', resultado);
        } catch (err) {
            error(res, 'Error al generar el reporte.', err.statusCode, err.message);
        }
    },
    obtenerEstadisticas: async (req, res) => {
        try {
            const resultado = await servicioAlumnos.obtenerEstadisticas();
            exito(res, 'Estadísticas de alumnos obtenidas.', resultado);
        } catch (err) {
            error(res, 'Error al obtener estadísticas.', err.statusCode, err.message);
        }
    }
};

module.exports = controladorAlumnos;