// src/pages/comunicaciones/CursoComunicacion.jsx (Reemplaza el contenido de tu antiguo GenerarMail.jsx)

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

// Componentes Importados (Asegura estas rutas)
import BtnVolver from "../../components/ui/BtnVolver.jsx"; 
import EncabezadoCurso from "../../components/curso/EncabezadoCurso.jsx"; 
import { useConsultaStore } from "../../store/consultaStore"; // ¡El store que adaptaste!

// ==========================================================
// DECLARACIÓN DE CONSTANTES Y ESTILOS
// ==========================================================

const API_BASE_URL = "http://localhost:3000/api/v1/mail";
const ID_USUARIO = 1;

// Opciones de envío de mail
const OpcionesEnvio = [
    { key: "notificacion", label: "Notificación General", placeholder: "Ingrese el mensaje...", requires: ["asunto", "mensaje"] },
    { key: "reunion", label: "Convocar a Reunión", placeholder: "Ingrese el motivo y detalles de la reunión...", requires: ["asunto", "fechaReunion", "horaReunion"] },
    { key: "alerta", label: "Alerta de Asistencia", placeholder: "Detalle las observaciones sobre las faltas...", requires: ["mensaje"] },
];

// Estilos (Se mantienen)
const styles = {
    pageContainer: {
        padding: "0 40px 40px 40px",
        backgroundColor: "#f4f7fa",
        minHeight: "calc(100vh - 80px)",
        fontFamily: "'Inter', sans-serif",
    },
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        marginTop: '15px',
    },
    title: {
        fontWeight: 600,
        fontSize: '2rem',
        color: '#333',
        marginLeft: '15px',
    },
    icon: {
        fontSize: '2rem',
        color: '#4f70b5',
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
    mainTitleContainer: { 
        textAlign: "center",
        marginBottom: "20px",
        marginTop: "15px",
    },
};

// ==========================================================
// COMPONENTE PRINCIPAL (Reemplazo de GenerarMail)
// ==========================================================

const CursoComunicacion = () => {
    // Store: Incluimos IDs individuales para mayor robustez
    const { 
        reporteCurso, 
        selectedCursoId, // <-- ID del curso
        selectedCursoNombre,
    } = useConsultaStore();

    // 1. Obtener datos del curso actual del store (Fijados por el perfil)
    const cursoData = useMemo(() => {
        const stored = reporteCurso || JSON.parse(sessionStorage.getItem("reporteCurso"));
        const anio = stored?.anio_lectivo || new Date().getFullYear();
        
        // Determinar el ID: Prioridad 1: ID en reporte, Prioridad 2: selectedCursoId del store
        const cursoId = stored?.id_curso || selectedCursoId || undefined;
        
        if (!cursoId) {
            return { id: undefined, alumnos: [] }; 
        }
        
        return {
            id: cursoId, 
            anio: anio,
            anioCurso: stored?.curso?.anio_curso,
            division: stored?.curso?.division,
            nombre: stored?.curso?.nombre || selectedCursoNombre, 
            alumnos: stored?.alumnos || [], 
            materia: stored?.materia || {}
        };
    }, [reporteCurso, selectedCursoId, selectedCursoNombre]); 

    // Estado - Datos
    const [anioLectivo, ] = useState(cursoData.anio); 
    const [alumnosFiltrados, setAlumnosFiltrados] = useState(cursoData.alumnos); 

    // Estado - Selección de destinatarios
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
    const [isLoadingSend, setIsLoadingSend] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);

    // Endpoints dinámicos
    const ENDPOINTS = useMemo(
        () => ({
            notificacion: { alumno: "/notificacion-general/masiva", curso: "/notificacion-general/curso" },
            reunion: { alumno: "/notificacion-reunion/masiva", curso: "/notificacion-reunion/curso" },
            alerta: { alumno: "/alerta-asistencia/masiva", curso: "/alerta-asistencia/curso" },
        }),
        []
    );

    // Valores computados
    const mostrarCamposReunion = tipoEnvio === "reunion";
    const currentPlaceholder =
        OpcionesEnvio.find((op) => op.key === tipoEnvio)?.placeholder ||
        "Ingrese el mensaje o detalles...";
    const isSendDisabled = isLoadingSend || cursoData.id === undefined;

    const isAllSelected = useMemo(() => {
        if (alumnosFiltrados.length === 0) return false;
        const selectedCount = Object.values(selectedAlumnosDNI).filter(v => v).length;
        return selectedCount === alumnosFiltrados.length;
    }, [alumnosFiltrados, selectedAlumnosDNI]);
    
    const selectedDNIs = useMemo(() => 
        alumnosFiltrados
            .filter(a => selectedAlumnosDNI[a.dni])
            .map(a => a.dni)
    , [alumnosFiltrados, selectedAlumnosDNI]);


    // --- Handlers y Lógica ---

    const handleMailChange = useCallback((e) => {
        const { name, value } = e.target;
        setMailData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handlePlantillaChange = useCallback((e) => {
        setTipoEnvio(e.target.value);
        setMailData({ asunto: "", mensaje: "", fechaReunion: "", horaReunion: "" });
    }, []);
    
    const handleToggleAlumno = (dni) => {
        setSelectedAlumnosDNI((prev) => ({ ...prev, [dni]: !prev[dni] }));
    };
    
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedAlumnosDNI({});
        } else {
            const allDNI = alumnosFiltrados.reduce((acc, alumno) => {
                acc[alumno.dni] = true;
                return acc;
            }, {});
            setSelectedAlumnosDNI(allDNI);
        }
    };


    // --- VALIDACIÓN ---
    const validarCampos = useCallback(() => {
        const requiredFields = OpcionesEnvio.find((op) => op.key === tipoEnvio)?.requires || [];

        const fieldNames = {
            asunto: "Asunto / Motivo", mensaje: "Mensaje / Observaciones", 
            fechaReunion: "Fecha", horaReunion: "Hora",
        };

        for (const field of requiredFields) {
            if (!mailData[field]) {
                setResponseMessage({ variant: "warning", text: `El campo "${fieldNames[field] || field}" es requerido.` });
                return false;
            }
        }
        
        if (selectedDNIs.length === 0) {
            setResponseMessage({ variant: "warning", text: "Debe seleccionar al menos un alumno para el envío." });
            return false;
        }

        return true;
    }, [tipoEnvio, mailData, selectedDNIs]);

    // --- CONSTRUCCIÓN DEL BODY ---
    const construirRequestBody = useCallback(() => {
        const requestBody = { id_usuario: ID_USUARIO };

        // Datos del curso del perfil
        requestBody.anio_curso = cursoData.anioCurso;
        requestBody.division = cursoData.division;
        requestBody.anio_lectivo = anioLectivo;

        // Lista de destinatarios
        requestBody.dnis = selectedDNIs; 
        
        if (tipoEnvio === "reunion") {
            requestBody.reunionData = {
                motivo: mailData.asunto, fecha: mailData.fechaReunion, hora: mailData.horaReunion,
                observaciones: mailData.mensaje, lugar: "Instituto",
            };
        } else if (tipoEnvio === "alerta") {
            requestBody.faltasMaximas = 20;
            requestBody.notificacionData = { asunto: "Alerta de Asistencia", mensaje: mailData.mensaje, tipo: "urgente" };
        } else if (tipoEnvio === "notificacion") {
            requestBody.notificacionData = { asunto: mailData.asunto, mensaje: mailData.mensaje, tipo: "informacion" };
        }

        return requestBody;
    }, [cursoData, anioLectivo, selectedDNIs, tipoEnvio, mailData]);

    // --- OBTENER ENDPOINT ---
    const obtenerEndpoint = useCallback(() => {
        // Usamos el endpoint masivo de alumno
        return ENDPOINTS[tipoEnvio].alumno; 
    }, [ENDPOINTS, tipoEnvio]);

    // --- ENVIAR MAIL ---
    const handleEnviarMail = useCallback(async () => {
        setResponseMessage(null);
        if (!cursoData.id) {
             setResponseMessage({ variant: "danger", text: "Error: No se ha podido cargar el perfil del curso/materia." });
             return;
        }

        if (!validarCampos()) return;

        setIsLoadingSend(true);

        try {
            const endpoint = obtenerEndpoint();
            const requestBody = construirRequestBody();
            const fullUrl = API_BASE_URL + endpoint;

            console.log("AXIOS POST:", fullUrl, requestBody);

            const { data } = await axios.post(fullUrl, requestBody);

            setResponseMessage({ variant: "success", text: data.message || "Envío exitoso." });
            setSelectedAlumnosDNI({}); // Limpia la selección después del envío
            setMailData({ asunto: "", mensaje: "", fechaReunion: "", horaReunion: "" });
        } catch (error) {
            console.error("Error al enviar mail:", error);
            const errorMsg = error.response?.data?.message || "Error de conexión con el servidor.";
            setResponseMessage({ variant: "danger", text: `Fallo el envío: ${errorMsg}` });
        } finally {
            setIsLoadingSend(false);
        }
    }, [cursoData, validarCampos, obtenerEndpoint, construirRequestBody, setIsLoadingSend, setResponseMessage, setMailData]);

    // --- Effects ---
    
    // Efecto: Asegurar lista de alumnos al inicio y asignar DNI
    useEffect(() => {
        if (cursoData.alumnos.length > 0) {
            setAlumnosFiltrados(cursoData.alumnos.map(a => ({
                ...a, 
                dni: a.dni_alumno || a.dni || a.dni_tutor // Asegurar que tenga DNI
            })));
        }
    }, [cursoData.alumnos]);


    // --- Render ---

    const isReady = cursoData.id !== undefined;

    return (
        <Container fluid style={styles.pageContainer}>
            <BtnVolver />
            
            {/* Encabezado Principal de la Página */}
            <div style={styles.headerContainer}>
                <span className="material-symbols-outlined" style={styles.icon}>mail</span>
                <h2 style={styles.title}>Generar Comunicación de Curso</h2>
            </div>

            {/* ENCABEZADO DE PERFIL (Materia - Curso) */}
            <EncabezadoCurso /> 

            {responseMessage && (
                <Alert variant={responseMessage.variant} className="mt-3">
                    {responseMessage.text}
                </Alert>
            )}

            {/* Alerta de Carga */}
            {!isReady && (
                 <Alert variant="danger">No se pudo cargar la información del curso/materia. Vuelva a la selección de reporte.</Alert>
            )}


            <Row className="mt-4" style={{ display: isReady ? 'flex' : 'none' }}>
                {/* Columna de Filtros y Selección */}
                <Col md={4}>
                    <Card style={styles.card}>
                        <div style={styles.infoTitle}>Filtros de Destino</div>

                        {/* Año Lectivo - Fijo y Deshabilitado */}
                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontWeight: 600 }}>Año Lectivo</Form.Label>
                            <Form.Control type="number" value={anioLectivo} disabled />
                        </Form.Group>
                        
                        {/* Lista de Alumnos con Checkbox Maestro */}
                        <div className="mt-4" style={styles.infoTitle}>
                            Destinatarios ({selectedDNIs.length}/{alumnosFiltrados.length})
                        </div>
                        
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label={`Seleccionar a todos los alumnos del curso`}
                                checked={isAllSelected}
                                onChange={handleSelectAll}
                                disabled={isSendDisabled || alumnosFiltrados.length === 0}
                                className="mb-2"
                            />
                        </Form.Group>

                        {/* Lista de Alumnos Individuales */}
                        {alumnosFiltrados.length === 0 ? (
                            <Alert variant="info" className="mb-0">
                                No hay alumnos activos en este curso para contactar.
                            </Alert>
                        ) : (
                            <div style={styles.listContainer}>
                                {alumnosFiltrados.map((alumno) => (
                                    <div key={alumno.dni} style={styles.checkboxItem}>
                                        <Form.Check
                                            type="checkbox"
                                            label={`${alumno.apellido} ${alumno.nombre} (${alumno.dni})`}
                                            checked={selectedAlumnosDNI[alumno.dni] || false}
                                            onChange={() => handleToggleAlumno(alumno.dni)}
                                            disabled={isSendDisabled}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Columna de Formulario */}
                <Col md={8}>
                    <Card style={styles.card}>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label style={styles.infoTitle}>Tipo de Comunicación</Form.Label>
                                <Form.Control as="select" value={tipoEnvio} onChange={handlePlantillaChange} disabled={isSendDisabled}>
                                    {OpcionesEnvio.map((op) => (
                                        <option key={op.key} value={op.key}>{op.label}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label style={styles.infoTitle}>
                                    {tipoEnvio === "reunion" ? "Motivo de la Reunión *" : "Asunto *"}
                                </Form.Label>
                                <Form.Control type="text" name="asunto" value={mailData.asunto} onChange={handleMailChange} disabled={isSendDisabled} />
                            </Form.Group>

                            {mostrarCamposReunion && (
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={styles.infoTitle}>Fecha *</Form.Label>
                                            <Form.Control type="date" name="fechaReunion" value={mailData.fechaReunion} onChange={handleMailChange} disabled={isSendDisabled} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={styles.infoTitle}>Hora *</Form.Label>
                                            <Form.Control type="time" name="horaReunion" value={mailData.horaReunion} onChange={handleMailChange} disabled={isSendDisabled} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}

                            <Form.Group className="mb-3">
                                <Form.Label style={styles.infoTitle}>Mensaje / Observaciones *</Form.Label>
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
                                disabled={isSendDisabled || selectedDNIs.length === 0} 
                                style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
                            >
                                {isLoadingSend ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                                        Enviando...
                                    </>
                                ) : (
                                    `Enviar Mail a ${selectedDNIs.length} Destinatario(s)`
                                )}
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CursoComunicacion;