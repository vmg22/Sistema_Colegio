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
        <div className="curso-dashboard-header">
        <span
          className="material-symbols-outlined search"
        >
          {icono} 
        </span>
        <h2 className="curso-dashboard-title">{titulo}</h2>
      </div>
        
      </div>
    </>
  );
};

export default HeaderPages;
