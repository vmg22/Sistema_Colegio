import React, { useEffect, useState } from "react";
import "../../styles/dashboard.css";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useConsultaStore } from "../../store/consultaStore";
import { getReporteAlumno, getReporteCurso } from "../../services/reportesService";
import { useNavigate } from "react-router-dom";
import LineaSeparadora from "../../components/ui/LineaSeparadora";
import { getMaterias } from "../../services/materiasServices";
import { getCursos } from "../../services/cursosService"; //faltan crear
import { getAniosLectivos } from "../../services/aniosServices"; //faltan crear

const Dashboard = () => {
  const [tipoConsulta, setConsulta] = useState("alumno");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const [alumno, setAlumno] = useState(null);
  const [dniInput, setDniInput] = useState("");
  const [anioInput, setAnioInput] = useState("2025");
  const [materias, setMaterias] = useState([]); // tomamos los nombres de las materias para generar un menu dinámico
  const [cursos, setCursos] = useState([]); // plural
  const [anios, setAnios] = useState([]); // plural// tomamos los años para generar un menu dinámico

  //guardamos los datos de la selección de consulta curso
  // NUEVOS ESTADOS para guardar la selección del formulario
  const [selectedCurso, setSelectedCurso] = useState("");
  const [selectedMateria, setSelectedMateria] = useState("");
  const [selectedPeriodo, setSelectedPeriodo] = useState("");
  const [selectedAnio, setSelectedAnio] = useState("");

  const navigate = useNavigate();
  // Zustand store
  const { setAlumnoDni, setAlumnoAnio, setReporteAlumno, setReporteCurso } =
    useConsultaStore();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [dataMaterias, dataCursos, dataAnios] = await Promise.all([
          getMaterias(),
          getCursos(),
          getAniosLectivos(),
        ]);
        console.log(
          "Datos recibidos de la API:",
          dataMaterias,
          dataCursos,
          dataAnios
        );

        setMaterias(dataMaterias);
        setCursos(dataCursos); // plural
        setAnios(dataAnios); // Guarda el array directamente
      } catch (error) {
        console.error("Error al cargar materias:", error);
      }
    };
    cargarDatos();
  }, []);

  const setConsulta2 = (tipo) => {
    setConsulta(tipo);

    // setAlumno(null);
    setError("");
    setDniInput("");
    setAnioInput("2025");
    setValidated(false);
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

    // Guardar en Zustand
    setAlumnoDni(dniInput);
    setAlumnoAnio(anioInput);

    setLoading(true);
    setError("");
    // setAlumno(null);

    try {
      const data = await getReporteAlumno(dniInput, anioInput);

      if (!data) {
        throw new Error("No se encontró información para ese alumno.");
      }

      console.log("✅ Reporte obtenido:", data);
      // setAlumno(data);
      setReporteAlumno(data);

      // Guardamos temporalmente en sessionStorage (por si recarga la página)
      sessionStorage.setItem("reporteAlumno", JSON.stringify(data));

      // Redirigimos a la vista de resultados
      navigate("/consulta");
    } catch (err) {
      console.error("❌ Error al traer reporte:", err);
      setError(err?.message || "No se pudo obtener el reporte del alumno.");
    } finally {
      setLoading(false);
    }
  };

  // --- CORRECCIÓN 1: Se eliminó la función handleSubmitCurso duplicada que estaba aquí ---

  const handleSubmitCurso = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    // ¡AQUÍ ESTÁ LA LÓGICA!
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

      // 1. Guardar en Zustand (asumiendo que existe setReporteCurso)
      setReporteCurso(dataReporte);

      // 2. Guardar en sessionStorage (para recargas)
      sessionStorage.setItem("reporteCurso", JSON.stringify(dataReporte));

      // 3. Navegar a la página de resultados (ej: /consulta-curso)
      navigate("/consulta-curso"); // ¡Necesitarás crear esta ruta y su página!
    } catch (err) {
      console.error("❌ Error al traer reporte de curso:", err);
      setError(err.message || "No se pudo obtener el reporte del curso.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="nombre_vista">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "20px",
          gap: "10px",
        }}
      >
        <span
          className="material-symbols-outlined search"
          style={{ marginRight: "15px" }}
        >
          search
        </span>
        <h4>Consulta Académica</h4>
      </div>

      <LineaSeparadora />

      <div className="contenedor-botones-dash">
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
                  value={anioInput}
                  onChange={(e) => setAnioInput(e.target.value)}
                  required
                >
                  {[2025, 2026].map((a) => (
                    <option key={a} value={a}>
                      {a}
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
        ) : (
          <Form noValidate validated={validated} onSubmit={handleSubmitCurso}>
            <h5 className="tituloForm">Buscar Curso</h5>
            <hr className="linea-separadora" />
            <Row className="mb-3 d-flex justify-content-around">
              {/* --- CURSO (DINÁMICO) --- */}
              <Form.Group as={Col} md="4">
                <Form.Label className="formLabel">Curso</Form.Label>
                {/* --- CORRECCIÓN 2: Se añaden 'value' y 'onChange' --- */}
                <Form.Select
                  required
                  value={selectedCurso}
                  onChange={(e) => setSelectedCurso(e.target.value)}
                >
                  <option value="">Seleccione curso</option>

                  {cursos?.map((curso) => (
                    <option key={curso.id_curso} value={curso.id_curso}>
                      {curso.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* --- MATERIA (DINÁMICO) --- */}
              <Form.Group as={Col} md="4">
                <Form.Label className="formLabel">Materia</Form.Label>
                {/* --- CORRECCIÓN 2: Se añaden 'value' y 'onChange' --- */}
                <Form.Select
                  required
                  value={selectedMateria}
                  onChange={(e) => setSelectedMateria(e.target.value)}
                >
                  <option value="">Seleccione materia</option>
                  {materias?.map((materia) => (
                    <option key={materia.id_materia} value={materia.id_materia}>
                      {materia.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            <Row className="mb-3 d-flex justify-content-around">
              {/* --- PERIODO (ESTÁTICO) --- */}
              <Form.Group as={Col} md="4">
                <Form.Label className="formLabel">Periodo</Form.Label>
                {/* --- CORRECCIÓN 2: Se añaden 'value' y 'onChange' --- */}
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

              {/* --- AÑO (DINÁMICO) --- */}
              <Form.Group as={Col} md="4">
                <Form.Label className="formLabel">Año</Form.Label>
                {/* --- CORRECCIÓN 2: Se añaden 'value' y 'onChange' --- */}
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

            {/* --- BOTÓN --- */}
            <div className="d-flex justify-content-center my-4">
              <Button
                type="submit"
                className="d-flex align-items-center gap-2 px-4 py-2 btnBuscar"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "20px" }}
                >
                  search
                </span>
                <span>Buscar Curso</span>
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Dashboard;