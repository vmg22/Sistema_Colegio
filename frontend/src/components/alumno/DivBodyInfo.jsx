import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { Copy } from "lucide-react"; // 📋 Ícono npm install lucide-react
import LineaSeparadora from "../ui/LineaSeparadora";
import { useConsultaStore } from "../../store/consultaStore";

const styles = {
  mainContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: "20px 40px 40px 40px",
    gap: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  cardInfo: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #ddd",
    flex: 1,
    minWidth: "400px",
  },
  cardInfoHeader: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#303F9F",
  },
  infoContainer: {
    marginTop: "20px",
  },
  cardInfoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  cardInfoLabel: {
    fontWeight: 500,
    color: "#555",
    margin: 0,
  },
  cardInfoValue: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#333",
    margin: 0,
    textAlign: "right",
  },
  copyIcon: {
    cursor: "pointer",
    color: "#666",
    transition: "color 0.2s",
  },
  noDataText: {
    color: "#777",
    fontStyle: "italic",
    padding: "10px 0",
  },
  centeredContainer: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "'Inter', sans-serif",
  },
};

const DivBodyInfo = () => {
  const { reporteAlumno } = useConsultaStore();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    let data = reporteAlumno || JSON.parse(sessionStorage.getItem("reporteAlumno"));
    setReporte(data);
    setLoading(false);
  }, [reporteAlumno]);

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "Fecha no disponible";

  const showData = (data) => data || "No disponible";

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      console.error("Error al copiar texto");
    }
  };

  if (loading) {
    return (
      <div style={styles.centeredContainer}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando reporte...</p>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div style={styles.centeredContainer}>
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

  const { tutores } = reporte;

  const formatDate = (dateString) => {
    if (!dateString) {
      return "Fecha no disponible";
    }
    return new Date(dateString).toLocaleDateString();
  };
  
  const showData = (data) => {
    return data || "No disponible";
  };

  return (
    <>
      <div
        className="d-flex flex-wrap justify-content-center mt-4"
        style={{ gap: "30px" }} 
      >
        <div className="card-info">
          <h4 className="card-info-header">Informacion del Alumno</h4>
          <LineaSeparadora />
          
          <div style={{ marginTop: '20px' }}>
            <div className="card-info-row">
              <p className="card-info-label">Nombre y Apellido</p>
              <p className="card-info-value">{reporte.nombre} {reporte.apellido}</p>
            </div>
            <div className="card-info-row">
              <p className="card-info-label">DNI</p>
              <p className="card-info-value">{showData(reporte.dni)}</p>
            </div>
            <div className="card-info-row">
              <p className="card-info-label">Fecha de Nacimiento</p>
              <p className="card-info-value">{formatDate(reporte.fecha_nacimiento)}</p>
            </div>
            <div className="card-info-row">
              <p className="card-info-label">Lugar de Nacimiento</p>
              <p className="card-info-value">{showData(reporte.lugar_nacimiento)}</p>
            </div>
            <div className="card-info-row">
              <p className="card-info-label">Dirección</p>
              <p className="card-info-value">{showData(reporte.direccion)}</p>
            </div>
            <div className="card-info-row">
              <p className="card-info-label">Teléfono</p>
              <p className="card-info-value">{showData(reporte.telefono)}</p>
            </div>
            <div className="card-info-row">
              <p className="card-info-label">Email</p>
              <p className="card-info-value">{showData(reporte.email)}</p>
            </div>
            <div className="card-info-row">
              <p className="card-info-label">Fecha de Inscripción</p>
              <p className="card-info-value">{formatDate(reporte.fecha_inscripcion)}</p> 
            </div>
            <div className="card-info-row">
              <p className="card-info-label">Estado</p>
              <p className="card-info-value">{showData(reporte.estado)}</p>
            </div>
          </div>
        </div>

        <div className="card-info">
          <h4 className="card-info-header">Informacion del Tutor</h4>
          <LineaSeparadora />
          
          <div style={{ marginTop: '20px' }}>
            {tutores && tutores.length > 0 ? (
              <>
                <div className="card-info-row">
                  <p className="card-info-label">Nombre y Apellido</p>
                  <p className="card-info-value">{tutores[0].nombre} {tutores[0].apellido}</p>
                </div>
                <div className="card-info-row">
                  <p className="card-info-label">DNI</p>
                  <p className="card-info-value">{showData(tutores[0].dni_tutor)}</p>
                </div>
                <div className="card-info-row">
                  <p className="card-info-label">Dirección</p>
                  <p className="card-info-value">{showData(tutores[0].direccion)}</p>
                </div>
                <div className="card-info-row">
                  <p className="card-info-label">Teléfono</p>
                  <p className="card-info-value">{showData(tutores[0].telefono)}</p>
                </div>
                <div className="card-info-row">
                  <p className="card-info-label">Email</p>
                  <p className="card-info-value">{showData(tutores[0].email)}</p>
                </div>
                <div className="card-info-row">
                  <p className="card-info-label">Parentesco</p>
                  <p className="card-info-value">{showData(tutores[0].parentesco)}</p>
                </div>
              </>
            ) : (
              <p>No hay información de tutor disponible.</p>
            )}
          </div>
        </div>
      </div>

    </>
  );
};

export default DivBodyInfo;
