import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { Copy } from "lucide-react"; // 📋 Ícono npm install lucide-react
import LineaSeparadora from "../ui/LineaSeparadora";
import { useConsultaStore } from "../../store/consultaStore";

const styles = {
  mainContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: "20px 40px 40px 40px",
    gap: "30px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  cardInfo: {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "25px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #ddd",
    flex: 1,
    minWidth: "400px",
  },
  cardInfoHeader: {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: "#303F9F",
  },
  infoContainer: {
    marginTop: "20px",
  },
  cardInfoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  cardInfoLabel: {
    fontWeight: 500,
    color: "#555",
    margin: 0,
  },
  cardInfoValue: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#333",
    margin: 0,
    textAlign: "right",
  },
  copyIcon: {
    cursor: "pointer",
    color: "#666",
    transition: "color 0.2s",
  },
  noDataText: {
    color: "#777",
    fontStyle: "italic",
    padding: "10px 0",
  },
  centeredContainer: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "'Inter', sans-serif",
  },
};

const DivBodyInfo = () => {
  const { reporteAlumno } = useConsultaStore();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    let data = reporteAlumno || JSON.parse(sessionStorage.getItem("reporteAlumno"));
    setReporte(data);
    setLoading(false);
  }, [reporteAlumno]);

  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString() : "Fecha no disponible";

  const showData = (data) => data || "No disponible";

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      console.error("Error al copiar texto");
    }
  };

  if (loading) {
    return (
      <div style={styles.centeredContainer}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando reporte...</p>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div style={styles.centeredContainer}>
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

  const { tutores } = reporte;

  const renderCopyableField = (value, type) => (
    <p style={styles.cardInfoValue}>
      {value || "No disponible"}
      {value && (
        <Copy
          size={16}
          style={{
            ...styles.copyIcon,
            color: copied === type ? "#2e7d32" : "#666",
          }}
          onClick={() => handleCopy(value, type)}
          title={copied === type ? "Copiado!" : "Copiar"}
        />
      )}
    </p>
  );

  return (
    <div style={styles.mainContainer}>
      {/* Información del Alumno */}
      <div style={styles.cardInfo}>
        <h4 style={styles.cardInfoHeader}>Información del Alumno</h4>
        <LineaSeparadora />
        <div style={styles.infoContainer}>
          <div style={styles.cardInfoRow}>
            <p style={styles.cardInfoLabel}>Nombre y Apellido</p>
            <p style={styles.cardInfoValue}>
              {reporte.nombre} {reporte.apellido}
            </p>
          </div>
          <div style={styles.cardInfoRow}>
            <p style={styles.cardInfoLabel}>DNI</p>
            <p style={styles.cardInfoValue}>{showData(reporte.dni)}</p>
          </div>
          <div style={styles.cardInfoRow}>
            <p style={styles.cardInfoLabel}>Fecha de Nacimiento</p>
            <p style={styles.cardInfoValue}>{formatDate(reporte.fecha_nacimiento)}</p>
          </div>
          <div style={styles.cardInfoRow}>
            <p style={styles.cardInfoLabel}>Lugar de Nacimiento</p>
            <p style={styles.cardInfoValue}>{showData(reporte.lugar_nacimiento)}</p>
          </div>
          <div style={styles.cardInfoRow}>
            <p style={styles.cardInfoLabel}>Teléfono</p>
            {renderCopyableField(reporte.telefono, "telefono")}
          </div>
          <div style={styles.cardInfoRow}>
            <p style={styles.cardInfoLabel}>Email</p>
            {renderCopyableField(reporte.email, "email")}
          </div>
          <div style={styles.cardInfoRow}>
            <p style={styles.cardInfoLabel}>Fecha de Inscripción</p>
            <p style={styles.cardInfoValue}>{formatDate(reporte.fecha_inscripcion)}</p>
          </div>
          <div style={styles.cardInfoRow}>
            <p style={styles.cardInfoLabel}>Estado</p>
            <p style={styles.cardInfoValue}>{showData(reporte.estado)}</p>
          </div>
        </div>
      </div>

      {/* Información del Tutor */}
      <div style={styles.cardInfo}>
        <h4 style={styles.cardInfoHeader}>Información del Tutor</h4>
        <LineaSeparadora />
        <div style={styles.infoContainer}>
          {tutores && tutores.length > 0 ? (
            <>
              <div style={styles.cardInfoRow}>
                <p style={styles.cardInfoLabel}>Nombre y Apellido</p>
                <p style={styles.cardInfoValue}>
                  {tutores[0].nombre} {tutores[0].apellido}
                </p>
              </div>
              <div style={styles.cardInfoRow}>
                <p style={styles.cardInfoLabel}>DNI</p>
                <p style={styles.cardInfoValue}>{showData(tutores[0].dni_tutor)}</p>
              </div>
              <div style={styles.cardInfoRow}>
                <p style={styles.cardInfoLabel}>Dirección</p>
                <p style={styles.cardInfoValue}>{showData(tutores[0].direccion)}</p>
              </div>
              <div style={styles.cardInfoRow}>
                <p style={styles.cardInfoLabel}>Teléfono</p>
                {renderCopyableField(tutores[0].telefono, "telefono_tutor")}
              </div>
              <div style={styles.cardInfoRow}>
                <p style={styles.cardInfoLabel}>Email</p>
                {renderCopyableField(tutores[0].email, "email_tutor")}
              </div>
              <div style={styles.cardInfoRow}>
                <p style={styles.cardInfoLabel}>Parentesco</p>
                <p style={styles.cardInfoValue}>{showData(tutores[0].parentesco)}</p>
              </div>
            </>
          ) : (
            <p style={styles.noDataText}>
              No hay información de tutor disponible.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DivBodyInfo;
