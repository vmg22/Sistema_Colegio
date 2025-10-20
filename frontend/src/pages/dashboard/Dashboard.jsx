import React from "react";
import { useState } from "react";
import "../../styles/dashboard.css";


const Dashboard = () => {
  const [tipoConsulta, setConsulta] = useState("alumno");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [validated, setValidated] = useState(false);



  return (
    <div className="nombre_vista">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "20px",
          gap: "10px",
        }}
      >
        <span
          class="material-symbols-outlined search"
          style={{ marginRight: "15px" }}
        >
          search
        </span>
        <h4>Consulta Academica</h4>
      </div>

      <hr className="linea-separadora" />

      <div className="contenedor-botones-dash">
        <button
          className={`btn-tipo ${tipoConsulta === "alumno" ? "activo" : ""}`}
          onClick={() => setConsulta("alumno")}
        >
          <div className="icono-contenedor">
            <span className="material-symbols-outlined person">person</span>
          </div>
          <span className="btn-texto">Consulta por Alumno</span>
        </button>

        <button
          className={`btn-tipo ${tipoConsulta === "curso" ? "activo" : ""}`}
          onClick={() => setConsulta("curso")}
        >
          <div className="icono-contenedor-group">
            <span className="material-symbols-outlined group">group</span>
          </div>
          <span className="btn-texto">Consulta por Curso</span>
        </button>
      </div>

      <div className="contenedor-busqueda">
        <h5>Buscar {tipoConsulta}</h5>
        <hr className="linea-separadora" />

        
      </div>
    </div>
  );
};
export default Dashboard;
