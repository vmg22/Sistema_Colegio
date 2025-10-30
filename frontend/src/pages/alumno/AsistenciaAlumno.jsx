import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
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
      <div style={styles.loadingContainer}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando asistencias...</p>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div style={styles.loadingContainer}>
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
    <div style={styles.pageContainer}>
      {/* 1. Botón Volver */}
      <BtnVolver />

      {/* 2. Header con nombre y curso */}
      <DivHeaderInfo reporte={reporte} variant="text" />
      <br />
      <br />
      <br />

      {/* 3. Grilla de tarjetas de asistencia */}
      <div style={styles.cardGrid}>
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
