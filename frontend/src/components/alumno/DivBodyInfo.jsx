import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LineaSeparadora from "../ui/LineaSeparadora";
import { useConsultaStore } from "../../store/consultaStore";
import { Button, Spinner } from "react-bootstrap";
import "../../styles/LinkCrud.css";
import "../../styles/cardNavegacion.css"; 


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