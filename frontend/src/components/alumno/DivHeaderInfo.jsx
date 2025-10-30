import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useConsultaStore } from "../../store/consultaStore";
import { Spinner, Button } from "react-bootstrap";
import BtnVolver from "../ui/BtnVolver";
import "../../styles/encabezadoCurso.css";


const DivHeaderInfo = () => {
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
        <BtnVolver rutaVolver="/" />
      </div>
    );
  }

  const { materias, tutores } = reporte;
  //   console.log("Datos del Alumno:", reporte);
  //   console.log(materias);
  //   console.log(tutores);
  return (
    <>
      <div
        className="d-flex align-items-center justify-content-between"
        style={{
          backgroundColor: "white",
          padding: "20px 30px",
          borderRadius: "15px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginTop: "20px",
        }}
      >
        <div className="d-flex align-items-center">
          <div className="encabezado-icon-circle">
            <span className="material-symbols-outlined encabezado-icon">
              person
            </span>
          </div>
          <h2 className="encabezado-title" style={{paddingLeft:"8px"}}>
           {reporte.nombre} {reporte.apellido}
        </h2>
        </div>

        <div className="d-flex align-items-center gap-4">
          <h5 style={{ margin: 0, color: "#303F9F" }}>DNI: {reporte.dni}</h5>
          {reporte.curso && (
            <>
              <h5 style={{ margin: 0, color: "#303F9F" }}>
                Curso: {reporte.curso.anio_curso} {reporte.curso.division}
              </h5>
            </>
          )}
          {/* Botón agregado para navegar a ConstAluTramite  */}
          {/* <Link to="/constanciaAlumnoTramite"> 
            <Button variant="primary" className="px-4 py-2">
              Constancia
            </Button>
          </Link>  */}
        </div>
      </div>
    </>
  );
};

export default DivHeaderInfo;
