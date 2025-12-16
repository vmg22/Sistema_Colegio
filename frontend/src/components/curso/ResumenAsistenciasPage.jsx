import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore.js";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import EncabezadoCurso from "../curso/EncabezadoCurso.jsx";
import ReporteAsistenciasTable from "./ReporteAsistenciasTable.jsx";
import "../../styles/resumenAsistencia.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const ResumenAsistenciasPage = () => {
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

    // Calculamos el porcentaje de asistencia para cada alumno
    const alumnosConAsistencia = alumnos.map(a => {
      const presentes = Number(a.asistencias?.presentes || 0);
      const ausentes = Number(a.asistencias?.ausentes || 0);
      const tardes = Number(a.asistencias?.tardes || 0);
      const totalClases = Number(a.asistencias?.total || 0);
      const porcentaje = totalClases > 0 ? (presentes / totalClases) * 100 : 0;
      
      return {
        ...a,
        asistenciaPorc: porcentaje.toFixed(1),
        presentes,
        ausentes,
        tardes,
        totalClases
      };
    });

    // Promedio de asistencia del curso
    const promedioAsistencia = totalAlumnos > 0
      ? (alumnosConAsistencia.reduce((acc, a) => acc + parseFloat(a.asistenciaPorc), 0) / totalAlumnos).toFixed(1)
      : "0.0";

    // Clasificación de alumnos
    const alumnosCriticos = alumnosConAsistencia.filter(a => parseFloat(a.asistenciaPorc) < 75);
    const alumnosBuenos = alumnosConAsistencia.filter(a => parseFloat(a.asistenciaPorc) >= 75);

    // Top 3 con mejor asistencia
    const top3 = [...alumnosConAsistencia]
      .sort((a, b) => parseFloat(b.asistenciaPorc) - parseFloat(a.asistenciaPorc))
      .slice(0, 3);

    // Insight inteligente
    const porcentajeCriticos = (alumnosCriticos.length / totalAlumnos) * 100;
    let insight;
    
    if (parseFloat(promedioAsistencia) >= 90) {
      insight = "🎉 Excelente nivel de asistencia general. El curso muestra alto compromiso.";
    } else if (parseFloat(promedioAsistencia) < 75) {
      insight = "📉 La asistencia promedio es baja. Se recomienda revisar la participación del curso.";
    } else if (porcentajeCriticos > 30) {
      insight = "⚠️ Varios alumnos con baja asistencia. Considerar seguimiento personalizado.";
    } else if (parseFloat(promedioAsistencia) >= 85) {
      insight = "✅ Buena asistencia general. El curso mantiene un nivel adecuado.";
    } else {
      insight = "📊 La asistencia del curso es aceptable, pero puede mejorar.";
    }

    // Total de clases dictadas (tomamos el máximo de total de cualquier alumno)
    const totalClasesDictadas = Math.max(
      ...alumnosConAsistencia.map(a => a.totalClases),
      0
    );

    return {
      stats: {
        promedioAsistencia,
        totalAlumnos,
        totalClasesDictadas,
        alumnosBuenos: alumnosBuenos.length,
        alumnosCriticos: alumnosCriticos.length,
        top3,
        alumnosCriticosLista: alumnosCriticos.map(a => ({
          id: a.alumno?.id,
          nombre: a.alumno?.nombreCompleto || "Alumno Desconocido",
          asistenciaPorc: a.asistenciaPorc,
          presentes: a.presentes,
          ausentes: a.ausentes,
          tardes: a.tardes,
          totalClases: a.totalClases,
          reason: parseFloat(a.asistenciaPorc) < 50 
            ? "Asistencia muy baja" 
            : "Asistencia baja"
        })),
        insight,
      },
      chartData: {
        labels: ["≥ 75% (Buena)", "< 75% (Crítica)"],
        datasets: [
          {
            label: "# de Alumnos",
            data: [alumnosBuenos.length, alumnosCriticos.length],
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
      <div className="asistencias-loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Calculando estadísticas...</p>
      </div>
    );

  if (!stats)
    return (
      <div className="asistencias-loading-container">
        <h5>No se encontraron datos de asistencia.</h5>
        <p>Vuelve al panel e intenta realizar una nueva búsqueda.</p>
        <Link to={"/"}>
          <Button variant="secondary" className="px-4">
            Volver
          </Button>
        </Link>
      </div>
    );

  return (
    <div className="asistencias-page-container">
      <div className="curso-dashboard-header mt-3">
        <span className="material-symbols-outlined asistencias-page-icon">event_available</span>
        <h2 className="curso-dashboard-title">Resumen de Asistencias</h2>
      </div>
      <EncabezadoCurso />

      <div className="asistencias-content-grid">
        
        {/* --- Columna Izquierda --- */}
        <div className="asistencias-stats-container">
          <div className="asistencias-insight-box">{stats.insight}</div>

          <div className="asistencias-stat-box">
            <h3 className="asistencias-stat-value">{stats.promedioAsistencia}%</h3>
            <p className="asistencias-stat-label">Promedio General de Asistencia</p>
            <small className="text-muted">
              Sobre {stats.totalClasesDictadas} clase{stats.totalClasesDictadas !== 1 ? 's' : ''} dictada{stats.totalClasesDictadas !== 1 ? 's' : ''}
            </small>
          </div>

          <hr />

          <div className="asistencias-stat-row">
            <div className="asistencias-stat-small-box">
              <h4 className="asistencias-stat-small-value asistencias-stat-small-value--green">
                {stats.alumnosBuenos}
              </h4>
              <p className="asistencias-stat-small-label">Buena asistencia (≥ 75%)</p>
            </div>
            <div className="asistencias-stat-small-box">
              <h4 className="asistencias-stat-small-value asistencias-stat-small-value--red">
                {stats.alumnosCriticos}
              </h4>
              <p className="asistencias-stat-small-label">Crítica (&lt; 75%)</p>
            </div>
          </div>

          <hr />

          <ReporteAsistenciasTable alumnos={reporte.alumnos} />
        </div>

        {/* --- Columna Derecha (Contenedor) --- */}
        <div className="asistencias-right-column-container">
          
          {/* 1. Gráfico */}
          <div className="asistencias-chart-container">
            <Doughnut
              data={chartData}
              options={{
                plugins: {
                  legend: { 
                    position: "top",
                    labels: {
                      font: { size: 14 }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: context => {
                        const label = context.label || "";
                        const val = context.parsed || 0;
                        const percentage = stats.totalAlumnos > 0
                          ? ((val / stats.totalAlumnos) * 100).toFixed(1)
                          : 0;
                        return `${label}: ${val} alumno${val !== 1 ? 's' : ''} (${percentage}%)`;
                      },
                    },
                  },
                },
                responsive: true,
                maintainAspectRatio: true,
              }}
            />
          </div>

          {/* 2. Mejor Asistencia */}
          <div className="asistencias-top3-container">
            <h4 className="asistencias-top3-title">🏆 Mejor Asistencia</h4>
            {stats.top3.length > 0 ? (
              <ul className="asistencias-top3-list">
                {stats.top3.map((a, i) => (
                  <li key={a.alumno?.id || i} className="asistencias-top3-item">
                    <span>
                      <strong className="asistencias-top3-rank">{i + 1}.</strong>{" "}
                      {a.alumno?.nombreCompleto || "N/A"}
                    </span>
                    <span className="asistencias-top3-promedio">
                      {a.asistenciaPorc}%
                      {parseFloat(a.asistenciaPorc) === 100 ? " 🌟" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay datos suficientes.</p>
            )}
          </div>

          {/* 3. Asistencia Crítica */}
          <div className="asistencias-riesgo-container">
            <h4 className="asistencias-riesgo-title">
              ⚠️ Asistencia Crítica ({stats.alumnosCriticos})
            </h4>

            {stats.alumnosCriticos === 0 ? (
              <p className="text-success">✅ No hay alumnos con asistencia crítica.</p>
            ) : (
              <ul className="asistencias-riesgo-list">
                {stats.alumnosCriticosLista.map((a, idx) => (
                  <li key={a.id || idx} className="asistencias-riesgo-item">
                    <div>
                      <div style={{ fontWeight: 600 }}>{a.nombre}</div>
                      <div className="asistencias-riesgo-reason">
                        {a.reason} — {a.asistenciaPorc}%
                      </div>
                      <div className="asistencias-riesgo-details">
                        <small className="text-muted">
                          P: {a.presentes} | A: {a.ausentes} | T: {a.tardes} | Total: {a.totalClases}
                        </small>
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

export default ResumenAsistenciasPage;