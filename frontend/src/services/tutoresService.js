import axios from "axios";
import API from "../api/api";

const TUTORES_URL = `${API}/tutores`;

export const editarTutorPorId = async (id, datosTutor) =>{
    const response = await axios.put(`${TUTORES_URL}/${id}`, datosTutor);
    return response.data;
}