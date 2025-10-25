import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/LinkCrud.css";

const CardNavegacion = ({cardData = []}) => {

    const [hoveredIndex, setHoveredIndex] = useState(null);

  // Si no hay datos, no renderizar nada
  if (!cardData || cardData.length === 0) {
    return null;
  }

  return (

         <div className="grid-container">
      {cardData.map((card, index) => (
        <Link
          key={card.to || index}
          to={card.to}
          className={`card-base ${hoveredIndex === index ? 'card-hover' : ''}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="card-icon-container">
            <span
              className="material-icons card-icon"
              style={{ color: card.color || "#2563EB" }}
            >
              {card.icon}
            </span>
          </div>

          <span className="card-label">
            {card.label}
          </span>
        </Link>
      ))}
    </div>

  )
}

export default CardNavegacion