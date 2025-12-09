import React, { useState, useEffect } from 'react';
import { editAlumno } from '../../services/alumnosService';
import '../../styles/alumnosModalEdit.css';

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
        setIsSaving(true);
        setError(null);
        
        try {
            const dataToUpdate = {
                nombre_alumno: formData.nombre_alumno,
                apellido_alumno: formData.apellido_alumno,
                dni_alumno: formData.dni_alumno,
                email: formData.email,
                telefono: formData.telefono,
                direccion: formData.direccion,
                fecha_nacimiento: formData.fecha_nacimiento,
                lugar_nacimiento: formData.lugar_nacimiento,
                estado: formData.estado
            };
            
            await editAlumno(alumnoToEdit.id_alumno, dataToUpdate);
            onSave();
        } catch (err) {
            console.error('Error al actualizar alumno:', err);
            setError(err.message || 'No se pudo actualizar el alumno.');
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
        <div className="wizard-overlay" onClick={onClose}>
            <div className="wizard-content" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="wizard-form">
                    <h3 className="wizard-header">Editar Perfil de Alumno</h3>

                    {alumnoToEdit?.username && (
                        <fieldset className="wizard-fieldset">
                            <legend className="wizard-legend">Datos de Acceso (No editables)</legend>
                            <div className="wizard-form-group">
                                <label className="wizard-label">Username:</label>
                                <input type="text" value={formData.username} disabled className="wizard-input" />
                            </div>
                            <div className="wizard-form-group">
                                <label className="wizard-label">Email (Login):</label>
                                <input type="text" value={formData.email_usuario} disabled className="wizard-input" />
                            </div>
                        </fieldset>
                    )}

                    <fieldset className="wizard-fieldset">
                        <legend className="wizard-legend">Datos Personales (Editables)</legend>
                        
                        <div className="form-row">
                            <div className="wizard-form-group">
                                <label htmlFor="dni_alumno" className="wizard-label">DNI: *</label>
                                <input
                                    type="text"
                                    id="dni_alumno"
                                    name="dni_alumno"
                                    value={formData.dni_alumno}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 8) {
                                            handleChange({ target: { name: 'dni_alumno', value: value } });
                                        }
                                    }}
                                    maxLength={8}
                                    placeholder="Ej: 12345678"
                                    required
                                    className="wizard-input"
                                />
                            </div>
                            
                            <div className="wizard-form-group">
                                <label htmlFor="estado" className="wizard-label">Estado: *</label>
                                <select
                                    id="estado"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    required
                                    className="wizard-select"
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                    <option value="egresado">Egresado</option>
                                    <option value="baja">Baja</option>
                                    <option value="suspendido">Suspendido</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="wizard-form-group">
                                <label htmlFor="nombre_alumno" className="wizard-label">Nombre: *</label>
                                <input
                                    type="text"
                                    id="nombre_alumno"
                                    name="nombre_alumno"
                                    value={formData.nombre_alumno}
                                    onChange={handleChange}
                                    required
                                    className="wizard-input"
                                />
                            </div>
                            
                            <div className="wizard-form-group">
                                <label htmlFor="apellido_alumno" className="wizard-label">Apellido: *</label>
                                <input
                                    type="text"
                                    id="apellido_alumno"
                                    name="apellido_alumno"
                                    value={formData.apellido_alumno}
                                    onChange={handleChange}
                                    required
                                    className="wizard-input"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="wizard-form-group">
                                <label htmlFor="fecha_nacimiento" className="wizard-label">Fecha de Nacimiento: *</label>
                                <input
                                    type="date"
                                    id="fecha_nacimiento"
                                    name="fecha_nacimiento"
                                    value={formData.fecha_nacimiento}
                                    onChange={handleChange}
                                    required
                                    className="wizard-input"
                                />
                            </div>
                            
                            <div className="wizard-form-group">
                                <label htmlFor="lugar_nacimiento" className="wizard-label">Lugar de Nacimiento:</label>
                                <input
                                    type="text"
                                    id="lugar_nacimiento"
                                    name="lugar_nacimiento"
                                    value={formData.lugar_nacimiento}
                                    onChange={handleChange}
                                    placeholder="Ciudad, Provincia"
                                    className="wizard-input"
                                />
                            </div>
                        </div>

                        <div className="wizard-form-group">
                            <label htmlFor="direccion" className="wizard-label">Domicilio:</label>
                            <input
                                type="text"
                                id="direccion"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                placeholder="Calle y número"
                                className="wizard-input"
                            />
                        </div>

                        <div className="form-row">
                            <div className="wizard-form-group">
                                <label htmlFor="email" className="wizard-label">Email de Contacto:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="ejemplo@email.com"
                                    className="wizard-input"
                                />
                            </div>
                            
                            <div className="wizard-form-group">
                                <label htmlFor="telefono" className="wizard-label">Teléfono:</label>
                                <input
                                    type="text"
                                    id="telefono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 10) {
                                            handleChange({ target: { name: 'telefono', value: value } });
                                        }
                                    }}
                                    maxLength={10}
                                    placeholder="Ej: 3814123456"
                                    className="wizard-input"
                                />
                            </div>
                        </div>
                    </fieldset>

                    {formData.fecha_inscripcion && (
                        <fieldset className="wizard-fieldset">
                            <legend className="wizard-legend">Información Adicional</legend>
                            <div className="wizard-form-group">
                                <label className="wizard-label">Fecha de Inscripción:</label>
                                <input 
                                    type="text" 
                                    value={formatDateForDisplay(formData.fecha_inscripcion)} 
                                    disabled 
                                    className="wizard-input"
                                />
                            </div>
                        </fieldset>
                    )}

                    {error && <p className="wizard-error">{error}</p>}

                    <div className="wizard-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="wizard-btn wizard-btn-cancel"
                            disabled={isSaving}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="wizard-btn wizard-btn-save" disabled={isSaving}>
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AlumnoEditModal;