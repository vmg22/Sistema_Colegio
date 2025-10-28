import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import logo from "../../assets/logoguidospano.png";
import "../../styles/nav.css";

const Navv = () => {
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

          <button className="btn btn-outline-secondary">Cerrar Sesión</button>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navv;
