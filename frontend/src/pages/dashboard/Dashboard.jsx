// src/components/Dashboard/Dashboard.jsx
import React, {  useState } from "react";
import "../../styles/dashboard.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { getAlumnoDni } from "../../services/alumnosService";

const Dashboard = () => {
  const [tipoConsulta, setConsulta] = useState("alumno");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dniInput, setDniInput] = useState("");
  const [alumno, setAlumno] = useState(null);

  const setConsulta2 = (tipo) => {
    setConsulta(tipo);
    setAlumno(null);
    setError("");
    setDniInput("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (!/^\d+$/.test(dniInput)) {
      setError("El DNI debe contener solo números.");
      return;
    }

    setLoading(true);
    setError("");
    setAlumno(null);

    try {
      const data = await getAlumnoDni(dniInput);
      setAlumno(data);
      console.log("Alumno obtenido:", data);
    } catch (err) {
      setError("No se pudo encontrar un alumno con ese DNI.");
      console.error("Error al traer alumno:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nombre_vista">
      <div style={{ display: "flex", alignItems: "center", marginLeft: "20px", gap: "10px" }}>
        <span className="material-symbols-outlined search" style={{ marginRight: "15px" }}>
          search
        </span>
        <h4>Consulta Académica</h4>
      </div>

      <hr className="linea-separadora" />

      <div className="contenedor-botones-dash">
        <button
          className={`btn-tipo ${tipoConsulta === "alumno" ? "activo" : ""}`}
          onClick={() => setConsulta2("alumno")}
        >
          <div className="icono-contenedor">
            <span className="material-symbols-outlined person">person</span>
          </div>
          <span className="btn-texto">Consulta por Alumno</span>
        </button>

        <button
          className={`btn-tipo ${tipoConsulta === "curso" ? "activo" : ""}`}
          onClick={() => setConsulta2("curso")}
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
            <Row className="mb-3 d-flex justify-content-around">
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
                    value={dniInput}
                    onChange={(e) => setDniInput(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label className="formLabel">Año</Form.Label>
                <Form.Select required>
                  {[2025, 2026].map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            <div className="d-flex justify-content-center my-4">
              <Button
                type="submit"
                className="d-flex align-items-center gap-2 px-4 py-2 btnBuscar"
                disabled={loading}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  search
                </span>
                <span>{loading ? "Buscando..." : "Buscar Alumno"}</span>
              </Button>
            </div>
          </Form>
          
        ) : (
          // Consulta por curso
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <h5 className="tituloForm">Buscar Curso</h5>
            <hr className="linea-separadora" />
            <Row className="mb-3 d-flex justify-content-around">
              <Form.Group as={Col} md="4">
                <Form.Label className="formLabel">Curso</Form.Label>
                <Form.Select required>
                  <option value="">Seleccione curso</option>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} md="4">
                <Form.Label className="formLabel">Materia</Form.Label>
                <Form.Select required>
                  {["", "Biologia", "Historia", "Matematicas", "Lengua", "Geografia", "Ingles"].map(
                    (m) => (
                      <option key={m} value={m}>
                        {m || "Seleccione materia"}
                      </option>
                    )
                  )}
                </Form.Select>
              </Form.Group>
            </Row>

            <Row className="mb-3 d-flex justify-content-around">
              <Form.Group as={Col} md="4">
                <Form.Label className="formLabel">Periodo</Form.Label>
                <Form.Select required>
                  <option value="">Seleccione cuatrimestre</option>
                  <option value="1">1er Cuatrimestre</option>
                  <option value="2">2do Cuatrimestre</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} md="4">
                <Form.Label className="formLabel">Año</Form.Label>
                <Form.Select required>
                  {[2025, 2026].map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            <div className="d-flex justify-content-center my-4">
              <Button type="submit" className="d-flex align-items-center gap-2 px-4 py-2 btnBuscar">
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  search
                </span>
                <span>Buscar Curso</span>
              </Button>
            </div>
          </Form>
        )}
      </div>

      <div className="resultados-busqueda" style={{ textAlign: "center", marginTop: "20px" }}>
        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {alumno && (
          <div>
            <h4>Alumno Encontrado</h4>
            <p>
              <strong>Nombre:</strong> {alumno.nombre_alumno} {alumno.apellido_alumno}
            </p>
            <p>
              <strong>DNI:</strong> {alumno.dni_alumno}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
