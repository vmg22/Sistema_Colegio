import React from "react";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import AccionCard from "../../components/ui/AccionCard.jsx"; // Reutilizamos AccionCard de alumno ui para evitar mas modulos
import EncabezadoCurso from "../../components/curso/EncabezadoCurso.jsx"; // Nuevo componente EncabezadoCurso solo para los cursos


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
  actionsTitle: {
    fontSize: "1.25rem",
    fontWeight: 500,
    color: "#444",
    marginBottom: "20px",
    marginTop: "10px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", // 3 columnas
    gap: "25px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
};

const CursoDashboardPage = () => {
  return (
    <div style={styles.pageContainer}>
      {/* 1. Botón Volver y Título */}
      <BtnVolver />
      <div style={styles.header}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "28px" }}
        >
          group
        </span>
        <h2 style={styles.title}>Perfil del Curso</h2>
      </div>

      {/* 2. Encabezado del Curso (NUEVO) */}
      <EncabezadoCurso />

      {/* 3. Acciones Disponibles */}
      <h4 style={styles.actionsTitle}>Acciones Disponibles</h4>
      <div style={styles.cardGrid}>
        <AccionCard
          titulo="Ver Listado de Alumnos"
          icono="list_alt"
          to="/reporte-curso/listado" // Nueva ruta para la tabla
        />
        <AccionCard
          titulo="Resumen de Calificaciones"
          icono="bar_chart"
          to="/reporte-curso/calificaciones" // TODO: Crear esta ruta
        />
        <AccionCard
          titulo="Resumen de Asistencias"
          icono="task_alt"
          to="/reporte-curso/Asistecias" // TODO: Crear esta ruta
        />
        <AccionCard
          titulo="Comunicación Grupal"
          icono="mail"
          to="/reporte-curso/comunicacion" // TODO: Crear esta ruta
        />
      </div>
    </div>
  );
};

export default CursoDashboardPage;

