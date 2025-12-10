import React, { useState, useEffect } from 'react';
import { getMateriasAsignadas } from '../../services/cursoMateriaService';
import * as asignacionService from '../../services/asignacionService';
import '../../styles/docentesmodal.css';
import { getAniosLectivos } from '../../services/aniosServices';

const AsignacionModal = ({
  onClose,
  onSave,
  docente,
  cursosList,
  asignacionToEdit
}) => {

  const [formData, setFormData] = useState({
    id_curso: '',
    id_materia: '',
    anio_lectivo: new Date().getFullYear().toString(),
    estado: 'activo',
  });

  const [materiasDelCurso, setMateriasDelCurso] = useState([]);
  const [loadingMateriasCurso, setLoadingMateriasCurso] = useState(false);
  const [aniosLectivos, setAniosLectivos] = useState([]);
  const [loadingAniosLectivos, setLoadingAniosLectivos] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [listaEstados, setListaEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);

  const isEditMode = Boolean(asignacionToEdit);

  useEffect(() => {
    async function fetchEstados() {
      try {
        setLoadingEstados(true);
        const estados = await asignacionService.getAsignacionEstados();
        setListaEstados(estados);
      } catch (error) {
        console.error("Error cargando estados:", error);
        setListaEstados(['activo', 'completado', 'inactivo']);
      } finally {
        setLoadingEstados(false);
      }
    }

    async function fetchAniosLectivos() {
      try {
        setLoadingAniosLectivos(true);
        const response = await getAniosLectivos();
        setAniosLectivos(response.datos || []);
      } catch (error) {
        console.error("Error cargando años lectivos:", error);
        setError("Error al cargar los años lectivos.");
      } finally {
        setLoadingAniosLectivos(false);
      }
    }

    fetchEstados();
    fetchAniosLectivos();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        id_curso: asignacionToEdit.id_curso,
        id_materia: asignacionToEdit.id_materia,
        anio_lectivo: asignacionToEdit.anio_lectivo,
        estado: asignacionToEdit.estado,
      });
    }
  }, [asignacionToEdit, isEditMode]);

  useEffect(() => {
    if (!formData.id_curso || loadingAniosLectivos) {
      setMateriasDelCurso([]);
      return;
    }

    const cargarMaterias = async () => {
      setLoadingMateriasCurso(true);
      try {
        const materias = await getMateriasAsignadas(formData.id_curso);
        setMateriasDelCurso(materias);
      } catch (err) {
        console.error("Error al cargar materias del curso:", err);
      } finally {
        setLoadingMateriasCurso(false);
      }
    };

    cargarMaterias();
  }, [formData.id_curso, loadingAniosLectivos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'id_curso') newData.id_materia = '';
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!formData.id_curso && !isEditMode) {
      setError('Debe seleccionar un Curso.');
      setIsSaving(false);
      return;
    }
    if (!formData.id_materia && !isEditMode) {
      setError('Debe seleccionar una Materia.');
      setIsSaving(false);
      return;
    }
    if (!formData.anio_lectivo) {
      setError('Debe seleccionar un Año Lectivo.');
      setIsSaving(false);
      return;
    }

    try {
      if (isEditMode) {
        await asignacionService.updateAsignacion(asignacionToEdit.id_asignacion, {
          anio_lectivo: formData.anio_lectivo,
          estado: formData.estado,
        });
      } else {
        await asignacionService.createAsignacion({
          ...formData,
          id_docente: docente.id_docente,
        });
      }
      onSave();
    } catch (err) {
      setError(err.message || 'Error al guardar la asignación. Verifique que no exista una asignación duplicada.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{isEditMode ? "Editar Asignación" : "Nueva Asignación"}</h3>

        <form onSubmit={handleSubmit}>
          <p style={{ marginBottom: '22px' }}>
            Docente: <strong>{docente.nombre} {docente.apellido}</strong>
          </p>

          {error && <p className="error-message">{error}</p>}

          {loadingAniosLectivos && (
            <p style={{ textAlign: 'center', color: '#666' }}>
              Cargando datos iniciales...
            </p>
          )}

          {!loadingAniosLectivos && (
            <>
              <div className="form-group">
                <label htmlFor="id_curso">Curso:</label>
                <select
                  id="id_curso"
                  name="id_curso"
                  value={formData.id_curso}
                  onChange={handleChange}
                  required
                  disabled={isEditMode || isSaving}
                >
                  <option value="">Seleccione un curso...</option>
                  {Array.isArray(cursosList) && cursosList.length > 0
                    ? cursosList.map((c) => (
                        <option key={c.id_curso} value={c.id_curso}>
                          {c.nombre} ({c.anio}° {c.division})
                        </option>
                      ))
                    : <option disabled>No hay cursos disponibles</option>}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="id_materia">Materia:</label>
                <select
                  id="id_materia"
                  name="id_materia"
                  value={formData.id_materia}
                  onChange={handleChange}
                  required={!isEditMode}
                  disabled={isEditMode || !formData.id_curso || loadingMateriasCurso || isSaving}
                >
                  <option value="">
                    {loadingMateriasCurso
                      ? "Cargando materias..."
                      : !formData.id_curso
                      ? "← Primero seleccione un curso"
                      : materiasDelCurso.length === 0
                      ? "Este curso no tiene materias asignadas"
                      : "Seleccione una materia..."}
                  </option>

                  {materiasDelCurso.map((m) => (
                    <option key={m.id_materia} value={m.id_materia}>
                      {m.nombre} (Nivel {m.nivel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="anio_lectivo">Año Lectivo:</label>
                <select
                  id="anio_lectivo"
                  name="anio_lectivo"
                  value={formData.anio_lectivo}
                  onChange={handleChange}
                  required
                  disabled={loadingAniosLectivos || isSaving}
                >
                  {aniosLectivos.map((a) => (
                    <option key={a.id_anio_lectivo} value={a.anio}>
                      {a.anio}
                    </option>
                  ))}
                </select>
              </div>

              {isEditMode && (
                <div className="form-group">
                  <label htmlFor="estado">Estado:</label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    disabled={loadingEstados || isSaving}
                    required
                  >
                    {loadingEstados
                      ? <option>Cargando...</option>
                      : listaEstados.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado.charAt(0).toUpperCase() + estado.slice(1)}
                          </option>
                        ))}
                  </select>
                </div>
              )}
            </>
          )}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={
                isSaving ||
                loadingMateriasCurso ||
                loadingAniosLectivos ||
                !formData.anio_lectivo ||
                (!isEditMode && !formData.id_materia)
              }
            >
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AsignacionModal;
