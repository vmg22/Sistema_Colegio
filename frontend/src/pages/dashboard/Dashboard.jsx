import React, { useEffect, useState, useMemo } from "react";
import "../../styles/dashboard.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useConsultaStore } from "../../store/consultaStore";
import {
  getReporteAlumno,
  getReporteCurso,
} from "../../services/reportesService";
import { useNavigate } from "react-router-dom";
import LineaSeparadora from "../../components/ui/LineaSeparadora";
import { getMaterias } from "../../services/materiasServices";
import { getCursos } from "../../services/cursosService";
import { getAniosLectivos } from "../../services/aniosServices";
import { getMateriasAsignadas } from "../../services/cursoMateriaService";
import { buscarAlumnoPorDNI } from "../../services/docenteService";
import { esDocente, getIdDocente, getUsuario } from "../../services/authService";



const ROLE_CONFIG = {
  admin: {
    icon: "admin_panel_settings",
    text: "Administrador",
    className: "admin-badge",
    iconClass: "admin-icon",
    textClass: "admin-text"
  },
  docente: {
    icon: "school",
    text: "Docente",
    className: "docente-badge",
    iconClass: "docente-icon",
    textClass: "docente-text"
  },
  preceptor: {
    icon: "security",
    text: "Preceptor",
    className: "preceptor-badge",
    iconClass: "preceptor-icon",
    textClass: "preceptor-text"
  },
  secretario: {
    icon: "edit_document",
    text: "Secretario",
    className: "secretario-badge",
    iconClass: "secretario-icon",
    textClass: "secretario-text"
  },
  tutor: {
    icon: "person_add",
    text: "Tutor",
    className: "tutor-badge",
    iconClass: "tutor-icon",
    textClass: "tutor-text"
  },
  // Opcional: Define un valor por defecto para roles no reconocidos
  default: {
    icon: "person",
    text: "Usuario",
    className: "default-badge",
    iconClass: "default-icon",
    textClass: "default-text"
  },
};

const Dashboard = () => {
  const [tipoConsulta, setConsulta] = useState("alumno");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dniInput, setDniInput] = useState("");
  const [anioInput, setAnioInput] = useState("2025");
  const [materias, setMaterias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [anios, setAnios] = useState([]);

  // Estados para la selección del formulario de curso
  const [selectedCurso, setSelectedCurso] = useState("");
  const [selectedMateria, setSelectedMateria] = useState("");
  const [selectedPeriodo, setSelectedPeriodo] = useState("");
  const [selectedAnio, setSelectedAnio] = useState("");
  const [materiasCursoSeleccionado, setMateriasCursoSeleccionado] = useState(
    []
  );

  // Obtener rol del usuario
  const [userRole, setUserRole] = useState("");
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // Zustand store
  const {
    setAlumnoDni,
    setAlumnoAnio,
    setReporteAlumno,
    setReporteCurso,
    setSelectedCursoNombre,
    setSelectedMateriaNombre,
    setSelectedPeriodoNombre,
    setSelectedAnioNombre,
  } = useConsultaStore();

  useEffect(() => {
    const userJSON = localStorage.getItem("usuario");
    let currentUser = null;

    if (userJSON) {
      try {
        currentUser = JSON.parse(userJSON);
      } catch (e) {
        console.error("Error al parsear el objeto de usuario:", e);
      }
    } // 2. Actualizar los estados

    if (currentUser) {
      setUser(currentUser); // Guarda el objeto completo
      setUserRole(currentUser.rol || "usuario"); // Usa el rol del objeto si existe
    } else {
      // Si no hay objeto 'usuario', intenta leer el rol antiguo por si acaso
      const role = localStorage.getItem("userRole") || "usuario";
      setUserRole(role);
    }

    const cargarDatosEstaticos = async () => {
      try {
        // Lógica condicional según el rol del usuario
        let dataCursos;
        
        // Debug: Verificar usuario
        const usuario = getUsuario();
        console.log("🔍 Usuario actual:", usuario);
        console.log("🔍 Es docente?:", esDocente());
        console.log("🔍 ID Docente:", getIdDocente());
        
        // Si es docente pero no tiene id_docente, obtenerlo
        let idDocente = getIdDocente();
        if (esDocente() && !idDocente && usuario?.id_usuario) {
          console.log("⚠️ Docente sin id_docente, obteniendo...");
          try {
            // ✅ CORRECCIÓN: Usar api.get en lugar de fetch con URL hardcodeada
            const { api } = await import("../../api/fetchConfig");
            const data = await api.get(`/docentes/usuario/${usuario.id_usuario}`);
            
            if (data && data.datos) {
              idDocente = data.datos.id_docente;
              // Actualizar localStorage
              usuario.id_docente = idDocente;
              localStorage.setItem("usuario", JSON.stringify(usuario));
              console.log("✅ ID Docente obtenido y guardado:", idDocente);
            }
          } catch (err) {
            console.error("❌ Error al obtener id_docente:", err);
          }
        }
        
        if (esDocente() && idDocente) {
          console.log("✅ Cargando cursos filtrados para docente ID:", idDocente);
          // DOCENTE: Cargar solo los cursos donde dicta
          const { getCursosPorDocente } = await import("../../services/docenteService");
          const cursosDocente = await getCursosPorDocente(idDocente);
          
          console.log("📚 Cursos del docente:", cursosDocente);
          
          // Transformar al formato esperado
          dataCursos = {
            datos: cursosDocente.map(curso => ({
              id_curso: curso.id_curso,
              nombre: curso.curso_nombre,
              anio: curso.anio,
              division: curso.division,
              turno: curso.turno
            }))
          };
        } else {
          console.log("ℹ️ Cargando todos los cursos (admin/sin login)");
          // ADMIN u otro rol: Cargar todos los cursos
          dataCursos = await getCursos();
        }
        
        const dataAnios = await getAniosLectivos();
        const dataMaterias = await getMaterias();
        
        console.log("Datos recibidos de la API:", dataCursos, dataAnios, dataMaterias);

        setCursos(dataCursos.datos);
        setAnios(dataAnios.datos);
        setMaterias(dataMaterias.datos);
      } catch (error) {
        console.error("Error al cargar datos estáticos:", error);
      }
    };
    cargarDatosEstaticos();
  }, []);

  useEffect(() => {
    // Cargar materias por curso si hay curso seleccionado
    if ((tipoConsulta === "curso" || tipoConsulta === "previas") && selectedCurso) {
      const cargarMaterias = async () => {
        try {
          setLoading(true);
          setError("");
          const id_curso = parseInt(selectedCurso);
          
          // Lógica condicional según el rol del usuario
          let dataMaterias;
          
          if (esDocente() && getIdDocente()) {
            // DOCENTE: Filtrar solo las materias que dicta en este curso
            const todasLasMaterias = await getMateriasAsignadas(id_curso);
            
            // Obtener las materias que el docente dicta en este curso específico
            const { getMateriasPorDocente } = await import("../../services/docenteService");
            const materiasDocente = await getMateriasPorDocente(getIdDocente());
            
            // Filtrar solo las materias del curso que el docente dicta
            dataMaterias = todasLasMaterias.filter(materia =>
              materiasDocente.some(md => md.id_materia === materia.id_materia)
            );
          } else {
            // ADMIN u otro rol: Mostrar todas las materias del curso
            dataMaterias = await getMateriasAsignadas(id_curso);
          }
          
          setMateriasCursoSeleccionado(dataMaterias);
        } catch (error) {
          console.error("Error al cargar materias asignadas:", error);
          setMateriasCursoSeleccionado([]); // Opcional: setError("Error al cargar las materias del curso.");
        } finally {

          setLoading(false);
        }
      };
      cargarMaterias();
    } else {
      // Limpiar las materias si no hay curso seleccionado o si cambiamos a otro tipo de consulta
      setMateriasCursoSeleccionado([]);
    }
  }, [selectedCurso, tipoConsulta]);

  // FILTRADO DE MATERIAS según el curso seleccionado
  const materiasFiltradas = useMemo(() => {
    if (!selectedCurso || !materias) return [];

    const cursoActual = cursos.find(
      (c) => c.id_curso === parseInt(selectedCurso)
    );

    if (!cursoActual) return [];

    return materias.filter(
      (materia) =>
        materia.nivel === cursoActual.anio && materia.estado === "activa"
    );
  }, [selectedCurso, cursos, materias]);

  const setConsulta2 = (tipo) => {
    setConsulta(tipo);
    setError("");
    setDniInput("");
    setAnioInput("2025");
    setValidated(false);

    setSelectedCurso("");
    setSelectedMateria("");
    setSelectedPeriodo("");
    setSelectedAnio("");
    setMateriasCursoSeleccionado([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (!/^\d+$/.test(dniInput)) {
      setError("El DNI debe contener solo números.");
      return;
    }

    setAlumnoDni(dniInput);
    setAlumnoAnio(anioInput);

    setLoading(true);
    setError("");

    try {
      // Lógica condicional según el rol del usuario
      let data;
      
      if (esDocente() && getIdDocente()) {
        // DOCENTE: Verificar acceso antes de obtener el reporte
        try {
          await buscarAlumnoPorDNI(getIdDocente(), dniInput);
          // Si llega aquí, tiene acceso, obtener el reporte
          data = await getReporteAlumno(dniInput, anioInput);
        } catch (accessError) {
          if (accessError.message === 'No tiene acceso a este alumno') {
            throw new Error("No tiene acceso a este alumno.");
          }
          throw accessError;
        }
      } else {
        // ADMIN u otro rol: Acceso completo sin restricciones
        data = await getReporteAlumno(dniInput, anioInput);
      }

      if (!data) {
        throw new Error("No se encontró información para ese alumno.");
      }

      console.log("✅ Reporte obtenido:", data);
      setReporteAlumno(data);

      sessionStorage.setItem("reporteAlumno", JSON.stringify(data));

      navigate("/perfilAlumno");
    } catch (err) {
      console.error("❌ Error al traer reporte:", err);
      setError(err?.message || "No se pudo obtener el reporte del alumno.");
    } finally {

      setLoading(false);
    }
  };

  const handleSubmitCurso = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    console.log("Buscando curso con:", {
      id_curso: selectedCurso,
      id_materia: selectedMateria,
      anio_lectivo: selectedAnio,
      cuatrimestre: selectedPeriodo,
    });

    setLoading(true);
    setError("");

    try {
      const dataReporte = await getReporteCurso(
        selectedCurso,
        selectedMateria,
        selectedAnio,
        selectedPeriodo
      );

      console.log("✅ Reporte de curso obtenido:", dataReporte);

      const cursoObj = cursos.find(
        (c) => c.id_curso === parseInt(selectedCurso)
      );
      const materiaObj = materiasCursoSeleccionado.find(
        (m) => m.id_materia === parseInt(selectedMateria)
      );
      const periodoNombre =
        selectedPeriodo === "1" ? "1er Cuatrimestre" : "2do Cuatrimestre";

      setReporteCurso(dataReporte);
      setSelectedCursoNombre(
        cursoObj ? `${cursoObj.anio}° ${cursoObj.division}` : "Curso"
      );
      setSelectedMateriaNombre(materiaObj ? materiaObj.nombre : "Materia");
      setSelectedPeriodoNombre(periodoNombre);
      setSelectedAnioNombre(selectedAnio);

      sessionStorage.setItem("reporteCurso", JSON.stringify(dataReporte));

      // Navegar según el tipo de consulta
      if (tipoConsulta === "previas") {
        navigate("/previas");
      } else {
        navigate("/cursoDashboard");
      }
    } catch (err) {
      console.error("❌ Error al traer reporte de curso:", err);
      setError(err.message || "No se pudo obtener el reporte del curso.");
    } finally {
      setLoading(false);
    }
  };

  const handleCursoChange = (e) => {
    setSelectedCurso(e.target.value);
    setSelectedMateria("");
  };

  const handleNavigateToCrud = () => {
    navigate("/crud");
  };

  const currentRoleConfig = ROLE_CONFIG[userRole] || ROLE_CONFIG["default"];
  console.log(user)
  return (
    <div className="nombre_vista">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginLeft: "20px",
          marginRight: "20px",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            className="material-symbols-outlined search"
            style={{ marginRight: "15px" }}
          >
            search
          </span>
          <h4>Consulta Académica</h4>
        </div>

        {/* BADGE DE USUARIO  */}
        <div className={currentRoleConfig.className}>
          <span className="material-symbols-outlined icon">
            {currentRoleConfig.icon}
          </span>
          <span className="text">{currentRoleConfig.text}</span>
        </div>
      </div>

      <LineaSeparadora />

      <div className="contenedor-botones-dash">
        {/* CARD ALUMNO */}
        <button
          className={`btn-tipo ${tipoConsulta === "alumno" ? "activo" : ""}`}
          onClick={() => setConsulta2("alumno")}
          type="button"
        >
          <div className="icono-contenedor">
            <span className="material-symbols-outlined person">person</span>
          </div>
          <span className="btn-texto">Consulta por Alumno</span>
        </button>

        {/* CARD CURSO */}
        <button
          className={`btn-tipo ${tipoConsulta === "curso" ? "activo" : ""}`}
          onClick={() => setConsulta2("curso")}
          type="button"
        >
          <div className="icono-contenedor-group">
            <span className="material-symbols-outlined group">group</span>
          </div>
          <span className="btn-texto">Consulta por Curso</span>
        </button>
        <button
          className={`btn-tipo ${tipoConsulta === "previas" ? "activo" : ""}`}
          onClick={() => setConsulta2("previas")}
          type="button"
        >
          <div className="icono-contenedor-assignment">
            <span className="material-symbols-outlined assignment">assignment</span>
          </div>
          <span className="btn-texto">Previas</span>
        </button>
        {userRole === "admin" && (
        <button
          className={`btn-tipo ${tipoConsulta === "mail" ? "activo" : ""}`}
          onClick={() => navigate("/generar-mail")}
          type="button"
        >
          <div className="icono-contenedor-mail">
            <span className="material-symbols-outlined mail">mail</span>
          </div>
          <span className="btn-texto">Enviar Mail General</span>
        </button>)}
        {userRole === "admin" && (
          <button
            className={`btn-tipo ${tipoConsulta === "gestion" ? "activo" : ""}`}
            onClick={handleNavigateToCrud}
            type="button"
          >
            <div className="icono-contenedor-settings">
              <span className="material-symbols-outlined settings">
                settings
              </span>
            </div>
            <span className="btn-texto">Gestión de Datos</span>
          </button>
        )}
      </div>

      <div className="contenedor-busqueda">
        {tipoConsulta === "alumno" ? (
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <h5 className="tituloForm">Buscar Alumno</h5>
            <hr className="linea-separadora" />
            <Row className="mb-3 d-flex justify-content-around">
              <Form.Group as={Col} md="4" controlId="validationCustom01">
                <Form.Label className="formLabel">DNI</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <span className="material-symbols-outlined">person</span>
                  </InputGroup.Text>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Ingrese DNI"
                    value={dniInput}
                    onChange={(e) => setDniInput(e.target.value.trim())}
                  />
                </InputGroup>
              </Form.Group>
              <Form.Group as={Col} md="4">
                <Form.Label className="formLabel">Año</Form.Label>
                <Form.Select
                  required
                  value={selectedAnio}
                  onChange={(e) => setSelectedAnio(e.target.value)}
                >
                  <option value="">Seleccione año</option>
                  {anios?.map((anioObj) => (
                    <option key={anioObj.id_anio_lectivo} value={anioObj.anio}>
                      {anioObj.anio}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}

            <div className="d-flex justify-content-center my-4">
              <Button
                type="submit"
                className="d-flex align-items-center gap-2 px-4 py-2 btnBuscar"
                disabled={loading}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  search
                </span>
                <span>{loading ? "Buscando..." : "Buscar Alumno"}</span>
              </Button>
            </div>
          </Form>
        ) : (tipoConsulta === "curso" || tipoConsulta === "previas") ? (
          <Form noValidate validated={validated} onSubmit={handleSubmitCurso}>
            <h5 className="tituloForm">{tipoConsulta === "previas" ? "Buscar Previas" : "Buscar Curso"}</h5>
            <hr className="linea-separadora" />
            <Row className="mb-3 d-flex justify-content-around">
              {/* Mostrar Curso siempre */}
              <Form.Group as={Col} md="4">
                <Form.Label className="formLabel">Curso</Form.Label>
                <Form.Select
                  required
                  value={selectedCurso}
                  onChange={handleCursoChange}
                >
                  <option value="">Seleccione curso</option>
                  {cursos?.map((curso) => (
                    <option key={curso.id_curso} value={curso.id_curso}>
                      {curso.nombre} - {curso.anio}° {curso.division} (
                      {curso.turno})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} md="4">
                               {" "}
                <Form.Label className="formLabel">Materia</Form.Label>         
                     {" "}
                <Form.Select
                  required
                  value={selectedMateria}
                  onChange={(e) => setSelectedMateria(e.target.value)}
                  disabled={!selectedCurso || loading}
                >
                  <option value="">
                    {!selectedCurso
                      ? "Primero seleccione un curso"
                      : loading
                      ? "Cargando materias..."
                      : "Seleccione materia"}
                  </option>
                  {materiasCursoSeleccionado?.map((materia) => (
                    <option key={materia.id_materia} value={materia.id_materia}>
                      {materia.nombre}
                    </option>
                  ))}
                </Form.Select>
                {selectedCurso &&
                  !loading &&
                  materiasCursoSeleccionado.length === 0 && (
                    <Form.Text className="text-warning">
                      No hay materias asignadas a este curso.
                    </Form.Text>
                  )}
              </Form.Group>
            </Row>

            <Row className="mb-3 d-flex justify-content-around">
              <Form.Group as={Col} md="4">
                <Form.Label className="formLabel">Periodo</Form.Label>
                <Form.Select
                  required
                  value={selectedPeriodo}
                  onChange={(e) => setSelectedPeriodo(e.target.value)}
                >
                  <option value="">Seleccione cuatrimestre</option>
                  <option value="1">1er Cuatrimestre</option>
                  <option value="2">2do Cuatrimestre</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} md="4">
                <Form.Label className="formLabel">Año</Form.Label>
                <Form.Select
                  required
                  value={selectedAnio}
                  onChange={(e) => setSelectedAnio(e.target.value)}
                >
                  <option value="">Seleccione año</option>
                  {anios?.map((anioObj) => (
                    <option key={anioObj.id_anio_lectivo} value={anioObj.anio}>
                      {anioObj.anio}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            {error && (
              <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            )}

            <div className="d-flex justify-content-center my-4">
              <Button
                type="submit"
                className="d-flex align-items-center gap-2 px-4 py-2 btnBuscar"
                disabled={loading}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  search
                </span>
                <span>{loading ? "Buscando..." : "Buscar Curso"}</span>
              </Button>
            </div>
          </Form>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
