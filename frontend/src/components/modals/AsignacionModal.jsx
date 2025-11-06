import React, { useState, useEffect } from 'react';

import * as asignacionService from '../../services/asignacionService'; 

import '../../styles/docentesmodal.css'; 

const AsignacionModal = ({ 
  onClose, 
  onSave, 
  docente, // El docente al que se le asigna
  cursosList, // Lista de todos los cursos
  materiasList, // Lista de todas las materias
  asignacionToEdit // La asignación a editar (o null si es para crear)
}) => {

  const [formData, setFormData] = useState({
    id_curso: '',
    id_materia: '',
    anio_lectivo: new Date().getFullYear(), // Año actual por defecto
    estado: 'activo',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [listaEstados, setListaEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(true);

  const isEditMode = Boolean(asignacionToEdit);


useEffect(() => {
    // 1. Lógica para llenar el formulario (que ya tenías)
    if (isEditMode) {
      setFormData({
        id_curso: asignacionToEdit.id_curso,
        id_materia: asignacionToEdit.id_materia,
        anio_lectivo: asignacionToEdit.anio_lectivo,
        estado: asignacionToEdit.estado,
      });
    }

    // 2. Lógica NUEVA para cargar los estados
    async function fetchEstados() {
      try {
        setLoadingEstados(true);
        const estados = await asignacionService.getAsignacionEstados();
        setListaEstados(estados);
      } catch (error) {
        console.error("Error cargando estados de asignación:", error);
        // Fallback si la API falla
        setListaEstados(['activo', 'completado', 'inactivo']);
      } finally {
        setLoadingEstados(false);
      }
    }
    
    fetchEstados();
    
  }, [asignacionToEdit, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (isEditMode) {
        // --- MODO EDICIÓN ---
 
        const dataToUpdate = {
          anio_lectivo: formData.anio_lectivo,
          estado: formData.estado,
        };
        await asignacionService.updateAsignacion(asignacionToEdit.id_asignacion, dataToUpdate);
      } else {
        // --- MODO CREACIÓN ---
        const dataToCreate = {
          ...formData,
          id_docente: docente.id_docente, // Vinculamos al docente del perfil
        };
        await asignacionService.createAsignacion(dataToCreate);
      }
      onSave(); // Llama a onSave del padre (para cerrar y recargar)
    } catch (err) {
      setError(err.message || 'No se pudo guardar la asignación.');
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
            <div className="form-group">
              <label htmlFor="id_materia">Materia:</label>
              <select
                id="id_materia"
                name="id_materia"
                value={formData.id_materia}
                onChange={handleChange}
                required
                disabled={isEditMode}
              >
                <option value="">Seleccione una materia...</option>
                {Array.isArray(materiasList) && materiasList.length > 0 ? (
                  materiasList.map((m) => (
                    <option key={m.id_materia} value={m.id_materia}>
                      {m.nombre}
                    </option>
                  ))
                ) : (
                  <option disabled>Cargando materias...</option>
                )}
              </select>
            </div>

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
                {Array.isArray(cursosList) && cursosList.length > 0 ? (
                  cursosList.map((c) => (
                    <option key={c.id_curso} value={c.id_curso}>
                      {c.nombre} ({c.anio}° {c.division})
                    </option>
                  ))
                ) : (
                  <option disabled>Cargando cursos...</option>
                )}
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

            {/* Solo mostramos el 'estado' al editar */}
            {isEditMode && (
              <div className="form-group">
                <label htmlFor="estado">Estado:</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  disabled={loadingEstados} // Deshabilitado mientras carga
                >
                  {loadingEstados ? (
                    <option value={formData.estado}>Cargando...</option>
                  ) : (
                    // Mapeamos los estados traídos de la API
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
            <button type="submit" className="btn-save" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AsignacionModal;