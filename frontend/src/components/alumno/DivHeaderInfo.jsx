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
        <span style={{ marginLeft: "10px" }}>Cargando información del alumno...</span>
      </div>
    );
  }

  const { nombre, apellido, dni, curso } = reporteAlumno;

  return (
    <div className="encabezado-curso-card">
      {/* Icono y Nombre a la izquierda */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: 1 }}>
        <div className="encabezado-icon-circle">
          <span className="material-symbols-outlined encabezado-icon">
            person
          </span>
        </div>
        
        <div className="encabezado-info-container">
          <h2 className="encabezado-title">
            {nombre} {apellido}
          </h2>
        </div>
      </div>

      {/* DNI y Curso a la derecha */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "30px",
        textAlign: "right"
      }}>
        <div>
          <h3 className="encabezado-total-alumnos">{dni}</h3>
          <p className="encabezado-total-label">DNI</p>
        </div>
        
        {curso && (
          <div>
            <h3 className="encabezado-total-alumnos">
              {curso.anio_curso} {curso.division}
            </h3>
            <p className="encabezado-total-label">Curso</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DivHeaderInfo;