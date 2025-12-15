// ⚠️ DEPRECATED: Este archivo se mantiene por compatibilidad con servicios existentes
// ✅ RECOMENDADO: Usar import { api, API_BASE_URL } from './fetchConfig' en nuevos archivos

// Exportar la URL base desde variables de entorno
const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

export default API;

// También exportar el objeto api de fetchConfig para migración gradual
export { api, apiFetch, API_BASE_URL } from './fetchConfig';
