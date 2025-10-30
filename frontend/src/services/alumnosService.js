import API from "../api/api"
import axios from "axios";

const ALUMNOS_URL = `${API}/alumnos`;

export const getAlumnoDni =async(dni) =>{

        const response  = await axios.get(`${ALUMNOS_URL}/dni/${dni}`);
        return response.data;

}