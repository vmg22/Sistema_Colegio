import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import DivHeaderInfo from "../../components/alumno/DivHeaderInfo.jsx";
import EstadoAcademicoCard from "../../components/ui/EstadoAcademicoCard.jsx";
import "../../styles/estadoAcademicoAlumno.css";

const EstadoAcademicoPage = () => {
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

  // Procesamos las materias para pasar al componente card
  const materias = useMemo(() => {
    if (!reporte || !reporte.materias) return [];
    return Object.entries(reporte.materias); // Devuelve [ [nombreMateria, data], ... ]
  }, [reporte]);

  if (loading) {
    return (
      <div className="estado-academico-page__loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando estado académico...</p>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="estado-academico-page__loading-container">
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
    <div className="estado-academico-page">
      {/* 1. Botón Volver */}
      <BtnVolver />
      <div className="curso-dashboard-header">
         <span className="material-symbols-outlined calificaciones-page-icon">trending_up</span>
        <h2 className="perfil-alumno-title">Estado Académico</h2>
      </div>

      {/* 2. Header con nombre y curso */}
      <DivHeaderInfo reporte={reporte} variant="text" />

      {/* 4. Grilla de tarjetas de estado */}
      <div className="estado-academico-page__card-grid">
        {materias.map(([nombre, data]) => (
          <EstadoAcademicoCard
            key={nombre}
            materiaNombre={nombre}
            data={data}
          />
        ))}
      </div>
    </div>
  );
};

export default EstadoAcademicoPage;