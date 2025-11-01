import React from "react";
import "../../styles/encabezadoEstudiante.css";

/**
 * Componente reutilizable para mostrar la info del estudiante.
 * @param {{
 * reporte: Object,
 * variant: 'card' | 'text'
 * }} props
 */
const EncabezadoEstudiante = ({ reporte, variant = "card" }) => {
  if (!reporte) {
    return null; // No mostrar nada si no hay datos
  }

  const { nombre, apellido, curso } = reporte;

  // Renderiza la variante 'CARD'
  if (variant === "card") {
    return (
      <div className="encabezado-estudiante-card">
        <div className="encabezado-estudiante__icon-circle">
          <span className="material-symbols-outlined encabezado-estudiante__icon">
            person
          </span>
        </div>
        <h3 className="encabezado-estudiante__name encabezado-estudiante__name--card">
          {nombre} {apellido}
        </h3>
      </div>
    );
  }

  // Renderiza la variante 'TEXT'
  return (
    <div className="encabezado-estudiante-text">
      <h2 className="encabezado-estudiante__name encabezado-estudiante__name--text">
        {nombre} {apellido}
      </h2>
      {curso && (
        <h3 className="encabezado-estudiante__course">
          {curso.nombre || `${curso.anio_curso} ${curso.division}`}
        </h3>
      )}
    </div>
  );
};

export default EncabezadoEstudiante;