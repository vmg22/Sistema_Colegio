import React, { useState, useEffect } from 'react';
import { Button, Table, Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import { getAniosLectivos, deleteAnioLectivo } from '../../../services/aniosServices';
import AnioLectivoModal from '../../../components/modals/AnioLectivoModal';
import Swal from 'sweetalert2'; // Para la confirmación de borrado

const GestionAniosLectivos = () => {
  const [aniosLectivos, setAniosLectivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [anioAEditar, setAnioAEditar] = useState(null);

  // Carga inicial de datos
  const cargarAnios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAniosLectivos();
      setAniosLectivos(response.datos || []); // Asumimos que la respuesta es { datos: [...] }
    } catch (err) {
      setError('Error al cargar los años lectivos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAnios();
  }, []);

  // --- Handlers para el Modal ---
  
  const handleOpenCreate = () => {
    setAnioAEditar(null); // 'null' significa modo "Crear"
    setShowModal(true);
  };

  const handleOpenEdit = (anio) => {
    setAnioAEditar(anio); // Pasamos el objeto a editar
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    // Cuando el modal guarda exitosamente, cerramos y refrescamos la tabla
    handleCloseModal();
    cargarAnios(); 
  };

  // --- Handler para Borrar ---
  
  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto (luego implementaremos 'restaurar').",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAnioLectivo(id);
          Swal.fire(
            '¡Eliminado!',
            'El año lectivo ha sido eliminado.',
            'success'
          );
          // Refrescar la lista filtrando el item eliminado
          setAniosLectivos(prev => prev.filter(a => a.id_anio_lectivo !== id));
        } catch (err) {
          Swal.fire(
            'Error',
            err.response?.data?.mensaje || 'No se pudo eliminar el año lectivo.',
            'error'
          );
        }
      }
    });
  };

  // --- Renderizado ---

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p>Cargando años lectivos...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h2>Gestión de Años Lectivos</h2>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={handleOpenCreate}>
            + Crear Nuevo Año Lectivo
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Año</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {aniosLectivos.length > 0 ? (
            aniosLectivos.map(anio => (
              <tr key={anio.id_anio_lectivo}>
                <td>{anio.anio}</td>
                <td>{new Date(anio.fecha_inicio).toLocaleDateString()}</td>
                <td>{new Date(anio.fecha_fin).toLocaleDateString()}</td>
                <td>
                  <span className={`badge bg-${
                    anio.estado === 'activo' ? 'success' :
                    anio.estado === 'planificacion' ? 'warning' : 'secondary'
                  }`}>
                    {anio.estado}
                  </span>
                </td>
                <td>
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleOpenEdit(anio)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDelete(anio.id_anio_lectivo)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No hay años lectivos registrados.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* El Modal (se renderiza pero solo se muestra si showModal es true) */}
      <AnioLectivoModal
        show={showModal}
        onHide={handleCloseModal}
        onSave={handleSave}
        anioAEditar={anioAEditar}
      />
    </Container>
  );
};

export default GestionAniosLectivos;