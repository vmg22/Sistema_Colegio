import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/LinkCrud.css';
import BtnVolver from '../ui/BtnVolver';


/**
 * Datos para las tarjetas de navegación.
 */
const cardData = [
  {
    to: "/alumnos",
    label: "Alumnos",
    icon: "group", // Ícono de Google para Alumnos
    color: "#2563EB", // azul-600
  },
  {
    to: "/docentes",
    label: "Docentes",
    icon: "work", // Ícono de Google para Docentes
    color: "#2563EB", // verde-600
  },
  {
    to: "/materias",
    label: "Materias",
    icon: "menu_book", // Ícono de Google para Materias
    color: "#2563EB", // indigo-600
  },
  {
    to: "/plan-de-equivalencias",
    label: "Plan de Equivalencias",
    icon: "description", // Ícono de Google para Plan de Equivalencias
    color: "#2563EB", // rojo-600
  },
];

/**
 * Componente LinkCrud rediseñado con CSS separado
 */
const LinkCrud = ({ showBackButton = false }) => {
  // Estado para manejar el efecto hover de cada tarjeta
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="link-crud-container">
      <div className="grid-container">
        {cardData.map((card, index) => (
          <Link
            key={card.to}
            to={card.to}
            className={`card-base ${hoveredIndex === index ? 'card-hover' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Contenedor del Ícono */}
            <div className="card-icon-container">
              {/* Google Material Icon */}
              <span
                className="material-icons card-icon"
                style={{ color: card.color }}
              >
                {card.icon}
              </span>
            </div>

            {/* Etiqueta de la tarjeta */}
            <span className="card-label">
              {card.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Separador y botón de volver */}
      <hr className="separator" />

      {showBackButton && (
        <BtnVolver rutaVolver={"/crud"} />
      )}
    </div>
  );
};

export default LinkCrud;