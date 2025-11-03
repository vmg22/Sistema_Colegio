// Archivo: src/components/curso/NotificacionModal.jsx

import React, { useState, useMemo } from 'react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap'; // Asumo que usas react-bootstrap
import {
  enviarAlertaAsistencia,
  enviarNotificacionGeneral,
} from '../../service/mailservice'; // Asegúrate de importar tus servicios

const NotificacionModal = ({ show, onHide, alumno, anioLectivo }) => {
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Resetea el estado al cerrar
  const handleClose = () => {
    onHide();
    setTimeout(() => {
      setIsSending(false);
      setFeedback({ type: '', message: '' });
    }, 300); // Espera a la animación de cierre
  };

  // 1. Identifica las razones para mostrar los botones correctos
  const { asistenciaReason, notaReason } = useMemo(() => {
    if (!alumno) return {};
    return {
      asistenciaReason: alumno.reasons.find((r) =>
        r.tipo.includes('Asistencia')
      ),
      notaReason: alumno.reasons.find((r) => r.tipo === 'Notas'),
    };
  }, [alumno]);

  // 2. Handler para enviar alerta de ASISTENCIA
  const handleSendAsistencia = async () => {
    setIsSending(true);
    setFeedback({ type: '', message: '' });
    try {
      // Llama al servicio singular
      const response = await enviarAlertaAsistencia(alumno.dni, anioLectivo);
      setFeedback({
        type: 'success',
        message:
          response.mensaje || 'Alerta de asistencia enviada correctamente.',
      });
    } catch (error) {
      setFeedback({
        type: 'danger',
        message: error.message || 'Error al enviar la alerta de asistencia.',
      });
    } finally {
      setIsSending(false);
    }
  };

  // 3. Handler para enviar alerta de NOTAS (personalizada)
  const handleSendNotas = async () => {
    setIsSending(true);
    setFeedback({ type: '', message: '' });

    // Construimos el mensaje personalizado
    const notificacionData = {
      asunto: `Alerta de Calificaciones: ${alumno.nombre}`,
      mensaje: `
        <p>Estimado/a tutor/a,</p>
        <p>Le informamos que el alumno <strong>${alumno.nombre}</strong> presenta un rendimiento académico que requiere seguimiento.</p>
        <p><strong>Detalle:</strong> Calificaciones Bajas (Promedio actual: <strong>${notaReason.valor}</strong>)</p>
        <p>Por favor, le solicitamos contactarse con la institución para conversar sobre su situación.</p>
      `,
      tipo: 'aviso', // 'aviso', 'urgente', etc.
    };

    try {
      // Llama al servicio general singular
      await enviarNotificacionGeneral(alumno.dni, anioLectivo, notificacionData);
      setFeedback({
        type: 'success',
        message: 'Notificación de notas enviada correctamente.',
      });
    } catch (error) {
      setFeedback({
        type: 'danger',
        message: error.message || 'Error al enviar la notificación de notas.',
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!alumno) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Notificar a Tutor de: {alumno.nombre}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {feedback.message && (
          <Alert variant={feedback.type}>{feedback.message}</Alert>
        )}

        {isSending && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Enviando...</span>
            </Spinner>
            <p>Enviando notificación...</p>
          </div>
        )}

        {!isSending && !feedback.type && (
          <>
            <p>
              <strong>Tutor:</strong> {alumno.tutorNombre}
              <br />
              <strong>Email:</strong> {alumno.tutorEmail}
            </p>
            <p>Seleccione la alerta que desea enviar:</p>

            {/* Botón condicional para Asistencia */}
            {asistenciaReason && (
              <Button
                variant="warning"
                className="w-100 mb-2"
                onClick={handleSendAsistencia}
                disabled={isSending}
              >
                Enviar Alerta de Asistencia ({asistenciaReason.valor})
              </Button>
            )}

            {/* Botón condicional para Notas */}
            {notaReason && (
              <Button
                variant="danger"
                className="w-100"
                onClick={handleSendNotas}
                disabled={isSending}
              >
                Enviar Alerta de Notas Bajas (Promedio: {notaReason.valor})
              </Button>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {feedback.type ? 'Cerrar' : 'Cancelar'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificacionModal;