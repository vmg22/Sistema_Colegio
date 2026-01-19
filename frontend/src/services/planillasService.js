import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const crearPlanillaNivelacion = async (data) => {
    const response = await axios.post(`${API_URL}/planillas/nivelacion`, data);
    return response.data;
};

export const obtenerPlanillasNivelacion = async (anioLectivo, idCurso, idMateria) => {
    const params = { anioLectivo };
    if (idCurso) params.idCurso = idCurso;
    if (idMateria) params.idMateria = idMateria;

    const response = await axios.get(`${API_URL}/planillas/nivelacion`, { params });
    return response.data;
};

export const obtenerDetalleNivelacion = async (idPlanilla) => {
    const response = await axios.get(`${API_URL}/planillas/nivelacion/${idPlanilla}/detalles`);
    return response.data;
};

export const obtenerCandidatosRegular = async (anioLectivo, idCurso, idMateria) => {
    const response = await axios.get(`${API_URL}/planillas/regular`, {
        params: { anioLectivo, idCurso, idMateria }
    });
    return response.data;
};

export const obtenerCandidatosPrevia = async (anioLectivo, idCurso, idMateria) => {
    const response = await axios.get(`${API_URL}/planillas/previa`, {
        params: { anioLectivo, idCurso, idMateria }
    });
    return response.data;
};
