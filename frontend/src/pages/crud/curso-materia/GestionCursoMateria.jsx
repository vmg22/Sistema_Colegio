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
  const [materiasMarcadas, setMateriasMarcadas] = useState(new Set());

  // Carga inicial de Cursos y Materias
  const cargarDatosMaestros = useCallback(async () => {
    try {
      setLoadingCursos(true);
      setLoadingMaterias(true);
      const [resCursos, resMaterias] = await Promise.all([
        getCursos(),
        getMaterias({}),
      ]);
      
      setCursos(resCursos.datos || []);
      setMaterias(resMaterias || []);
      
    } catch (err) {
      setError(err.message || "Error al cargar las cursos-materias.");
    } finally {
      setLoadingCursos(false);
      setLoadingMaterias(false);
    }
  }, []);

  useEffect(() => {
    cargarDatosMaestros();
  }, [cargarDatosMaestros]);

  // Cargar asignaciones cuando se elige un curso
  useEffect(() => {
    const cargarAsignaciones = async () => {
      if (!selectedCursoId) {
        setMateriasMarcadas(new Set());
        return;
      }
      
      setLoadingAsignaciones(true);
      setError(null);
      try {
        const materiasAsignadas = await getMateriasAsignadas(selectedCursoId);
        const idsSet = new Set(materiasAsignadas.map(m => m.id_materia));
        setMateriasMarcadas(idsSet);
      } catch (err) {
        setError(err.message || "Error al cargar las materias asignadas a este curso.");
      } finally {
        setLoadingAsignaciones(false);
      }
    };

    cargarAsignaciones();
  }, [selectedCursoId]);

  // Filtrado de Materias
  const materiasFiltradas = useMemo(() => {
    if (!selectedCursoId || !cursos.length || !materias.length) {
      return [];
    }
    const cursoSeleccionado = cursos.find(c => c.id_curso === parseInt(selectedCursoId));
    if (!cursoSeleccionado) return [];

    return materias.filter(m => m.nivel === cursoSeleccionado.anio);
  }, [selectedCursoId, cursos, materias]);

  // Handlers
  const handleCursoChange = (e) => {
    setSelectedCursoId(e.target.value);
  };

  const handleMateriaToggle = (id_materia) => {
    setMateriasMarcadas(prevSet => {
      const newSet = new Set(prevSet);
      if (newSet.has(id_materia)) {
        newSet.delete(id_materia);
      } else {
        newSet.add(id_materia);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

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

  // Estilos en línea - Azul Institucional
  const styles = {
    container: {
      backgroundColor: '#e8eef5',
      minHeight: '100vh',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
      marginBottom: '32px'
    },
    title: {
      fontSize: '28px',
      fontWeight: '600',
      color: '#3f51b5',
      marginBottom: '8px'
    },
    subtitle: {
      fontSize: '15px',
      color: '#5a6b8c',
      fontWeight: '400'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #d0dae6',
      boxShadow: '0 2px 8px rgba(74, 92, 148, 0.08)',
      marginBottom: '24px',
      overflow: 'hidden'
    },
    cardHeader: {
      backgroundColor: '#3f51b5',
      color: '#ffffff',
      padding: '16px 20px',
      fontSize: '16px',
      fontWeight: '600',
      borderBottom: 'none'
    },
    cardBody: {
      padding: '20px'
    },
    formLabel: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#2c3e6d',
      marginBottom: '8px'
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      fontSize: '14px',
      borderRadius: '8px',
      border: '1px solid #c5d0e0',
      backgroundColor: '#ffffff',
      color: '#2c3e6d',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s'
    },
    checkboxContainer: {
      maxHeight: '400px',
      overflowY: 'auto',
      padding: '8px 0'
    },
    checkboxWrapper: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px',
      marginBottom: '4px',
      borderRadius: '6px',
      transition: 'background-color 0.2s',
      cursor: 'pointer'
    },
    checkbox: {
      width: '18px',
      height: '18px',
      marginRight: '12px',
      cursor: 'pointer',
      accentColor: '#4a5c94'
    },
    checkboxLabel: {
      fontSize: '14px',
      color: '#2c3e6d',
      cursor: 'pointer',
      margin: 0,
      userSelect: 'none'
    },
    buttonPrimary: {
      backgroundColor: '#4a5c94',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 24px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s, transform 0.1s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    alert: {
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '14px'
    },
    alertDanger: {
      backgroundColor: '#fef2f2',
      color: '#991b1b',
      border: '1px solid #fecaca'
    },
    alertWarning: {
      backgroundColor: '#fffbeb',
      color: '#92400e',
      border: '1px solid #fde68a'
    },
    textMuted: {
      color: '#7a8aa3',
      fontSize: '14px'
    },
    divider: {
      border: 'none',
      borderTop: '1px solid #d0dae6',
      margin: '20px 0'
    }
  };

  if (loadingCursos) {
    return (
      <div style={{...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '16px'}}>
        <Spinner animation="border" style={{color: '#4a5c94'}} />
        <p style={styles.textMuted}>Cargando cursos...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <BtnVolver/>
      
      <div style={styles.header}>
        <h2 style={styles.title}>Gestión de Planes de Estudio</h2>
        <p style={styles.subtitle}>Seleccione un curso para ver y asignar sus materias.</p>
      </div>

      {error && (
        <div style={{...styles.alert, ...styles.alertDanger}}>
          {error}
        </div>
      )}

      <Row>
        {/* Columna 1: Selector de Curso */}
        <Col md={4}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              1. Seleccionar Curso
            </div>
            <div style={styles.cardBody}>
              <div>
                <label style={styles.formLabel}>Curso</label>
                <select
                  style={styles.select}
                  value={selectedCursoId} 
                  onChange={handleCursoChange}
                  disabled={isSaving}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4a5c94';
                    e.target.style.boxShadow = '0 0 0 3px rgba(74, 92, 148, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#c5d0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">-- Seleccione un curso --</option>
                  {cursos.map(curso => (
                    <option key={curso.id_curso} value={curso.id_curso}>
                      {curso.nombre} ({curso.anio}° {curso.division} - {curso.turno})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Col>

        {/* Columna 2: Lista de Materias */}
        <Col md={8}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              2. Asignar Materias
            </div>
            <div style={styles.cardBody}>
              {!selectedCursoId ? (
                <p style={styles.textMuted}>Por favor, seleccione un curso para ver sus materias.</p>
              ) : loadingAsignaciones || loadingMaterias ? (
                <div style={{textAlign: 'center'}}>
                  <Spinner animation="border" size="sm" style={{color: '#4a5c94'}} />
                  <p style={{...styles.textMuted, marginTop: '12px'}}>Cargando materias...</p>
                </div>
              ) : materiasFiltradas.length === 0 ? (
                <div style={{...styles.alert, ...styles.alertWarning}}>
                  No se encontraron materias de Nivel {cursos.find(c => c.id_curso === parseInt(selectedCursoId))?.anio}. 
                  Asegúrese de haber creado materias para ese nivel.
                </div>
              ) : (
                <div>
                  <div style={styles.checkboxContainer}>
                    {materiasFiltradas.map(materia => (
                      <div 
                        key={materia.id_materia}
                        style={styles.checkboxWrapper}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f4f9'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => handleMateriaToggle(materia.id_materia)}
                      >
                        <input
                          type="checkbox"
                          id={`materia-${materia.id_materia}`}
                          style={styles.checkbox}
                          checked={materiasMarcadas.has(materia.id_materia)}
                          onChange={() => handleMateriaToggle(materia.id_materia)}
                          disabled={isSaving}
                        />
                        <label 
                          htmlFor={`materia-${materia.id_materia}`}
                          style={styles.checkboxLabel}
                        >
                          {materia.nombre} (Nivel {materia.nivel})
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <hr style={styles.divider} />
                  
                  <button
                    style={styles.buttonPrimary}
                    onClick={handleSave}
                    disabled={isSaving || loadingAsignaciones}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#3d4d7a';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#4a5c94';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    {isSaving ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" />
                        Guardando...
                      </>
                    ) : 'Guardar Cambios'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default GestionCursoMateria;