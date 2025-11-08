import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { createCurso, updateCurso } from "../../services/cursosService"
const CursoModal = ({ show, onHide, onSave, cursoAEditar }) => {
  
  const initialState = {
    nombre: '',
    anio: 1,
    division: '',
    turno: 'mañana',
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
        setIsEditMode(true);
        setFormData({
          nombre: cursoAEditar.nombre,
          anio: cursoAEditar.anio,
          division: cursoAEditar.division,
          turno: cursoAEditar.turno,
          estado: cursoAEditar.estado,
        });
      } else {
        setIsEditMode(false);
        setFormData(initialState);
      }
    }
  }, [cursoAEditar, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (isEditMode) {
        await updateCurso(cursoAEditar.id_curso, formData);
      } else {
        await createCurso(formData);
      }
      onSave();
      
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
                  max="6"
                  required
                  disabled={saving}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
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
            <Col md={4}>
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
            <Col md={4}>
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
            {saving ? <Spinner as="span" animation="border" size="sm" /> : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CursoModal;