import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import AsistenciaMateriaCard from "../../components/ui/AsistenciaMateriaCard.jsx"; 
import EncabezadoEstudiante from "../../components/ui/EncabezadoEstudiante.jsx";
import DivHeaderInfo from "../../components/alumno/DivHeaderInfo.jsx"
import "../../styles/asistenciaAlumno.css";

const AsistenciasPage = () => {
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
  

  // Procesamos los datos de asistencia usando useMemo
  const materiasConAsistencia = useMemo(() => {
    if (!reporte || !reporte.materias) return [];

    // Usamos Object.entries para convertir el objeto de materias en un array
    return Object.entries(reporte.materias).map(([nombreMateria, data]) => {
      const asistencias = data.asistencias || [];
      const totalClases = asistencias.length;

      if (totalClases === 0) {
        return {
          nombre: nombreMateria,
          stats: {
            porcentaje: 100,
            faltas: 0,
            presentes: 0,
            totalClases: 0,
          },
        };
      }

      const faltas = asistencias.filter(a => a.estado === 'ausente').length;
      const presentes = totalClases - faltas;
      const porcentaje = Math.round((presentes / totalClases) * 100);

      return {
        nombre: nombreMateria,
        stats: {
          porcentaje,
          faltas,
          presentes,
          totalClases,
        },
      };
    });
  }, [reporte]);

  if (loading) {
    return (
      <div className="asistencias-page__loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando asistencias...</p>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="asistencias-page__loading-container">
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

  return (
    <div className="asistencias-page">
      {/* 1. Botón Volver */}
      <BtnVolver />

      <div className="curso-dashboard-header">
         <span className="material-symbols-outlined calificaciones-page-icon">task_alt</span>
        <h2 className="perfil-alumno-title">Asistencia</h2>
      </div>
      
      {/* 2. Header con nombre y curso (usando el nuevo componente) */}
      <DivHeaderInfo reporte={reporte} variant="text" />
      <br /><br /><br />

      {/* 3. Grilla de tarjetas de asistencia */}
      <div className="asistencias-page__card-grid">
        {materiasConAsistencia.map((materia) => (
          <AsistenciaMateriaCard
            key={materia.nombre}
            materiaNombre={materia.nombre}
            stats={materia.stats}
          />
        ))}
      </div>
    </div>
  );
};

export default AsistenciasPage;