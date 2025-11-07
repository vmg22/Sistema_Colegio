import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

const ModalAddCursoMateria = ({
  alumnoToEdit,
  cursoActual,
  materiasActuales,
  onClose,
  onSave,
}) => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Datos dinámicos
  const [cursosDisponibles, setCursosDisponibles] = useState([]);
  const [materiasDisponibles, setMateriasDisponibles] = useState([]);
  
  // Selecciones del formulario
  const [selectedCurso, setSelectedCurso] = useState(cursoActual?.id_curso || "");
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);
  const [anioLectivo, setAnioLectivo] = useState(new Date().getFullYear());

  // Cargar cursos disponibles al montar
  useEffect(() => {
    cargarCursos();
  }, []);

  // Cargar materias cuando cambia el curso
  useEffect(() => {
    if (selectedCurso) {
      cargarMateriasPorCurso(selectedCurso);
    } else {
      setMateriasDisponibles([]);
      setMateriasSeleccionadas([]);
    }
  }, [selectedCurso]);

  // Pre-seleccionar materias actuales
  useEffect(() => {
    if (materiasActuales && materiasActuales.length > 0) {
      const idsMateriasActuales = materiasActuales.map((m) => m.id_materia);
      setMateriasSeleccionadas(idsMateriasActuales);
    }
  }, [materiasActuales]);

  const cargarCursos = async () => {
    try {
      const response = await axios.get(`${API_URL}/cursos`);
      console.log("Cursos cargados:", response.data);
      setCursosDisponibles(response.data.datos);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
      setError("No se pudieron cargar los cursos disponibles");
    }
  };

  const cargarMateriasPorCurso = async (idCurso) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/cursos/${idCurso}/materias`);
      console.log("Materias cargadas:", response.data);
      setMateriasDisponibles(response.data.datos);
      setError("");
    } catch (error) {
      console.error("Error al cargar materias:", error);
      setError("No se pudieron cargar las materias del curso");
      setMateriasDisponibles([]);
    } finally {
      setLoading(false);
    }
  };

  // Materias filtradas según nivel del curso (similar a tu Dashboard)
  const materiasFiltradas = useMemo(() => {
    if (!selectedCurso || !materiasDisponibles.length) return [];

    const cursoActual = cursosDisponibles.find(
      (c) => c.id_curso === parseInt(selectedCurso)
    );

    if (!cursoActual) return materiasDisponibles;

    return materiasDisponibles.filter(
      (materia) => materia.nivel === cursoActual.anio
    );
  }, [selectedCurso, materiasDisponibles, cursosDisponibles]);

  const handleToggleMateria = (idMateria) => {
    setMateriasSeleccionadas((prev) => {
      if (prev.includes(idMateria)) {
        return prev.filter((id) => id !== idMateria);
      } else {
        return [...prev, idMateria];
      }
    });
  };

  const handleSelectAll = () => {
    if (materiasSeleccionadas.length === materiasFiltradas.length) {
      setMateriasSeleccionadas([]);
    } else {
      setMateriasSeleccionadas(materiasFiltradas.map((m) => m.id_materia));
    }
  };

  const handleCursoChange = (e) => {
    setSelectedCurso(e.target.value);
    setMateriasSeleccionadas([]); // Limpiar materias al cambiar curso
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (!selectedCurso) {
      setError("Debe seleccionar un curso");
      return;
    }

    if (materiasSeleccionadas.length === 0) {
      setError("Debe seleccionar al menos una materia");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const datos = {
        id_curso: parseInt(selectedCurso),
        anio_lectivo: anioLectivo,
        materias: materiasSeleccionadas,
      };

      console.log("Enviando datos:", datos);

      // Si ya tiene curso, actualizar; si no, crear
      if (cursoActual) {
        await axios.put(
          `${API_URL}/alumnos/${alumnoToEdit.id_alumno}/curso`,
          datos
        );
        alert("Curso actualizado exitosamente");
      } else {
        await axios.post(
          `${API_URL}/alumnos/${alumnoToEdit.id_alumno}/curso`,
          datos
        );
        alert("Curso asignado exitosamente");
      }

      onSave(); // Recargar datos en el componente padre
    } catch (error) {
      console.error("Error al guardar:", error);
      setError(
        error.response?.data?.mensaje ||
          "Error al guardar. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            {cursoActual ? "Editar Curso y Materias" : "Asignar Curso y Materias"}
          </h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Información del Alumno */}
            <div className="info-box mb-3">
              <strong>Alumno:</strong> {alumnoToEdit.nombre_alumno}{" "}
              {alumnoToEdit.apellido_alumno}
              <br />
              <strong>DNI:</strong> {alumnoToEdit.dni_alumno}
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <Row className="mb-3">
              {/* Año Lectivo */}
              <Form.Group as={Col} md="12">
                <Form.Label className="formLabel">
                  Año Lectivo <span className="required">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  value={anioLectivo}
                  onChange={(e) => setAnioLectivo(parseInt(e.target.value))}
                  min={2020}
                  max={2030}
                  required
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              {/* Selección de Curso */}
              <Form.Group as={Col} md="12">
                <Form.Label className="formLabel">
                  Curso <span className="required">*</span>
                </Form.Label>
                <Form.Select
                  required
                  value={selectedCurso}
                  onChange={handleCursoChange}
                >
                  <option value="">-- Seleccione un curso --</option>
                  {cursosDisponibles.map((curso) => (
                    <option key={curso.id_curso} value={curso.id_curso}>
                      {curso.nombre} - {curso.anio}° {curso.division} ({curso.turno})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            {/* Selección de Materias */}
            {selectedCurso && (
              <div className="form-group">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="formLabel">
                    Materias <span className="required">*</span>
                  </Form.Label>
                  {materiasFiltradas.length > 0 && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleSelectAll}
                      type="button"
                    >
                      {materiasSeleccionadas.length === materiasFiltradas.length
                        ? "Deseleccionar Todas"
                        : "Seleccionar Todas"}
                    </Button>
                  )}
                </div>

                {loading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Cargando materias...</span>
                    </div>
                  </div>
                ) : materiasFiltradas.length > 0 ? (
                  <div className="materias-checkbox-container">
                    {materiasFiltradas.map((materia) => (
                      <div key={materia.id_materia} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`materia-${materia.id_materia}`}
                          checked={materiasSeleccionadas.includes(
                            materia.id_materia
                          )}
                          onChange={() =>
                            handleToggleMateria(materia.id_materia)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`materia-${materia.id_materia}`}
                        >
                          <strong>{materia.nombre}</strong>
                          {materia.descripcion && (
                            <small className="d-block text-muted">
                              {materia.descripcion}
                            </small>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    Este curso no tiene materias asignadas. Por favor, configure
                    las materias del curso primero.
                  </div>
                )}

                {materiasSeleccionadas.length > 0 && (
                  <div className="mt-2">
                    <small className="text-muted">
                      {materiasSeleccionadas.length} materia(s) seleccionada(s)
                    </small>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={
                loading ||
                !selectedCurso ||
                materiasSeleccionadas.length === 0
              }
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Guardando...
                </>
              ) : cursoActual ? (
                "Actualizar Curso"
              ) : (
                "Asignar Curso"
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ModalAddCursoMateria;