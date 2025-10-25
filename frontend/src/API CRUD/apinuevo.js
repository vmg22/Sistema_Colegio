import axios from "axios";

// 1. Definimos la URL base de tu backend
const API_URL = "http://localhost:3000/api/v1";

// 2. Creamos la instancia de Axios (un objeto con .get, .post, etc.)
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 3. Interceptor para manejar las respuestas
apiClient.interceptors.response.use(
  (response) => {
    // Tu backend responde con { status, mensaje, datos }
    // Devolvemos solo los 'datos' para que el resto del código
    // no tenga que hacer 'response.data.datos'
    return response.data.datos; 
  },
  (error) => {
    // Si hay un error, extraemos el mensaje de error de tu backend
    const errorMsg = error.response?.data?.mensaje || 
                     error.response?.data?.error || 
                     "Ocurrió un error desconocido";
                     
    console.error("❌ Error en la llamada API:", errorMsg);
    
    // Rechazamos la promesa con el mensaje de error
    return Promise.reject(new Error(errorMsg));
  }
);

// 4. Exportamos el objeto apiClient, no el string
export default apiClient;