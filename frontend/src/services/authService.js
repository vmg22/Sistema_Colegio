/**
 * Servicio para manejar autenticación y datos del usuario
 */

const USUARIO_KEY = 'usuario';

/**
 * Guardar usuario en localStorage
 * @param {Object} usuario - Datos del usuario
 */
export const setUsuario = (usuario) => {
  localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
};

/**
 * Obtener usuario de localStorage
 * @returns {Object|null} Datos del usuario o null
 */
export const getUsuario = () => {
  const usuario = localStorage.getItem(USUARIO_KEY);
  return usuario ? JSON.parse(usuario) : null;
};

/**
 * Verificar si el usuario es docente
 * @returns {boolean} true si es docente
 */
export const esDocente = () => {
  const usuario = getUsuario();
  return usuario && usuario.rol === 'docente';
};

/**
 * Obtener ID del docente logueado
 * @returns {number|null} ID del docente o null
 */
export const getIdDocente = () => {
  const usuario = getUsuario();
  return usuario && usuario.rol === 'docente' ? usuario.id_docente : null;
};

/**
 * Obtener rol del usuario
 * @returns {string|null} Rol del usuario o null
 */
export const getRol = () => {
  const usuario = getUsuario();
  return usuario ? usuario.rol : null;
};

/**
 * Cerrar sesión
 */
export const logout = () => {
  localStorage.removeItem(USUARIO_KEY);
};

/**
 * Verificar si hay un usuario logueado
 * @returns {boolean} true si hay usuario logueado
 */
export const estaLogueado = () => {
  return getUsuario() !== null;
};
