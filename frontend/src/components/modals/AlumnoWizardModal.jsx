// AlumnoWizardModal.jsx
import React, { useState } from 'react';
import { createAlumnoConTutor } from '../../services/alumnosService';
import '../../styles/alumnosModalEdit.css';

const AlumnoWizardModal = ({ onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    alumno: {
      dni_alumno: '',
      nombre_alumno: '',
      apellido_alumno: '',
      fecha_nacimiento: '',
      lugar_nacimiento: '',
      direccion: '',
      telefono: '',
      email: '',
      fecha_inscripcion: new Date().toISOString().split('T')[0]
    },
    tutor: {
      dni_tutor: '',
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
      parentesco: 'padre',
      crear_usuario: false,
      username: '',
      email_usuario: '',
      password: ''
    }
  });

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      // Validar datos del alumno
      if (!formData.alumno.dni_alumno || !formData.alumno.nombre_alumno || !formData.alumno.apellido_alumno) {
        setError('Complete los campos obligatorios del alumno');
        return;
      }
    }
    setError(null);
    setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar datos del tutor
    if (!formData.tutor.dni_tutor || !formData.tutor.nombre || !formData.tutor.apellido) {
      setError('Complete los campos obligatorios del tutor');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await createAlumnoConTutor(formData);
      onSave();
    } catch (err) {
      console.error('Error al crear alumno:', err);
      setError(err.response?.data?.mensaje || 'No se pudo crear el alumno');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="wizard-overlay" onClick={onClose}>
      <div className="wizard-content large" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="wizard-form">
          <div className="wizard-header">
            <h3>Agregar Nuevo Alumno</h3>
            <div className="wizard-steps">
              <span className={step === 1 ? 'active' : step > 1 ? 'completed' : ''}>
                1. Datos del Alumno
              </span>
              <span className={step === 2 ? 'active' : step > 2 ? 'completed' : ''}>
                2. Datos del Tutor
              </span>
              <span className={step === 3 ? 'active' : ''}>
                3. Crear Usuario (Opcional)
              </span>
            </div>
          </div>

          {/* PASO 1: DATOS DEL ALUMNO */}
          {step === 1 && (
            <fieldset className="wizard-fieldset">
              <legend className="wizard-legend">Datos del Alumno *</legend>
              
              <div className="form-row">
                <div className="wizard-form-group">
                  <label className="wizard-label">DNI: *</label>
                  <input
                    type="text"
                    className="wizard-input"
                    value={formData.alumno.dni_alumno}
                    onChange={(e) => handleChange('alumno', 'dni_alumno', e.target.value)}
                    pattern="[0-9]{7,8}"
                    required
                  />
                </div>
                <div className="wizard-form-group">
                  <label className="wizard-label">Fecha de Nacimiento: *</label>
                  <input
                    type="date"
                    className="wizard-input"
                    value={formData.alumno.fecha_nacimiento}
                    onChange={(e) => handleChange('alumno', 'fecha_nacimiento', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="wizard-form-group">
                  <label className="wizard-label">Nombre: *</label>
                  <input
                    type="text"
                    className="wizard-input"
                    value={formData.alumno.nombre_alumno}
                    onChange={(e) => handleChange('alumno', 'nombre_alumno', e.target.value)}
                    required
                  />
                </div>
                <div className="wizard-form-group">
                  <label className="wizard-label">Apellido: *</label>
                  <input
                    type="text"
                    className="wizard-input"
                    value={formData.alumno.apellido_alumno}
                    onChange={(e) => handleChange('alumno', 'apellido_alumno', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="wizard-form-group">
                <label className="wizard-label">Lugar de Nacimiento:</label>
                <input
                  type="text"
                  className="wizard-input"
                  value={formData.alumno.lugar_nacimiento}
                  onChange={(e) => handleChange('alumno', 'lugar_nacimiento', e.target.value)}
                  placeholder="Ciudad, Provincia"
                />
              </div>

              <div className="wizard-form-group">
                <label className="wizard-label">Domicilio:</label>
                <input
                  type="text"
                  className="wizard-input"
                  value={formData.alumno.direccion}
                  onChange={(e) => handleChange('alumno', 'direccion', e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="wizard-form-group">
                  <label className="wizard-label">Email:</label>
                  <input
                    type="email"
                    className="wizard-input"
                    value={formData.alumno.email}
                    onChange={(e) => handleChange('alumno', 'email', e.target.value)}
                  />
                </div>
                <div className="wizard-form-group">
                  <label className="wizard-label">Teléfono:</label>
                  <input
                    type="tel"
                    className="wizard-input"
                    value={formData.alumno.telefono}
                    onChange={(e) => handleChange('alumno', 'telefono', e.target.value)}
                  />
                </div>
              </div>
            </fieldset>
          )}

          {/* PASO 2: DATOS DEL TUTOR */}
          {step === 2 && (
            <fieldset className="wizard-fieldset">
              <legend className="wizard-legend">Datos del Tutor *</legend>
              
              <div className="form-row">
                <div className="wizard-form-group">
                  <label className="wizard-label">DNI: *</label>
                  <input
                    type="text"
                    className="wizard-input"
                    value={formData.tutor.dni_tutor}
                    onChange={(e) => handleChange('tutor', 'dni_tutor', e.target.value)}
                    pattern="[0-9]{7,8}"
                    required
                  />
                </div>
                <div className="wizard-form-group">
                  <label className="wizard-label">Parentesco: *</label>
                  <select
                    className="wizard-select"
                    value={formData.tutor.parentesco}
                    onChange={(e) => handleChange('tutor', 'parentesco', e.target.value)}
                    required
                  >
                    <option value="padre">Padre</option>
                    <option value="madre">Madre</option>
                    <option value="tutor_legal">Tutor Legal</option>
                    <option value="abuelo/a">Abuelo/a</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="wizard-form-group">
                  <label className="wizard-label">Nombre: *</label>
                  <input
                    type="text"
                    className="wizard-input"
                    value={formData.tutor.nombre}
                    onChange={(e) => handleChange('tutor', 'nombre', e.target.value)}
                    required
                  />
                </div>
                <div className="wizard-form-group">
                  <label className="wizard-label">Apellido: *</label>
                  <input
                    type="text"
                    className="wizard-input"
                    value={formData.tutor.apellido}
                    onChange={(e) => handleChange('tutor', 'apellido', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="wizard-form-group">
                <label className="wizard-label">Domicilio:</label>
                <input
                  type="text"
                  className="wizard-input"
                  value={formData.tutor.direccion}
                  onChange={(e) => handleChange('tutor', 'direccion', e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="wizard-form-group">
                  <label className="wizard-label">Email de Contacto:</label>
                  <input
                    type="email"
                    className="wizard-input"
                    value={formData.tutor.email}
                    onChange={(e) => handleChange('tutor', 'email', e.target.value)}
                  />
                </div>
                <div className="wizard-form-group">
                  <label className="wizard-label">Teléfono: *</label>
                  <input
                    type="tel"
                    className="wizard-input"
                    value={formData.tutor.telefono}
                    onChange={(e) => handleChange('tutor', 'telefono', e.target.value)}
                    required
                  />
                </div>
              </div>
            </fieldset>
          )}

          {/* PASO 3: CREAR USUARIO (OPCIONAL) */}
          {step === 3 && (
            <fieldset className="wizard-fieldset">
              <legend className="wizard-legend">Crear Usuario para el Tutor (Opcional)</legend>
              
              <div className="wizard-form-group">
                <label className="wizard-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.tutor.crear_usuario}
                    onChange={(e) => handleChange('tutor', 'crear_usuario', e.target.checked)}
                  />
                  <span>¿Crear cuenta de acceso para el tutor?</span>
                </label>
              </div>

              {formData.tutor.crear_usuario && (
                <>
                  <div className="wizard-form-group">
                    <label className="wizard-label">Username: *</label>
                    <input
                      type="text"
                      className="wizard-input"
                      value={formData.tutor.username}
                      onChange={(e) => handleChange('tutor', 'username', e.target.value)}
                      required={formData.tutor.crear_usuario}
                    />
                  </div>

                  <div className="wizard-form-group">
                    <label className="wizard-label">Email (Login): *</label>
                    <input
                      type="email"
                      className="wizard-input"
                      value={formData.tutor.email_usuario}
                      onChange={(e) => handleChange('tutor', 'email_usuario', e.target.value)}
                      required={formData.tutor.crear_usuario}
                    />
                  </div>

                  <div className="wizard-form-group">
                    <label className="wizard-label">Contraseña: *</label>
                    <input
                      type="password"
                      className="wizard-input"
                      value={formData.tutor.password}
                      onChange={(e) => handleChange('tutor', 'password', e.target.value)}
                      placeholder="Dejar vacío para usar contraseña por defecto (123456)"
                    />
                  </div>
                </>
              )}
            </fieldset>
          )}

          {error && <p className="wizard-error">{error}</p>}

          {/* BOTONES DE NAVEGACIÓN */}
          <div className="wizard-actions">
            <button
              type="button"
              onClick={step === 1 ? onClose : handleBack}
              className="wizard-btn wizard-btn-cancel"
              disabled={isSaving}
            >
              {step === 1 ? 'Cancelar' : 'Anterior'}
            </button>
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="wizard-btn wizard-btn-next"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                className="wizard-btn wizard-btn-save"
                disabled={isSaving}
              >
                {isSaving ? 'Guardando...' : 'Crear Alumno'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlumnoWizardModal;