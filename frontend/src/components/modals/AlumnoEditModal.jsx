import React, { useState, useEffect } from 'react';
import { editAlumno } from '../../services/alumnosService';

const AlumnoEditModal = ({ alumnoToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre_alumno: '',
    apellido_alumno: '',
    dni_alumno: '',
    email: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    lugar_nacimiento: '',
    estado: 'activo',
    username: '',
    email_usuario: '',
    fecha_inscripcion: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const requiredStar = <span style={{ color: '#dc3545' }}>*</span>;

  useEffect(() => {
    if (alumnoToEdit) {
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        nombre_alumno: alumnoToEdit.nombre_alumno || '',
        apellido_alumno: alumnoToEdit.apellido_alumno || '',
        dni_alumno: alumnoToEdit.dni_alumno || '',
        email: alumnoToEdit.email || '',
        telefono: alumnoToEdit.telefono || '',
        direccion: alumnoToEdit.direccion || '',
        fecha_nacimiento: formatDateForInput(alumnoToEdit.fecha_nacimiento),
        lugar_nacimiento: alumnoToEdit.lugar_nacimiento || '',
        estado: alumnoToEdit.estado || 'activo',
        username: alumnoToEdit.username || 'N/A',
        email_usuario: alumnoToEdit.email_usuario || 'N/A',
        fecha_inscripcion: alumnoToEdit.fecha_inscripcion || ''
      });
    }
  }, [alumnoToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.dni_alumno || !formData.nombre_alumno || !formData.apellido_alumno || !formData.fecha_nacimiento || !formData.estado) {
      setError('Complete todos los campos obligatorios (*).');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const dataToUpdate = {
        nombre_alumno: formData.nombre_alumno,
        apellido_alumno: formData.apellido_alumno,
        dni_alumno: formData.dni_alumno,
        email: formData.email || null,
        telefono: formData.telefono || null,
        direccion: formData.direccion || null,
        fecha_nacimiento: formData.fecha_nacimiento,
        lugar_nacimiento: formData.lugar_nacimiento || null,
        estado: formData.estado
      };

      await editAlumno(alumnoToEdit.id_alumno, dataToUpdate);
      onSave();
    } catch (err) {
      console.error('Error al actualizar alumno:', err);
      setError(err.message || 'No se pudo actualizar el alumno. Verifique los datos.');
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
        <h3>Editar Perfil de Alumno</h3>

        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          {alumnoToEdit?.username && (
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
                <input type="text" value={formData.username} disabled />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Email (Login):</label>
                <input type="text" value={formData.email_usuario} disabled />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="dni_alumno">DNI: {requiredStar}</label>
            <input
              type="text"
              id="dni_alumno"
              name="dni_alumno"
              value={formData.dni_alumno}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 8) {
                  handleChange({ target: { name: 'dni_alumno', value } });
                }
              }}
              maxLength={8}
              placeholder="Ej: 12345678"
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="nombre_alumno">Nombre: {requiredStar}</label>
            <input
              type="text"
              id="nombre_alumno"
              name="nombre_alumno"
              value={formData.nombre_alumno}
              onChange={handleChange}
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido_alumno">Apellido: {requiredStar}</label>
            <input
              type="text"
              id="apellido_alumno"
              name="apellido_alumno"
              value={formData.apellido_alumno}
              onChange={handleChange}
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha_nacimiento">Fecha de Nacimiento: {requiredStar}</label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="lugar_nacimiento">Lugar de Nacimiento:</label>
            <input
              type="text"
              id="lugar_nacimiento"
              name="lugar_nacimiento"
              value={formData.lugar_nacimiento}
              onChange={handleChange}
              placeholder="Ciudad, Provincia"
              disabled={isSaving}
            />
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

          <div className="form-group">
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
              <option value="egresado">Egresado</option>
              <option value="baja">Baja</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </div>

          {formData.fecha_inscripcion && (
            <div style={{
              marginTop: '30px',
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

export default AlumnoEditModal;
