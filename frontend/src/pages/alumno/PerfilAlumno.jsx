import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore";
// Corregidas las rutas de importación y el nombre del componente
import BtnVolver from "../../components/ui/BtnVolver.jsx"; 
import AccionCard from "../../components/ui/AccionCard.jsx";

import EncabezadoEstudiante from "../../components/ui/EncabezadoEstudiante.jsx";

// Estilos actualizados
const styles = {
  pageContainer: {
    padding: "0 40px 40px 40px",
    backgroundColor: "#f4f7fa",
    minHeight: "calc(100vh - 80px)",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "20px 0",
    color: "#303F9F",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
    margin: 0,
  },
  // Eliminamos los estilos 'studentCard', 'studentIconCircle', 'studentIcon', 'studentName'
  // porque ahora están dentro de StudentHeader.jsx
  actionsTitle: {
    fontSize: "1.25rem",
    fontWeight: 500,
    color: "#444",
    marginBottom: "20px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "25px",
    maxWidth: "1000px",
    margin: "0 auto",
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
      {/* 1. Botón Volver (sin prop 'rutaVolver') */}
      <BtnVolver />
      <div style={styles.header}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "28px" }}
        >
          badge
        </span>
        <h2 style={styles.title}>Perfil de Alumno</h2>
      </div>

      {/* 2. Card de Información (usando el nuevo componente) */}
      <EncabezadoEstudiante reporte={reporte} variant="card" />

      {/* 3. Acciones Disponibles (corregidas las rutas 'to') */}
      <h4 style={styles.actionsTitle}>Acciones Disponibles</h4>
      <div style={styles.cardGrid}>
        <AccionCard
          titulo="Info alumno"
          icono="account_circle"
          to="/consulta" 
        />
        <AccionCard
          titulo="Ver Asistencias"
          icono="task_alt"
          to="/asistenciasAlumno" // Esta es la ruta que creamos
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

