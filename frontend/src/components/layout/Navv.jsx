import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import logo from "../../assets/logoguidospano.png";
import "../../styles/nav.css";

const Navv = () => {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      // Obtener el token
      const token = localStorage.getItem("token");

      if (token) {
        // Llamar al endpoint de logout (opcional)
        try {
          await fetch("http://localhost:3000/api/v1/auth/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error("Error al cerrar sesión en el servidor:", error);
          // Continuar con el logout local aunque falle el servidor
        }
      }

      // Limpiar localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");

      // Redirigir al login
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aún así limpiar y redirigir
      localStorage.clear();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar expand="lg" className="nav">
        <Container>
          <div className="d-flex align-items-center">
            <Navbar.Brand href="/" className="d-flex align-items-center">
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
                backgroundColor: "rgba(255,255,255,0.5)" 
              }}
            ></div>

            <Nav className="d-flex align-items-center gap-3">
              <Nav.Link
                to="/"
                className="text-white px-3 py-1 rounded small"
                style={{ color: "white" }}
              >
                <i className="bi bi-house me-2"></i>
                Principal
              </Nav.Link>
            </Nav>
          </div>

          <button className="btn btn-outline-secondary"onClick={handleLogout} disabled={loading}>Cerrar Sesión</button>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navv;
