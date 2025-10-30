import React from "react";
import "../../styles/headerpages.css";

const HeaderPages = ({ icono, titulo }) => {
  return (
    <>
      
      



      <div className="curso-dashboard-header">
        <span className="material-symbols-outlined curso-dashboard-icon">
          {icono} 
        </span>
        <h2 className="curso-dashboard-title">{titulo}</h2>
      </div>
    </>
  );
};

export default HeaderPages;
