import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Limpiar error al escribir
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_usuario: formData.usuario,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || "Error al iniciar sesión");
      }

      // Guardar token y datos del usuario
      localStorage.setItem("token", data.datos.token);
      localStorage.setItem("usuario", JSON.stringify(data.datos.usuario));

      // Redirigir al dashboard
      navigate("/dashboard");
      
    } catch (err) {
      setError(err.message || "Error al iniciar sesión. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/solicitar-reset");
  };

  return (
    <div className="login-container">
      {/* Formulario de login */}
      <div className="login-form-wrapper">
        <div className="login-form-container">
          {/* Icono de usuario */}
          <div className="login-icon">
            <span className="material-symbols-outlined">account_circle</span>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Campo Usuario */}
            <div className="login-form-group">
              <label htmlFor="usuario" className="login-label">
                Usuario
              </label>
              <input
                type="email"
                id="usuario"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                className="login-input"
                placeholder="correo@ejemplo.com"
                required
                disabled={loading}
              />
            </div>

            {/* Campo Contraseña */}
            <div className="login-form-group">
              <label htmlFor="password" className="login-label">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="login-input"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="login-error">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            {/* Link olvidé contraseña */}
            <div className="login-forgot">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="login-forgot-link"
                disabled={loading}
              >
                Olvidé mi contraseña
              </button>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  INICIANDO...
                </>
              ) : (
                "INICIAR SESIÓN"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;