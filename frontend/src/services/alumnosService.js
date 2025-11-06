import API from "../api/api"
import axios from "axios";

const ALUMNOS_URL = `${API}/alumnos`;

export const getAlumnoDni =async(dni) =>{

        const response  = await axios.get(`${ALUMNOS_URL}/dni/${dni}`);
        return response.data;

}

export const getAllAlumnos = async() =>{
        const response = await axios.get(ALUMNOS_URL);
        return response.data;
}

export const getAlumnoId = async(id)=>{

        const response = await axios.get(`${ALUMNOS_URL}/${id}`)
        return response.data;
}

export const deleteAlumno = async(id)=>{
        const response = await axios.delete(`${ALUMNOS_URL}/${id}`)
        return response.data;
}

export const editAlumno = async ()=>{
        
}