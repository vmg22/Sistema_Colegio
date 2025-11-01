import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore.js";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import ReporteCursoTable from "../../components/curso/ReporteCursoTable.jsx";
import EncabezadoCurso from "../../components/curso/EncabezadoCurso.jsx";
import "../../styles/cursoDashboard.css"; 

const ReporteCursoListPage = () => {
  const { reporteCurso } = useConsultaStore();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let dataToSet = null;

    if (reporteCurso) {
      dataToSet = reporteCurso;
    } else {
      const storedData = sessionStorage.getItem("reporteCurso");
      if (storedData) {
        try {
          dataToSet = JSON.parse(storedData);
        } catch (error) {
          console.error("Error parsing sessionStorage data:", error);
          dataToSet = null;
        }
      }
    }

    setReporte(dataToSet);
    setLoading(false);
  }, [reporteCurso]);

  const { alumnos, totalAlumnos } = useMemo(() => {
    if (!reporte?.alumnos) {
      return { alumnos: [], totalAlumnos: 0 };
    }
    return {
      alumnos: reporte.alumnos ?? [],
      totalAlumnos: reporte.totalAlumnos ?? 0,
    };
  }, [reporte]);

  if (loading) {
    return (
      <div className="curso-loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando reporte de curso...</p>
      </div>
    );
  }

  if (!reporte || !Array.isArray(alumnos) || alumnos.length === 0) {
    return (
      <div className="curso-loading-container">
        <h5>No se encontraron datos para este curso.</h5>
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
      <BtnVolver />
      <div className="curso-dashboard-header">
        <span className="material-symbols-outlined curso-dashboard-icon">list_alt</span>
        <h2 className="curso-dashboard-title">Listado de Alumnos ({totalAlumnos} Alumnos</h2>
      </div>
      <EncabezadoCurso />
      <ReporteCursoTable alumnos={alumnos} />
    </div>
  );
};

export default ReporteCursoListPage;