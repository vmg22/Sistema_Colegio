const BASE_URL = "http://localhost:3000/api";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  // ⭐ Manejo de errores 403/401
  if (response.status === 403 || response.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    throw new Error("Sesión inválida");
  }

  if (!response.ok) throw new Error("Error en petición");

  return response.json();
};

export const api = {
  get: (url) => apiFetch(url),
  post: (url, data) =>
    apiFetch(url, { method: "POST", body: JSON.stringify(data) }),
  patch: (url, data) =>
    apiFetch(url, { method: "PATCH", body: JSON.stringify(data) }),
};
