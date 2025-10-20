import React from "react";
import { useState } from "react";
import "../../styles/dashboard.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";

const Dashboard = () => {
  const [tipoConsulta, setConsulta] = useState("alumno");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <div className="nombre_vista">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "20px",
          gap: "10px",
        }}
      >
        <span
          class="material-symbols-outlined search"
          style={{ marginRight: "15px" }}
        >
          search
        </span>
        <h4>Consulta Academica</h4>
      </div>

      <hr className="linea-separadora" />

      <div className="contenedor-botones-dash">
        <button
          className={`btn-tipo ${tipoConsulta === "alumno" ? "activo" : ""}`}
          onClick={() => setConsulta("alumno")}
        >
          <div className="icono-contenedor">
            <span className="material-symbols-outlined person">person</span>
          </div>
          <span className="btn-texto">Consulta por Alumno</span>
        </button>

        <button
          className={`btn-tipo ${tipoConsulta === "curso" ? "activo" : ""}`}
          onClick={() => setConsulta("curso")}
        >
          <div className="icono-contenedor-group">
            <span className="material-symbols-outlined group">group</span>
          </div>
          <span className="btn-texto">Consulta por Curso</span>
        </button>
      </div>

      <div className="contenedor-busqueda">
        <h5>Buscar {tipoConsulta}</h5>
        <hr className="linea-separadora" />

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustom01">
              <Form.Label>DNI</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <span className="material-symbols-outlined">person</span>
                </InputGroup.Text>
                <Form.Control required type="text" placeholder="Ingrese DNI" />
              </InputGroup>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustomPeriodo">
              <Form.Label>Periodo</Form.Label>
              <Form.Select required>
                <option value="">Seleccione cuatrimestre</option>
                <option value="1">1er Cuatrimestre</option>
                <option value="2">2do Cuatrimestre</option>
              </Form.Select>
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="validationCustomPeriodo">
              <Form.Label>Año</Form.Label>
              <Form.Select required>
                <option value="">Seleccione año</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <div style={{ display: "flex", justifyContent: "center" , marginTop:"20px", marginBottom:"20px"}}>
            <Button
              type="submit"
              
            >
              <span
                class="material-symbols-outlined"
                style={{ marginRight: "15px" }}
              >
                search
              </span>
              Buscar alumno
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default Dashboard;
