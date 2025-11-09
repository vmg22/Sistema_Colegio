import React, { useState, useEffect } from 'react';
import { createAnioLectivo, updateAnioLectivo } from '../../services/aniosServices';

// --- OBJETOS DE ESTILO (Estilos en línea) ---
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro semitransparente
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
        width: '90%',
        maxWidth: '500px',
        overflow: 'hidden',
        fontFamily: "'Segoe UI', sans-serif",
        animation: 'fadeIn 0.3s ease-out' // Nota: Las animaciones complejas requieren CSS real, esto es un intento básico
    },
    header: {
        margin: 0,
        padding: '20px 25px',
        backgroundColor: '#f7f9fc',
        borderBottom: '1px solid #e0e0e0',
        color: '#333',
        fontSize: '20px',
        fontWeight: '600',
    },
    form: {
        padding: '25px',
    },
    formGroup: {
        marginBottom: '18px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
        color: '#555',
        fontSize: '15px',
    },
    requiredStar: {
        color: '#dc3545',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        fontSize: '16px',
        boxSizing: 'border-box', // Vital para que el padding no rompa el ancho
        transition: 'border-color 0.3s',
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '15px',
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #f0f0f0',
    },
    btnBase: {
        padding: '12px 25px',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        border: 'none',
        transition: 'opacity 0.2s',
    },
    btnCancel: {
        backgroundColor: '#6c757d',
        color: 'white',
    },
    btnSave: {
        backgroundColor: '#0d6efd',
        color: 'white',
    },
    error: {
        color: '#dc3545',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        padding: '12px 20px',
        borderRadius: '6px',
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: '500',
    }
};

// Helper para fechas
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try { return new Date(dateString).toISOString().split('T')[0]; } 
  catch (error) {
    console.error("Error formateando fecha:", dateString, error);
    return '';}
};

const initialState = {
  anio: new Date().getFullYear() + 1,
  fecha_inicio: '',
  fecha_fin: '',
  estado: 'planificacion'
};

const AnioLectivoModal = ({ show, onHide, onSave, anioAEditar }) => {
  const [formData, setFormData] = useState(initialState);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const isEditMode = Boolean(anioAEditar);

  useEffect(() => {
    if (show) {
      setError(null);
      if (isEditMode) {
        setFormData({
          anio: anioAEditar.anio,
          fecha_inicio: formatDateForInput(anioAEditar.fecha_inicio),
          fecha_fin: formatDateForInput(anioAEditar.fecha_fin),
          estado: anioAEditar.estado,
        });
      } else {
        setFormData(initialState);
      }
    }
  }, [anioAEditar, show, isEditMode]);

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
        await updateAnioLectivo(anioAEditar.id_anio_lectivo, formData);
      } else {
        await createAnioLectivo(formData);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al guardar. Intente de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div style={styles.overlay} onClick={onHide}>
      {/* 'e.stopPropagation()' evita que clicks dentro del modal lo cierren */}
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <h3 style={styles.header}>
            {isEditMode ? 'Editar Año Lectivo' : 'Crear Nuevo Año Lectivo'}
        </h3>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="anio">
                Año <span style={styles.requiredStar}>*</span>
            </label>
            <input
              type="number"
              id="anio"
              name="anio"
              value={formData.anio}
              onChange={handleChange}
              placeholder="Ej: 2026"
              min="2020" max="2040" required
              disabled={isSaving}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="fecha_inicio">
                Fecha de Inicio <span style={styles.requiredStar}>*</span>
            </label>
            <input
              type="date"
              id="fecha_inicio"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              required
              disabled={isSaving}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="fecha_fin">
                Fecha de Fin <span style={styles.requiredStar}>*</span>
            </label>
            <input
              type="date"
              id="fecha_fin"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              required
              disabled={isSaving}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="estado">
                Estado <span style={styles.requiredStar}>*</span>
            </label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              disabled={isSaving}
              style={styles.input} // Reutilizamos el estilo de input para el select
            >
              <option value="planificacion">Planificación</option>
              <option value="activo">Activo</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </div>

          <div style={styles.footer}>
            <button 
              type="button" 
              onClick={onHide} 
              disabled={isSaving}
              // Combinamos estilos base con estilos específicos del botón
              style={{...styles.btnBase, ...styles.btnCancel, opacity: isSaving ? 0.6 : 1}}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              style={{...styles.btnBase, ...styles.btnSave, opacity: isSaving ? 0.6 : 1}}
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AnioLectivoModal;