import React from "react";
import { useEffect, useState } from "react";
// import { Link } from "react-router-dom"; // No se está usando Link aquí
import { useConsultaStore } from "../../store/consultaStore";
import { Spinner } from "react-bootstrap";
import BtnVolver from "../ui/BtnVolver";

// ✔️ Estilos unificados en JSS
const styles = {
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: '20px 30px',
    borderRadius: '15px',
    // ✔️ Sombra y borde mejorados para consistencia
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    border: '1px solid #ddd',
    marginTop: '20px',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  iconCircle: {
    borderRadius: '50%',
    backgroundColor: '#303F9F',
    height: '45px',
    width: '45px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: 'white',
    fontSize: '28px',
  },
  profileName: {
    margin: 0,
    fontWeight: 600,
    color: '#333',
  },
  detailsSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
  },
  detailText: {
    margin: 0,
    color: '#303F9F',
    fontWeight: 500,
    fontSize: '1rem', // h5 es un poco grande semánticamente, controlamos con estilo
  },
  centeredContainer: {
    textAlign: 'center',
    paddingTop: '50px',
    fontFamily: "'Inter', sans-serif",
  },
};

const DivHeaderInfo = () => {
  const { reporteAlumno } = useConsultaStore();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let dataToSet = null;

    if (reporteAlumno) {
      dataToSet = reporteAlumno;
    } else {
      const storedData = sessionStorage.getItem("reporteAlumno");
      if (storedData) {
        dataToSet = JSON.parse(storedData);
      }
    }
    setReporte(dataToSet);
    setLoading(false);
  }, [reporteAlumno]);

  // ✔️ Estado de Carga con estilo JSS
  if (loading) {
    return (
      <div style={styles.centeredContainer}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando reporte...</p>
      </div>
    );
  }

  // ✔️ Estado de Error con estilo JSS
  if (!reporte) {
    return (
      <div style={styles.centeredContainer}>
        <h5>No se encontraron datos del alumno.</h5>
        <p>Vuelve al panel e intenta realizar una nueva búsqueda.</p>
        <BtnVolver rutaVolver="/" />
      </div>
    );
  }

  // const { materias, tutores } = reporte; // No se usan, se pueden comentar

  // ✔️ JSX Limpio usando el objeto 'styles'
  return (
    <>
      <div style={styles.headerContainer}>
        <div style={styles.profileSection}>
          <div style={styles.iconCircle}>
            <span className="material-symbols-outlined" style={styles.icon}>
              person
            </span>
          </div>
          <h4 style={styles.profileName}>
            {reporte.nombre} {reporte.apellido}
          </h4>
        </div>

        <div style={styles.detailsSection}>
          <h5 style={styles.detailText}>DNI: {reporte.dni}</h5>
          {reporte.curso && (
            <h5 style={styles.detailText}>
              Curso: {reporte.curso.anio_curso} {reporte.curso.division}
            </h5>
          )}
        </div>
      </div>
    </>
  );
};

export default DivHeaderInfo;