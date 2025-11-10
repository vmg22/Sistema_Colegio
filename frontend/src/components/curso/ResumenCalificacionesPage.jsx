import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore.js";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import EncabezadoCurso from "../curso/EncabezadoCurso.jsx";
import ReporteNotasTable from "./ReporteNotasTable.jsx";
import "../../styles/resumenCalificaciones.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const ResumenCalificacionesPage = () => {
  const { reporteCurso } = useConsultaStore();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = reporteCurso || JSON.parse(sessionStorage.getItem("reporteCurso"));
    setReporte(stored);
    setLoading(false);
  }, [reporteCurso]);

  const { stats, chartData } = useMemo(() => {
    if (!reporte?.alumnos?.length) return { stats: null, chartData: null };

    const alumnos = reporte.alumnos;
    const totalAlumnos = alumnos.length;

    const alumnosAprobados = alumnos.filter(a => parseFloat(a.calificaciones?.promedio || 0) >= 6).length;
    const alumnosDesaprobados = totalAlumnos - alumnosAprobados;
    const alumnosDestacados = alumnos.filter(a => parseFloat(a.calificaciones?.promedio || 0) >= 8).length;

    const promedioGeneral = (
      alumnos.reduce((acc, a) => acc + parseFloat(a.calificaciones?.promedio || 0), 0) / totalAlumnos
    ).toFixed(2);

    const top3 = [...alumnos]
      .sort((a, b) => parseFloat(b.calificaciones?.promedio || 0) - parseFloat(a.calificaciones?.promedio || 0))
      .slice(0, 3);

    const mejorAlumno = top3[0];

    const alumnosEnRiesgoLista = alumnos
      .filter(a => parseFloat(a.calificaciones?.promedio || 0) < 6)
      .map(a => ({
        id: a.alumno?.id,
        nombre: a.alumno?.nombreCompleto || "Alumno Desconocido",
        promedio: parseFloat(a.calificaciones?.promedio || 0).toFixed(2),
        reason: "Notas bajas",
      }));

    const alumnosEnRiesgoCount = alumnosEnRiesgoLista.length;

    const asistenciaPromedio = (
      alumnos.reduce((acc, a) => {
        if (!a.asistencias?.total) return acc + 100;
        const presentes = Number(a.asistencias.presentes || 0);
        const totalClases = Number(a.asistencias.total);
        return acc + (presentes / totalClases) * 100;
      }, 0) / totalAlumnos
    ).toFixed(1);

    const insight =
      promedioGeneral > 8
        ? "🎉 ¡Excelente rendimiento general del curso!"
        : promedioGeneral < 6
        ? "📉 El promedio general es bajo. Revisar estrategias de aprendizaje."
        : alumnosEnRiesgoCount / totalAlumnos > 0.3
        ? "⚠️ Hay varios alumnos en riesgo. Considerar clases de refuerzo."
        : "📚 El curso mantiene un desempeño promedio estable.";

    return {
      stats: {
        promedioGeneral,
        alumnosAprobados,
        alumnosDesaprobados,
        alumnosDestacados,
        totalAlumnos,
        mejorAlumnoNombre: mejorAlumno ? mejorAlumno.alumno?.nombreCompleto || "N/A" : "N/A",
        mejorAlumnoPromedio: mejorAlumno
          ? parseFloat(mejorAlumno.calificaciones?.promedio || 0).toFixed(2)
          : "N/A",
        asistenciaPromedio,
        alumnosEnRiesgo: alumnosEnRiesgoCount,
        insight,
        top3,
        alumnosEnRiesgoLista,
      },
      chartData: {
        labels: ["Aprobados", "Desaprobados"],
        datasets: [
          {
            label: "# de Alumnos",
            data: [alumnosAprobados, alumnosDesaprobados],
            backgroundColor: ["#4caf50", "#f44336"],
            borderColor: ["#fff", "#fff"],
            borderWidth: 2,
          },
        ],
      },
    };
  }, [reporte]);

  if (loading)
    return (
      <div className="calificaciones-loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Calculando estadísticas...</p>
      </div>
    );

  if (!stats)
    return (
      <div className="calificaciones-loading-container">
        <h5>No se encontraron datos de calificaciones.</h5>
        <p>Vuelve al panel e intenta realizar una nueva búsqueda.</p>
        <Link to={"/"}>
          <Button variant="secondary" className="px-4">
            Volver
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="calificaciones-page-container">
      <BtnVolver />
      <div className="curso-dashboard-header">
         <span className="material-symbols-outlined calificaciones-page-icon">bar_chart</span>
        <h2 className="curso-dashboard-title">Resumen de Calificaciones</h2>
      </div>
      <EncabezadoCurso />

      <div className="calificaciones-content-grid">
        
        {/* --- Columna Izquierda --- */}
        <div className="calificaciones-stats-container">
          <div className="calificaciones-insight-box">{stats.insight}</div>

          <div className="calificaciones-stat-box">
            <h3 className="calificaciones-stat-value">{stats.promedioGeneral}</h3>
            <p className="calificaciones-stat-label">Promedio General del Curso</p>
          </div>

          <hr />

          <div className="calificaciones-stat-row">
            <div className="calificaciones-stat-small-box">
              <h4 className="calificaciones-stat-small-value calificaciones-stat-small-value--green">{stats.alumnosAprobados}</h4>
              <p className="calificaciones-stat-small-label">Aprobados (≥ 6)</p>
            </div>
            <div className="calificaciones-stat-small-box">
              <h4 className="calificaciones-stat-small-value calificaciones-stat-small-value--red">{stats.alumnosDesaprobados}</h4>
              <p className="calificaciones-stat-small-label">Desaprobados (&lt; 6)</p>
            </div>
            <div className="calificaciones-stat-small-box">
              <h4 className="calificaciones-stat-small-value calificaciones-stat-small-value--blue">{stats.alumnosDestacados}</h4>
              <p className="calificaciones-stat-small-label">Destacados (≥ 8)</p>
            </div>
          </div>

          <hr />

          <ReporteNotasTable alumnos={reporte.alumnos} />
        </div>

        {/* --- Columna Derecha (Contenedor) --- */}
        <div className="calificaciones-right-column-container">

          {/* 1. Gráfico */}
          <div className="calificaciones-chart-container">
            <Doughnut
              data={chartData}
              options={{
                plugins: {
                  legend: { position: "top" },
                  tooltip: {
                    callbacks: {
                      label: context => {
                        const label = context.label || "";
                        const val = context.parsed || 0;
                        return `${label}: ${val} alumnos (${(
                          (val / stats.totalAlumnos) *
                          100
                        ).toFixed(1)}%)`;
                      },
                    },
                  },
                },
              }}
            />
          </div>

          {/* 2. Mejores Alumnos */}
          <div className="calificaciones-top3-container">
            <h4 className="calificaciones-top3-title">🏆 Mejores Alumnos</h4>
            <ul className="calificaciones-top3-list">
              {stats.top3.map((a, i) => (
                <li key={a.alumno?.id || i} className="calificaciones-top3-item">
                  <span>
                    <strong className="calificaciones-top3-rank">{i + 1}.</strong>{" "}
                    {a.alumno?.nombreCompleto || "N/A"}
                  </span>
                  <span className="calificaciones-top3-promedio">
                    {parseFloat(a.calificaciones?.promedio || 0).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Alumnos en Riesgo */}
          <div className="calificaciones-riesgo-container">
            <h4 className="calificaciones-riesgo-title">⚠️ Alumnos en riesgo ({stats.alumnosEnRiesgo})</h4>

            {stats.alumnosEnRiesgo === 0 ? (
              <p>No hay alumnos en riesgo en este curso.</p>
            ) : (
              <ul className="calificaciones-riesgo-list">
                {stats.alumnosEnRiesgoLista.map((a, idx) => (
                  <li key={a.id || idx} className="calificaciones-riesgo-item">
                    <div>
                      <div style={{ fontWeight: 600 }}>{a.nombre}</div>
                      <div className="calificaciones-riesgo-reason">
                        {a.reason} — Promedio: {a.promedio}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResumenCalificacionesPage;