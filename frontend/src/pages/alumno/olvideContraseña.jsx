import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api/fetchConfig";
import "../../styles/login.css";

const OlvideContrasena = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [tokenValid, setTokenValid] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    
    console.log('🔗 Token recibido:', tokenFromUrl);

    if (!tokenFromUrl) {
      setError("Enlace inválido. No se encontró token de verificación.");
      setTokenValid(false);
      return;
    }

    // Limpiar token de espacios
    const cleanToken = tokenFromUrl.replace(/\s/g, '');
    setToken(cleanToken);
    setTokenValid(true);
    console.log('✅ Token válido asignado');

  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token || !tokenValid) {
      setError("Token no válido o enlace expirado");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!validatePassword(formData.newPassword)) {
      setError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número");
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Enviando solicitud de reset...');
      
      // ✅ Usar API centralizada
      const data = await api.post("/auth/reset-password", {
        token: token,
        newPassword: formData.newPassword,
      });

      console.log('📨 Respuesta del servidor:', data);

      setSuccess(data.mensaje || "¡Contraseña actualizada exitosamente! Redirigiendo al login...");
      setFormData({ newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error('❌ Error en submit:', err);
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNewLink = () => {
    navigate("/solicitar-reset");
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  // Mostrar pantalla de error si el token no es válido
  if (!tokenValid) {
    return (
      <div className="login-container">
        <div className="login-form-wrapper">
          <div className="login-form-container">
            <div className="login-icon">
              <span className="material-symbols-outlined" style={{ color: '#dc3545', fontSize: '48px' }}>
                error
              </span>
            </div>
            <h2 className="login-title">Enlace Inválido</h2>
            <p className="login-subtitle">
              El enlace de recuperación no es válido o ha expirado.
            </p>
            
            {error && (
              <div className="login-error">
                <span className="material-symbols-outlined">error</span>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <button
                onClick={handleRequestNewLink}
                className="login-button"
                style={{ backgroundColor: '#28a745' }}
              >
                SOLICITAR NUEVO ENLACE
              </button>
              
              <button
                onClick={handleBackToLogin}
                className="login-forgot-link"
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#007bff', 
                  cursor: 'pointer',
                  padding: '10px'
                }}
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="login-form-container">
          <div className="login-icon">
            <span className="material-symbols-outlined">lock_reset</span>
          </div>
          <h2 className="login-title">Restablecer Contraseña</h2>
          <p className="login-subtitle">Ingresa tu nueva contraseña</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="newPassword" className="login-label">
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="login-input"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="confirmPassword" className="login-label">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="login-input"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="password-requirements">
              <p style={{ fontSize: "0.85rem", color: "#666", margin: "10px 0" }}>
                La contraseña debe contener:
              </p>
              <ul style={{ 
                fontSize: "0.8rem", 
                color: "#666", 
                paddingLeft: "20px", 
                margin: 0,
                textAlign: 'left'
              }}>
                <li>Mínimo 8 caracteres</li>
                <li>Al menos una mayúscula</li>
                <li>Al menos una minúscula</li>
                <li>Al menos un número</li>
              </ul>
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

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  ACTUALIZANDO...
                </>
              ) : (
                "RESTABLECER CONTRASEÑA"
              )}
            </button>

            <div className="login-forgot">
              <button
                type="button"
                onClick={handleBackToLogin}
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

export default OlvideContrasena;