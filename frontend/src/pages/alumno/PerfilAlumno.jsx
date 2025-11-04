import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore";
import BtnVolver from "../../components/ui/BtnVolver.jsx"; 
import AccionCard from "../../components/ui/AccionCard.jsx";
import EncabezadoEstudiante from "../../components/ui/EncabezadoEstudiante.jsx";
import "../../styles/perfilAlumno.css";
import DivHeaderInfo from "../../components/alumno/DivHeaderInfo.jsx";

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
      <div className="perfil-alumno-loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando reporte...</p>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="perfil-alumno-loading-container">
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
    <div className="perfil-alumno-container">
      {/* 1. Botón Volver */}
      <BtnVolver />
      <div className="curso-dashboard-header">
         <span className="material-symbols-outlined calificaciones-page-icon">badge</span>
        <h2 className="perfil-alumno-title">Perfil de Alumno</h2>
      </div>

      {/* 2. Card de Información */}
      <DivHeaderInfo/>

      {/* 3. Acciones Disponibles */}
      <h4 className="perfil-alumno-actions-title">Acciones Disponibles</h4>
      <div className="perfil-alumno-card-grid">
        <AccionCard
          titulo="Info Alumno"
          icono="account_circle"
          to="/consulta" 
        />
        <AccionCard
          titulo="Ver Asistencias"
          icono="task_alt"
          to="/asistenciasAlumno"
        />
        <AccionCard
          titulo="Estado Académico"
          icono="trending_up"
          to="/estadoAcademicoAlumno"
        />
        <AccionCard
          titulo="Historial de Comunicaciones"
          icono="chat"
          to="/perfil-alumno/comunicaciones"
        />
        <AccionCard
          titulo="Certificados y Actas"
          icono="description"
          to="/home-certificados"
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