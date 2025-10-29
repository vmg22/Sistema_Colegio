import React from "react";
import Table from "react-bootstrap/Table";

const styles = {
  container: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #ddd",
    marginTop: "25px",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: 600,
    color: "#303F9F",
    marginBottom: "15px",
  },
  table: {
    borderCollapse: "separate",
    borderSpacing: "0 8px",
    width: "100%",
    textAlign: "center",
  },
  th: {
    backgroundColor: "#303F9F",
    color: "white",
    fontWeight: 500,
    padding: "10px",
    border: "none",
  },
  td: {
    backgroundColor: "#f9f9f9",
    border: "none",
    padding: "10px",
    verticalAlign: "middle",
  },
  row: {
    borderRadius: "10px",
    transition: "all 0.2s ease",
  },
  rowHover: {
    backgroundColor: "#e3f2fd",
  },
  critical: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    fontWeight: 600,
  },
  good: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    fontWeight: 600,
  },
};

const ReporteAsistenciasTable = ({ alumnos = [] }) => {
  if (!alumnos.length) {
    return (
      <div style={styles.container}>
        <h5>No se encontraron registros de asistencia.</h5>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>📋 Detalle de Asistencias por Alumno</h4>
      <Table responsive hover style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Alumno</th>
            <th style={styles.th}>Presentes</th>
            <th style={styles.th}>Ausentes</th>
            <th style={styles.th}>Total Clases</th>
            <th style={styles.th}>Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((a, index) => {
            const presentes = Number(a.asistencias?.presentes || 0);
            const total = Number(a.asistencias?.total || 0);
            const ausentes = total - presentes;
            const porc = total > 0 ? ((presentes / total) * 100).toFixed(1) : 100;

            const isCritico = porc < 75;

            return (
              <tr
                key={index}
                style={{
                  ...styles.row,
                  ...(isCritico ? styles.critical : styles.good),
                }}
              >
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{a.alumno?.nombreCompleto || "—"}</td>
                <td style={styles.td}>{presentes}</td>
                <td style={styles.td}>{ausentes}</td>
                <td style={styles.td}>{total}</td>
                <td style={styles.td}>
                  {porc}%{" "}
                  {isCritico ? "⚠️" : porc >= 95 ? "🌟" : porc >= 85 ? "✅" : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default ReporteAsistenciasTable;
