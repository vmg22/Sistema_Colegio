import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Button,
  Table,
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";
import {
  getMaterias,
  deleteMateria,
} from "../../../services/materiasaltasService";
import MateriaModal from "../../../components/modals/MateriaModal";
import Swal from "sweetalert2";
import { useDebounce } from "use-debounce"; // (npm i use-debounce)
import BtnVolver from "../../../components/ui/BtnVolver";

const Materias = () => {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [materiaAEditar, setMateriaAEditar] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // 2. Añade un useRef para controlar la carga inicial
  const isInitialMount = useRef(true);

  // Carga de datos
  const cargarMaterias = useCallback(async (buscar) => {
    try {
      setLoading(true);
      setError(null);
      // --- CORRECCIÓN: Tu servicio espera un objeto 'params' ---
      const materiasArray = await getMaterias({ buscar: buscar });

      // --- CORRECCIÓN: Tu servicio ya devuelve el array ---
      setMaterias(materiasArray || []);
    } catch (err) {
      // --- CORRECCIÓN: Leer err.message ---
      setError(err.message || "Error al cargar las materias.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []); // El 'useCallback' es correcto así

  // Búsqueda con debounce
  useEffect(() => {
    // 3. Lógica de búsqueda corregida

    // Si es la primera vez que se renderiza, no hagas nada.
    // La carga inicial ya la hizo el useEffect de arriba.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Para todas las demás ejecuciones (escribir o borrar),
    // simplemente llama a cargarMaterias con el término.
    cargarMaterias(debouncedSearchTerm);
  }, [debouncedSearchTerm, cargarMaterias]);

  // --- Handlers Modal ---

  const handleOpenCreate = () => {
    setMateriaAEditar(null);
    setShowModal(true);
  };

  const handleOpenEdit = (materia) => {
    setMateriaAEditar(materia);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    handleCloseModal();
    setSearchTerm("");

    // 4. Lógica de guardado simplificada
    // Si la búsqueda ya estaba vacía, forzamos la recarga
    // Si no lo estaba, el useEffect de 'debouncedSearchTerm' se disparará solo.
    if (debouncedSearchTerm === "") {
      cargarMaterias("");
    }
  };

  // --- Handler Delete ---

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "La materia se moverá a la papelera (borrado lógico).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMateria(id);
          Swal.fire(
            "¡Movido a Papelera!",
            "La materia ha sido eliminada.",
            "success"
          );
          setMaterias((prev) => prev.filter((m) => m.id_materia !== id));
        } catch (err) {
          // --- CORRECCIÓN: Leer err.message ---
          Swal.fire("Error", err.message || "No se pudo eliminar.", "error");
        }
      }
    });
  };

  // --- Renderizado (sin cambios) ---

  return (
    <Container className="mt-4">
      <BtnVolver/>
      <Row className="mb-3 align-items-center">
        <Col md={6}>
          <h2>Gestión de Materias</h2>
        </Col>
        <Col md={6} className="text-md-end">
          <Button variant="primary" onClick={handleOpenCreate}>
            + Crear Nueva Materia
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Group>
            <InputGroup>
              <InputGroup.Text>Buscar</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Cargando materias...</p>
        </div>
      )}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Nivel (Año)</th>
              <th>Ciclo</th>
              <th>Carga Horaria</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materias.length > 0 ? (
              materias.map((materia) => (
                <tr key={materia.id_materia}>
                  <td>
                    {materia.nombre}
                    {materia.descripcion && (
                      <small className="d-block text-muted">
                        {materia.descripcion}
                      </small>
                    )}
                  </td>
                  <td>{materia.nivel}°</td>
                  <td>{materia.ciclo}</td>
                  <td>
                    {materia.carga_horaria
                      ? `${materia.carga_horaria} hs.`
                      : "N/A"}
                  </td>
                  <td>
                    <span
                      className={`badge bg-${
                        materia.estado === "activa" ? "success" : "secondary"
                      }`}
                    >
                      {materia.estado}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleOpenEdit(materia)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(materia.id_materia)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No se encontraron materias.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <MateriaModal
        show={showModal}
        onHide={handleCloseModal}
        onSave={handleSave}
        materiaAEditar={materiaAEditar}
      />
    </Container>
  );
};

export default Materias;
