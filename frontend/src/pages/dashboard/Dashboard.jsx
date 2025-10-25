import React, { useEffect, useState, useMemo } from "react";
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
import { getCursos } from "../../services/cursosService";
import { getAniosLectivos } from "../../services/aniosServices";

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
        setCursos(dataCursos);
        setAnios(dataAnios);
      } catch (error) {
        console.error("Error al cargar materias:", error);
      }
    };
    cargarDatos();
  }, []);

  // 🎯 FILTRADO DE MATERIAS según el curso seleccionado
  const materiasFiltradas = useMemo(() => {
    if (!selectedCurso) return [];
    
    // Buscar el curso seleccionado para obtener su año
    const cursoActual = cursos.find(c => c.id_curso === parseInt(selectedCurso));
    
    if (!cursoActual) return [];
    
    // Filtrar materias que coincidan con el nivel del curso y estén activas
    return materias.filter(materia => 
      materia.nivel === cursoActual.anio && 
      materia.estado === 'activa'
    );
  }, [selectedCurso, cursos, materias]);

  const setConsulta2 = (tipo) => {
    setConsulta(tipo);
    setError("");
    setDniInput("");
    setAnioInput("2025");
    setValidated(false);
    
    // Resetear selecciones de curso cuando cambia el tipo de consulta
    setSelectedCurso("");
    setSelectedMateria("");
    setSelectedPeriodo("");
    setSelectedAnio("");
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

    try {
      const data = await getReporteAlumno(dniInput, anioInput);

      if (!data) {
        throw new Error("No se encontró información para ese alumno.");
      }

      console.log("✅ Reporte obtenido:", data);
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

      // Guardar en Zustand
      setReporteCurso(dataReporte);

      // Guardar en sessionStorage (para recargas)
      sessionStorage.setItem("reporteCurso", JSON.stringify(dataReporte));

      // Navegar a la página de resultados
      navigate("/consulta-curso");
    } catch (err) {
      console.error("❌ Error al traer reporte de curso:", err);
      setError(err.message || "No se pudo obtener el reporte del curso.");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Resetear materia cuando cambia el curso
  const handleCursoChange = (e) => {
    setSelectedCurso(e.target.value);
    setSelectedMateria(""); // Limpiar la materia seleccionada
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
              {/* 🎯 CURSO (DINÁMICO) */}
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
                      {curso.nombre} - {curso.anio}° {curso.division} ({curso.turno})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* 🎯 MATERIA (FILTRADA DINÁMICAMENTE) */}
              <Form.Group as={Col} md="4">
                <Form.Label className="formLabel">Materia</Form.Label>
                <Form.Select
                  required
                  value={selectedMateria}
                  onChange={(e) => setSelectedMateria(e.target.value)}
                  disabled={!selectedCurso}
                >
                  <option value="">
                    {!selectedCurso 
                      ? "Primero seleccione un curso" 
                      : "Seleccione materia"}
                  </option>
                  {materiasFiltradas?.map((materia) => (
                    <option key={materia.id_materia} value={materia.id_materia}>
                      {materia.nombre}
                    </option>
                  ))}
                </Form.Select>
                {selectedCurso && materiasFiltradas.length === 0 && (
                  <Form.Text className="text-warning">
                    No hay materias activas para este curso
                  </Form.Text>
                )}
              </Form.Group>
            </Row>

            <Row className="mb-3 d-flex justify-content-around">
              {/* PERIODO (ESTÁTICO) */}
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

              {/* AÑO (DINÁMICO) */}
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

            {/* BOTÓN */}
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
        )}
      </div>
    </div>
  );
};

export default Dashboard;