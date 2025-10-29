import React from "react";

// Estilos para la variante 'card' (usada en PerfilAlumno)
const cardStyles = {
  container: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    border: "1px solid #3f51b5", // Borde azul primario
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
    flexShrink: 0,
  },
  icon: {
    fontSize: "36px",
  },
  name: {
    fontSize: "1.875rem", // 30px
    fontWeight: 600,
    color: "#333",
    margin: 0,
  },
};

// Estilos para la variante 'text' (usada en AsistenciasPage)
const textStyles = {
  container: {
    textAlign: "center",
    padding: "10px 0 30px 0",
    color: "#333",
  },
  name: {
    fontSize: "1.875rem", // 30px
    fontWeight: 600,
    margin: 0,
  },
  course: {
    fontSize: "1.25rem", // 20px
    fontWeight: 500,
    color: "#555",
    margin: 0,
    marginTop: "4px",
  },
};

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
      <div style={cardStyles.container}>
        <div style={cardStyles.iconCircle}>
          <span className="material-symbols-outlined" style={cardStyles.icon}>
            person
          </span>
        </div>
        <h3 style={cardStyles.name}>
          {nombre} {apellido}
        </h3>
      </div>
    );
  }

  // Renderiza la variante 'TEXT'
  return (
    <div style={textStyles.container}>
      <h2 style={textStyles.name}>
        {nombre} {apellido}
      </h2>
      {curso && (
        <h3 style={textStyles.course}>
          {curso.nombre || `${curso.anio_curso} ${curso.division}`}
        </h3>
      )}
    </div>
  );
};

export default EncabezadoEstudiante;
