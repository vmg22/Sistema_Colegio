import React, { useEffect, useState } from "react";
import { useConsultaStore } from "../../../store/consultaStore";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import "../../../styles/consulta.css";
import { Link } from "react-router-dom";

const Consulta = () => {
  const { reporteAlumno } = useConsultaStore();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    let dataToSet = null;

    if (reporteAlumno) {
      dataToSet = reporteAlumno;
    } else {
      const storedData = sessionStorage.getItem("reporteAlumno");
      if (storedData) {
        dataToSet = JSON.parse(storedData);
      }
    }

    setReporte(dataToSet);
    setLoading(false); 
  }, [reporteAlumno]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando reporte...</p>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="text-center mt-5">
        <h5>No se encontraron datos del alumno.</h5>
        <p>Vuelve al panel e intenta realizar una nueva búsqueda.</p>
        <Link to={"/"}>
          <Button variant="secondary" className="px-4">
            Volver
          </Button>
        </Link>
      </div>
    );
  }

  const { materias, tutores } = reporte;
  console.log("Datos del Alumno:", reporte);
  console.log(materias);
  console.log(tutores);

  return (
    <div className="container mt-4 consulta-container">
      <div className="d-flex align-items-center mb-4">
        <span className="material-symbols-outlined search me-2">person</span>
        <h4>Reporte Académico del Alumno</h4>
      </div>

      <Card className="mb-4 sombra-card">
        <Card.Body>
          <Card.Title className="mb-3">Datos del Alumno</Card.Title>
          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Nombre:</strong> {reporte.nombre} {reporte.apellido}
              </p>
              <p>
                <strong>DNI:</strong> {reporte.dni}
              </p>
              <p>
                <strong>Curso:</strong> {reporte.curso.anio_curso}{" "}
                {reporte.curso.division}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Año:</strong> {reporte.curso.anio_lectivo}
              </p>
              <p>
                <strong>Estado:</strong>
                {(() => {
                  const estados = {
                    activo: { class: "bg-success", text: "Activo" },
                    egresado: { class: "bg-primary", text: "Egresado" },
                    baja: { class: "bg-danger", text: "Baja" },
                    suspendido: { class: "bg-warning", text: "Suspendido" },
                    inactivo: { class: "bg-secondary", text: "Inactivo" },
                  };

                  const estadoConfig = estados[reporte.estado] || {
                    class: "bg-dark",
                    text: "Desconocido",
                  };

                  return (
                    <span className={`badge ${estadoConfig.class}`}>
                      {estadoConfig.text}
                    </span>
                  );
                })()}
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* 📘 Materias y notas (¡Descomentado!) */}
      {/* <Card className="mb-4 sombra-card">
        <Card.Body>
          <Card.Title className="mb-3">Materias y Calificaciones</Card.Title>
          {materias && materias.length > 0 ? (
            <Table bordered hover responsive>
              <thead className="table-primary">
                <tr>
                  <th>Materia</th>
                  <th>1° Cuatrimestre</th>
                  <th>2° Cuatrimestre</th>
                  <th>Promedio</th>
                </tr>
              </thead>
              <tbody>
                {materias.map((m, i) => (
                  <tr key={i}>
                    <td>{m.materia}</td>
                    <td>{m.nota_1 ?? "-"}</td>
                    <td>{m.nota_2 ?? "-"}</td>
                    <td>
                      {m.promedio
                        ? Number(m.promedio).toFixed(1)
                        // Pequeña corrección por si una nota es null
                        : m.nota_1 && m.nota_2
                        ? ((m.nota_1 + m.nota_2) / 2).toFixed(1)
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No hay materias registradas para este año.</p>
          )}
        </Card.Body>
      </Card> */}

      {/* 👨‍👩‍👧 Tutores (¡Descomentado!) */}
      {/* <Card className="mb-4 sombra-card">
        <Card.Body>
          <Card.Title className="mb-3">Tutores del Alumno</Card.Title>
          {tutores && tutores.length > 0 ? (
            <Table bordered hover responsive>
              <thead className="table-success">
                <tr>
                  <th>Nombre</th>
                  <th>Parentesco</th>
                  <th>Teléfono</th>
                </tr>
              </thead>
              <tbody>
                {tutores.map((t, i) => (
                  <tr key={i}>
                    <td>{t.nombre}</td>
                    <td>{t.parentesco}</td>
                    <td>{t.telefono}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No hay tutores registrados.</p>
          )}
        </Card.Body>
      </Card> */}

      <div className="text-center mt-4">
        <Link to={"/"}>
          <Button variant="secondary" className="px-4">
            Volver al Panel
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Consulta;
