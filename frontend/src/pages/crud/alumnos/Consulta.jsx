import React, { useEffect, useState } from "react";
import { useConsultaStore } from "../../../store/consultaStore";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import "../../../styles/consulta.css";
import { Link } from "react-router-dom";
import HeaderPages from "../../../components/ui/HeaderPages";
import BtnVolver from "../../../components/ui/BtnVolver";
import LineaSeparadora from "../../../components/ui/LineaSeparadora";
import DivHeaderInfo from "../../../components/alumno/DivHeaderInfo";
import DivBodyInfo from "../../../components/alumno/DivBodyInfo";

const Consulta = () => {
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

  const { materias, tutores } = reporte;
  console.log("Datos del Alumno:", reporte);
  console.log(materias);
  console.log(tutores);

  return (
    <div className="container mt-4 consulta-container">
      <div className="consulta-content">
      <BtnVolver rutaVolver={"/"} />
      <HeaderPages titulo="Informacion Alumno" icono="search"/>
      <DivHeaderInfo/>
      <DivBodyInfo/>      
      </div>
                         
    </div>

  );
};

export default Consulta;
