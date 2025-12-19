// AlumnoWizardModal.jsx
import React, { useState } from 'react';
import { createAlumnoConTutor } from '../../services/alumnosService';
import '../../styles/docentesmodal.css';

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
      if (!formData.alumno.dni_alumno || !formData.alumno.nombre_alumno || !formData.alumno.apellido_alumno || !formData.alumno.fecha_nacimiento) {
        setError('Complete los campos obligatorios del alumno (marcados con *)');
        return;
      }
      if (formData.alumno.dni_alumno.length < 7 || formData.alumno.dni_alumno.length > 8) {
        setError('El DNI debe tener 7 u 8 dígitos');
        return;
      }
    }

    if (step === 2) {
      if (!formData.tutor.dni_tutor || !formData.tutor.nombre || !formData.tutor.apellido || !formData.tutor.telefono || !formData.tutor.parentesco) {
        setError('Complete los campos obligatorios del tutor (marcados con *)');
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

    if (formData.tutor.crear_usuario && (!formData.tutor.username || !formData.tutor.email_usuario)) {
      setError('Si desea crear cuenta, debe ingresar Username y Email de Login.');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await createAlumnoConTutor(formData);
      onSave();
    } catch (err) {
      console.error('Error al crear alumno:', err);
      setError(err.response?.data?.mensaje || 'No se pudo crear el alumno. Verifique los datos.');
    } finally {
      setIsSaving(false);
    }
  };

  const requiredStar = <span style={{ color: '#dc3545' }}>*</span>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Agregar Nuevo Alumno - Paso {step} de 2</h3>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          {step === 1 && (
            <>
              <div className="form-group">
                <label htmlFor="dni_alumno">DNI: {requiredStar}</label>
                <input
                  type="text"
                  id="dni_alumno"
                  value={formData.alumno.dni_alumno}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 8) handleChange('alumno', 'dni_alumno', value);
                  }}
                  maxLength={8}
                  placeholder="Ej: 12345678"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nombre_alumno">Nombre: {requiredStar}</label>
                <input
                  type="text"
                  id="nombre_alumno"
                  value={formData.alumno.nombre_alumno}
                  onChange={(e) => handleChange('alumno', 'nombre_alumno', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="apellido_alumno">Apellido: {requiredStar}</label>
                <input
                  type="text"
                  id="apellido_alumno"
                  value={formData.alumno.apellido_alumno}
                  onChange={(e) => handleChange('alumno', 'apellido_alumno', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="fecha_nacimiento">Fecha de Nacimiento: {requiredStar}</label>
                <input
                  type="date"
                  id="fecha_nacimiento"
                  value={formData.alumno.fecha_nacimiento}
                  onChange={(e) => handleChange('alumno', 'fecha_nacimiento', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lugar_nacimiento">Lugar de Nacimiento:</label>
                <input
                  type="text"
                  id="lugar_nacimiento"
                  value={formData.alumno.lugar_nacimiento}
                  onChange={(e) => handleChange('alumno', 'lugar_nacimiento', e.target.value)}
                  placeholder="Ciudad, Provincia"
                />
              </div>

              <div className="form-group">
                <label htmlFor="direccion_alumno">Domicilio:</label>
                <input
                  type="text"
                  id="direccion_alumno"
                  value={formData.alumno.direccion}
                  onChange={(e) => handleChange('alumno', 'direccion', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email_alumno">Email:</label>
                <input
                  type="email"
                  id="email_alumno"
                  value={formData.alumno.email}
                  onChange={(e) => handleChange('alumno', 'email', e.target.value)}
                  placeholder="ejemplo@email.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono_alumno">Teléfono:</label>
                <input
                  type="text"
                  id="telefono_alumno"
                  value={formData.alumno.telefono}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) handleChange('alumno', 'telefono', value);
                  }}
                  maxLength={10}
                  placeholder="Ej: 3814123456"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-group">
                <label htmlFor="dni_tutor">DNI del Tutor: {requiredStar}</label>
                <input
                  type="text"
                  id="dni_tutor"
                  value={formData.tutor.dni_tutor}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 8) handleChange('tutor', 'dni_tutor', value);
                  }}
                  maxLength={8}
                  placeholder="Ej: 12345678"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nombre_tutor">Nombre del Tutor: {requiredStar}</label>
                <input
                  type="text"
                  id="nombre_tutor"
                  value={formData.tutor.nombre}
                  onChange={(e) => handleChange('tutor', 'nombre', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="apellido_tutor">Apellido del Tutor: {requiredStar}</label>
                <input
                  type="text"
                  id="apellido_tutor"
                  value={formData.tutor.apellido}
                  onChange={(e) => handleChange('tutor', 'apellido', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="parentesco">Parentesco: {requiredStar}</label>
                <select
                  id="parentesco"
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

              <div className="form-group">
                <label htmlFor="telefono_tutor">Teléfono: {requiredStar}</label>
                <input
                  type="text"
                  id="telefono_tutor"
                  value={formData.tutor.telefono}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) handleChange('tutor', 'telefono', value);
                  }}
                  maxLength={10}
                  placeholder="Ej: 3814123456"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="direccion_tutor">Domicilio:</label>
                <input
                  type="text"
                  id="direccion_tutor"
                  value={formData.tutor.direccion}
                  onChange={(e) => handleChange('tutor', 'direccion', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email_tutor">Email de Contacto:</label>
                <input
                  type="email"
                  id="email_tutor"
                  value={formData.tutor.email}
                  onChange={(e) => handleChange('tutor', 'email', e.target.value)}
                  placeholder="ejemplo@email.com"
                />
              </div>
            </>
          )}

          {/* {step === 3 && (
            <>
              <p>Opcional: Si desea que el tutor pueda acceder al sistema, active esta opción y complete los datos de usuario.</p>

              <div className="form-group" style={{ marginBottom: '25px' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontWeight: 400, color: '#333' }}>
                  <input
                    type="checkbox"
                    checked={formData.tutor.crear_usuario}
                    onChange={(e) => handleChange('tutor', 'crear_usuario', e.target.checked)}
                    style={{ width: 'auto', marginRight: '10px' }}
                  />
                  <span>¿Crear cuenta de acceso para el tutor?</span>
                </label>
              </div>

              {formData.tutor.crear_usuario && (
                <>
                  <div className="form-group">
                    <label htmlFor="username">Username: {requiredStar}</label>
                    <input
                      type="text"
                      id="username"
                      value={formData.tutor.username}
                      onChange={(e) => handleChange('tutor', 'username', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email_usuario">Email (Login): {requiredStar}</label>
                    <input
                      type="email"
                      id="email_usuario"
                      value={formData.tutor.email_usuario}
                      onChange={(e) => handleChange('tutor', 'email_usuario', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password_tutor">Contraseña:</label>
                    <input
                      type="password"
                      id="password_tutor"
                      value={formData.tutor.password}
                      onChange={(e) => handleChange('tutor', 'password', e.target.value)}
                      placeholder="Dejar vacío para usar contraseña por defecto (123456)"
                    />
                  </div>
                </>
              )}
            </>
          )} */}

          <div className="modal-actions">
            <button
              type="button"
              onClick={step === 1 ? onClose : handleBack}
              className="btn-cancel"
              disabled={isSaving}
            >
              {step === 1 ? 'Cancelar' : 'Atrás'}
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn-save"
                disabled={isSaving}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                className="btn-save"
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
