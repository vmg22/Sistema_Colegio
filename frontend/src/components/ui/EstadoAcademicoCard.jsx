import React from "react";

// Estilos para la tarjeta
const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    overflow: "hidden", // Para que el header no se salga
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    backgroundColor: "#303F9F", // Primary Dark
    color: "white",
    padding: "12px 16px",
  },
  headerTitle: {
    margin: 0,
    fontSize: "1.1rem", // 18px
    fontWeight: 600,
  },
  content: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  section: {
    width: "100%",
  },
  sectionTitle: {
    fontSize: "0.875rem", // 14px
    fontWeight: 600,
    color: "#555",
    textTransform: "uppercase",
    marginBottom: "8px",
    borderBottom: "1px solid #eee",
    paddingBottom: "4px",
  },
  cuatrimestreContainer: {
    display: "flex",
    justifyContent: "space-around", // Espacio entre cuatrimestres
    gap: "10px",
  },
  // MODIFICADO: Ahora es un contenedor flex-column
  cuatrimestreBox: {
    textAlign: "center",
    padding: "12px 8px",
    borderRadius: "6px",
    backgroundColor: "#f4f7fa",
    flex: 1, // Para que ocupen el mismo espacio
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  cuatrimestreLabel: {
    fontSize: "0.8rem", // 12px
    color: "#777",
    margin: 0,
    fontWeight: 600,
  },
  // NUEVO: Contenedor para las notas individuales
  notasContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "6px",
    flexWrap: "wrap",
    minHeight: "32px", // Asegura altura aunque no haya notas
  },
  // NUEVO: Estilo para cada nota
  notaBox: {
    width: "32px",
    height: "32px",
    borderRadius: "4px",
    backgroundColor: "#e0e7ff", // Light blue
    color: "#303F9F", // Primary Dark
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    fontWeight: "700",
  },
  // NUEVO: Estilo para notas nulas o vacías
  notaBoxNull: {
    width: "32px",
    height: "32px",
    borderRadius: "4px",
    backgroundColor: "#e0e0e0", // Grey
    color: "#777",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    fontWeight: "600",
  },
  // NUEVO: Contenedor para el promedio
  promedioContainer: {
    marginTop: "10px",
    borderTop: "1px solid #e0e0e0",
    paddingTop: "8px",
  },
  // NUEVO: Etiqueta para el promedio
  promedioLabel: {
    fontSize: "0.75rem", // 12px
    color: "#555",
    margin: 0,
    fontWeight: 500,
    textTransform: "uppercase",
  },
  // MODIFICADO: Estilo para el valor del promedio
  cuatrimestrePromedio: {
    fontSize: "1.5rem", // 24px
    fontWeight: 600,
    color: "#303F9F",
    margin: 0,
    lineHeight: 1.2,
  },
  finalContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },
  finalBox: {
    textAlign: "center",
  },
  finalLabel: {
    fontSize: "0.875rem", // 14px
    color: "#555",
    fontWeight: 500,
    margin: 0,
  },
  finalValue: {
    fontSize: "1.1rem", // 18px
    fontWeight: 600,
    color: "#333",
    margin: 0,
    textTransform: "capitalize",
  },
  notaFinal: {
    fontSize: "1.75rem", // 28px
    fontWeight: 700,
    color: "#303F9F",
  },
  noData: {
    fontSize: "0.9rem",
    color: "#888",
    textAlign: "center",
    padding: "5px 0",
  },
};

// Función para asignar color al estado
const getEstadoStyle = (estado) => {
  switch (estado) {
    case "aprobado":
    case "aprobada": // Añadido
      return { color: "#4caf50", fontWeight: 700 }; // Success
    case "reprobado":
    case "desaprobada": // Añadido
    case "libre": // Añadido
    case "previa": // Añadido
      return { color: "#f44336", fontWeight: 700 }; // Error
    case "cursando":
    default:
      return { color: "#303F9F", fontWeight: 600 }; // Primary Dark
  }
};

const EstadoAcademicoCard = ({ materiaNombre, data }) => {
  const { calificaciones, estado_final, calificacion_final } = data;

  return (
    <div style={styles.card}>
      {/* --- Header --- */}
      <div style={styles.header}>
        <h3 style={styles.headerTitle}>{materiaNombre}</h3>
      </div>

      {/* --- Contenido --- */}
      <div style={styles.content}>
        {/* --- Sección Cuatrimestres --- */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Cuatrimestres</h4>
          <div style={styles.cuatrimestreContainer}>
            {calificaciones && calificaciones.length > 0 ? (
              calificaciones.map((c) => (
                <div key={c.cuatrimestre} style={styles.cuatrimestreBox}>
                  {/* Etiqueta del Cuatrimestre */}
                  <p style={styles.cuatrimestreLabel}>
                    {c.cuatrimestre}° Cuat.
                  </p>

                  {/* MODIFICADO: Detalle de Notas Individuales */}
                  <div style={styles.notasContainer}>
                    {c.notas && c.notas.length > 0 ? (
                      c.notas.map((nota, index) => (
                        <div
                          key={index}
                          style={nota ? styles.notaBox : styles.notaBoxNull}
                        >
                          {nota ? parseFloat(nota).toFixed(1) : "-"}
                        </div>
                      ))
                    ) : (
                      <p style={styles.noData}>Sin notas</p>
                    )}
                  </div>

                  {/* MODIFICADO: Promedio separado */}
                  <div style={styles.promedioContainer}>
                    <p style={styles.promedioLabel}>Promedio</p>
                    <p style={styles.cuatrimestrePromedio}>
                      {c.promedio ? parseFloat(c.promedio).toFixed(2) : "-"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p style={styles.noData}>Sin datos de cuatrimestres.</p>
            )}
          </div>
        </div>

        {/* --- Sección Estado Final --- */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Estado Final</h4>
          <div style={styles.finalContainer}>
            <div style={styles.finalBox}>
              <p style={styles.finalLabel}>Estado</p>
              <p
                style={{ ...styles.finalValue, ...getEstadoStyle(estado_final) }}
              >
                {estado_final || "-"}
              </p>
            </div>
            <div style={styles.finalBox}>
              <p style={styles.finalLabel}>Nota Final</p>
              <p style={styles.notaFinal}>
                {calificacion_final
                  ? parseFloat(calificacion_final).toFixed(2)
                  : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadoAcademicoCard;

