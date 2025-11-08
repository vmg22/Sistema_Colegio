import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { createAnioLectivo, updateAnioLectivo } from '../../services/aniosServices';

// Helper para formatear la fecha que viene de la BD (ej: "2025-03-01T...Z")
// a un formato que el input type="date" entiende (ej: "2025-03-01")
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toISOString().split('T')[0];
  } catch (error) {
    console.error("Error formateando fecha:", dateString, error);
    return '';
  }
};

const AnioLectivoModal = ({ show, onHide, onSave, anioAEditar }) => {
  
  const initialState = {
    anio: new Date().getFullYear() + 1, // Sugiere el próximo año
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'planificacion'
  };

  const [formData, setFormData] = useState(initialState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show) {
      setError(null); // Limpia errores al abrir
      if (anioAEditar) {
        // Modo Edición
        setIsEditMode(true);
        setFormData({
          anio: anioAEditar.anio,
          fecha_inicio: formatDateForInput(anioAEditar.fecha_inicio),
          fecha_fin: formatDateForInput(anioAEditar.fecha_fin),
          estado: anioAEditar.estado,
        });
      } else {
        // Modo Creación
        setIsEditMode(false);
        setFormData(initialState);
      }
    }
  }, [anioAEditar, show]); // Se re-ejecuta cuando el modal se abre o cambia el prop

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
        // Lógica de Actualizar (PUT)
        await updateAnioLectivo(anioAEditar.id_anio_lectivo, formData);
      } else {
        // Lógica de Crear (POST)
        await createAnioLectivo(formData);
      }
      onSave(); // Llama al padre para refrescar la tabla y cerrar
      
    } catch (err) {
      // Captura errores de la API (ej: año duplicado)
      setError(err.response?.data?.mensaje || 'Error al guardar. Intente de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? 'Editar Año Lectivo' : 'Crear Nuevo Año Lectivo'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form.Group className="mb-3" controlId="formAnio">
            <Form.Label>Año <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="number"
              name="anio"
              value={formData.anio}
              onChange={handleChange}
              placeholder="Ej: 2026"
              min="2020"
              max="2040"
              required
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFechaInicio">
            <Form.Label>Fecha de Inicio <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="date"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFechaFin">
            <Form.Label>Fecha de Fin <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="date"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              required
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Estado <span className="text-danger">*</span></Form.Label>
            <Form.Select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              disabled={saving}
            >
              <option value="planificacion">Planificación</option>
              <option value="activo">Activo</option>
              <option value="finalizado">Finalizado</option>
            </Form.Select>
          </Form.Group>
          
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                {' Guardando...'}
              </>
            ) : 'Guardar Cambios'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AnioLectivoModal;