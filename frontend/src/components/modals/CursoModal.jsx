import React, { useState, useEffect } from 'react';
import { createCurso, updateCurso } from "../../services/cursosService";
import '../../styles/docentesmodal.css'; // Tu CSS personalizado

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

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onHide}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{isEditMode ? 'Editar Curso' : 'Crear Nuevo Curso'}</h3>
        
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          
          <fieldset>
            <legend>Datos del Curso</legend>
            
            {/* Fila 1: Nombre y Año */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '18px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="nombre">
                  Nombre <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Primero A"
                  required
                  disabled={saving}
                />
              </div>
              
              <div className="form-group" style={{ flex: '0 0 150px' }}>
                <label htmlFor="anio">
                  Año <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="number"
                  id="anio"
                  name="anio"
                  value={formData.anio}
                  onChange={handleChange}
                  min="1"
                  max="6"
                  required
                  disabled={saving}
                />
              </div>
            </div>

            {/* Fila 2: División, Turno y Estado */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="division">
                  División <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  id="division"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  placeholder="Ej: A"
                  maxLength="10"
                  required
                  disabled={saving}
                />
              </div>
              
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="turno">
                  Turno <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <select
                  id="turno"
                  name="turno"
                  value={formData.turno}
                  onChange={handleChange}
                  required
                  disabled={saving}
                >
                  <option value="mañana">Mañana</option>
                  <option value="tarde">Tarde</option>
                  <option value="noche">Noche</option>
                </select>
              </div>
              
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="completado">Completado</option>
                </select>
              </div>
            </div>
          </fieldset>

          {/* Botones de acción */}
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={onHide} 
              disabled={saving}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-save" 
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CursoModal;