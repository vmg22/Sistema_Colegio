import React from "react";
// Importamos 'useNavigate' en lugar de 'Link'
import { useNavigate } from "react-router-dom";

// Quitamos 'rutaVolver' de los props, ya no la necesitamos
const BtnVolver = ({ mostrarAgregar = false }) => {
  // Obtenemos la función de navegación
  const navigate = useNavigate();

  // Esta función nos llevará un paso atrás en el historial
  const handleVolver = () => {
    navigate(-1); // -1 significa "ir a la página anterior"
  };

  return (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{ paddingBottom: "20px " }}
    >
      {/* Quitamos el componente <Link> y usamos un <button> normal 
        con un evento onClick
      */}
      <button
        onClick={handleVolver} // Añadimos el onClick
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

