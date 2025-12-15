// ===========================================
// UTILIDADES PARA JWT
// ===========================================
// Este archivo centraliza la decodificación y manejo de JWT
// ✅ Validación de expiración
// ✅ Manejo seguro de errores
// ✅ Funciones helper para obtener datos del usuario

import { jwtDecode } from 'jwt-decode';

/**
 * Decodifica el token JWT almacenado en localStorage
 * @returns {object|null} - Objeto decodificado del token o null si es inválido
 */
export const getUserFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const decoded = jwtDecode(token);
    
    // Verificar si el token ha expirado
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.warn('Token expirado, limpiando localStorage');
      localStorage.clear();
      return null;
    }
    
    return decoded;
  } catch (error) {
    console.error('Error decodificando token:', error);
    localStorage.clear();
    return null;
  }
};

/**
 * Obtiene el ID del usuario desde el token
 * @returns {number|null} - ID del usuario o null si no está disponible
 */
export const getUserId = () => {
  const user = getUserFromToken();
  return user?.id || null;
};

/**
 * Obtiene el rol del usuario desde el token
 * @returns {string|null} - Rol del usuario o null si no está disponible
 */
export const getUserRole = () => {
  const user = getUserFromToken();
  return user?.rol || null;
};

/**
 * Obtiene el username del usuario desde el token
 * @returns {string|null} - Username o null si no está disponible
 */
export const getUsername = () => {
  const user = getUserFromToken();
  return user?.username || null;
};

/**
 * Obtiene el email del usuario desde el token
 * @returns {string|null} - Email o null si no está disponible
 */
export const getUserEmail = () => {
  const user = getUserFromToken();
  return user?.email || null;
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} - true si hay un token válido
 */
export const isAuthenticated = () => {
  return getUserFromToken() !== null;
};

/**
 * Verifica si el usuario tiene un rol específico
 * @param {string} requiredRole - Rol requerido
 * @returns {boolean} - true si el usuario tiene el rol
 */
export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

/**
 * Verifica si el usuario tiene alguno de los roles especificados
 * @param {string[]} requiredRoles - Array de roles permitidos
 * @returns {boolean} - true si el usuario tiene alguno de los roles
 */
export const hasAnyRole = (requiredRoles) => {
  const userRole = getUserRole();
  return requiredRoles.includes(userRole);
};

/**
 * Cierra la sesión del usuario
 * Limpia localStorage y redirige al login
 */
export const logout = () => {
  localStorage.clear();
  window.location.href = '/login';
};
