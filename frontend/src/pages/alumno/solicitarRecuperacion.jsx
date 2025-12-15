import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/fetchConfig";
import "../../styles/login.css";

const SolicitarRecuperacion = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");
  setLoading(true);

  try {
    // ✅ Usar API centralizada
    const data = await api.post("/auth/solicitar-reset", {
      email_usuario: email,
    });

    setSuccess(data.mensaje);
    setEmail("");

    setTimeout(() => {
      navigate("/login");
    }, 5000);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="login-form-container">
          <div className="login-icon">
            <span className="material-symbols-outlined">mail</span>
          </div>

          <h2 className="login-title">Recuperar Contraseña</h2>
          <p className="login-subtitle">
            Ingresa tu correo electrónico y te enviaremos instrucciones
          </p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="email" className="login-label">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="correo@ejemplo.com"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className="login-error">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            {success && (
              <div className="login-success">
                <span className="material-symbols-outlined">check_circle</span>
                {success}
              </div>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  ENVIANDO...
                </>
              ) : (
                "ENVIAR CORREO"
              )}
            </button>

            <div className="login-forgot">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="login-forgot-link"
                disabled={loading}
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SolicitarRecuperacion;
