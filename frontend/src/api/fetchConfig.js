// ===========================================
// CONFIGURACIÓN CENTRALIZADA DE HTTP
// ===========================================
// Este archivo centraliza TODAS las peticiones HTTP del frontend
// ✅ Usa variables de entorno (VITE_API_URL)
// ✅ Maneja autenticación JWT automáticamente
// ✅ Redirige a login en errores 401/403
// ✅ Manejo de errores mejorado

// Obtener la URL base de la API desde variables de entorno
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

/**
 * Función principal para realizar peticiones HTTP
 * @param {string} endpoint - Endpoint de la API (ejemplo: "/alumnos" o "/auth/login")
 * @param {object} options - Opciones de fetch (method, body, headers, etc.)
 * @returns {Promise<object>} - Respuesta JSON parseada
 */
export const apiFetch = async (endpoint, options = {}) => {
  let token = localStorage.getItem("token");

  // Fallback: buscar token en objeto usuario
  if (!token) {
    const usuarioJSON = localStorage.getItem("usuario");
    if (usuarioJSON) {
      try {
        const usuario = JSON.parse(usuarioJSON);
        if (usuario && usuario.token) {
          token = usuario.token;
        }
      } catch (e) {
        console.error("Error al parsear usuario de localStorage:", e);
      }
    }
  }

  console.log(`📡 Fetching ${endpoint} - Token found:`, token ? 'YES' : 'NO'); // DEBUG

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    // ⭐ Manejo de errores de autenticación (401/403)
    if (response.status === 403 || response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
      throw new Error("Sesión inválida o expirada");
    }

    // ⭐ Manejo de errores generales
    if (!response.ok) {
      // Intentar obtener mensaje de error del servidor
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.mensaje || errorData.error || `Error ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error);
    throw error;
  }
};

/**
 * API Helper - Métodos HTTP simplificados
 */
export const api = {
  /**
   * GET - Obtener datos
   * @param {string} url - Endpoint (ej: "/alumnos")
   * @returns {Promise<object>}
   */
  get: (url) => apiFetch(url),

  /**
   * POST - Crear nuevo recurso
   * @param {string} url - Endpoint
   * @param {object} data - Datos a enviar
   * @returns {Promise<object>}
   */
  post: (url, data) =>
    apiFetch(url, { method: "POST", body: JSON.stringify(data) }),

  /**
   * PUT - Actualizar recurso completo
   * @param {string} url - Endpoint
   * @param {object} data - Datos a enviar
   * @returns {Promise<object>}
   */
  put: (url, data) =>
    apiFetch(url, { method: "PUT", body: JSON.stringify(data) }),

  /**
   * PATCH - Actualizar recurso parcialmente
   * @param {string} url - Endpoint
   * @param {object} data - Datos a enviar
   * @returns {Promise<object>}
   */
  patch: (url, data) =>
    apiFetch(url, { method: "PATCH", body: JSON.stringify(data) }),

  /**
   * DELETE - Eliminar recurso
   * @param {string} url - Endpoint
   * @returns {Promise<object>}
   */
  delete: (url) =>
    apiFetch(url, { method: "DELETE" }),
};

// Exportar también la URL base por si se necesita en algún componente
export const API_BASE_URL = BASE_URL;
