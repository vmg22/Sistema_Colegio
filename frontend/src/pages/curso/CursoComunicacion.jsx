// Archivo: src/pages/curso/CursoComunicacion.jsx

import React, { useState, useEffect, useMemo } from "react"; // <-- Importar useState
import { useConsultaStore } from "../../store/consultaStore.js";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import EncabezadoCurso from "../../components/curso/EncabezadoCurso.jsx";

// --- 1. HELPER FUNCTION (Para las "píldoras" de Alertas) ---
const getReasonBadgeClass = (reason) => {
  // ... (Sin cambios)
  switch (reason.tipo) {
    case 'Notas':
      return Number(reason.valor) < 4 ? 'bg-danger' : 'bg-warning text-dark';
    case 'Asistencia Crítica':
      return 'bg-danger';
    case 'Asistencia Moderada':
      return 'bg-warning text-dark';
    default:
      return 'bg-secondary';
  }
};

const CursoComunicacion = () => {
  const { reporteCurso } = useConsultaStore();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- NUEVO ESTADO ---
  // Guarda el ID del alumno cuyo email se acaba de copiar
  const [copiedId, setCopiedId] = useState(null);


  useEffect(() => {
    const stored =
      reporteCurso || JSON.parse(sessionStorage.getItem("reporteCurso"));
    setReporte(stored);
    setLoading(false);
  }, [reporteCurso]);

  // --- 'useMemo' (SIN CAMBIOS) ---
  const { alumnosEnRiesgo } = useMemo(() => {
    // ... (Tu lógica de 'useMemo' está perfecta)
    if (!reporte?.alumnos?.length) {
      return { alumnosEnRiesgo: [] };
    }
    const listaRiesgo = [];
    reporte.alumnos.forEach((a) => {
      let reasons = []; let riskLevel = 'warning';
      const promedio = parseFloat(a.calificaciones?.promedio || 0);
      if (promedio < 6) {
        reasons.push({ tipo: 'Notas', valor: promedio.toFixed(2) });
        if (promedio < 4) { riskLevel = 'danger'; }
      }
      const presentes = Number(a.asistencias?.presentes || 0);
      const totalClases = Number(a.asistencias?.total || 0);
      let porcentajeAsistencia = 100;
      if (totalClases > 0) {
        porcentajeAsistencia = (presentes / totalClases) * 100;
      }
      const asistenciaFormato = `${porcentajeAsistencia.toFixed(0)}% (${presentes}/${totalClases})`;
      if (porcentajeAsistencia < 75) {
        reasons.push({ tipo: 'Asistencia Crítica', valor: asistenciaFormato, });
        riskLevel = 'danger';
      } else if (porcentajeAsistencia >= 75 && porcentajeAsistencia <= 80) {
        reasons.push({ tipo: 'Asistencia Moderada', valor: asistenciaFormato, });
      }
      if (reasons.length > 0) {
        listaRiesgo.push({
          id: a.alumno?.id,
          nombre: a.alumno?.nombreCompleto || "Alumno Desconocido",
          tutorNombre: a.tutor?.nombreCompleto || "No asignado",
          tutorEmail: a.tutor?.email || "N/A",
          reasons: reasons,
          riskLevel: riskLevel, 
        });
      }
    });
    return { alumnosEnRiesgo: listaRiesgo };
  }, [reporte]);

  // --- NUEVA FUNCIÓN PARA COPIAR ---
  const handleCopyEmail = (email, id) => {
    if (!email || email === 'N/A' || !navigator.clipboard) return;

    navigator.clipboard.writeText(email).then(() => {
      // Éxito: muestra el feedback
      setCopiedId(id);
      // Resetea el feedback después de 2 segundos
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    }).catch(err => {
      console.error("Error al copiar el email: ", err);
    });
  };


  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!reporte) {
    return (
      <div>
        No hay datos del reporte. <BtnVolver />
      </div>
    );
  }

  // --- RENDERIZADO (con columna 'Email' modificada) ---
  return (
    <div>
      <BtnVolver />
      <EncabezadoCurso curso={reporte.curso} />
      <hr className="my-4" />

      {/* Título de la sección */}
      <h4 className="mt-4">
        Reporte de Alumnos en Seguimiento ({alumnosEnRiesgo.length})
      </h4>
      <p>Alumnos que presentan notas bajas o ausentismo.</p>

      {/* --- INICIO DEL REPORTE --- */}
      <div className="card shadow-sm mt-3" style={{ border: 'none' }}>
        
        {/* Encabezado Azul */}
        <div 
          className="d-none d-md-flex row mx-0"
          style={{ 
            backgroundColor: '#004a99',
            color: 'white',
            padding: '0.75rem 0.5rem',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          }}
        >
          <div className="col-md-3 fw-bold">Alumno</div>
          <div className="col-md-3 fw-bold">Tutor</div>
          <div className="col-md-3 fw-bold">Email Tutor</div>
          <div className="col-md-3 fw-bold">Alertas de Riesgo</div>
        </div>

        {/* Cuerpo de la lista */}
        <div className="list-group list-group-flush">
          {alumnosEnRiesgo.length > 0 ? (
            alumnosEnRiesgo.map((alumno) => (
              <div 
                key={alumno.id} 
                className="list-group-item"
                style={{
                  borderLeft: `5px solid ${alumno.riskLevel === 'danger' ? '#dc3545' : '#ffc107'}`
                }}
              >
                <div className="row align-items-center gy-2">
                  {/* Columna Alumno */}
                  <div className="col-md-3">
                    <strong className="d-md-none">Alumno: </strong>
                    {alumno.nombre}
                  </div>
                  
                  {/* Columna Tutor */}
                  <div className="col-md-3">
                    <strong className="d-md-none">Tutor: </strong>
                    {alumno.tutorNombre}
                  </div>

                  {/* --- Columna Email (MODIFICADA) --- */}
                  <div className="col-md-3">
                    <strong className="d-md-none">Email: </strong>
                    <div className="input-group input-group-sm">
                      <span 
                        className="form-control border-0 px-0"
                        style={{ 
                          fontSize: '0.9em', 
                          backgroundColor: 'transparent',
                          overflowWrap: 'break-word',
                          whiteSpace: 'normal',
                          height: 'auto'
                        }}
                      >
                        {alumno.tutorEmail}
                      </span>
                      
                      {/* Lógica de Copiado */}
                      {copiedId === alumno.id ? (
                        <span className="input-group-text bg-success text-white">¡Copiado!</span>
                      ) : (
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={() => handleCopyEmail(alumno.tutorEmail, alumno.id)}
                          disabled={!alumno.tutorEmail || alumno.tutorEmail === 'N/A'}
                          title="Copiar email"
                        >
                          {/* Icono de Bootstrap Icons (como en tu imagen). 
                            Si no lo tienes, reemplaza <i> por "Copiar"
                          */}
                          <i className="bi bi-copy"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  {/* --- Fin Columna Email --- */}

                  {/* Columna Alertas */}
                  <div className="col-md-3">
                    <strong className="d-md-none">Alertas: </strong>
                    {alumno.reasons.map((reason, index) => (
                      <span 
                        key={index} 
                        className={`badge ${getReasonBadgeClass(reason)} me-1`}
                        style={{ fontSize: '0.8em' }}
                      >
                        {reason.tipo}: {reason.valor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Mensaje si no hay alumnos
            <div className="list-group-item">
              <div className="alert alert-success m-0">
                🎉 ¡Excelente! No hay alumnos en situación de riesgo.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CursoComunicacion;