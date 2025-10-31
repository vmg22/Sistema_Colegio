import React from "react"; // Ya no necesitas useState ni useEffect
import { useConsultaStore } from "../../store/consultaStore";
import { Spinner } from "react-bootstrap";
import "../../styles/encabezadoCurso.css";

const EncabezadoCurso = () => {
  // Obtenemos todo de Zustand.
  // Gracias a 'persist', estos datos ya vienen cargados desde sessionStorage.
  const {
    reporteCurso,
    selectedCursoNombre,
    selectedMateriaNombre,
    selectedPeriodoNombre,
    selectedAnioNombre,
  } = useConsultaStore();

  // Si los datos aún no están (ej. primera carga), se muestra un spinner.
  if (!selectedCursoNombre || !selectedMateriaNombre) {
    return (
      <div className="encabezado-curso-card">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const totalAlumnos = reporteCurso?.totalAlumnos || 0;

  return (
    <div className="encabezado-curso-card">
      {/* Icono */}
      <div className="encabezado-icon-circle">
        <span className="material-symbols-outlined encabezado-icon">
          school
        </span>
      </div>

      {/* Info Principal */}
      <div className="encabezado-info-container">
        <h2 className="encabezado-title">
          {selectedMateriaNombre} - {selectedCursoNombre}
        </h2>
        <p className="encabezado-subtitle">
          {selectedAnioNombre} | {selectedPeriodoNombre}
        </p>
      </div>

      {/* Stats */}
      <div className="encabezado-stats-container">
        <h3 className="encabezado-total-alumnos">{totalAlumnos}</h3>
        <p className="encabezado-total-label">Alumnos</p>
      </div>
    </div>
  );
};

export default EncabezadoCurso;
