import axios from 'axios';

// La URL base de tu backend (que usa CommonJS)
const API = 'http://localhost:3000/api/v1'; // Ajusta el puerto si es necesario

// (C) Create
export const createDocenteRequest = (docente) => 
  axios.post(`${API}/docentes`, docente);

// (R) Read
export const getDocentesRequest = () => 
  axios.get(`${API}/docentes`);