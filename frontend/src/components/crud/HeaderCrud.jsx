import React from "react";

const HeaderCrud = () => {
  return (
    <div style={{ backgroundColor: "white", padding: "6px" }}>
      <div
        style={{
          marginLeft: "20px",
          gap: "10px",
        }}
      >
        <div className="d-flex align-items-center">
          <span
            className="material-symbols-outlined search"
            style={{ marginRight: "15px" }}
          >
            search
          </span>
          <h4 style={{ margin: 0 }}>Gestión Académica</h4>
        </div>
        
        <p style={{ 
          color: "#64748B", 
          margin: 0, 
          marginLeft: "40px", 
          marginTop: "4px" 
        }}>
          Administración de Alumnos, Docentes y Materias
        </p>
      </div>
    </div>
  );
};

export default HeaderCrud;