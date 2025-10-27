import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import AccionCard from "../../components/ui/AccionCard.jsx";

// Estilos actualizados con la nueva paleta y tipografía
const styles = {
  pageContainer: {
    padding: "0 40px 40px 40px",
    backgroundColor: "#f4f7fa",
    minHeight: "calc(100vh - 80px)",
    fontFamily: "'Inter', sans-serif", // Aplicar fuente Inter
    
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "20px 0",
    color: "#303F9F", // Primary Dark
  },
  title: {
    fontSize: "1.5rem", // 24px (Heading 4)
    fontWeight: 600, // Coincide con Heading 2/3 (usamos 600 para más jerarquía)
    margin: 0,
  },
  studentCard: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    border: "1px solid #3f51b5",
    
  },
  studentIconCircle: {
    height: "60px",
    width: "60px",
    borderRadius: "50%",
    backgroundColor: "#c5cae9", // Primary Light
    color: "#303F9F", // Primary Dark
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  studentIcon: {
    fontSize: "36px",
  },
  studentName: {
    fontSize: "1.875rem", // 30px (Heading 3)
    fontWeight: 600, // Heading 3
    color: "#333",
    margin: 0,
  },
  actionsTitle: {
    fontSize: "1.25rem", // 20px (Subheading)
    fontWeight: 500, // Subheading
    color: "#444",
    marginBottom: "20px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // Forzar 3 columnas
    gap: "25px",
    maxWidth: "1000px", // Ancho máximo para el grid
    margin: "0 auto", // Centrar el grid si es más angosto que el contenedor
  },
  loadingContainer: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "'Inter', sans-serif",
  },
};

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
      <div style={styles.loadingContainer}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando reporte...</p>
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
      {/* 1. Botón Volver y Título */}
      <BtnVolver rutaVolver={"/"} />
      <div style={styles.header}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "28px" }}
        >
          badge
        </span>
        <h2 style={styles.title}>Perfil de Alumno</h2>
      </div>

      {/* 2. Card de Información del Alumno */}
      <div style={styles.studentCard}>
        <div style={styles.studentIconCircle}>
          <span className="material-symbols-outlined" style={styles.studentIcon}>
            person
          </span>
        </div>
        <h3 style={styles.studentName}>
          {reporte.nombre} {reporte.apellido}
        </h3>
      </div>

      {/* 3. Acciones Disponibles */}
      <h4 style={styles.actionsTitle}>Acciones Disponibles</h4>
      <div style={styles.cardGrid}>
        <AccionCard
          titulo="Info alumno"
          icono="account_circle"
          to="/consulta" // Debes crear esta ruta
        />
        <AccionCard
          titulo="Ver Asistencias"
          icono="task_alt"
          to="/perfil-alumno/asistencias" // Debes crear esta ruta
        />
        <AccionCard
          titulo="Estado Academico"
          icono="trending_up"
          to="/perfil-alumno/estado-academico" // Debes crear esta ruta
        />
        <AccionCard
          titulo="Historial de Comunicaciones"
          icono="chat"
          to="/perfil-alumno/comunicaciones" // Debes crear esta ruta
        />
        <AccionCard
          titulo="Certificados y actas"
          icono="description"
          to="/perfil-alumno/certificados" // Debes crear esta ruta
        />
        <AccionCard
          titulo="Generar Mail"
          icono="mail"
          to="/perfil-alumno/generar-mail" // Debes crear esta ruta
        />
      </div>
    </div>
  );
};

export default PerfilAlumno;