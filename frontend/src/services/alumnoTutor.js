import API from "../api/api"
import axios from "axios";

const ALUMNO_TUTOR_URL = `${API}/alumno-tutor`;
const TUTOR_URL = `${API}/tutores`;


export const getAlumnoTutorId =async(id_alumno) =>{

        const response  = await axios.get(`${ALUMNO_TUTOR_URL}/alumno/${id_alumno}`);
        return response.data;

}

export const getTutor = async(id)=>{
    const response = await axios.get(`${TUTOR_URL}/${id}`)
    return response.data;
}