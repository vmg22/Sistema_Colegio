import React from 'react'
import AccionCard from '../../components/ui/AccionCard';
import BtnVolver from '../../components/ui/BtnVolver';
import EncabezadoEstudiante from '../../components/ui/EncabezadoEstudiante';
import DivHeaderInfo from '../../components/alumno/DivHeaderInfo';

const HomeCertificados = () => {
    // Estilos actualizados
const styles = {
  pageContainer: {
    padding: "0 40px 40px 40px",
    backgroundColor: "#f4f7fa",
    minHeight: "calc(100vh - 80px)",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "20px 0",
    color: "#303F9F",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
    margin: 0,
  },
  // Eliminamos los estilos 'studentCard', 'studentIconCircle', 'studentIcon', 'studentName'
  // porque ahora están dentro de StudentHeader.jsx
  actionsTitle: {
    fontSize: "1.25rem",
    fontWeight: 500,
    color: "#444",
    marginBottom: "20px",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "25px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  loadingContainer: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "'Inter', sans-serif",
  },
};
  return (
    
    <div style={styles.pageContainer}><DivHeaderInfo/>
      {/* 1. Botón Volver (sin prop 'rutaVolver') */}
      <BtnVolver />
      <div style={styles.header}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "28px" }}
        >
          badge
        </span>
        <h2 style={styles.title}>Certificados</h2>
      </div>
        
        
        <br /><br /><br />
        
        <div style={styles.cardGrid}>
        <AccionCard
          titulo="Constancia Alumno Regular"
          icono="account_circle"
          to="/constanciaAlumnoRegular" 
        />
        <AccionCard
          titulo="Certificado Abono Escolar"
          icono="task_alt"
          to="/certificados-AbnEsc" // Esta es la ruta que creamos
        />
        <AccionCard
          titulo="Certificado Comprobante de Vacante"
          icono="trending_up"
          to="/certificados-cCVac"
        />
        <AccionCard
          titulo="Certificado Escolar"
          icono="chat"
          to="/certificadoEscolar"
        />
        <AccionCard
          titulo="Constancia de Alumno en Trámite"
          icono="description"
          to="/constanciaAlumnoTramite"
        />
        <AccionCard
          titulo="Acta Volante Examen"
          icono="mail"
          to="/certificados-ActVolEx"
        />
      </div>
      
    </div>
  )
}

export default HomeCertificados
