const queries = require('./planillas.queries');

const crearPlanillaNivelacion = async (req, res, next) => {
    try {
        const id = await queries.crearPlanillaNivelacion(req.body);
        res.status(201).json({ success: true, id_planilla: id, message: 'Planilla de nivelación creada correctamente' });
    } catch (error) {
        next(error);
    }
};

const obtenerPlanillasNivelacion = async (req, res, next) => {
    try {
        const { anioLectivo, idCurso, idMateria } = req.query;
        const planillas = await queries.obtenerPlanillasNivelacion(anioLectivo, idCurso, idMateria);
        res.json(planillas);
    } catch (error) {
        next(error);
    }
};

const obtenerDetalleNivelacion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const detalles = await queries.obtenerDetalleNivelacion(id);
        res.json(detalles);
    } catch (error) {
        next(error);
    }
};

const obtenerCandidatosRegular = async (req, res, next) => {
    try {
        const { idCurso, idMateria, anioLectivo } = req.query;
        if (!idCurso || !idMateria || !anioLectivo) {
            return res.status(400).json({ error: 'Faltan parámetros idCurso, idMateria o anioLectivo' });
        }
        const alumnos = await queries.obtenerCandidatosRegular(idCurso, idMateria, anioLectivo);
        res.json(alumnos);
    } catch (error) {
        next(error);
    }
};

const obtenerCandidatosPrevia = async (req, res, next) => {
    try {
        const { idCurso, idMateria, anioLectivo } = req.query;
        if (!idCurso || !idMateria || !anioLectivo) {
            return res.status(400).json({ error: 'Faltan parámetros idCurso, idMateria o anioLectivo' });
        }
        const alumnos = await queries.obtenerCandidatosPrevia(idCurso, idMateria, anioLectivo);
        res.json(alumnos);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    crearPlanillaNivelacion,
    obtenerPlanillasNivelacion,
    obtenerDetalleNivelacion,
    obtenerCandidatosRegular,
    obtenerCandidatosPrevia
};
