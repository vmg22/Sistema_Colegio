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
        <h4>Consulta Académica</h4>
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
        {tipoConsulta === "alumno" ? (
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <h5 className="tituloForm">Buscar Alumno</h5>
            <hr className="linea-separadora" />
            <Row className="mb-3 d-flex justify-content-center">
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label className="formLabel">DNI</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <span className="material-symbols-outlined">person</span>
                  </InputGroup.Text>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Ingrese DNI"
                  />
                </InputGroup>
              </Form.Group>
            </Row>
            <Row className="mb-3 d-flex justify-content-around">
              <Form.Group as={Col} md="4" controlId="validationCustomPeriodo">
                <Form.Label className="formLabel">Periodo</Form.Label>
                <Form.Select required>
                  <option value="">Seleccione cuatrimestre</option>
                  <option value="1">1er Cuatrimestre</option>
                  <option value="2">2do Cuatrimestre</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="validationCustomPeriodo">
                <Form.Label className="formLabel">Año</Form.Label>
                <Form.Select required>
                  <option value="">Seleccione año</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <div className="d-flex justify-content-center my-4">
              <Button
                type="submit"
                className="d-flex align-items-center gap-2 px-4 py-2 btnBuscar"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  search
                </span>
                <span>Buscar Alumno</span>
              </Button>
            </div>
          </Form>
        ) : (
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <h5 className="tituloForm">Buscar Curso</h5>
            <hr className="linea-separadora" />
            <Row className="mb-3 d-flex justify-content-around">
              <Form.Group as={Col} md="4" controlId="validationCustomPeriodo">
                <Form.Label className="formLabel">Curso</Form.Label>
                <Form.Select required>
                  <option value="">Seleccione curso</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="validationCustomPeriodo">
                <Form.Label className="formLabel">Materia</Form.Label>
                <Form.Select required>
                  <option value="">Seleccione materia</option>
                  <option value="Biologia">Biologia</option>
                  <option value="Historia">Historia</option>
                  <option value="Matematicas">Matematicas</option>
                  <option value="Lengua">Lengua</option>
                  <option value="Geografia">Geografia</option>
                  <option value="Ingles">Ingles</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <Row className="mb-3 d-flex justify-content-around">
              <Form.Group as={Col} md="4" controlId="validationCustomPeriodo">
                <Form.Label className="formLabel">Periodo</Form.Label>
                <Form.Select required>
                  <option value="">Seleccione cuatrimestre</option>
                  <option value="1">1er Cuatrimestre</option>
                  <option value="2">2do Cuatrimestre</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="validationCustomPeriodo">
                <Form.Label className="formLabel">Año</Form.Label>
                <Form.Select required>
                  <option value="">Seleccione año</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </Form.Select>
              </Form.Group>
            </Row>
            <div className="d-flex justify-content-center my-4">
              <Button
                type="submit"
                className="d-flex align-items-center gap-2 px-4 py-2 btnBuscar"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  search
                </span>
                <span>Buscar Curso</span>
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
