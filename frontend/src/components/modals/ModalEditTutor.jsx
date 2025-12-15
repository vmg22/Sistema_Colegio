import React, { useState, useEffect } from 'react';
import { editarTutorPorId } from '../../services/tutoresService';

const ModalEditTutor = ({ tutorToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni_tutor: '',
    email: '',
    telefono: '',
    direccion: '',
    parentesco: '',
    estado: 'activo',
    username: '',
    email_usuario: '',
    fecha_inscripcion: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const requiredStar = <span style={{ color: '#dc3545' }}>*</span>;

  useEffect(() => {
    if (tutorToEdit) {
      setFormData({
        nombre: tutorToEdit.nombre || '',
        apellido: tutorToEdit.apellido || '',
        dni_tutor: tutorToEdit.dni_tutor || '',
        email: tutorToEdit.email || '',
        telefono: tutorToEdit.telefono || '',
        direccion: tutorToEdit.direccion || '',
        parentesco: tutorToEdit.parentesco || '',
        estado: tutorToEdit.estado || 'activo',
        username: tutorToEdit.username || '',
        email_usuario: tutorToEdit.email_usuario || '',
        fecha_inscripcion: tutorToEdit.fecha_inscripcion || ''
      });
    }
  }, [tutorToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tutorToEdit?.id_tutor) {
      setError('Error: No se puede identificar al tutor.');
      return;
    }

    if (!formData.dni_tutor || !formData.nombre || !formData.apellido || !formData.parentesco || !formData.estado) {
      setError('Complete todos los campos obligatorios (*).');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const dataToUpdate = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        dni_tutor: formData.dni_tutor,
        email: formData.email || null,
        telefono: formData.telefono || null,
        direccion: formData.direccion || null,
        parentesco: formData.parentesco,
        estado: formData.estado
      };

      await editarTutorPorId(tutorToEdit.id_tutor, dataToUpdate);
      onSave();
    } catch (err) {
      console.error('Error al actualizar tutor:', err);
      setError(err.message || 'No se pudo actualizar el tutor. Verifique los datos.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Editar Tutor</h3>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          {tutorToEdit?.username && (
            <div style={{
              marginBottom: '22px',
              padding: '16px',
              border: '1px solid #c5d8f0',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <h4 style={{
                margin: '0 0 15px 0',
                fontSize: '16px',
                color: '#1e3c72',
                fontWeight: '600'
              }}>
                Datos de Acceso (No editables)
              </h4>

              <div className="form-group">
                <label>Username:</label>
                <input type="text" value={formData.username || 'N/A'} disabled />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Email (Login):</label>
                <input type="text" value={formData.email_usuario || 'N/A'} disabled />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="dni_tutor">DNI: {requiredStar}</label>
            <input
              type="text"
              id="dni_tutor"
              name="dni_tutor"
              value={formData.dni_tutor}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 8) {
                  handleChange({ target: { name: 'dni_tutor', value } });
                }
              }}
              maxLength={8}
              placeholder="Ej: 12345678"
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="nombre">Nombre: {requiredStar}</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido: {requiredStar}</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="parentesco">Parentesco: {requiredStar}</label>
            <select
              id="parentesco"
              name="parentesco"
              value={formData.parentesco}
              onChange={handleChange}
              required
              disabled={isSaving}
            >
              <option value="">Seleccione...</option>
              <option value="padre">Padre</option>
              <option value="madre">Madre</option>
              <option value="tutor legal">Tutor legal</option>
              <option value="abuelo/a">Abuelo/a</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="direccion">Domicilio:</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              placeholder="Calle y número"
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email de Contacto:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@email.com"
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                  handleChange({ target: { name: 'telefono', value } });
                }
              }}
              maxLength={10}
              placeholder="Ej: 3814123456"
              disabled={isSaving}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '22px' }}>
            <label htmlFor="estado">Estado: {requiredStar}</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
              disabled={isSaving}
              style={{ maxWidth: '250px' }}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          {formData.fecha_inscripcion && (
            <div style={{
              marginBottom: '22px',
              padding: '16px',
              border: '1px solid #c5d8f0',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <h4 style={{
                margin: '0 0 15px 0',
                fontSize: '16px',
                color: '#1e3c72',
                fontWeight: '600'
              }}>
                Información Adicional (No editable)
              </h4>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Fecha de Inscripción:</label>
                <input
                  type="text"
                  value={formatDateForDisplay(formData.fecha_inscripcion)}
                  disabled
                />
              </div>
            </div>
          )}

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
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditTutor;
