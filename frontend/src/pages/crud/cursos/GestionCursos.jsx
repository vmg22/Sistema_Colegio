import React, { useState, useEffect } from 'react';
import { Button, Table, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import { getCursos, deleteCurso } from '../../../services/cursosService';
import CursoModal from '../../../components/modals/CursoModal';
import Swal from 'sweetalert2';
import BtnVolver from '../../../components/ui/BtnVolver';

const GestionCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showModal, setShowModal] = useState(false);
  const [cursoAEditar, setCursoAEditar] = useState(null);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCursos();
      setCursos(response.datos || []);
    } catch (err) {
      setError('Error al cargar los cursos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  // --- Handlers Modal ---
  
  const handleOpenCreate = () => {
    setCursoAEditar(null);
    setShowModal(true);
  };

  const handleOpenEdit = (curso) => {
    setCursoAEditar(curso);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    handleCloseModal();
    cargarCursos(); 
  };

  // --- Handler Delete ---
  
  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará el curso (borrado lógico).",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCurso(id);
          Swal.fire('¡Eliminado!', 'El curso ha sido eliminado.', 'success');
          setCursos(prev => prev.filter(c => c.id_curso !== id));
        } catch (err) {
          Swal.fire('Error', err.response?.data?.mensaje || 'No se pudo eliminar.', 'error');
        }
      }
    });
  };

  // --- Renderizado ---

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando cursos...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <BtnVolver/>
      <Row className="mb-3">
        <Col>
          <h2>Gestión de Cursos</h2>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleOpenCreate}>
            + Crear Nuevo Curso
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Año</th>
            <th>División</th>
            <th>Turno</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.length > 0 ? (
            cursos.map(curso => (
              <tr key={curso.id_curso}>
                <td>{curso.nombre}</td>
                <td>{curso.anio}°</td>
                <td>{curso.division}</td>
                <td>{curso.turno}</td>
                <td>
                  <span className={`badge bg-${curso.estado === 'activo' ? 'success' : 'secondary'}`}>
                    {curso.estado}
                  </span>
                </td>
                <td>
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleOpenEdit(curso)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(curso.id_curso)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No hay cursos registrados.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <CursoModal
        show={showModal}
        onHide={handleCloseModal}
        onSave={handleSave}
        cursoAEditar={cursoAEditar}
      />
    </Container>
  );
};

export default GestionCursos;