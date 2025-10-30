import React from "react";

const ReporteCursoTable = ({ alumnos = [] }) => {
  const styles = {
    container: {
      overflowX: "auto",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
      marginTop: "15px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      textAlign: "center",
      borderRadius: "12px",
      overflow: "hidden",
    },
    th: {
      backgroundColor: "#004b9b",
      color: "white",
      padding: "12px 8px",
      fontWeight: "600",
      fontSize: "14px",
      borderBottom: "2px solid #003b7d",
    },
    td: {
      padding: "10px 8px",
      borderBottom: "1px solid #e0e0e0",
      fontSize: "14px",
      color: "#333",
      transition: "background-color 0.2s ease-in-out",
    },
    trEven: {
      backgroundColor: "#f9f9f9",
    },
    trHover: {
      backgroundColor: "#e6f0ff",
    },
    notaPromedio: {
      fontWeight: "bold",
    },
    asistencia: {
      fontWeight: "bold",
    },
  };

  const getNotaStyle = (nota) => {
    if (nota >= 7) return { color: "#2e8b57" };
    if (nota >= 4) return { color: "#ff9800" };
    return { color: "#d32f2f" };
  };

  const getAsistenciaStyle = (asistencia) => {
    const porcentaje = asistencia?.porcentaje ?? 0;
    if (porcentaje >= 85) return { color: "#2e8b57" };
    if (porcentaje >= 70) return { color: "#ff9800" };
    return { color: "#d32f2f" };
  };

  const formatNota = (nota) => {
    if (nota === undefined || nota === null || isNaN(nota)) return "-";
    return Number(nota).toFixed(1);
  };

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>DNI</th>
            <th style={styles.th}>Nombre</th>
            <th style={styles.th}>Apellido</th>
            <th style={styles.th}>Nota 1</th>
            <th style={styles.th}>Nota 2</th>
            <th style={styles.th}>Nota 3</th>
            <th style={styles.th}>Promedio</th>
            <th style={styles.th}>Asistencia (%)</th>
            <th style={styles.th}>Faltas</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.length > 0 ? (
            alumnos.map((item, index) => {
              const { alumno = {}, calificaciones, asistencias } = item || {};
              const safeCalificaciones = calificaciones ?? {};
              const safeAsistencias = asistencias ?? {};
              const asistenciaInfo = getAsistenciaStyle(safeAsistencias);
              const faltas = Number(safeAsistencias.ausentes ?? 0);

              return (
                <tr
                  key={index}
                  style={
                    index % 2 === 0
                      ? styles.trEven
                      : {}
                  }
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      index % 2 === 0 ? styles.trEven.backgroundColor : "#fff")
                  }
                >
                  <td style={styles.td}>{alumno.dni ?? "-"}</td>
                  <td style={styles.td}>{alumno.nombre ?? "-"}</td>
                  <td style={styles.td}>{alumno.apellido ?? "-"}</td>
                  <td style={{ ...styles.td, ...getNotaStyle(safeCalificaciones.nota1) }}>
                    {formatNota(safeCalificaciones.nota1)}
                  </td>
                  <td style={{ ...styles.td, ...getNotaStyle(safeCalificaciones.nota2) }}>
                    {formatNota(safeCalificaciones.nota2)}
                  </td>
                  <td style={{ ...styles.td, ...getNotaStyle(safeCalificaciones.nota3) }}>
                    {formatNota(safeCalificaciones.nota3)}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...getNotaStyle(safeCalificaciones.promedio),
                      ...styles.notaPromedio,
                    }}
                  >
                    {formatNota(safeCalificaciones.promedio)}
                  </td>
                  <td
                    style={{
                      ...styles.td,
                      ...asistenciaInfo,
                      ...styles.asistencia,
                    }}
                  >
                    {safeAsistencias.porcentaje ?? 0}%
                  </td>
                  <td style={styles.td}>{faltas}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" style={styles.td}>
                No hay registros disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReporteCursoTable;
