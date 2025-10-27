import React from "react";
import { Link } from "react-router-dom";

// Estilos actualizados con la nueva paleta y tipografía
const styles = {
    card: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)", // Sombra suave por defecto
    textDecoration: "none",
    color: "#333",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    textAlign: "center",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
    minHeight: "170px",
    fontFamily: "'Inter', sans-serif",
    border: "1px solid #3f51b5", // Borde Azul (Primary)",
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.4)", // ¡CORREGIDO! Eliminamos la sombra negra en hover
    borderColor: "#3f51b5",
    border: "2px solid #3f51b5" // Mantenemos solo el Borde Azul (Primary) en hover
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
    fontSize: "32px",
  },
  title: {
    fontSize: "1rem", // 16px (Body Text)
    fontWeight: 500, // Un poco más de peso que el body text normal
    margin: 0,
  },
};

const AccionCard = ({ titulo, icono, to }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link
      to={to}
      style={{ ...styles.card, ...(isHovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.iconCircle}>
        <span className="material-symbols-outlined" style={styles.icon}>
          {icono}
        </span>
      </div>
      <h5 style={styles.title}>{titulo}</h5>
    </Link>
  );
};

export default AccionCard;