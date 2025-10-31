import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
<<<<<<< HEAD
import AsistenciaMateriaCard from "../../components/ui/AsistenciaMateriaCard.jsx"; 
import EncabezadoEstudiante from "../../components/ui/EncabezadoEstudiante.jsx";
import DivHeaderInfo from "../../components/alumno/DivHeaderInfo.jsx"
import "../../styles/asistenciaAlumno.css";
=======
import AsistenciaMateriaCard from "../../components/ui/AsistenciaMateriaCard.jsx";
import EncabezadoEstudiante from "../../components/ui/EncabezadoEstudiante.jsx";
import DivHeaderInfo from "../../components/alumno/DivHeaderInfo.jsx";

// Estilos
const styles = {
  pageContainer: {
    padding: "0 40px 40px 40px",
    backgroundColor: "#f4f7fa",
    minHeight: "calc(100vh - 80px)",
    fontFamily: "'Inter', sans-serif",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "25px",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  loadingContainer: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "'Inter', sans-serif",
  },
};
>>>>>>> fdc98708accb55987618ff7efe7693d2d513b4f9

const AsistenciasPage = () => {
  const { reporteAlumno } = useConsultaStore();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect seguro: solo actualiza si cambia realmente el contenido
  useEffect(() => {
    let dataToSet = null;

    if (reporteAlumno && Object.keys(reporteAlumno).length > 0) {
      dataToSet = reporteAlumno;
    } else {
      const storedData = sessionStorage.getItem("reporteAlumno");
      if (storedData) {
        try {
          dataToSet = JSON.parse(storedData);
        } catch (e) {
          console.error("Error parsing reporteAlumno from sessionStorage:", e);
          dataToSet = null;
        }
      }
    }

    // Comparamos stringify para evitar actualizar con el mismo objeto repetidamente
    setReporte((prev) => {
      const prevStr = prev ? JSON.stringify(prev) : null;
      const nextStr = dataToSet ? JSON.stringify(dataToSet) : null;

      if (prevStr !== nextStr) {
        return dataToSet;
      }
      return prev;
    });

    // Aseguramos que loading se actualice apropiadamente
    setLoading(false);
  }, [reporteAlumno]);

  // Procesamos los datos de asistencia y eliminamos duplicados por nombre de materia
  const materiasConAsistencia = useMemo(() => {
    if (!reporte || !reporte.materias) return [];

    // Convertir a array (en caso de venir como objeto)
    const materiasArray = Object.entries(reporte.materias).map(([nombre, data]) => ({
      nombre,
      data,
    }));

    // Filtrar duplicados por nombre (mantiene la primera ocurrencia)
    const materiasUnicas = materiasArray.filter(
      (m, index, self) => index === self.findIndex((t) => t.nombre === m.nombre)
    );

    return materiasUnicas.map(({ nombre, data }) => {
      const asistencias = Array.isArray(data.asistencias) ? data.asistencias : [];
      const totalClases = asistencias.length;

      if (totalClases === 0) {
        return {
          nombre,
          stats: {
            porcentaje: 100,
            faltas: 0,
            presentes: 0,
            totalClases: 0,
          },
        };
      }

      const faltas = asistencias.filter((a) => a.estado === "ausente").length;
      const presentes = totalClases - faltas;
      const porcentaje = Math.round((presentes / totalClases) * 100);

      return {
        nombre,
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

<<<<<<< HEAD
      <div className="curso-dashboard-header">
         <span className="material-symbols-outlined calificaciones-page-icon">task_alt</span>
        <h2 className="perfil-alumno-title">Asistencia</h2>
      </div>
      
      {/* 2. Header con nombre y curso (usando el nuevo componente) */}
=======
      {/* 2. Header con nombre y curso */}
>>>>>>> fdc98708accb55987618ff7efe7693d2d513b4f9
      <DivHeaderInfo reporte={reporte} variant="text" />
      <br />
      <br />
      <br />

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

<<<<<<< HEAD
export default AsistenciasPage;
=======
export default AsistenciasPage;
>>>>>>> fdc98708accb55987618ff7efe7693d2d513b4f9
