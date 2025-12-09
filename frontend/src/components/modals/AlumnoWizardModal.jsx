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
      if (formData.alumno.dni_alumno.length < 7 || formData.alumno.dni_alumno.length > 8) {
        setError('El DNI debe tener 7 u 8 dígitos');
        return;
      }
    }
    if (step === 2) {
      // Validar datos del tutor
      if (!formData.tutor.dni_tutor || !formData.tutor.nombre || !formData.tutor.apellido || !formData.tutor.telefono) {
        setError('Complete los campos obligatorios del tutor');
        return;
      }
      if (formData.tutor.dni_tutor.length < 7 || formData.tutor.dni_tutor.length > 8) {
        setError('El DNI del tutor debe tener 7 u 8 dígitos');
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
            <h3 className='text-center'>Agregar Nuevo Alumno - Paso {step} de 3</h3>
          </div>

          {/* PASO 1: DATOS DEL ALUMNO */}
          {step === 1 && (
            <fieldset className="wizard-fieldset">
              <legend className="wizard-legend text-center">Datos del Alumno</legend>
              
              <div className="form-row">
                <div className="wizard-form-group">
                  <label className="wizard-label">DNI: *</label>
                  <input
                    type="text"
                    className="wizard-input"
                    value={formData.alumno.dni_alumno}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 8) {
                        handleChange('alumno', 'dni_alumno', value);
                      }
                    }}
                    maxLength={8}
                    placeholder="Ej: 12345678"
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
                    placeholder="ejemplo@email.com"
                  />
                </div>
                <div className="wizard-form-group">
                  <label className="wizard-label">Teléfono:</label>
                  <input
                    type="text"
                    className="wizard-input"
                    value={formData.alumno.telefono}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        handleChange('alumno', 'telefono', value);
                      }
                    }}
                    maxLength={10}
                    placeholder="Ej: 3814123456"
                  />
                </div>
              </div>
            </fieldset>
          )}

          {/* PASO 2: DATOS DEL TUTOR */}
          {step === 2 && (
            <fieldset className="wizard-fieldset">
              <legend className="wizard-legend text-center">Datos del Tutor</legend>
              
              <div className="form-row">
                <div className="wizard-form-group">
                  <label className="wizard-label">DNI: *</label>
                  <input
                    type="text"
                    className="wizard-input"
                    value={formData.tutor.dni_tutor}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 8) {
                        handleChange('tutor', 'dni_tutor', value);
                      }
                    }}
                    maxLength={8}
                    placeholder="Ej: 12345678"
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
                    placeholder="ejemplo@email.com"
                  />
                </div>
                <div className="wizard-form-group">
                  <label className="wizard-label">Teléfono: *</label>
                  <input
                    type="text"
                    className="wizard-input"
                    value={formData.tutor.telefono}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        handleChange('tutor', 'telefono', value);
                      }
                    }}
                    maxLength={10}
                    placeholder="Ej: 3814123456"
                    required
                  />
                </div>
              </div>
            </fieldset>
          )}

          {/* PASO 3: CREAR USUARIO (OPCIONAL) */}
          {step === 3 && (
            <fieldset className="wizard-fieldset">
              <legend className="wizard-legend text-center">Crear Usuario para el Tutor (Opcional)</legend>
              
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
                    <label className="wizard-label">Contraseña:</label>
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
                className="wizard-btn wizard-btn-save"
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