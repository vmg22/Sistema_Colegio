import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LineaSeparadora from "../ui/LineaSeparadora";
import { useConsultaStore } from "../../store/consultaStore";
import { Button, Spinner } from "react-bootstrap";

const DivBodyInfo = () => {
  const { reporteAlumno } = useConsultaStore();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let dataToSet = null;

    if (reporteAlumno) {
      dataToSet = reporteAlumno;
    } else {
      const storedData = sessionStorage.getItem("reporteAlumno");
      if (storedData) {
        dataToSet = JSON.parse(storedData);
      }
    }

    setReporte(dataToSet);
    setLoading(false);
  }, [reporteAlumno]);

  // --- Estados de Carga y Error ---
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando reporte...</p>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="text-center mt-5">
        <h5>No se encontraron datos del alumno.</h5>
        <p>Vuelve al panel e intenta realizar una nueva búsqueda.</p>
        <Link to={"/"}>
          <Button variant="secondary" className="px-4">
            Volver
          </Button>
        </Link>
      </div>
    );
  }

  // --- Datos y Lógica ---
  const { materias, tutores } = reporte;

  // Helper para formatear fechas y evitar errores
  const formatDate = (dateString) => {
    if (!dateString) {
      return "Fecha no disponible";
    }
    return new Date(dateString).toLocaleDateString();
  };
  
  const showData = (data) => {
    return data || "No disponible";
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "24px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    flex: 1, 
    minWidth: "300px",
  };

  const infoRowStyle = {
    marginBottom: "16px",
  };

  const labelStyle = {
    margin: 0,
    fontSize: "0.85rem",
    color: "#666",     
    textTransform: "uppercase", 
  };

  const valueStyle = {
    margin: 0,
    fontSize: "1rem",  
    fontWeight: "500", 
    color: "#111",
  };


  return (
    <div
      className="d-flex flex-wrap justify-content-center mt-4"
      style={{ gap: "30px" }} 
    >

      <div style={cardStyle}>
        <h4 style={{textAlign:"center"}}>Informacion del Alumno</h4>
        <LineaSeparadora />
        
        <div style={{ marginTop: '20px' }}>
          <div style={infoRowStyle}>
            <p style={labelStyle}>Nombre y Apellido</p>
            <p style={valueStyle}>{reporte.nombre} {reporte.apellido}</p>
          </div>
          <div style={infoRowStyle}>
            <p style={labelStyle}>DNI</p>
            <p style={valueStyle}>{showData(reporte.dni)}</p>
          </div>
          <div style={infoRowStyle}>
            <p style={labelStyle}>Fecha de Nacimiento</p>
            <p style={valueStyle}>{formatDate(reporte.fecha_nacimiento)}</p>
          </div>
          <div style={infoRowStyle}>
            <p style={labelStyle}>Lugar de Nacimiento</p>
            <p style={valueStyle}>{showData(reporte.lugar_nacimiento)}</p>
          </div>
          <div style={infoRowStyle}>
            <p style={labelStyle}>Teléfono</p>
            <p style={valueStyle}>{showData(reporte.telefono)}</p>
          </div>
          <div style={infoRowStyle}>
            <p style={labelStyle}>Email</p>
            <p style={valueStyle}>{showData(reporte.email)}</p>
          </div>
          <div style={infoRowStyle}>
            <p style={labelStyle}>Fecha de Inscripción</p>
            <p style={valueStyle}>{formatDate(reporte.fecha_inscripcion)}</p> 
          </div>
          <div style={infoRowStyle}>
            <p style={labelStyle}>Estado</p>
            <p style={valueStyle}>{showData(reporte.estado)}</p>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h4 style={{textAlign:"center"}}>Informacion del Tutor</h4>
        <LineaSeparadora />
        
        <div style={{ marginTop: '20px' }}>
          {tutores && tutores.length > 0 ? (
            <>
              <div style={infoRowStyle}>
                <p style={labelStyle}>Nombre y Apellido</p>
                <p style={valueStyle}>{tutores[0].nombre} {tutores[0].apellido}</p>
              </div>
              <div style={infoRowStyle}>
                <p style={labelStyle}>DNI</p>
                <p style={valueStyle}>{showData(tutores[0].dni_tutor)}</p>
              </div>
              <div style={infoRowStyle}>
                <p style={labelStyle}>Dirección</p>
                <p style={valueStyle}>{showData(tutores[0].direccion)}</p>
              </div>
              <div style={infoRowStyle}>
                <p style={labelStyle}>Teléfono</p>
                <p style={valueStyle}>{showData(tutores[0].telefono)}</p>
              </div>
              <div style={infoRowStyle}>
                <p style={labelStyle}>Email</p>
                <p style={valueStyle}>{showData(tutores[0].email)}</p>
              </div>
              <div style={infoRowStyle}>
                <p style={labelStyle}>Parentesco</p>
                <p style={valueStyle}>{showData(tutores[0].parentesco)}</p>
              </div>
            </>
          ) : (
            <p>No hay información de tutor disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DivBodyInfo;