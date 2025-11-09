import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
// --- CORRECCIÓN: Importamos los nombres de tu servicio ---
import { 
  createMateria, 
  updateMateria, 
  getCiclosMateria, 
  getEstadosMateria 
} from '../../services/materiasaltasService';

  const initialState = {
    nombre: '',
    nivel: 1,
    ciclo: 'basico',
    estado: 'activa',
    carga_horaria: '',
    descripcion: ''
  };

const MateriaModal = ({ show, onHide, onSave, materiaAEditar }) => {
  


  const [formData, setFormData] = useState(initialState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingEnums, setLoadingEnums] = useState(false);
  const [error, setError] = useState(null);
  
  const [ciclos, setCiclos] = useState([]);
  const [estados, setEstados] = useState([]);

  useEffect(() => {
    const loadModalData = async () => {
      if (show) {
        setError(null);
        setLoadingEnums(true);
        
        try {
          // --- CORRECCIÓN: Usamos los nombres de tu servicio ---
          const [resCiclos, resEstados] = await Promise.all([
            getCiclosMateria(),
            getEstadosMateria()
          ]);
          
          // --- CORRECCIÓN: Tu servicio ya devuelve el array ---
          setCiclos(resCiclos || []);
          setEstados(resEstados || []);
          
        } catch (err) {
          setError(err.message || 'Error al cargar opciones del formulario.');
        } finally {
          setLoadingEnums(false);
        }

        if (materiaAEditar) {
          // Modo Edición
          setIsEditMode(true);
          setFormData({
            nombre: materiaAEditar.nombre,
            nivel: materiaAEditar.nivel,
            ciclo: materiaAEditar.ciclo,
            estado: materiaAEditar.estado,
            carga_horaria: materiaAEditar.carga_horaria || '',
            descripcion: materiaAEditar.descripcion || ''
          });
        } else {
          // Modo Creación
          setIsEditMode(false);
          setFormData(initialState);
        }
      }
    };
    loadModalData();
  }, [materiaAEditar, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === 'carga_horaria' || name === 'nivel') ? (value === '' ? '' : parseInt(value, 10)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const datosParaEnviar = {
      ...formData,
      carga_horaria: formData.carga_horaria || null,
      descripcion: formData.descripcion || null,
    };

    try {
      if (isEditMode) {
        // Tu servicio usa PATCH para updateMateria, lo cual es genial
        await updateMateria(materiaAEditar.id_materia, datosParaEnviar);
      } else {
        await createMateria(datosParaEnviar);
      }
      onSave();
      
    } catch (err) {
      // --- CORRECCIÓN: Tu servicio ya procesa el error ---
      setError(err.message || 'Error al guardar. Verifique los datos.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditMode ? 'Editar Materia' : 'Crear Nueva Materia'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {loadingEnums && <Spinner animation="border" size="sm" />}

          {/* ... (El resto del formulario (Filas y Columnas) no cambia) ... */}
          {/* ... (Nombre, Nivel, Ciclo, Estado, Carga Horaria, Descripción) ... */}

          <Row>
            <Col md={8}>
              <Form.Group className="mb-3" controlId="formNombre">
                <Form.Label>Nombre Materia <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Matemática I"
                  required
                  disabled={saving || loadingEnums}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formNivel">
                <Form.Label>Nivel (Año) <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleChange}
                  min="1"
                  max="6" 
                  required
                  disabled={saving || loadingEnums}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formCiclo">
                <Form.Label>Ciclo <span className="text-danger">*</span></Form.Label>
                <Form.Select
                  name="ciclo"
                  value={formData.ciclo}
                  onChange={handleChange}
                  required
                  disabled={saving || loadingEnums}
                >
                  {ciclos.map(ciclo => (
                    <option key={ciclo} value={ciclo}>{ciclo.charAt(0).toUpperCase() + ciclo.slice(1)}</option>
                  ))}
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
                  disabled={saving || loadingEnums}
                >
                  {estados.map(estado => (
                    <option key={estado} value={estado}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
             <Col md={4}>
              <Form.Group className="mb-3" controlId="formCargaHoraria">
                <Form.Label>Carga Horaria (Hs. Semanales)</Form.Label>
                <Form.Control
                  type="number"
                  name="carga_horaria"
                  value={formData.carga_horaria}
                  onChange={handleChange}
                  placeholder="Ej: 3"
                  min="0"
                  disabled={saving || loadingEnums}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formDescripcion">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="(Opcional) Breve descripción de la materia..."
              disabled={saving || loadingEnums}
            />
          </Form.Group>
          
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={saving || loadingEnums}>
            {saving ? <Spinner as="span" animation="border" size="sm" /> : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MateriaModal;