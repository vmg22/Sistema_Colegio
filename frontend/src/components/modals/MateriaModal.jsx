import React, { useState, useEffect } from 'react';
// --- ¡CAMBIO AQUÍ! ---
import * as materiasaltasService from '../../services/materiasaltasService';
import '../../styles/docentesmodal.css'; // Reutiliza el mismo CSS

// Estado inicial que coincide con tu tabla 'materia'
const initialState = {
  nombre: '',
  descripcion: '',
  carga_horaria: '',
  nivel: '',
  ciclo: 'basico',
  estado: 'activa',
};

const MateriaModal = ({ materiaToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState(initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [listaEstados, setListaEstados] = useState([]);
  const [listaCiclos, setListaCiclos] = useState([]);
  const [loadingEnums, setLoadingEnums] = useState(true);

  const isEditMode = Boolean(materiaToEdit);

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        setLoadingEnums(true);
        setError(null);
        const [estados, ciclos] = await Promise.all([
          // --- ¡CAMBIO AQUÍ! ---
          materiasaltasService.getEstadosMateria(),
          materiasaltasService.getCiclosMateria()
        ]);
        setListaEstados(estados);
        setListaCiclos(ciclos);
      } catch (err) {
        console.error("Error cargando ENUMs:", err);
        setError("No se pudieron cargar las opciones del formulario.");
      } finally {
        setLoadingEnums(false);
      }
    };
    fetchEnums();

    if (isEditMode) {
      setFormData({
        nombre: materiaToEdit.nombre || '',
        descripcion: materiaToEdit.descripcion || '',
        carga_horaria: materiaToEdit.carga_horaria || '',
        nivel: materiaToEdit.nivel || '',
        ciclo: materiaToEdit.ciclo || 'basico',
        estado: materiaToEdit.estado || 'activa',
      });
    } else {
      setFormData(initialState);
    }
  }, [materiaToEdit, isEditMode]);

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
        // --- ¡CAMBIO AQUÍ! ---
        await materiasaltasService.updateMateria(materiaToEdit.id_materia, formData);
      } else {
        // --- ¡CAMBIO AQUÍ! ---
        await materiasaltasService.createMateria(formData);
      }
      onSave(); 
    } catch (err) {
      setError(err.message || 'No se pudo guardar la materia.');
    } finally {
      setIsSaving(false);
    }
  };

  const capitalizar = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <h3 data-step={isEditMode ? "Editar" : "Nueva"}>
            {isEditMode ? 'Editar Materia' : 'Crear Nueva Materia'}
          </h3>
          
          <fieldset>
            <legend>Datos de la Materia</legend>
            <div className="form-group">
              <label htmlFor="nombre">Nombre Materia:</label>
              <input type="text" id="nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="nivel">Nivel/Año:</label>
              <input type="number" id="nivel" name="nivel" value={formData.nivel || ''} onChange={handleChange} required placeholder="Ej: 1, 2, 3..." />
            </div>
            <div className="form-group">
              <label htmlFor="carga_horaria">Carga Horaria (hs semanales):</label>
              <input type="number" id="carga_horaria" name="carga_horaria" value={formData.carga_horaria || ''} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="ciclo">Ciclo:</label>
              <select id="ciclo" name="ciclo" value={formData.ciclo || 'basico'} onChange={handleChange} disabled={loadingEnums}>
                {loadingEnums ? <option>Cargando...</option> :
                  listaCiclos.map(c => <option key={c} value={c}>{capitalizar(c)}</option>)
                }
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="estado">Estado:</label>
              <select id="estado" name="estado" value={formData.estado || 'activa'} onChange={handleChange} disabled={loadingEnums}>
                 {loadingEnums ? <option>Cargando...</option> :
                  listaEstados.map(e => <option key={e} value={e}>{capitalizar(e)}</option>)
                }
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="descripcion">Descripción (Opcional):</label>
              <textarea id="descripcion" name="descripcion" value={formData.descripcion || ''} onChange={handleChange} rows="3"></textarea>
            </div>
          </fieldset>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel" disabled={isSaving}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MateriaModal;