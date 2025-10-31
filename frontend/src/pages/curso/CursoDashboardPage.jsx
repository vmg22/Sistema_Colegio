import React from "react";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import AccionCard from "../../components/ui/AccionCard.jsx";
import EncabezadoCurso from "../../components/curso/EncabezadoCurso.jsx";
import "../../styles/cursoDashboard.css"; // Importamos el archivo CSS

const CursoDashboardPage = () => {
  return (
    <div className="curso-dashboard-container">
      {/* 1. Botón Volver y Título */}
      <BtnVolver />
      <div className="curso-dashboard-header">
        <span className="material-symbols-outlined curso-dashboard-icon">
          group
        </span>
        <h2 className="curso-dashboard-title">Perfil del Curso</h2>
      </div>

      {/* 2. Encabezado del Curso */}
      <EncabezadoCurso />

      {/* 3. Acciones Disponibles */}
      <h4 className="curso-actions-title">Acciones Disponibles</h4>
      <div className="curso-card-grid">
        <AccionCard
          titulo="Ver Listado de Alumnos"
          icono="list_alt"
          to="/reporte-curso/listado"
        />
        <AccionCard
          titulo="Resumen de Calificaciones"
          icono="bar_chart"
          to="/reporte-curso/calificaciones"
        />
        <AccionCard
          titulo="Resumen de Asistencias"
          icono="task_alt"
          to="/reporte-curso/Asistencias"
        />
        <AccionCard
          titulo="Carga de Calificaciones"
          icono="sticky_note_2"
          to="/reporte-curso/carga-calificaciones"
        />
        <AccionCard
          titulo="Carga de Asistencia"
          icono="event_available"
          to="/reporte-curso/carga-calificaciones"
        />
        <AccionCard
          titulo="Comunicación Grupal"
          icono="mail"
          to="/reporte-curso/comunicacion"
        />
      </div>
    </div>
  );
};

export default CursoDashboardPage;