import React from "react";
import { useConsultaStore } from "../../store/consultaStore";
import { Spinner } from "react-bootstrap";
import "../../styles/encabezadoCurso.css";

const DivHeaderInfo = () => {
  const { reporteAlumno } = useConsultaStore();

  // Si los datos aún no están, se muestra un spinner
  if (!reporteAlumno) {
    return (
      <div className="encabezado-curso-card">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const { nombre, apellido, dni, curso } = reporteAlumno;

  return (
    <div className="encabezado-curso-card">
      {/* Icono */}
      <div className="encabezado-icon-circle">
        <span className="material-symbols-outlined encabezado-icon">
          person
        </span>
      </div>

      {/* Info Principal */}
      <div className="encabezado-info-container">
        <h2 className="encabezado-title">
          {nombre} {apellido}
        </h2>
        <p className="encabezado-subtitle">
          {curso ? `Curso: ${curso.anio_curso} ${curso.division}` : "Sin curso asignado"}
        </p>
      </div>

      {/* Stats */}
      <div className="encabezado-stats-container">
        <h3 className="encabezado-total-alumnos">{dni}</h3>
        <p className="encabezado-total-label">DNI</p>
      </div>
    </div>
  );
};

export default DivHeaderInfo;