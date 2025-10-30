import React, { useState, useEffect } from "react";
import { useConsultaStore } from "../../store/consultaStore";
import { Spinner } from "react-bootstrap";

// Estilos
const styles = {
  headerCard: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    border: "1px solid #3f51b5",
  },
  iconCircle: {
    height: "60px",
    width: "60px",
    borderRadius: "50%",
    backgroundColor: "#c5cae9", // Primary Light
    color: "#303F9F", // Primary Dark
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: "36px",
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: "1.875rem", // 30px
    fontWeight: 600,
    color: "#333",
    margin: 0,
  },
  subtitle: {
    fontSize: "1.1rem", // 18px
    fontWeight: 500,
    color: "#555",
    margin: 0,
  },
  statsContainer: {
    textAlign: "right",
  },
  totalAlumnos: {
    fontSize: "1.25rem", // 20px
    fontWeight: 600,
    color: "#303F9F",
    margin: 0,
  },
  totalLabel: {
    fontSize: "0.9rem",
    color: "#777",
    margin: 0,
  },
};

const EncabezadoCurso = () => {
  // Obtenemos todo de Zustand
  const {
    reporteCurso,
    selectedCursoNombre,
    selectedMateriaNombre,
    selectedPeriodoNombre,
    selectedAnioNombre,
  } = useConsultaStore();

  const [nombres, setNombres] = useState({
    curso: "",
    materia: "",
    periodo: "",
    anio: "",
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para cargar datos desde Zustand o SessionStorage
    const loadData = () => {
      const reporte = reporteCurso || JSON.parse(sessionStorage.getItem("reporteCurso"));
      const curso = selectedCursoNombre || sessionStorage.getItem("selectedCursoNombre");
      const materia = selectedMateriaNombre || sessionStorage.getItem("selectedMateriaNombre");
      const periodo = selectedPeriodoNombre || sessionStorage.getItem("selectedPeriodoNombre");
      const anio = selectedAnioNombre || sessionStorage.getItem("selectedAnioNombre");

      setNombres({
        curso: curso || "",
        materia: materia || "",
        periodo: periodo || "",
        anio: anio || "",
        total: reporte.totalAlumnos || 0,
      });
      setLoading(false);
    };

    loadData();
  }, [
    reporteCurso,
    selectedCursoNombre,
    selectedMateriaNombre,
    selectedPeriodoNombre,
    selectedAnioNombre,
  ]);

  if (loading) {
    return (
      <div style={styles.headerCard}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div style={styles.headerCard}>
      {/* Icono */}
      <div style={styles.iconCircle}>
        <span className="material-symbols-outlined" style={styles.icon}>
          school
        </span>
      </div>

      {/* Info Principal */}
      <div style={styles.infoContainer}>
        <h2 style={styles.title}>
          {nombres.materia} - {nombres.curso}
        </h2>
        <p style={styles.subtitle}>
          {nombres.anio} | {nombres.periodo}
        </p>
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <h3 style={styles.totalAlumnos}>{nombres.total}</h3>
        <p style={styles.totalLabel}>Alumnos</p>
      </div>
    </div>
  );
};

export default EncabezadoCurso;

