import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import logo from "../../assets/logoguidospano.png"
import '../../styles/nav.css'

const Navv = () => {
  return (
    <div>
    <Navbar expand="lg" className="nav">
      <Container>

        <div className='d-flex align-items-center'>
         <Navbar.Brand href="/" className="d-flex align-items-center">
            <img
              src={logo}
              alt="Logo"
              width="70"
              height="70"
              className="d-inline-block align-top me-2"
            
            />
            <span className="fw-bold text-uppercase small text-white">
              Sistema de Gestión <br /> Carlos Guido Spano
            </span>
          </Navbar.Brand>

          <Nav className="d-flex align-items-center gap-3">

            <Nav.Link
              href="/principal "
              className="text-white px-3 py-1 rounded small"
              style={{ color:"white" }}
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
  )
}

export default Navv