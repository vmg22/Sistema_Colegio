import { createContext, useContext, useState } from 'react';
import { getDocentesRequest, createDocenteRequest } from '../api/docente.api.js';

// 1. Crear el Contexto
const DocenteContext = createContext();

// 2. Crear un Hook personalizado (buena práctica)
export const useDocentes = () => {
  const context = useContext(DocenteContext);
  if (!context) {
    throw new Error("useDocentes debe usarse dentro de un DocenteProvider");
  }
  return context;
};

// 3. Crear el Proveedor (Provider)
export const DocenteProvider = ({ children }) => {
  const [docentes, setDocentes] = useState([]);
  const [errors, setErrors] = useState([]);

  // (R) Leer Docentes
  const getDocentes = async () => {
    try {
      const res = await getDocentesRequest();
      // Asumo que tu backend responde con { exito: true, datos: [...] }
      setDocentes(res.data.datos); 
    } catch (error) {
      console.error(error);
    }
  };

  // (C) Crear Docente
  const createDocente = async (docente) => {
    try {
      await createDocenteRequest(docente);
      // Refrescamos la lista después de crear
      await getDocentes(); 
      return true; // Éxito
    } catch (error) {
      // Tu backend (servicio) lanza errores con statusCode
      setErrors(error.response.data); 
      return false; // Fracaso
    }
  };

  return (
    <DocenteContext.Provider value={{
      docentes,
      getDocentes,
      createDocente,
      errors
    }}>
      {children}
    </DocenteContext.Provider>
  );
};
