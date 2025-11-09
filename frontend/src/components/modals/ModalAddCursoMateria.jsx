import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';

// Importamos todos los servicios que este modal necesita
import { getCursos } from '../../services/cursosService';
import { getMateriasAsignadas } from '../../services/cursoMateriaService';
import { getAniosLectivos } from '../../services/aniosServices';
import { matricularAlumnoEnCurso } from '../../services/alumnosService';

const ModalAddCursoMateria = ({ show, onClose, onSave, idAlumno }) => {
  
  const [formData, setFormData] = useState({
    id_curso: '',
    anio_lectivo: new Date().getFullYear().toString(), // Empezar con el año actual
  });

  // Listas para los dropdowns
  const [cursosList, setCursosList] = useState([]);
  const [aniosList, setAniosList] = useState([]);
  const [materiasPreview, setMateriasPreview] = useState([]); // Lista de materias a asignar

  // Estados de carga
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [loadingMaterias, setLoadingMaterias] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Carga inicial de Cursos y Años Lectivos
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        setLoadingDropdowns(true);
        setError(null);

        const [resCursos, resAnios] = await Promise.all([
          getCursos(),
          getAniosLectivos()
        ]);
        
        setCursosList(resCursos.datos || []);
        setAniosList(resAnios.datos || []);
        
      } catch (err) {
        setError("Error al cargar las opciones del formulario.");
        console.error(err);
      } finally {
        setLoadingDropdowns(false);
      }
    };
    if (show) {
      loadDropdowns();
    }
  }, [show]); // Se recarga cada vez que se abre el modal

  // Carga las materias correspondientes a un curso (del Plan de Estudios)
  const cargarMateriasDelCurso = useCallback(async (idCurso) => {
    if (!idCurso) {
      setMateriasPreview([]);
      return;
    }
    setLoadingMaterias(true);
    setError(null);
    try {
      const materias = await getMateriasAsignadas(idCurso);
      setMateriasPreview(materias);
      if (materias.length === 0) {
        setError("Advertencia: Este curso no tiene materias en su plan de estudios. No se puede matricular.");
      }
    } catch (err) {
      setError(err.message || "Error al cargar las materias de este curso.");
    } finally {
      setLoadingMaterias(false);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Si el usuario cambió el CURSO, cargamos la lista de materias
    if (name === 'id_curso') {
      setFormData(prev => ({ ...prev, id_materia: '' })); // Resetea
      cargarMateriasDelCurso(value); // Carga la vista previa
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Usamos la nueva función del servicio de alumno
      await matricularAlumnoEnCurso(
        idAlumno, 
        parseInt(formData.id_curso), 
        parseInt(formData.anio_lectivo)
      );
      
      onSave(); // Llama a onSave del AlumnosPerfil (cierra y refresca)

    } catch (err) {
      setError(err.message || 'No se pudo matricular al alumno.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    // Usamos el 'show' y 'onHide' (en lugar de 'onClose') de React-Bootstrap
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Asignar Curso (Matricular)</Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {loadingDropdowns && (
            <div className="text-center">
              <Spinner animation="border" />
              <p>Cargando opciones...</p>
            </div>
          )}

          <fieldset disabled={isSaving || loadingDropdowns}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formCurso">
                  <Form.Label>Curso <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="id_curso"
                    value={formData.id_curso}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Seleccione un curso --</option>
                    {cursosList.map(curso => (
                      <option key={curso.id_curso} value={curso.id_curso}>
                        {curso.nombre} ({curso.anio}° {curso.division} - {curso.turno})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formAnioLectivo">
                  <Form.Label>Año Lectivo <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    name="anio_lectivo"
                    value={formData.anio_lectivo}
                    onChange={handleChange}
                    required
                  >
                    {aniosList.map(anio => (
                      <option key={anio.id_anio_lectivo} value={anio.anio}>
                        {anio.anio}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <hr />

            {/* Vista Previa de Materias */}
            <Form.Group>
              <Form.Label>Materias a Inscribir (Vista Previa)</Form.Label>
              {loadingMaterias && <Spinner animation="border" size="sm" />}
              
              {!loadingMaterias && materiasPreview.length > 0 && (
                <div className="materias-preview-list" style={{ maxHeight: '200px', overflowY: 'auto', background: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                  <ul>
                    {materiasPreview.map(materia => (
                      <li key={materia.id_materia}>{materia.nombre}</li>
                    ))}
                  </ul>
                </div>
              )}

              {!loadingMaterias && materiasPreview.length === 0 && (
                 <p className="text-muted">
                   {formData.id_curso ? 'Este curso no tiene materias en su plan de estudios.' : 'Seleccione un curso para ver las materias.'}
                 </p>
              )}
            </Form.Group>
          </fieldset>
          
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={
              isSaving || 
              loadingDropdowns || 
              loadingMaterias ||
              !formData.id_curso ||
              materiasPreview.length === 0 // No se puede matricular si no hay materias
            }
          >
            {isSaving ? 'Matriculando...' : 'Matricular Alumno'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalAddCursoMateria;