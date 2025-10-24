import React from "react";
import "../../styles/headerpages.css";

const HeaderPages = ({ icono, titulo }) => {
  return (
    <>
      
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "20px",
          gap: "10px",
        }}
      >
        <span
          className="material-symbols-outlined search"
          style={{ marginRight: "15px" }}
        >
          {icono}
        </span>
        {/* Aquí usamos la prop "titulo" para el H3 */}
        <h4 className="tituloHeader">{titulo}</h4>
        
      </div>
    </>
  );
};

export default HeaderPages;
