import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { api } from "../../api/fetchConfig";
import { getUserFromToken } from "../../utils/jwt";

import logo from "../../assets/logoguidospano.png";
import "../../styles/nav.css";

const Navv = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Usar utilidad JWT para obtener usuario
    const currentUser = getUserFromToken();
    
    if (currentUser) {
      setUser(currentUser);
    } else {
      // Fallback: intentar leer de localStorage directamente
      const userJSON = localStorage.getItem("usuario");
      if (userJSON) {
        try {
          setUser(JSON.parse(userJSON));
        } catch (e) {
          console.error("Error al parsear el objeto de usuario:", e);
        }
      }
    }
  }, []);

  const handleLogout = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // ✅ Usar API centralizada para logout
          await api.post("/auth/logout");
        } catch (error) {
          console.error("Error al cerrar sesión en el servidor:", error);
          // Continuar con el logout local aunque falle el servidor
        }
      }

      // Limpiar localStorage completamente
      localStorage.clear();

      // Redirigir al login con replace: true para no dejar historial
      navigate("/login", { replace: true });

      // Prevenir que el usuario vuelva atrás con el botón del navegador
      window.history.pushState(null, "", "/login");

      // Listener para prevenir navegación hacia atrás
      const preventBack = () => {
        window.history.pushState(null, "", "/login");
      };

      window.addEventListener("popstate", preventBack);

      // Limpiar el listener después de 1 segundo (ya estará en login)
      setTimeout(() => {
        window.removeEventListener("popstate", preventBack);
      }, 1000);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aún así limpiar y redirigir
      localStorage.clear();
      navigate("/login", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar expand="lg" className="nav">
        <Container>
          <div className="d-flex align-items-center">
            <Navbar.Brand to="/dashboard" className="d-flex align-items-center">
              <img
                src={logo}
                alt="Logo"
                width="70"
                height="70"
                className="d-inline-block me-2"
                style={{
                  transform: "translateY(-2px)",
                }}
              />
              <span className="nombreCol">
                SISTEMA DE GESTIÓN <br /> CARLOS GUIDO SPANO
              </span>
            </Navbar.Brand>

            <div
              className="mx-3"
              style={{
                height: "40px",
                width: "1px",
                backgroundColor: "rgba(255,255,255,0.5)",
              }}
            ></div>

            <Nav className="d-flex align-items-center gap-3">
              <Nav.Link
                href="/dashboard"
                className="text-white px-3 py-1 rounded small"
                style={{ color: "white" }}
              >
                <i className="bi bi-house me-2"></i>
                Principal
              </Nav.Link>
            </Nav>
          </div>

          <button
            className="btn btn-outline-light logout-btn"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Cerrando...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar sesión {user?.username}
              </>
            )}
          </button>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navv;
