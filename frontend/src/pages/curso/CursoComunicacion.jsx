import React, { useState, useEffect, useMemo } from 'react';
import { useConsultaStore } from '../../store/consultaStore.js';
import BtnVolver from '../../components/ui/BtnVolver.jsx';
import EncabezadoCurso from '../../components/curso/EncabezadoCurso.jsx';

// --- NUEVAS IMPORTACIONES ---
import { Button, Alert, Spinner } from 'react-bootstrap';
import NotificacionModal from './NotificacionModal.jsx'; // <-- El Modal
import { enviarAlertaAsistenciaMasiva } from '../../service/mailservice.js'; // <-- Servicio Masivo

// --- Helper para clases de badges ---
const getReasonBadgeClass = (reason) => {
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
  const [copiedId, setCopiedId] = useState(null);

  // --- NUEVOS ESTADOS ---
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [isSendingMasivo, setIsSendingMasivo] = useState(false);
  const [feedbackMasivo, setFeedbackMasivo] = useState({ type: '', msg: '' });
  const [selectedStudent, setSelectedStudent] = useState(null); // Para el modal

  useEffect(() => {
    const stored =
      reporteCurso || JSON.parse(sessionStorage.getItem('reporteCurso'));
    setReporte(stored);
    setLoading(false);
  }, [reporteCurso]);

  // --- 'useMemo' (corregido) ---
  const { alumnosEnRiesgo, anioLectivo } = useMemo(() => {
    if (!reporte?.alumnos?.length) {
      return { alumnosEnRiesgo: [], anioLectivo: null };
    }

    const anio = reporte.curso?.anio_lectivo || new Date().getFullYear();
    const listaRiesgo = [];

    reporte.alumnos.forEach((a) => {
      let reasons = [];
      let riskLevel = 'warning';

      const promedio = parseFloat(a.calificaciones?.promedio || 0);
      if (promedio < 6) {
        reasons.push({ tipo: 'Notas', valor: promedio.toFixed(2) });
        if (promedio < 4) {
          riskLevel = 'danger';
        }
      }

      const presentes = Number(a.asistencias?.presentes || 0);
      const totalClases = Number(a.asistencias?.total || 0);
      let porcentajeAsistencia = 100;

      if (totalClases > 0) {
        porcentajeAsistencia = (presentes / totalClases) * 100;
      }

      const asistenciaFormato = `${porcentajeAsistencia.toFixed(0)}% (${presentes}/${totalClases})`;

      if (porcentajeAsistencia < 75) {
        reasons.push({ tipo: 'Asistencia Crítica', valor: asistenciaFormato });
        riskLevel = 'danger';
      } else if (porcentajeAsistencia >= 75 && porcentajeAsistencia <= 80) {
        reasons.push({ tipo: 'Asistencia Moderada', valor: asistenciaFormato });
      }

      if (reasons.length > 0) {
        listaRiesgo.push({
          id: a.alumno?.id,
          dni: a.alumno?.dni || 'Sin DNI',
          nombre: a.alumno?.nombreCompleto || 'Alumno Desconocido',
          tutorNombre: a.tutor?.nombreCompleto || 'No asignado',
          tutorEmail: a.tutor?.email || 'N/A',
          reasons: reasons,
          riskLevel: riskLevel,
        });
      }
    });

    return { alumnosEnRiesgo: listaRiesgo, anioLectivo: anio };
  }, [reporte]);

  // --- NUEVA FUNCIÓN PARA COPIAR EMAIL ---
  const handleCopyEmail = (email, id) => {
    if (!email || email === 'N/A' || !navigator.clipboard) return;

    navigator.clipboard
      .writeText(email)
      .then(() => {
        setCopiedId(id);
        setTimeout(() => {
          setCopiedId(null);
        }, 2000);
      })
      .catch((err) => {
        console.error('Error al copiar el email: ', err);
      });
  };

  // --- HANDLERS NUEVOS ---

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === alumnosEnRiesgo.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(alumnosEnRiesgo.map((a) => a.id)));
    }
  };

  const handleOpenModal = (alumno) => {
    setSelectedStudent(alumno);
  };

  const handleCloseModal = () => {
    setSelectedStudent(null);
  };

  const handleSendAsistenciaMasiva = async () => {
    if (selectedIds.size === 0) {
      setFeedbackMasivo({
        type: 'warning',
        msg: 'Debe seleccionar al menos un alumno.',
      });
      return;
    }

    setIsSendingMasivo(true);
    setFeedbackMasivo({ type: '', msg: '' });

    const dnisToSend = alumnosEnRiesgo
      .filter((a) => selectedIds.has(a.id))
      .map((a) => a.dni);

    try {
      const response = await enviarAlertaAsistenciaMasiva(
        dnisToSend,
        anioLectivo
      );
      setFeedbackMasivo({
        type: 'success',
        msg: `Envío masivo completado. Exitosos: ${response.exitosos}, Fallidos: ${response.fallidos}.`,
      });
      setSelectedIds(new Set());
    } catch (error) {
      setFeedbackMasivo({
        type: 'danger',
        msg: error.message || 'Error en el envío masivo de asistencias.',
      });
    } finally {
      setIsSendingMasivo(false);
    }
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

  // --- RENDERIZADO COMPLETO ---
  return (
    <div>
      <BtnVolver />
      <EncabezadoCurso curso={reporte.curso} />
      <hr className="my-4" />

      <h4 className="mt-4">
        Reporte de Alumnos en Seguimiento ({alumnosEnRiesgo.length})
      </h4>
      <p>Alumnos que presentan notas bajas o ausentismo.</p>

      {/* --- SECCIÓN DE ACCIONES MASIVAS --- */}
      <div className="card shadow-sm p-3 mb-3">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Button
            variant="warning"
            onClick={handleSendAsistenciaMasiva}
            disabled={isSendingMasivo || selectedIds.size === 0}
          >
            {isSendingMasivo ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              '📧 Enviar Alerta Asistencia (Seleccionados)'
            )}
          </Button>
          <span className="text-muted">
            {selectedIds.size} de {alumnosEnRiesgo.length} seleccionados
          </span>
        </div>
        {feedbackMasivo.msg && (
          <Alert variant={feedbackMasivo.type} className="mt-3 mb-0">
            {feedbackMasivo.msg}
          </Alert>
        )}
      </div>

      {/* --- LISTA DE ALUMNOS EN RIESGO --- */}
      <div className="card shadow-sm mt-3" style={{ border: 'none' }}>
        {/* Encabezado Azul */}
        <div
          className="d-none d-md-flex row mx-0 align-items-center"
          style={{
            backgroundColor: '#004a99',
            color: 'white',
            padding: '0.75rem 0.5rem',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
          }}
        >
          <div className="col-md-1 text-center">
            <input
              type="checkbox"
              className="form-check-input"
              title="Seleccionar Todos"
              checked={
                alumnosEnRiesgo.length > 0 &&
                selectedIds.size === alumnosEnRiesgo.length
              }
              onChange={handleToggleSelectAll}
            />
          </div>
          <div className="col-md-2 fw-bold">Alumno</div>
          <div className="col-md-2 fw-bold">Tutor</div>
          <div className="col-md-3 fw-bold">Email Tutor</div>
          <div className="col-md-3 fw-bold">Alertas de Riesgo</div>
          <div className="col-md-1 fw-bold">Acción</div>
        </div>

        <div className="list-group list-group-flush">
          {alumnosEnRiesgo.length > 0 ? (
            alumnosEnRiesgo.map((alumno) => (
              <div
                key={alumno.id}
                className="list-group-item"
                style={{
                  borderLeft: `5px solid ${
                    alumno.riskLevel === 'danger' ? '#dc3545' : '#ffc107'
                  }`,
                }}
              >
                <div className="row align-items-center gy-2">
                  <div className="col-md-1 text-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedIds.has(alumno.id)}
                      onChange={() => handleToggleSelect(alumno.id)}
                    />
                  </div>
                  <div className="col-md-2">
                    <strong className="d-md-none">Alumno: </strong>
                    {alumno.nombre}
                  </div>
                  <div className="col-md-2">
                    <strong className="d-md-none">Tutor: </strong>
                    {alumno.tutorNombre}
                  </div>
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
                          height: 'auto',
                        }}
                      >
                        {alumno.tutorEmail}
                      </span>

                      {copiedId === alumno.id ? (
                        <span className="input-group-text bg-success text-white">
                          ¡Copiado!
                        </span>
                      ) : (
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() =>
                            handleCopyEmail(alumno.tutorEmail, alumno.id)
                          }
                          disabled={
                            !alumno.tutorEmail || alumno.tutorEmail === 'N/A'
                          }
                          title="Copiar email"
                        >
                          <i className="bi bi-copy"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
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
                  <div className="col-md-1 text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      title="Notificar (Individual)"
                      onClick={() => handleOpenModal(alumno)}
                    >
                      <i className="bi bi-send"></i>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="list-group-item">
              <div className="alert alert-success m-0">
                🎉 ¡Excelente! No hay alumnos en situación de riesgo.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL --- */}
      <NotificacionModal
        show={!!selectedStudent}
        onHide={handleCloseModal}
        alumno={selectedStudent}
        anioLectivo={anioLectivo}
      />
    </div>
  );
};

export default CursoComunicacion;
