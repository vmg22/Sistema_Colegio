import React, { useEffect, useState } from "react";
import { useConsultaStore } from "../../../store/consultaStore";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import "../../../styles/consulta.css";
import { Link } from "react-router-dom";
import HeaderPages from "../../../components/ui/HeaderPages";
import LineaSeparadora from "../../../components/ui/LineaSeparadora";
import DivHeaderInfo from "../../../components/alumno/DivHeaderInfo";
import DivBodyInfo from "../../../components/alumno/DivBodyInfo";

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

      </div>
    );
  }

  const { materias, tutores } = reporte;
  console.log("Datos del Alumno:", reporte);
  console.log(materias);
  console.log(tutores);

  return (
    <div className="perfil-alumno-container">
      <div className="curso-dashboard-header mt-3">
         <span className="material-symbols-outlined calificaciones-page-icon">search</span>
        <h2 className="perfil-alumno-title">Informacion Alumno</h2>
      </div>
      <DivHeaderInfo/>
      <DivBodyInfo/>

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
    </div>
  );
};

export default Consulta;
