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
        backgroundColor: 'rgba(0, 20, 40, 0.7)', // Azul oscuro semitransparente
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(3px)', // Efecto de desenfoque moderno
    },
    modal: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 50, 100, 0.3)', // Sombra azulada
        width: '90%',
        maxWidth: '500px',
        overflow: 'hidden',
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
        border: '1px solid #d1e3f8',
        animation: 'modalAppear 0.3s ease-out'
    },
    header: {
        margin: 0,
        padding: '22px 28px',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', // Degradado azul
        color: '#ffffff',
        fontSize: '22px',
        fontWeight: '600',
        letterSpacing: '0.3px',
        borderBottom: '3px solid #3a6bc8',
    },
    form: {
        padding: '28px',
        backgroundColor: '#f8fbff', // Fondo azul muy claro
    },
    formGroup: {
        marginBottom: '22px',
    },
    label: {
        display: 'block',
        marginBottom: '10px',
        fontWeight: '600',
        color: '#1e3c72', // Azul oscuro
        fontSize: '15px',
        letterSpacing: '0.2px',
    },
    requiredStar: {
        color: '#ff4757',
        marginLeft: '4px',
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        border: '2px solid #c5d8f0',
        borderRadius: '8px',
        fontSize: '16px',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
        backgroundColor: '#ffffff',
        color: '#2c3e50',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
    },
    inputFocus: {
        outline: 'none',
        borderColor: '#3a6bc8',
        boxShadow: '0 0 0 3px rgba(58, 107, 200, 0.1)',
    },
    select: {
        width: '100%',
        padding: '14px 16px',
        border: '2px solid #c5d8f0',
        borderRadius: '8px',
        fontSize: '16px',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
        backgroundColor: '#ffffff',
        color: '#2c3e50',
        cursor: 'pointer',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
        appearance: 'none',
        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%231e3c72\'%3e%3cpath d=\'M7 10l5 5 5-5z\'/%3e%3c/svg%3e")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 16px center',
        backgroundSize: '20px',
    },
    footer: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '16px',
        marginTop: '32px',
        paddingTop: '22px',
        borderTop: '2px solid #e8f0fe',
    },
    btnBase: {
        padding: '14px 28px',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        border: 'none',
        transition: 'all 0.3s ease',
        letterSpacing: '0.5px',
        minWidth: '120px',
        textTransform: 'uppercase',
        fontFamily: "'Segoe UI', sans-serif",
    },
    btnCancel: {
        background: 'linear-gradient(to right, #6c757d, #5a6268)',
        color: 'white',
        boxShadow: '0 4px 6px rgba(108, 117, 125, 0.2)',
    },
    btnCancelHover: {
        background: 'linear-gradient(to right, #5a6268, #4e555b)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 8px rgba(108, 117, 125, 0.3)',
    },
    btnSave: {
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        boxShadow: '0 4px 6px rgba(30, 60, 114, 0.2)',
    },
    btnSaveHover: {
        background: 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 8px rgba(30, 60, 114, 0.3)',
    },
    error: {
        color: '#c92a2a',
        backgroundColor: '#ffe3e3',
        border: '2px solid #ffa8a8',
        padding: '14px 20px',
        borderRadius: '8px',
        marginBottom: '24px',
        textAlign: 'center',
        fontWeight: '500',
        fontSize: '15px',
        boxShadow: '0 2px 4px rgba(201, 42, 42, 0.1)',
    },
    disabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
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