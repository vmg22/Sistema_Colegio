const servicioUsuarios = require('./auth.services');
const { exito, error } = require('../../utils/responses');

const controladorUsuarios = {
  // GET /api/auth
  getAllUsuarios: async (solicitud, respuesta) => {
    try {
      const usuarios = await servicioUsuarios.obtenerTodosUsuarios();
      exito(respuesta, 'Usuarios obtenidos correctamente', usuarios);
    } catch (err) {
      error(respuesta, 'Error al obtener usuarios', 500, err.message);
    }
  },

  // GET /api/auth/:id
  getUsuarioById: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const usuario = await servicioUsuarios.obtenerUsuarioPorId(id);
      
      if (!usuario) {
        return error(respuesta, 'Usuario no encontrado', 404);
      }
      
      exito(respuesta, 'Usuario obtenido correctamente', usuario);
    } catch (err) {
      error(respuesta, 'Error al obtener usuario', 500, err.message);
    }
  },

  // POST /api/auth
  createUsuario: async (solicitud, respuesta) => {
    try {
      const datosUsuario = solicitud.body;
      
      if (!datosUsuario.username || !datosUsuario.password_hash || !datosUsuario.email_usuario) {
        return error(respuesta, 'Username, password y email son obligatorios', 400);
      }
      
      const usuarioCreado = await servicioUsuarios.crearUsuario(datosUsuario);
      exito(respuesta, 'Usuario creado exitosamente', usuarioCreado, 201);
    } catch (err) {
      error(respuesta, 'Error al crear usuario', 400, err.message);
    }
  },

  // PUT /api/auth/:id
  updateUsuario: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const datosActualizados = solicitud.body;
      
      const usuarioActualizado = await servicioUsuarios.actualizarUsuario(id, datosActualizados);
      exito(respuesta, 'Usuario actualizado correctamente', usuarioActualizado);
    } catch (err) {
      error(respuesta, 'Error al actualizar usuario', 400, err.message);
    }
  },

  // DELETE /api/auth/:id
  deleteUsuario: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const resultado = await servicioUsuarios.eliminarUsuario(id);
      exito(respuesta, resultado.mensaje);
    } catch (err) {
      error(respuesta, 'Error al eliminar usuario', 400, err.message);
    }
  },

  // GET /api/auth/eliminados/listar
  getUsuariosEliminados: async (solicitud, respuesta) => {
    try {
      const usuariosEliminados = await servicioUsuarios.obtenerUsuariosEliminados();
      exito(respuesta, 'Usuarios eliminados obtenidos', usuariosEliminados);
    } catch (err) {
      error(respuesta, 'Error al obtener usuarios eliminados', 500, err.message);
    }
  },

  // POST /api/auth/:id/restaurar
  restaurarUsuario: async (solicitud, respuesta) => {
    try {
      const { id } = solicitud.params;
      const usuarioRestaurado = await servicioUsuarios.restaurarUsuario(id);
      exito(respuesta, 'Usuario restaurado correctamente', usuarioRestaurado);
    } catch (err) {
      error(respuesta, 'Error al restaurar usuario', 400, err.message);
    }
  }
};

module.exports = controladorUsuarios;