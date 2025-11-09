import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Spinner, Button, Form, Card, Alert, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useConsultaStore } from "../../store/consultaStore";
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import EncabezadoEstudiante from "../../components/ui/EncabezadoEstudiante.jsx";
import DivHeaderInfo from "../../components/alumno/DivHeaderInfo.jsx";
import DivBodyInfo from "../../components/alumno/DivBodyInfo.jsx";
import "../../styles/perfilAlumno.css";
import "../../styles/generarMailAlumno.css";
// --- Configuración general ---
const API_BASE_URL = "http://localhost:3000/api/v1/mail";
const ID_USUARIO = 1;

// --- Tipos de mensajes ---
const OpcionesEnvio = [
  {
    key: "notificacion",
    label: "Notificación General",
    placeholder: "Ingrese el mensaje...",
    requires: ["asunto", "mensaje"],
    endpoint: "/notificacion-general",
  },
  {
    key: "reunion",
    label: "Convocar a Reunión",
    placeholder: "Ingrese el motivo y detalles de la reunión...",
    requires: ["asunto", "fechaReunion", "horaReunion", "mensaje"],
    endpoint: "/notificacion-reunion",
  },
  {
    key: "alerta",
    label: "Alerta de Asistencia",
    placeholder: "Detalle las observaciones sobre las faltas...",
    requires: ["mensaje"],
    endpoint: "/alerta-asistencia",
  },
];

const GenerarMailAlumno = () => {
  const { reporteAlumno } = useConsultaStore();
  const [reporte, setReporte] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Estado del formulario ---
  const [tipoEnvio, setTipoEnvio] = useState("notificacion");
  const [mailData, setMailData] = useState({
    asunto: "",
    mensaje: "",
    fechaReunion: "",
    horaReunion: "",
  });
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  // --- Cargar datos del alumno ---
  useEffect(() => {
    let dataToSet = reporteAlumno;
    if (!dataToSet) {
      const stored = sessionStorage.getItem("reporteAlumno");
      if (stored) dataToSet = JSON.parse(stored);
    }
    setReporte(dataToSet);
    setLoading(false);
  }, [reporteAlumno]);

  // --- Handlers ---
  const handleMailChange = (e) => {
    const { name, value } = e.target;
    setMailData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlantillaChange = (e) => {
    setTipoEnvio(e.target.value);
    setMailData({
      asunto: "",
      mensaje: "",
      fechaReunion: "",
      horaReunion: "",
    });
    setResponseMessage(null);
  };

  const validarCampos = useCallback(() => {
    const opcion = OpcionesEnvio.find((op) => op.key === tipoEnvio);
    for (const field of opcion.requires) {
      if (!mailData[field]?.trim()) {
        setResponseMessage({
          variant: "warning",
          text: `El campo "${field}" es requerido.`,
        });
        return false;
      }
    }
    return true;
  }, [tipoEnvio, mailData]);

  const construirRequestBody = () => {
    const requestBody = {
      id_usuario: ID_USUARIO,
      dni: reporte.dni,
      anio: reporte.anio_lectivo || "2025",
    };

    if (tipoEnvio === "reunion") {
      requestBody.reunionData = {
        motivo: mailData.asunto,
        fecha: mailData.fechaReunion,
        hora: mailData.horaReunion,
        observaciones: mailData.mensaje,
        lugar: "Instituto",
      };
    } else if (tipoEnvio === "alerta") {
      requestBody.notificacionData = {
        asunto: "Alerta de Asistencia",
        mensaje: mailData.mensaje,
        tipo: "urgente",
      };
    } else {
      requestBody.notificacionData = {
        asunto: mailData.asunto,
        mensaje: mailData.mensaje,
        tipo: "informacion",
      };
    }

    return requestBody;
  };

  const handleEnviarMail = async () => {
    setResponseMessage(null);
    if (!validarCampos()) return;
    setIsLoadingSend(true);

    try {
      const opcion = OpcionesEnvio.find((op) => op.key === tipoEnvio);
      const { data } = await axios.post(
        `${API_BASE_URL}${opcion.endpoint}`,
        construirRequestBody()
      );

      setResponseMessage({
        variant: "success",
        text: data.message || "Correo enviado correctamente.",
      });
      setMailData({
        asunto: "",
        mensaje: "",
        fechaReunion: "",
        horaReunion: "",
      });
    } catch (error) {
      setResponseMessage({
        variant: "danger",
        text: error.response?.data?.message || "Error al enviar el correo.",
      });
    } finally {
      setIsLoadingSend(false);
    }
  };

  // --- Loading / sin datos ---
  if (loading) {
    return (
      <div className="gma-perfil-alumno-loading-container">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando datos...</p>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="gma-perfil-alumno-loading-container">
        <h5>No se encontraron datos del alumno.</h5>
        <Link to="/">
          <Button variant="secondary">Volver</Button>
        </Link>
      </div>
    );
  }

  // --- Render principal ---
  return (
    <div className="gma-perfil-alumno-container" style={{ paddingBottom: "3rem" }}>
      <BtnVolver />
      <EncabezadoEstudiante
        nombre={reporte.nombre || "Alumno"}
        dni={reporte.dni || ""}
        curso={reporte.curso || ""}
      />
      <DivHeaderInfo />

      {/* === Distribución en dos columnas: Info del alumno + Formulario === */}
      <div className="gma-container mt-4">
        <Row>
          {/* Columna izquierda: información del alumno */}
          <Col md={5}>
            <Card className="gma-card shadow-sm p-3 mb-4">
              <h5 className="mb-3 text-center">📘 Información del Alumno</h5>
              <DivBodyInfo />
            </Card>
          </Col>

          {/* Columna derecha: formulario de envío de mail */}
          <Col md={7}>
            <h3 className="gma-text-center mb-4">Enviar Correo al Tutor</h3>

            {responseMessage && (
              <Alert
                variant={responseMessage.variant}
                onClose={() => setResponseMessage(null)}
                dismissible
              >
                {responseMessage.text}
              </Alert>
            )}

            <Card className="gma-card p-4 shadow-sm">
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tipo de Comunicación</Form.Label>
                      <Form.Select
                        value={tipoEnvio}
                        onChange={handlePlantillaChange}
                        disabled={isLoadingSend}
                      >
                        {OpcionesEnvio.map((op) => (
                          <option key={op.key} value={op.key}>
                            {op.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {tipoEnvio !== "alerta" && (
                  <Form.Group className="mb-3">
                    <Form.Label>Asunto *</Form.Label>
                    <Form.Control
                      type="text"
                      name="asunto"
                      value={mailData.asunto}
                      onChange={handleMailChange}
                      placeholder="Ej: Información importante"
                    />
                  </Form.Group>
                )}

                {tipoEnvio === "reunion" && (
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha *</Form.Label>
                        <Form.Control
                          type="date"
                          name="fechaReunion"
                          value={mailData.fechaReunion}
                          onChange={handleMailChange}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Hora *</Form.Label>
                        <Form.Control
                          type="time"
                          name="horaReunion"
                          value={mailData.horaReunion}
                          onChange={handleMailChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Mensaje *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    name="mensaje"
                    value={mailData.mensaje}
                    onChange={handleMailChange}
                    placeholder={
                      OpcionesEnvio.find((op) => op.key === tipoEnvio)
                        ?.placeholder
                    }
                  />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="outline-secondary"
                    onClick={() =>
                      setMailData({
                        asunto: "",
                        mensaje: "",
                        fechaReunion: "",
                        horaReunion: "",
                      })
                    }
                  >
                    Limpiar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleEnviarMail}
                    disabled={isLoadingSend}
                  >
                    {isLoadingSend ? (
                      <>
                        <Spinner size="sm" animation="border" /> Enviando...
                      </>
                    ) : (
                      "Enviar Email"
                    )}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default GenerarMailAlumno;
