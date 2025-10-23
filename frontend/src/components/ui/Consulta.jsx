import React, { useEffect, useState } from "react";
import { useConsultaStore } from "../../store/consultaStore";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import "../../styles/consulta.css";

const Consulta = () => {
  const { alumnoDni, alumnoAnio } = useConsultaStore();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar desde Zustand o desde sessionStorage (por si recarga)
    const storedData = sessionStorage.getItem("reporteAlumno");

    if (storedData) {
      setReporte(JSON.parse(storedData));
    }
    setLoading(false);
  }, [alumnoDni, alumnoAnio]);

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
      </div>
    );
  }

  const { alumno, materias, tutores } = reporte;

  return (
    <div className="container mt-4 consulta-container">
      <div className="d-flex align-items-center mb-4">
        <span className="material-symbols-outlined search me-2">person</span>
        <h4>Reporte Académico del Alumno</h4>
      </div>

      {/* 🧑‍🎓 Datos del alumno */}
      <Card className="mb-4 sombra-card">
        <Card.Body>
          <Card.Title className="mb-3">Datos del Alumno</Card.Title>
          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Nombre:</strong> {alumno?.nombre} {alumno?.apellido}
              </p>
              <p>
                <strong>DNI:</strong> {alumno?.dni}
              </p>
              <p>
                <strong>Curso:</strong> {alumno?.curso}° {alumno?.curso.division}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Año:</strong> {alumnoAnio}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <span className="badge bg-success">Activo</span>
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* 📘 Materias y notas */}
      <Card className="mb-4 sombra-card">
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
                        : ((m.nota_1 + m.nota_2) / 2).toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No hay materias registradas para este año.</p>
          )}
        </Card.Body>
      </Card>

      {/* 👨‍👩‍👧 Tutores */}
      <Card className="mb-4 sombra-card">
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
      </Card>

      <div className="text-center mt-4">
        <Button
          variant="secondary"
          className="px-4"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Volver al Panel
        </Button>
      </div>
    </div>
  );
};

export default Consulta;
