import React, { useState, useEffect } from 'react';
import {
  createMateria,
  updateMateria,
  getCiclosMateria,
  getEstadosMateria
} from '../../services/materiasaltasService';
import '../../styles/docentesmodal.css';

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
          const [resCiclos, resEstados] = await Promise.all([
            getCiclosMateria(),
            getEstadosMateria()
          ]);

          setCiclos(resCiclos || []);
          setEstados(resEstados || []);

        } catch (err) {
          setError(err.message || 'Error al cargar opciones del formulario.');
        } finally {
          setLoadingEnums(false);
        }

        if (materiaAEditar) {
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
        await updateMateria(materiaAEditar.id_materia, datosParaEnviar);
      } else {
        await createMateria(datosParaEnviar);
      }
      onSave();

    } catch (err) {
      setError(err.message || 'Error al guardar. Verifique los datos.');
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onHide}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{isEditMode ? 'Editar Materia' : 'Crear Nueva Materia'}</h3>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {loadingEnums && (
            <p style={{ textAlign: 'center', color: '#666' }}>
              Cargando opciones...
            </p>
          )}

            {/* Fila 1: Nombre y Nivel */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '18px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="nombre">
                  Nombre Materia <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Matemática I"
                  required
                  disabled={saving || loadingEnums}
                />
              </div>

              <div className="form-group" style={{ flex: '0 0 150px' }}>
                <label htmlFor="nivel">
                  Nivel (Año) <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="number"
                  id="nivel"
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleChange}
                  min="1"
                  max="6"
                  required
                  disabled={saving || loadingEnums}
                />
              </div>
            </div>

            {/* Fila 2: Ciclo, Estado y Carga Horaria */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '18px' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="ciclo">
                  Ciclo <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <select
                  id="ciclo"
                  name="ciclo"
                  value={formData.ciclo}
                  onChange={handleChange}
                  required
                  disabled={saving || loadingEnums}
                >
                  {ciclos.map(ciclo => (
                    <option key={ciclo} value={ciclo}>
                      {ciclo.charAt(0).toUpperCase() + ciclo.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  disabled={saving || loadingEnums}
                >
                  {estados.map(estado => (
                    <option key={estado} value={estado}>
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ flex: '0 0 180px' }}>
                <label htmlFor="carga_horaria">Carga Horaria (Hs.)</label>
                <input
                  type="number"
                  id="carga_horaria"
                  name="carga_horaria"
                  value={formData.carga_horaria}
                  onChange={handleChange}
                  placeholder="Ej: 3"
                  min="0"
                  disabled={saving || loadingEnums}
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="(Opcional) Breve descripción de la materia..."
                rows="3"
                disabled={saving || loadingEnums}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

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
              disabled={saving || loadingEnums}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MateriaModal;