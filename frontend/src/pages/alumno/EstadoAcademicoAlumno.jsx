import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import DivHeaderInfo from "../../components/alumno/DivHeaderInfo.jsx";
import EstadoAcademicoCard from "../../components/ui/EstadoAcademicoCard.jsx"; // Nuevo componente

// Estilos
const styles = {
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
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "25px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  loadingContainer: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "'Inter', sans-serif",
  },
};

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
      <div style={styles.loadingContainer}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando estado académico...</p>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div style={styles.loadingContainer}>
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
    <div style={styles.pageContainer}>
      {/* 1. Botón Volver */}
      <BtnVolver />

      {/* 2. Header con nombre y curso */}
      <DivHeaderInfo reporte={reporte} variant="text" />

      {/* 3. Título de la página */}
      <h2 style={styles.pageTitle}>
        <span className="material-symbols-outlined">trending_up</span>
        Estado Académico
      </h2>

      {/* 4. Grilla de tarjetas de estado */}
      <div style={styles.cardGrid}>
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
