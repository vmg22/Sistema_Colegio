import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button } from "react-bootstrap";
import { useConsultaStore } from "../../store/consultaStore.js";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import EncabezadoCurso from "./EncabezadoCurso.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const styles = {
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
    position: "sticky",
    top: "100px",
  },
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
  top3Container: { marginTop: "20px" },
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
  riesgoContainer: { marginTop: "30px" },
  riesgoTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#dc3545",
    marginBottom: "10px",
  },
  riesgoList: { listStyle: "none", padding: 0, margin: 0 },
  riesgoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #eee",
    fontSize: "0.95rem",
  },
  riesgoReason: { fontSize: "0.85rem", color: "#dc3545", fontWeight: 500 },
};

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
    const total = alumnos.length;

    const aprobados = alumnos.filter(a => parseFloat(a.calificaciones.promedio) >= 6).length;
    const desaprobados = total - aprobados;
    const destacados = alumnos.filter(a => parseFloat(a.calificaciones.promedio) >= 8).length;

    const promedioGeneral = (
      alumnos.reduce((acc, a) => acc + parseFloat(a.calificaciones.promedio || 0), 0) / total
    ).toFixed(2);

    const top3 = [...alumnos].sort(
      (a, b) => parseFloat(b.calificaciones.promedio) - parseFloat(a.calificaciones.promedio)
    ).slice(0, 3);

    const mejor = top3[0];
    const totalAusencias = alumnos.reduce((acc, a) => acc + (a.asistencias?.ausentes || 0), 0);

    const asistenciaPromedio = (
      alumnos.reduce((acc, a) => {
        if (!a.asistencias?.total) return acc + 100;
        return acc + (a.asistencias.presentes / a.asistencias.total) * 100;
      }, 0) / total
    ).toFixed(1);

    const riesgoLista = alumnos
      .filter(a => {
        const prom = parseFloat(a.calificaciones.promedio);
        const asistenciaPorc = a.asistencias?.total
          ? (a.asistencias.presentes / a.asistencias.total) * 100
          : 100;
        return prom < 6 || asistenciaPorc < 70;
      })
      .map(a => {
        const prom = parseFloat(a.calificaciones.promedio);
        const asistenciaPorc = a.asistencias?.total
          ? (a.asistencias.presentes / a.asistencias.total) * 100
          : 100;
        let reason =
          prom < 6 && asistenciaPorc < 70
            ? "Notas y Asistencia bajas"
            : prom < 6
            ? "Notas bajas"
            : "Asistencia baja";
        return { id: a.alumno.id, nombre: a.alumno.nombreCompleto, reason };
      });

    const insight =
      promedioGeneral > 8
        ? "🎉 ¡Excelente rendimiento general del curso!"
        : promedioGeneral < 6
        ? "📉 El promedio general es bajo. Revisar asistencia y métodos de enseñanza."
        : riesgoLista.length / total > 0.3
        ? "⚠️ Hay varios alumnos en riesgo. Considerar clases de refuerzo o tutorías."
        : "📚 El curso mantiene un desempeño promedio estable.";

    return {
      stats: {
        promedioGeneral,
        aprobados,
        desaprobados,
        destacados,
        total,
        totalAusencias,
        mejorAlumno: mejor ? mejor.alumno.nombreCompleto : "N/A",
        asistenciaPromedio,
        riesgoCount: riesgoLista.length,
        insight,
        top3,
        riesgoLista,
      },
      chartData: {
        labels: ["Aprobados", "Desaprobados"],
        datasets: [
          {
            label: "# de Alumnos",
            data: [aprobados, desaprobados],
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
      <div style={styles.loadingContainer}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Calculando estadísticas...</p>
      </div>
    );

  if (!stats)
    return (
      <div style={styles.loadingContainer}>
        <h5>No se encontraron datos de calificaciones.</h5>
        <p>Vuelve al panel e intenta realizar una nueva búsqueda.</p>
        <Link to={"/"}>
          <Button variant="secondary" className="px-4">Volver</Button>
        </Link>
      </div>
    );

  return (
    <div style={styles.pageContainer}>
      <BtnVolver />
      <EncabezadoCurso />
      <h2 style={styles.pageTitle}>
        
        <span className="material-symbols-outlined">bar_chart</span>
        Resumen de Calificaciones y Asistencias
      </h2>

      <div style={styles.contentGrid}>
        {/* Estadísticas */}
        <div style={styles.statsContainer}>
          <div style={styles.insightBox}>{stats.insight}</div>

          <div style={styles.statBox}>
            <h3 style={styles.statValue()}>{stats.promedioGeneral}</h3>
            <p style={styles.statLabel}>Promedio General del Curso</p>
          </div>
          <hr />

          <div style={styles.statRow}>
            <div style={styles.statSmallBox}>
              <h4 style={styles.statSmallValue("#4caf50")}>{stats.aprobados}</h4>
              <p style={styles.statSmallLabel}>Aprobados (≥ 6)</p>
            </div>
            <div style={styles.statSmallBox}>
              <h4 style={styles.statSmallValue("#f44336")}>{stats.desaprobados}</h4>
              <p style={styles.statSmallLabel}>Desaprobados (&lt; 6)</p>
            </div>
            <div style={styles.statSmallBox}>
              <h4 style={styles.statSmallValue()}>{stats.destacados}</h4>
              <p style={styles.statSmallLabel}>Destacados (≥ 8)</p>
            </div>
          </div>
          <hr />

          <div style={styles.statRow}>
            <div style={styles.statSmallBox}>
              <h4 style={styles.statSmallValue("#f44336")}>{stats.riesgoCount}</h4>
              <p style={styles.statSmallLabel}>Alumnos en Riesgo</p>
            </div>
            <div style={styles.statSmallBox}>
              <h4 style={styles.statSmallValue("#ff9800")}>{stats.asistenciaPromedio}%</h4>
              <p style={styles.statSmallLabel}>Asistencia Promedio</p>
            </div>
            <div style={styles.statSmallBox}>
              <h4 style={styles.statSmallValue()}>{stats.totalAusencias}</h4>
              <p style={styles.statSmallLabel}>Total Ausencias</p>
            </div>
          </div>
          <hr />

          <div style={styles.top3Container}>
            <h4 style={styles.top3Title}>🏆 Mejores Alumnos</h4>
            <ul style={styles.top3List}>
              {stats.top3.map((a, i) => (
                <li key={a.alumno.id} style={styles.top3Item}>
                  <span>
                    <strong style={styles.top3Rank}>{i + 1}.</strong> {a.alumno.nombreCompleto}
                  </span>
                  <span style={styles.top3Promedio}>
                    {parseFloat(a.calificaciones.promedio).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {stats.riesgoLista.length > 0 && (
            <div style={styles.riesgoContainer}>
              <h4 style={styles.riesgoTitle}>⚠️ Alumnos en Riesgo</h4>
              <ul style={styles.riesgoList}>
                {stats.riesgoLista.map(a => (
                  <li key={a.id} style={styles.riesgoItem}>
                    <span>{a.nombre}</span>
                    <span style={styles.riesgoReason}>({a.reason})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Gráfico */}
        <div style={styles.chartContainer}>
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                tooltip: {
                  callbacks: {
                    label: context => {
                      const label = context.label || "";
                      const val = context.parsed || 0;
                      return `${label}: ${val} alumnos (${((val / stats.total) * 100).toFixed(1)}%)`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumenCalificacionesPage;
