import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore.js";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import ReporteCursoTable from "../../components/curso/ReporteCursoTable.jsx";
import EncabezadoCurso from "../../components/curso/EncabezadoCurso.jsx";

const styles = {
  pageContainer: {
    padding: "0 40px 40px 40px",
    backgroundColor: "#f4f7fa",
    minHeight: "calc(100vh - 80px)",
    fontFamily: "'Inter', sans-serif",
  },
  pageTitle: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#303F9F",
    margin: "20px 0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  loadingContainer: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "'Inter', sans-serif",
  },
};

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
      <div style={styles.loadingContainer}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando reporte de curso...</p>
      </div>
    );
  }

  if (!reporte || !Array.isArray(alumnos) || alumnos.length === 0) {
    return (
      <div style={styles.loadingContainer}>
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
    <div style={styles.pageContainer}>
      <BtnVolver />
      <EncabezadoCurso />
      <h2 style={styles.pageTitle}>
        <span className="material-symbols-outlined">list_alt</span>
        Listado de Alumnos ({totalAlumnos} Alumnos)
      </h2>
      <ReporteCursoTable alumnos={alumnos} />
    </div>
  );
};

export default ReporteCursoListPage;
