import React from "react";
import { Link } from "react-router-dom";

const BtnVolver = ({rutaVolver, mostrarAgregar = false}) => {
  return (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{ padding: "20px " }}
    >
      <Link to={rutaVolver} style={{ textDecoration: "none" }}>
        <button
          className="d-flex align-items-center gap-2"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#303F9F",
            fontWeight: "500",
            padding: "8px 16px",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "20px" }}
          >
            arrow_back
          </span>
          VOLVER
        </button>
      </Link>

{mostrarAgregar && (
<button
        className=" btn btn-success d-flex align-items-center gap-2 px-4 py-2"
        style={{
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        <i className="fas fa-plus"></i>
        <span>Agregar</span>
      </button>
)}
      
    </div>
  );
};

export default BtnVolver;
