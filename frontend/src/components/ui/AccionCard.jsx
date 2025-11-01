import React from "react";
import { Link } from "react-router-dom";
import "../../styles/accionCard.css";

const AccionCard = ({ titulo, icono, to }) => {
  return (
    <Link
      to={to}
      className="accion-card"
    >
      <div className="accion-card__icon-circle">
        <span className="material-symbols-outlined accion-card__icon">
          {icono}
        </span>
      </div>
      <h5 className="accion-card__title">{titulo}</h5>
    </Link>
  );
};

export default AccionCard;