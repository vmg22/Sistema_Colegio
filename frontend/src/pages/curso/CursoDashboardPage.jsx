import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore";
import BtnVolver from "../../components/ui/BtnVolver.jsx"; 
import AccionCard from "../../components/ui/AccionCard.jsx";
import EncabezadoEstudiante from "../../components/ui/EncabezadoEstudiante.jsx";
import "../../styles/cursoDashboard.css"; // Mismo archivo CSS

const PerfilAlumno = () => {
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
      <div className="curso-loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando reporte...</p>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="curso-loading-container">
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

  return (
    <div className="curso-dashboard-container">
      {/* 1. Botón Volver */}
      <BtnVolver />
      <div className="curso-dashboard-header">
        <span className="material-symbols-outlined curso-dashboard-icon">
          badge
        </span>
        <h2 className="curso-dashboard-title">Perfil de Alumno</h2>
      </div>

      {/* 2. Card de Información */}
      <EncabezadoEstudiante reporte={reporte} variant="card" />

      {/* 3. Acciones Disponibles */}
      <h4 className="curso-actions-title">Acciones Disponibles</h4>
      <div className="curso-card-grid">
        <AccionCard
          titulo="Info alumno"
          icono="account_circle"
          to="/consulta" 
        />
        <AccionCard
          titulo="Ver Asistencias"
          icono="task_alt"
          to="/asistenciasAlumno"
        />
        <AccionCard
          titulo="Estado Academico"
          icono="trending_up"
          to="/estadoAcademicoAlumno"
        />
        <AccionCard
          titulo="Historial de Comunicaciones"
          icono="chat"
          to="/perfil-alumno/comunicaciones"
        />
        <AccionCard
          titulo="Certificados y actas"
          icono="description"
          to="/constanciaAlumnoTramite"
        />
        <AccionCard
          titulo="Generar Mail"
          icono="mail"
          to="/perfil-alumno/generar-mail"
        />
      </div>
    </div>
  );
};

export default PerfilAlumno;