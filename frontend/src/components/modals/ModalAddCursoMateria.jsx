import React, { useState, useEffect, useCallback } from 'react';

// Importamos el estilo genérico
import '../../styles/docentesmodal.css';
// Asumimos que los servicios están en el lugar correcto
import { getCursos } from '../../services/cursosService';
import { getMateriasAsignadas } from '../../services/cursoMateriaService';
import { getAniosLectivos } from '../../services/aniosServices';
import { matricularAlumnoEnCurso } from '../../services/alumnosService';

const ModalAddCursoMateria = ({ show, onClose, onSave, idAlumno }) => {
  const [formData, setFormData] = useState({
    id_curso: '',
    anio_lectivo: new Date().getFullYear().toString()
  });

  const [cursosList, setCursosList] = useState([]);
  const [aniosList, setAniosList] = useState([]);
  const [materiasPreview, setMateriasPreview] = useState([]);

  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [loadingMaterias, setLoadingMaterias] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const requiredStar = <span style={{ color: '#dc3545' }}>*</span>;

  useEffect(() => {
    const loadDropdowns = async () => {
      if (!show) return;

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
    loadDropdowns();
  }, [show]);

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
      } else if (error && error.includes("Advertencia")) {
        setError(null);
      }
    } catch (err) {
      setError(err.message || "Error al cargar las materias de este curso.");
    } finally {
      setLoadingMaterias(false);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'id_curso') {
      cargarMateriasDelCurso(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!formData.id_curso || !formData.anio_lectivo || materiasPreview.length === 0) {
      setError("Debe seleccionar un Curso y un Año Lectivo válidos, y el curso debe tener materias asignadas.");
      setIsSaving(false);
      return;
    }

    try {
      await matricularAlumnoEnCurso(
        idAlumno,
        parseInt(formData.id_curso),
        parseInt(formData.anio_lectivo)
      );
      onSave();
    } catch (err) {
      setError(err.message || 'No se pudo matricular al alumno.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Asignar Curso (Matricular)</h3>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          {loadingDropdowns && (
            <p style={{ textAlign: 'center', color: '#666' }}>
              <span style={{ marginRight: '10px' }}>Cargando opciones...</span>
              <div className="spinner-border text-primary" role="status" style={{ width: '1rem', height: '1rem' }}>
                <span className="visually-hidden">Cargando...</span>
              </div>
            </p>
          )}

          <fieldset disabled={isSaving || loadingDropdowns}>
            <div className="form-group">
              <label htmlFor="id_curso">Curso {requiredStar}</label>
              <select
                id="id_curso"
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
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="anio_lectivo">Año Lectivo {requiredStar}</label>
              <select
                id="anio_lectivo"
                name="anio_lectivo"
                value={formData.anio_lectivo}
                onChange={handleChange}
                required
                style={{ maxWidth: '250px' }}
              >
                {aniosList.map(anio => (
                  <option key={anio.id_anio_lectivo} value={anio.anio}>
                    {anio.anio}
                  </option>
                ))}
              </select>
            </div>

            <hr style={{ marginTop: '30px', marginBottom: '30px', borderTop: '1px solid #c5d8f0' }} />

            <div className="form-group">
              <label>Materias a Inscribir (Vista Previa)</label>

              {loadingMaterias && (
                <p style={{ textAlign: 'center', color: '#666' }}>
                  <span style={{ marginRight: '10px' }}>Cargando materias...</span>
                  <div className="spinner-border text-primary" role="status" style={{ width: '1rem', height: '1rem' }}>
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </p>
              )}

              {!loadingMaterias && materiasPreview.length > 0 && (
                <div style={{ maxHeight: '200px', overflowY: 'auto', background: '#e8f0fe', padding: '15px', borderRadius: '8px', border: '1px solid #d1e3f8' }}>
                  <ul style={{ listStyleType: 'disc', margin: 0, paddingLeft: '20px', color: '#1e3c72' }}>
                    {materiasPreview.map(materia => (
                      <li key={materia.id_materia} style={{ marginBottom: '5px' }}>{materia.nombre}</li>
                    ))}
                  </ul>
                </div>
              )}

              {!loadingMaterias && materiasPreview.length === 0 && (
                <p style={{ color: '#7a8ca8', fontSize: '14px', fontStyle: 'italic', padding: '10px' }}>
                  {formData.id_curso ? 'Este curso no tiene materias en su plan de estudios.' : 'Seleccione un curso para ver las materias.'}
                </p>
              )}
            </div>
          </fieldset>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-save"
              disabled={
                isSaving ||
                loadingDropdowns ||
                loadingMaterias ||
                !formData.id_curso ||
                materiasPreview.length === 0
              }
            >
              {isSaving ? 'Matriculando...' : 'Matricular Alumno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddCursoMateria;
