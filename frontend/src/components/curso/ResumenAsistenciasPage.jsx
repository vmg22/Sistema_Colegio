import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore.js";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import EncabezadoCurso from "../curso/EncabezadoCurso.jsx";
import ReporteAsistenciasTable from "./ReporteAsistenciasTable.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const styles = {
  // ... (pageContainer, pageTitle, loadingContainer...)
  pageContainer: {
    padding: "0 40px 40px 40px",
    backgroundColor: "#f4f7fa",
    minHeight: "calc(100vh - 80px)",
    fontFamily: "'Inter', sans-serif",
  },
  pageTitle: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#303F9F",
    margin: "20px 0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  loadingContainer: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "'Inter', sans-serif",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "30px",
    alignItems: "start",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  statsContainer: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #ddd",
  },
  rightColumnContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "30px", 
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #ddd",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: "400px",
    // position: "sticky", // ✔️ LÍNEA CORREGIDA (descomentada)
    top: "100px",
  },
  // ... (statBox, statValue, statLabel, statRow...)
  statBox: { textAlign: "center", marginBottom: "20px" },
  statValue: (color = "#303F9F") => ({
    fontSize: "2.5rem",
    fontWeight: 700,
    color,
    margin: 0,
  }),
  statLabel: { fontSize: "1rem", color: "#555", margin: 0 },
  statRow: {
    display: "flex",
    justifyContent: "space-around",
    margin: "20px 0",
  },
  statSmallBox: { textAlign: "center", flex: 1 },
  statSmallValue: (color = "#333") => ({
    fontSize: "1.5rem",
    fontWeight: 600,
    color,
    margin: 0,
  }),
  statSmallLabel: { fontSize: "0.9rem", color: "#777", margin: 0 },
  insightBox: {
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#e3f2fd",
    color: "#0d47a1",
    textAlign: "center",
    fontWeight: 500,
    marginBottom: "20px",
    border: "1px solid #bbdefb",
  },
  
  // 
  top3Container: {
    marginTop: "0",
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #ddd",
  },
  top3Title: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#333",
    marginBottom: "10px",
  },
  top3List: { listStyle: "none", padding: 0, margin: 0 },
  top3Item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
    fontSize: "0.95rem",
  },
  top3Rank: { fontWeight: 600, color: "#303F9F" },
  top3Promedio: { fontWeight: 600 },
  
  riesgoContainer: {
    marginTop: "0", 
    backgroundColor: "white", 
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #ddd",
  },
  riesgoTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#dc3545",
    marginBottom: "10px",
  },
  riesgoList: { listStyle: "none", padding: 0, margin: 0 },
  riesgoItem: {
    padding: "8px 0",
    borderBottom: "1px solid #eee",
    fontSize: "0.95rem",
  },
  riesgoReason: { fontSize: "0.85rem", color: "#dc3545", fontWeight: 500 },
};

const ResumenAsistenciasPage = () => {
  // ... (Toda tu lógica: useStore, useState, useEffect, useMemo)
  // ... (Esta parte no cambia en absoluto)
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

    const alumnosConAsistencia = alumnos.map(a => {
      const presentes = Number(a.asistencias?.presentes || 0);
      const totalClases = Number(a.asistencias?.total || 0);
      const porcentaje = totalClases > 0 ? (presentes / totalClases) * 100 : 100;
      return {
        ...a,
        asistenciaPorc: porcentaje.toFixed(1),
      };
    });

    const promedioAsistencia = (
      alumnosConAsistencia.reduce((acc, a) => acc + parseFloat(a.asistenciaPorc), 0) / totalAlumnos
    ).toFixed(1);

    const alumnosCriticos = alumnosConAsistencia.filter(a => a.asistenciaPorc < 75);
    const alumnosBuenos = alumnosConAsistencia.filter(a => a.asistenciaPorc >= 75);

    const top3 = [...alumnosConAsistencia]
      .sort((a, b) => b.asistenciaPorc - a.asistenciaPorc)
      .slice(0, 3);

    const insight =
      promedioAsistencia > 90
        ? "🎉 Excelente nivel de asistencia general."
        : promedioAsistencia < 75
        ? "📉 La asistencia promedio es baja. Se recomienda revisar la participación."
        : alumnosCriticos.length / totalAlumnos > 0.3
        ? "⚠️ Varios alumnos con baja asistencia. Considerar seguimiento personalizado."
        : "📊 La asistencia del curso es aceptable.";

    return {
      stats: {
        promedioAsistencia,
        totalAlumnos,
        alumnosBuenos: alumnosBuenos.length,
        alumnosCriticos: alumnosCriticos.length,
        top3,
        alumnosCriticosLista: alumnosCriticos.map(a => ({
          id: a.alumno?.id,
          nombre: a.alumno?.nombreCompleto || "Alumno Desconocido",
          asistenciaPorc: a.asistenciaPorc,
          reason: "Asistencia baja",
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

  // ... (Tu código de 'if (loading)' e 'if (!stats)' no cambia)
  if (loading)
    return (
      <div style={styles.loadingContainer}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Calculando estadísticas...</p>
      </div>
    );

  if (!stats)
    return (
      <div style={styles.loadingContainer}>
        <h5>No se encontraron datos de asistencia.</h5>
        <p>Vuelve al panel e intenta realizar una nueva búsqueda.</p>
        <Link to={"/"}>
          <Button variant="secondary" className="px-4">
            Volver
          </Button>
        </Link>
      </div>
    );


  // ✔️ RENDERIZADO (JSX) MODIFICADO
  return (
    <div style={styles.pageContainer}>
      <BtnVolver />
      <EncabezadoCurso />
      <h2 style={styles.pageTitle}>
        <span className="material-symbols-outlined">event_available</span>
        Resumen de Asistencias
      </h2>

      <div style={styles.contentGrid}>
        
        {/* --- Columna Izquierda --- */}
        <div style={styles.statsContainer}>
          <div style={styles.insightBox}>{stats.insight}</div>

          <div style={styles.statBox}>
            <h3 style={styles.statValue()}>{stats.promedioAsistencia}%</h3>
            <p style={styles.statLabel}>Promedio General de Asistencia</p>
          </div>

          <hr />

          <div style={styles.statRow}>
            <div style={styles.statSmallBox}>
              <h4 style={styles.statSmallValue("#4caf50")}>{stats.alumnosBuenos}</h4>
              <p style={styles.statSmallLabel}>Buena asistencia (≥ 75%)</p>
            </div>
            <div style={styles.statSmallBox}>
              <h4 style={styles.statSmallValue("#f44336")}>{stats.alumnosCriticos}</h4>
              <p style={styles.statSmallLabel}>Crítica (&lt; 75%)</p>
            </div>
          </div>

          <hr />

          <ReporteAsistenciasTable alumnos={reporte.alumnos} />

          {/* ❌ "Mejor Asistencia" MOVIDO DE AQUÍ */}
          
        </div>

        {/* --- Columna Derecha (Contenedor) --- */}
        <div style={styles.rightColumnContainer}>
          
          {/* 1. Gráfico (como estaba antes) */}
          <div style={styles.chartContainer}>
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

          {/* 2. Mejor Asistencia (MOVIDO AQUÍ) */}
          {/* ✔️ SECCIÓN MOVIDA */}
          <div style={styles.top3Container}>
            <h4 style={styles.top3Title}>🏆 Mejor Asistencia</h4>
            <ul style={styles.top3List}>
              {stats.top3.map((a, i) => (
                <li key={a.alumno?.id || i} style={styles.top3Item}>
                  <span>
                    <strong style={styles.top3Rank}>{i + 1}.</strong>{" "}
                    {a.alumno?.nombreCompleto || "N/A"}
                  </span>
                  <span style={styles.top3Promedio}>{a.asistenciaPorc}%</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Asistencia Crítica (como estaba antes) */}
          {/* ✔️ SECCIÓN MOVIDA */}
          <div style={styles.riesgoContainer}>
            <h4 style={styles.riesgoTitle}>⚠️ Asistencia Crítica ({stats.alumnosCriticos})</h4>

            {stats.alumnosCriticos === 0 ? (
              <p>No hay alumnos con asistencia crítica.</p>
            ) : (
              <ul style={styles.riesgoList}>
                {stats.alumnosCriticosLista.map((a, idx) => (
                  <li key={a.id || idx} style={styles.riesgoItem}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{a.nombre}</div>
                      <div style={styles.riesgoReason}>
                        {a.reason} — {a.asistenciaPorc}%
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div> {/* Fin de rightColumnContainer */}
      </div> {/* Fin de contentGrid */}
    </div>
  );
};

export default ResumenAsistenciasPage;