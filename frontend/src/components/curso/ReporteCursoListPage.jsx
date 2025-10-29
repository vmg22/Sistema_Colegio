import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore.js";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
// Corregida la ruta para que apunte a la carpeta 'components'
import ReporteCursoTable from "../../components/curso/ReporteCursoTable.jsx"; 
import EncabezadoCurso from "../../components/curso/EncabezadoCurso.jsx";

// Estilos
const styles = {
// ... (estilos existentes)
  pageContainer: {
    padding: "0 40px 40px 40px",
    backgroundColor: "#f4f7fa",
    minHeight: "calc(100vh - 80px)",
    fontFamily: "'Inter', sans-serif",
  },
  pageTitle: {
    fontSize: "1.5rem", // 24px
    fontWeight: 600,
    color: "#303F9F", // Primary Dark
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
// ... (código existente)
  const { reporteCurso } = useConsultaStore(); // Obtenemos el reporte de curso
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
// ... (código existente)
    let dataToSet = null;
    if (reporteCurso) {
      dataToSet = reporteCurso;
    } else {
      const storedData = sessionStorage.getItem("reporteCurso");
      if (storedData) {
        dataToSet = JSON.parse(storedData);
      }
    }
    setReporte(dataToSet);
    setLoading(false);
  }, [reporteCurso]);

  // Usamos useMemo para extraer los datos de forma segura
  const { alumnos, totalAlumnos } = useMemo(() => {
    // ¡CORRECCIÓN! El objeto 'reporte' es el que tiene los datos, no 'reporte.data'
    if (!reporte) {
      return { alumnos: [], totalAlumnos: 0 };
    }
    
    return {
        alumnos: reporte.alumnos || [],
        totalAlumnos: reporte.totalAlumnos || 0
    };
  }, [reporte]);

  if (loading) {
// ... (código existente)
    return (
      <div style={styles.loadingContainer}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando reporte de curso...</p>
      </div>
    );
  }

  if (!reporte || !alumnos || alumnos.length === 0) {
// ... (código existente)
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

      {/* 1. Botón Volver */}
      <BtnVolver />
       <EncabezadoCurso />

      {/* 2. Título */}
      <h2 style={styles.pageTitle}>
        <span className="material-symbols-outlined">list_alt</span>
        Listado de Alumnos ({totalAlumnos} Alumnos)
      </h2>

      {/* 3. Tabla de Alumnos */}
      <ReporteCursoTable alumnos={alumnos} />
    </div>
  );
};

export default ReporteCursoListPage;

