import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { createCurso, updateCurso } from '../..//services/cursosService';
// NOTA: Aún no importamos docentes, usaremos un input numérico.

const CursoModal = ({ show, onHide, onSave, cursoAEditar }) => {
  
  const initialState = {
    nombre: '',
    anio: 1,
    division: '',
    turno: 'mañana',
    id_docente_tutor: null,
    estado: 'activo'
  };

  const [formData, setFormData] = useState(initialState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      setError(null);
      if (cursoAEditar) {
        // Modo Edición
        setIsEditMode(true);
        setFormData({
          nombre: cursoAEditar.nombre,
          anio: cursoAEditar.anio,
          division: cursoAEditar.division,
          turno: cursoAEditar.turno,
          id_docente_tutor: cursoAEditar.id_docente_tutor || null,
          estado: cursoAEditar.estado,
        });
      } else {
        // Modo Creación
        setIsEditMode(false);
        setFormData(initialState);
      }
    }
  }, [cursoAEditar, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      // Si el valor es de un 'number' y está vacío, guárdalo como null
      [name]: value === '' && name === 'id_docente_tutor' ? null : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Preparamos los datos
    const datosParaEnviar = {
      ...formData,
      // Asegurarnos que el id_docente_tutor se vaya como número o null
      id_docente_tutor: formData.id_docente_tutor ? parseInt(formData.id_docente_tutor, 10) : null
    };

    try {
      if (isEditMode) {
        await updateCurso(cursoAEditar.id_curso, datosParaEnviar);
      } else {
        await createCurso(datosParaEnviar);
      }
      onSave(); // Llama al padre para refrescar y cerrar
      
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar. Verifique los datos.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? 'Editar Curso' : 'Crear Nuevo Curso'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formNombre">
                <Form.Label>Nombre <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Primero A"
                  required
                  disabled={saving}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formAnio">
                <Form.Label>Año <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  name="anio"
                  value={formData.anio}
                  onChange={handleChange}
                  min="1"
                  max="6" // O el máximo que tengas
                  required
                  disabled={saving}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formDivision">
                <Form.Label>División <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  placeholder="Ej: A"
                  maxLength="10"
                  required
                  disabled={saving}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formTurno">
                <Form.Label>Turno <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="turno"
                  value={formData.turno}
                  onChange={handleChange}
                  required
                  disabled={saving}
                >
                  <option value="mañana">Mañana</option>
                  <option value="tarde">Tarde</option>
                  <option value="noche">Noche</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formDocenteTutor">
                <Form.Label>ID Docente Tutor</Form.Label>
                <Form.Control
                  type="number"
                  name="id_docente_tutor"
                  value={formData.id_docente_tutor || ''}
                  onChange={handleChange}
                  placeholder="(Opcional)"
                  disabled={saving}
                />
                <Form.Text className="text-muted">
                  Por ahora, ingresar el ID. Más adelante será un buscador.
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formEstado">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="completado">Completado</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CursoModal;