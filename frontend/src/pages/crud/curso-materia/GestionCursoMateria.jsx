import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button, Spinner, Alert, Container, Row, Col, Form, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';

// Importamos TODOS los servicios que necesitamos
import { getCursos } from '../../../services/cursosService';
import { getMaterias } from '../../../services/materiasaltasService';
import { getMateriasAsignadas, actualizarAsignaciones } from '../../../services/cursoMateriaService';
import BtnVolver from '../../../components/ui/BtnVolver';

const GestionCursoMateria = () => {
  // Listas maestras
  const [cursos, setCursos] = useState([]);
  const [materias, setMaterias] = useState([]); // Todas las materias

  // Estado de la UI
  const [selectedCursoId, setSelectedCursoId] = useState('');
  const [loadingCursos, setLoadingCursos] = useState(true);
  const [loadingMaterias, setLoadingMaterias] = useState(true);
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // --- El estado clave ---
  // Usamos un Set para guardar los IDs de las materias que están MARCADAS.
  // Es mucho más rápido para agregar/quitar/verificar que un array.
  const [materiasMarcadas, setMateriasMarcadas] = useState(new Set());

  // Carga inicial de Cursos y Materias (la lista completa)
  const cargarDatosMaestros = useCallback(async () => {
    try {
      setLoadingCursos(true);
      setLoadingMaterias(true);
      const [resCursos, resMaterias] = await Promise.all([
        getCursos(),      // Tu servicio devuelve { datos: [...] }
        getMaterias({}),  // Tu servicio devuelve [...]
      ]);
      
      setCursos(resCursos.datos || []);
      setMaterias(resMaterias || []);
      
    } catch (err) {
      setError('Error al cargar datos maestros (cursos o materias).');
    } finally {
      setLoadingCursos(false);
      setLoadingMaterias(false);
    }
  }, []);

  useEffect(() => {
    cargarDatosMaestros();
  }, [cargarDatosMaestros]);

  // --- Efecto Secundario: Cargar asignaciones cuando se elige un curso ---
  useEffect(() => {
    const cargarAsignaciones = async () => {
      if (!selectedCursoId) {
        setMateriasMarcadas(new Set()); // Limpiar
        return;
      }
      
      setLoadingAsignaciones(true);
      setError(null);
      try {
        // 1. Pedimos a la API la lista de materias que YA tiene este curso
        const materiasAsignadas = await getMateriasAsignadas(selectedCursoId);
        
        // 2. Convertimos ese array en un Set de IDs para los checkboxes
        const idsSet = new Set(materiasAsignadas.map(m => m.id_materia));
        setMateriasMarcadas(idsSet);

      } catch (err) {
        setError('Error al cargar las materias asignadas a este curso.');
      } finally {
        setLoadingAsignaciones(false);
      }
    };

    cargarAsignaciones();
  }, [selectedCursoId]); // Se dispara cada vez que cambia el curso seleccionado


  // --- Filtrado de Materias (Lógica del Dashboard) ---
  // Filtra la lista TOTAL de materias para mostrar solo las del nivel correcto
  const materiasFiltradas = useMemo(() => {
    if (!selectedCursoId || !cursos.length || !materias.length) {
      return [];
    }
    const cursoSeleccionado = cursos.find(c => c.id_curso === parseInt(selectedCursoId));
    if (!cursoSeleccionado) return [];

    // Filtra materias donde 'nivel' (materia) sea igual a 'anio' (curso)
    return materias.filter(m => m.nivel === cursoSeleccionado.anio);

  }, [selectedCursoId, cursos, materias]);


  // --- Handlers ---
  
  const handleCursoChange = (e) => {
    setSelectedCursoId(e.target.value);
  };

  // Maneja el clic en un checkbox
  const handleMateriaToggle = (id_materia) => {
    setMateriasMarcadas(prevSet => {
      const newSet = new Set(prevSet); // Copia el Set
      if (newSet.has(id_materia)) {
        newSet.delete(id_materia); // Si estaba, lo quita
      } else {
        newSet.add(id_materia); // Si no estaba, lo añade
      }
      return newSet;
    });
  };

  // Maneja el botón de Guardar
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    // Convierte el Set de IDs de vuelta a un array
    const idMateriasArray = Array.from(materiasMarcadas);
    
    try {
      await actualizarAsignaciones(selectedCursoId, idMateriasArray);
      Swal.fire(
        '¡Guardado!',
        'El plan de estudios del curso ha sido actualizado.',
        'success'
      );
    } catch (err) {
      setError(err.message || 'Error al guardar los cambios.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Renderizado ---

  if (loadingCursos) {
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
          <h2>Gestión de Planes de Estudio</h2>
          <p>Seleccione un curso para ver y asignar sus materias.</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {/* Columna 1: Selector de Curso */}
        <Col md={4}>
          <Card>
            <Card.Header>1. Seleccionar Curso</Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Curso</Form.Label>
                <Form.Select 
                  value={selectedCursoId} 
                  onChange={handleCursoChange}
                  disabled={isSaving}
                >
                  <option value="">-- Seleccione un curso --</option>
                  {cursos.map(curso => (
                    <option key={curso.id_curso} value={curso.id_curso}>
                      {curso.nombre} ({curso.anio}° {curso.division} - {curso.turno})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna 2: Lista de Materias */}
        <Col md={8}>
          <Card>
            <Card.Header>2. Asignar Materias</Card.Header>
            <Card.Body>
              {!selectedCursoId ? (
                <p className="text-muted">Por favor, seleccione un curso para ver sus materias.</p>
              ) : loadingAsignaciones || loadingMaterias ? (
                <div className="text-center">
                  <Spinner animation="border" size="sm" />
                  <p>Cargando materias...</p>
                </div>
              ) : materiasFiltradas.length === 0 ? (
                <Alert variant="warning">
                  No se encontraron materias de Nivel {cursos.find(c => c.id_curso === parseInt(selectedCursoId))?.anio}. 
                  Asegúrese de haber creado materias para ese nivel.
                </Alert>
              ) : (
                <Form>
                  <div className="materias-checklist" style={{maxHeight: '400px', overflowY: 'auto'}}>
                    {materiasFiltradas.map(materia => (
                      <Form.Check 
                        type="checkbox"
                        key={materia.id_materia}
                        id={`materia-${materia.id_materia}`}
                        label={`${materia.nombre} (Nivel ${materia.nivel})`}
                        // Marcamos el check si el ID está en nuestro Set
                        checked={materiasMarcadas.has(materia.id_materia)}
                        onChange={() => handleMateriaToggle(materia.id_materia)}
                        disabled={isSaving}
                      />
                    ))}
                  </div>
                  
                  <hr />
                  
                  <Button 
                    variant="primary" 
                    onClick={handleSave}
                    disabled={isSaving || loadingAsignaciones}
                  >
                    {isSaving ? (
                      <Spinner as="span" animation="border" size="sm" />
                    ) : 'Guardar Cambios'}
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GestionCursoMateria;