import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Button,
  Form,
  Card,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { useConsultaStore } from "../../store/consultaStore.js";
import { getUserId } from "../../utils/jwt";
import { API_BASE_URL } from "../../api/fetchConfig";

// API específica para mail
const API_MAIL_URL = `${API_BASE_URL}/mail`;

// Opciones de envío de mail
const OpcionesEnvio = [
  {
    key: "notificacion",
    label: "Notificación General",
    placeholder: "Ingrese el mensaje...",
    requires: ["asunto", "mensaje"],
  },
  {
    key: "reunion",
    label: "Convocar a Reunión",
    placeholder: "Ingrese el motivo y detalles de la reunión...",
    requires: ["asunto", "fechaReunion", "horaReunion"],
  },
  {
    key: "alerta",
    label: "Alerta de Asistencia",
    placeholder: "Detalle las observaciones sobre las faltas...",
    requires: ["mensaje"],
  },
];

// Estilos
const styles = {
  pageContainer: {
    padding: "0 40px 40px 40px",
    backgroundColor: "#f4f7fa",
    minHeight: "calc(100vh - 80px)",
    fontFamily: "'Inter', sans-serif",
  },
  mainTitleContainer: {
    textAlign: "center",
    marginBottom: "20px",
    marginTop: "15px",
  },
  card: {
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  infoTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    borderBottom: "1px solid #ddd",
    paddingBottom: "10px",
    marginBottom: "15px",
  },
  listContainer: {
    maxHeight: "400px",
    overflowY: "auto",
    border: "1px solid #eee",
    padding: "10px",
    borderRadius: "4px",
  },
  checkboxItem: {
    marginBottom: "8px",
  },
};

const GenerarMail = () => {
  // Store
  const { reporteAlumno } = useConsultaStore();

  // Estado - Datos
  const [_reporte, setReporte] = useState(null);
  const [anioLectivo, setAnioLectivo] = useState(new Date().getFullYear());
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);

  // Estado - Selección de destinatarios
  const [tipoDestino, setTipoDestino] = useState("alumnos");
  const [selectedCursoId, setSelectedCursoId] = useState("");
  const [selectedCursosIds, setSelectedCursosIds] = useState({});
  const [selectedAlumnosDNI, setSelectedAlumnosDNI] = useState({});

  // Estado - Formulario de mail
  const [tipoEnvio, setTipoEnvio] = useState("notificacion");
  const [mailData, setMailData] = useState({
    asunto: "",
    mensaje: "",
    fechaReunion: "",
    horaReunion: "",
  });

  // Estado - UI
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  // Endpoints dinámicos
  const ENDPOINTS = useMemo(
    () => ({
      notificacion: {
        alumno: "/notificacion-general-masiva",
        curso: "/curso/notificacion-general",
        cursos: "/cursos/notificacion-general",
      },
      reunion: {
        alumno: "/notificacion-reunion-masiva",
        curso: "/curso/notificacion-reunion",
      },
      alerta: {
        alumno: "/alerta-asistencia-masiva",
        curso: "/curso/alerta-asistencia",
      },
    }),
    []
  );

  // Valores computados
  const mostrarCamposReunion = tipoEnvio === "reunion";
  const currentPlaceholder =
    OpcionesEnvio.find((op) => op.key === tipoEnvio)?.placeholder ||
    "Ingrese el mensaje o detalles...";
  const isSendDisabled = isLoadingData || isLoadingSend;

  // --- Handlers ---

  const handleMailChange = useCallback((e) => {
    const { name, value } = e.target;
    setMailData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePlantillaChange = useCallback((e) => {
    setTipoEnvio(e.target.value);
    setMailData({ asunto: "", mensaje: "", fechaReunion: "", horaReunion: "" });
  }, []);

  const handleDestinoChange = (destino) => {
    setTipoDestino(destino);
    setSelectedCursoId("");
    setSelectedCursosIds({});
    setSelectedAlumnosDNI({});
    setAlumnosFiltrados([]);
  };

  const handleToggleCursoEnvio = (idCurso) => {
    setSelectedCursosIds((prev) => ({ ...prev, [idCurso]: !prev[idCurso] }));
  };

  const handleToggleAlumno = (dni) => {
    setSelectedAlumnosDNI((prev) => ({ ...prev, [dni]: !prev[dni] }));
  };

  // --- Funciones de carga de datos ---

  const cargarCursosDisponibles = useCallback(async (currentAnio) => {
    setIsLoadingData(true);
    setResponseMessage(null);
    try {
      const { data } = await axios.get(`${API_MAIL_URL}/cursos/${currentAnio}`);
      setCursosDisponibles(data.data);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
      setResponseMessage({
        variant: "danger",
        text: "Error al cargar cursos disponibles.",
      });
      setCursosDisponibles([]);
      setSelectedCursoId("");
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  const cargarAlumnosPorCurso = useCallback(
    async (cursoId, anioLectivoActual) => {
      const cursoSeleccionado = cursosDisponibles.find(
        (c) => c.id_curso === cursoId
      );

      if (!cursoSeleccionado) {
        setAlumnosFiltrados([]);
        return;
      }

      const { anio_curso, division } = cursoSeleccionado;

      setIsLoadingData(true);
      try {
        const url = `${API_MAIL_URL}/curso/${anio_curso}/${division}/${anioLectivoActual}/alumnos`;
        const { data } = await axios.get(url);
        setAlumnosFiltrados(data.data);
        setSelectedAlumnosDNI({});
        setResponseMessage(null);
      } catch (error) {
        console.error("Error al cargar alumnos por curso:", error);
        setAlumnosFiltrados([]);
        const errorMsg =
          error.response?.data?.message ||
          `No se encontraron alumnos para el curso ${anio_curso}° división ${division}.`;
        setResponseMessage({ variant: "info", text: errorMsg });
      } finally {
        setIsLoadingData(false);
      }
    },
    [cursosDisponibles]
  );

  // --- Validación y envío ---

  const validarCampos = useCallback(() => {
    const requiredFields =
      OpcionesEnvio.find((op) => op.key === tipoEnvio)?.requires || [];

    const fieldNames = {
      asunto: "Asunto / Motivo",
      mensaje: "Mensaje / Observaciones",
      fechaReunion: "Fecha",
      horaReunion: "Hora",
    };

    for (const field of requiredFields) {
      if (!mailData[field]) {
        setResponseMessage({
          variant: "warning",
          text: `El campo "${fieldNames[field] || field}" es requerido.`,
        });
        return false;
      }
    }

    if (tipoDestino === "alumnos") {
      const alumnosSeleccionados = Object.keys(selectedAlumnosDNI).filter(
        (dni) => selectedAlumnosDNI[dni]
      );
      if (alumnosSeleccionados.length === 0) {
        setResponseMessage({
          variant: "warning",
          text: "Debe seleccionar al menos un alumno para el envío individual.",
        });
        return false;
      }
    }

    if (tipoDestino === "cursos") {
      const cursosSeleccionados = Object.keys(selectedCursosIds).filter(
        (id) => selectedCursosIds[id]
      );
      if (cursosSeleccionados.length === 0) {
        setResponseMessage({
          variant: "warning",
          text: "Debe seleccionar al menos un curso para el envío masivo.",
        });
        return false;
      }
      
      // ✅ VALIDACIÓN NUEVA: Múltiples cursos solo con notificación
      if (cursosSeleccionados.length > 1 && tipoEnvio !== "notificacion") {
        setResponseMessage({
          variant: "warning",
          text: "Solo se puede enviar a múltiples cursos con 'Notificación General'. Para reuniones o alertas, seleccione un curso a la vez.",
        });
        return false;
      }
    }

    return true;
  }, [tipoEnvio, mailData, tipoDestino, selectedAlumnosDNI, selectedCursosIds]);

  const construirRequestBody = () => {
    // ✅ Obtener ID del usuario autenticado desde el token
    const id_usuario = getUserId();
    const requestBody = { id_usuario: id_usuario || 1 }; // Fallback a 1 si no hay usuario

    // Agregar destinatarios
    if (tipoDestino === "alumnos") {
      requestBody.dnis = Object.keys(selectedAlumnosDNI).filter(
        (dni) => selectedAlumnosDNI[dni]
      );
      requestBody.anio = anioLectivo;
    } else if (tipoDestino === "cursos") {
      const selectedIds = Object.keys(selectedCursosIds)
        .filter((id) => selectedCursosIds[id])
        .map(Number);

      // ✅ Para múltiples cursos (solo notificación general)
      if (tipoEnvio === "notificacion" && selectedIds.length > 1) {
        requestBody.cursos = cursosDisponibles
          .filter((c) => selectedIds.includes(c.id_curso))
          .map((c) => ({
            anio_curso: c.anio_curso,
            division: c.division,
            anio_lectivo: anioLectivo,
          }));
      } 
      // ✅ Para curso único (cualquier tipo de envío)
      else if (selectedIds.length === 1) {
        const cursoSeleccionado = cursosDisponibles.find(
          (c) => c.id_curso === selectedIds[0]
        );
        requestBody.anio_curso = cursoSeleccionado.anio_curso;
        requestBody.division = cursoSeleccionado.division;
        requestBody.anio_lectivo = anioLectivo;
      }
    }

    // Agregar datos específicos según tipo de envío
    if (tipoEnvio === "reunion") {
      requestBody.reunionData = {
        motivo: mailData.asunto,
        fecha: mailData.fechaReunion,
        hora: mailData.horaReunion,
        observaciones: mailData.mensaje,
        lugar: "Instituto",
      };
    } else if (tipoEnvio === "alerta") {
      requestBody.faltasMaximas = 20;
      requestBody.notificacionData = {
        asunto: "Alerta de Asistencia",
        mensaje: mailData.mensaje,
        tipo: "urgente",
      };
    } else if (tipoEnvio === "notificacion") {
      requestBody.notificacionData = {
        asunto: mailData.asunto,
        mensaje: mailData.mensaje,
        tipo: "informacion",
      };
    }

    return requestBody;
  };

  const obtenerEndpoint = () => {
    // ✅ Para alumnos individuales
    if (tipoDestino === "alumnos") {
      return ENDPOINTS[tipoEnvio].alumno;
    }

    // ✅ Para cursos
    const selectedIds = Object.keys(selectedCursosIds)
      .filter((id) => selectedCursosIds[id])
      .map(Number);

    // ✅ Múltiples cursos solo para notificación
    if (selectedIds.length > 1 && tipoEnvio === "notificacion") {
      return ENDPOINTS.notificacion.cursos;
    }

    // ✅ Curso único: usar endpoint según tipo de envío
    return ENDPOINTS[tipoEnvio].curso;
  };

  const handleEnviarMail = async () => {
    setResponseMessage(null);

    if (!validarCampos()) return;

    setIsLoadingSend(true);

    try {
      const endpoint = obtenerEndpoint();
      const requestBody = construirRequestBody();
      const fullUrl = API_MAIL_URL + endpoint;

      console.log("=== DEBUG INFO ===");
      console.log("Tipo de envío:", tipoEnvio);
      console.log("Tipo de destino:", tipoDestino);
      console.log("Endpoint:", endpoint);
      console.log("URL completa:", fullUrl);
      console.log("Request Body:", JSON.stringify(requestBody, null, 2));

      const { data } = await axios.post(fullUrl, requestBody);

      setResponseMessage({
        variant: "success",
        text: data.message || "Envío masivo exitoso.",
      });

      setMailData({
        asunto: "",
        mensaje: "",
        fechaReunion: "",
        horaReunion: "",
      });
      
      // ✅ Limpiar selecciones
      setSelectedCursosIds({});
      setSelectedAlumnosDNI({});
      
    } catch (error) {
      console.error("=== ERROR DETAILS ===");
      console.error("Error al enviar mail masivo:", error);
      console.error("Response data:", error.response?.data);
      console.error("Error message:", error.message);
      
      let errorMsg = "Error de conexión con el servidor.";
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.status) {
        errorMsg = `Error ${error.response.status}: ${error.response.statusText}`;
      }
      
      setResponseMessage({
        variant: "danger",
        text: `Fallo el envío masivo: ${errorMsg}`,
      });
    } finally {
      setIsLoadingSend(false);
    }
  };

  // --- Effects ---

  useEffect(() => {
    cargarCursosDisponibles(anioLectivo);
  }, [anioLectivo, cargarCursosDisponibles]);

  useEffect(() => {
    if (tipoDestino === "alumnos" && selectedCursoId) {
      cargarAlumnosPorCurso(selectedCursoId, anioLectivo);
    } else {
      setAlumnosFiltrados([]);
    }
  }, [selectedCursoId, tipoDestino, anioLectivo, cargarAlumnosPorCurso]);

  useEffect(() => {
    let dataToSet = reporteAlumno;
    if (!dataToSet) {
      const storedData = sessionStorage.getItem("reporteAlumno");
      if (storedData) {
        dataToSet = JSON.parse(storedData);
      }
    }
    if (dataToSet) {
      setReporte(dataToSet);
    }
  }, [reporteAlumno]);

  // --- Render ---

  return (
    <div className='curso-dashboard-container' style={styles.pageContainer}>
<div className="curso-dashboard-header mt-3">
        <span className="material-symbols-outlined curso-dashboard-icon">
          mail
        </span>
        <h2 className="curso-dashboard-title">Generar Mail</h2>
      </div>
      {responseMessage && (
        <Alert variant={responseMessage.variant} className="mt-3">
          {responseMessage.text}
        </Alert>
      )}

      <Row className="mt-4">
        {/* Columna de Filtros y Selección */}
        <Col md={4}>
          <Card style={styles.card}>
            <div style={styles.infoTitle}>Filtros de Destino</div>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600 }}>Año Lectivo</Form.Label>
              <Form.Control
                type="number"
                value={anioLectivo}
                onChange={(e) => setAnioLectivo(Number(e.target.value))}
                disabled={isSendDisabled}
              />
            </Form.Group>

            <div className="mt-4" style={styles.infoTitle}>
              Tipo de Destinatario
            </div>
            <Form.Group className="mb-3">
              <Form.Check
                type="radio"
                label="Alumno Individual"
                name="destinoRadio"
                value="alumnos"
                checked={tipoDestino === "alumnos"}
                onChange={() => handleDestinoChange("alumnos")}
                disabled={isSendDisabled}
                className="mb-2"
              />
              <Form.Check
                type="radio"
                label="Cursos Completos"
                name="destinoRadio"
                value="cursos"
                checked={tipoDestino === "cursos"}
                onChange={() => handleDestinoChange("cursos")}
                disabled={isSendDisabled}
              />
            </Form.Group>

            {tipoDestino === "alumnos" && (
              <>
                <div className="mt-4" style={styles.infoTitle}>
                  Filtro por Curso
                </div>
                <Form.Group className="mb-4">
                  <Form.Control
                    as="select"
                    value={selectedCursoId}
                    onChange={(e) => setSelectedCursoId(Number(e.target.value))}
                    disabled={isSendDisabled || cursosDisponibles.length === 0}
                  >
                    <option value="">-- Seleccionar Curso --</option>
                    {cursosDisponibles.map((curso) => (
                      <option key={curso.id_curso} value={curso.id_curso}>
                        {curso.anio_curso}° {curso.nombre_curso}{" "}
                        {curso.division}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </>
            )}

            {/* ✅ ALERTA NUEVA para múltiples cursos */}
            {tipoDestino === "cursos" && 
             tipoEnvio !== "notificacion" && 
             Object.keys(selectedCursosIds).filter(id => selectedCursosIds[id]).length > 1 && (
              <Alert variant="warning" className="mb-3">
                ⚠️ Para <strong>Reuniones</strong> y <strong>Alertas</strong>, solo puede seleccionar UN curso a la vez.
                Para múltiples cursos, use <strong>Notificación General</strong>.
              </Alert>
            )}

            <div className="mt-4" style={styles.infoTitle}>
              Seleccionar
            </div>

            {isLoadingData ? (
              <div className="text-center">
                <Spinner animation="border" size="sm" /> Cargando datos...
              </div>
            ) : (
              <div style={styles.listContainer}>
                {tipoDestino === "cursos" ? (
                  cursosDisponibles.length === 0 ? (
                    <Alert variant="info" className="mb-0">
                      No hay cursos disponibles para el año {anioLectivo}.
                    </Alert>
                  ) : (
                    cursosDisponibles.map((curso) => (
                      <div key={curso.id_curso} style={styles.checkboxItem}>
                        <Form.Check
                          type="checkbox"
                          label={`${curso.anio_curso}° ${curso.nombre_curso} ${curso.division} (${curso.cantidad_alumnos} alumnos)`}
                          checked={selectedCursosIds[curso.id_curso] || false}
                          onChange={() =>
                            handleToggleCursoEnvio(curso.id_curso)
                          }
                          disabled={isSendDisabled}
                        />
                      </div>
                    ))
                  )
                ) : selectedCursoId === "" ? (
                  <Alert variant="secondary" className="mb-0">
                    Seleccione un curso primero.
                  </Alert>
                ) : alumnosFiltrados.length === 0 ? (
                  <Alert variant="info" className="mb-0">
                    No hay alumnos activos en este curso.
                  </Alert>
                ) : (
                  alumnosFiltrados.map((alumno) => (
                    <div key={alumno.dni} style={styles.checkboxItem}>
                      <Form.Check
                        type="checkbox"
                        label={`${alumno.apellido} ${alumno.nombre} (${alumno.dni})`}
                        checked={selectedAlumnosDNI[alumno.dni] || false}
                        onChange={() => handleToggleAlumno(alumno.dni)}
                        disabled={isSendDisabled}
                      />
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        </Col>

        {/* Columna de Formulario */}
        <Col md={8}>
          <Card style={styles.card}>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label style={styles.infoTitle}>
                  Tipo de Comunicación
                </Form.Label>
                <Form.Control
                  as="select"
                  value={tipoEnvio}
                  onChange={handlePlantillaChange}
                  disabled={isSendDisabled}
                >
                  {OpcionesEnvio.map((op) => (
                    <option key={op.key} value={op.key}>
                      {op.label}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={styles.infoTitle}>
                  {tipoEnvio === "reunion"
                    ? "Motivo de la Reunión *"
                    : "Asunto *"}
                </Form.Label>
                <Form.Control
                  type="text"
                  name="asunto"
                  value={mailData.asunto}
                  onChange={handleMailChange}
                  disabled={isSendDisabled}
                />
              </Form.Group>

              {mostrarCamposReunion && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={styles.infoTitle}>Fecha *</Form.Label>
                      <Form.Control
                        type="date"
                        name="fechaReunion"
                        value={mailData.fechaReunion}
                        onChange={handleMailChange}
                        disabled={isSendDisabled}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label style={styles.infoTitle}>Hora *</Form.Label>
                      <Form.Control
                        type="time"
                        name="horaReunion"
                        value={mailData.horaReunion}
                        onChange={handleMailChange}
                        disabled={isSendDisabled}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}

              <Form.Group className="mb-3">
                <Form.Label style={styles.infoTitle}>
                  Mensaje / Observaciones *
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={mostrarCamposReunion ? 4 : 8}
                  name="mensaje"
                  value={mailData.mensaje}
                  onChange={handleMailChange}
                  placeholder={currentPlaceholder}
                  disabled={isSendDisabled}
                />
              </Form.Group>
            </Form>

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="primary"
                onClick={handleEnviarMail}
                disabled={isSendDisabled}
                style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
              >
                {isLoadingSend ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Enviando...
                  </>
                ) : (
                  "Enviar Mail"
                )}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GenerarMail;