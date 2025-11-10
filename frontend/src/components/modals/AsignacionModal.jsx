import React, { useState, useEffect } from 'react';
// IMPORTANTE: Ajusta la ruta de importación según donde tengas tu servicio
import { getMateriasAsignadas } from '../../services/cursoMateriaService';
import * as asignacionService from '../../services/asignacionService';
import '../../styles/docentesmodal.css';

const AsignacionModal = ({
  onClose,
  onSave,
  docente,
  cursosList,
  // materiasList, // YA NO LO USAMOS, lo cargamos internamente
  asignacionToEdit
}) => {

  const [formData, setFormData] = useState({
    id_curso: '',
    id_materia: '',
    anio_lectivo: new Date().getFullYear(),
    estado: 'activo',
  });

  // Nuevos estados para manejar las materias del curso seleccionado
  const [materiasDelCurso, setMateriasDelCurso] = useState([]);
  const [loadingMateriasCurso, setLoadingMateriasCurso] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [listaEstados, setListaEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);

  const isEditMode = Boolean(asignacionToEdit);

  // 1. Efecto para cargar datos iniciales si es edición
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        id_curso: asignacionToEdit.id_curso,
        id_materia: asignacionToEdit.id_materia,
        anio_lectivo: asignacionToEdit.anio_lectivo,
        estado: asignacionToEdit.estado,
      });
    }

    // Cargar estados posibles
    async function fetchEstados() {
      try {
        setLoadingEstados(true);
        const estados = await asignacionService.getAsignacionEstados();
        setListaEstados(estados);
      } catch (error) {
        console.error("Error cargando estados:", error);
        setListaEstados(['activo', 'completado', 'inactivo']); // Fallback
      } finally {
        setLoadingEstados(false);
      }
    }
    fetchEstados();
  }, [asignacionToEdit, isEditMode]);

  // 2. NUEVO EFECTO: Cargar materias cuando cambia el curso seleccionado
  useEffect(() => {
    // Si no hay curso seleccionado, limpiamos las materias
    if (!formData.id_curso) {
      setMateriasDelCurso([]);
      return;
    }

    const cargarMaterias = async () => {
      setLoadingMateriasCurso(true);
      try {
        // Llamamos a tu servicio existente para obtener SOLO las materias de este curso
        const materias = await getMateriasAsignadas(formData.id_curso);
        setMateriasDelCurso(materias);
      } catch (err) {
        console.error("Error al cargar materias del curso:", err);
        // Podrías setear un error aquí si quieres mostrarlo en la UI
      } finally {
        setLoadingMateriasCurso(false);
      }
    };

    cargarMaterias();
  }, [formData.id_curso]); // Se ejecuta cada vez que cambia el ID del curso

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      // Si cambió el curso, reseteamos la materia seleccionada para evitar inconsistencias
      if (name === 'id_curso') {
        newData.id_materia = '';
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      if (isEditMode) {
        await asignacionService.updateAsignacion(asignacionToEdit.id_asignacion, {
          anio_lectivo: formData.anio_lectivo,
          estado: formData.estado,
          // En edición normalmente no se permite cambiar curso/materia, solo estado/año
        });
      } else {
        await asignacionService.createAsignacion({
          ...formData,
          id_docente: docente.id_docente,
        });
      }
      onSave();
    } catch (err) {
      setError(err.message || 'Error al guardar la asignación.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h3>{isEditMode ? "Editar Asignación" : "Nueva Asignación"}</h3>
          <p>
            Docente:{" "}
            <strong>
              {docente.nombre} {docente.apellido}
            </strong>
          </p>

          <fieldset>
            <legend>Datos de la Asignación</legend>

            {/* Selector de CURSO */}
            {/* Selector de CURSO */}
            <div className="form-group">
              <label htmlFor="id_curso">Curso:</label>
              <select
                id="id_curso"
                name="id_curso"
                value={formData.id_curso}
                onChange={handleChange}
                required
                disabled={isEditMode}
              >
                <option value="">Seleccione un curso...</option>

                {/* --- VERSIÓN SEGURA --- */}
                {/* Verificamos si cursosList existe Y si es un array real */}
                {Array.isArray(cursosList) && cursosList.length > 0
                  ? cursosList.map((c) => (
                      <option key={c.id_curso} value={c.id_curso}>
                        {c.nombre} ({c.anio}° {c.division})
                      </option>
                    ))
                  : !isEditMode && (
                      <option disabled>No hay cursos disponibles</option>
                    )}
                {/* ---------------------- */}
              </select>
            </div>

            {/* Selector de MATERIA (Dinámico) */}
            <div className="form-group">
              <label htmlFor="id_materia">Materia:</label>
              <select
                id="id_materia"
                name="id_materia"
                value={formData.id_materia}
                onChange={handleChange}
                required
                // Deshabilitado si: es edición, no hay curso seleccionado, o está cargando
                disabled={
                  isEditMode || !formData.id_curso || loadingMateriasCurso
                }
                className={
                  !formData.id_curso && !isEditMode
                    ? "select-disabled-hint"
                    : ""
                }
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
              <input
                type="number"
                id="anio_lectivo"
                name="anio_lectivo"
                value={formData.anio_lectivo}
                onChange={handleChange}
                required
              />
            </div>

            {isEditMode && (
              <div className="form-group">
                <label htmlFor="estado">Estado:</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  disabled={loadingEstados}
                >
                  {loadingEstados ? (
                    <option>Cargando...</option>
                  ) : (
                    listaEstados.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado.charAt(0).toUpperCase() + estado.slice(1)}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}
          </fieldset>

          {error && <p className="error-message">{error}</p>}

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
              disabled={isSaving || (loadingMateriasCurso && !isEditMode)}
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