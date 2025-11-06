import React from 'react'
import { useState , useEffect} from 'react';
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
            // Datos no editables (solo para mostrar si existen)
            username: '',
            email_usuario: '',
            fecha_inscripcion: ''
        });
        const [isSaving, setIsSaving] = useState(false);
        const [error, setError] = useState(null);

        useEffect(() => {
                // Llenamos el form con los datos del tutor
                if (tutorToEdit) {
                    // Formatear fecha para input type="date"
                    const formatDateForInput = (dateString) => {
                        if (!dateString) return '';
                        const date = new Date(dateString);
                        return date.toISOString().split('T')[0];
                    };
        
                    setFormData({
                        nombre: tutorToEdit.nombre || '',
                        apellido: tutorToEdit.apellido|| '',
                        dni_tutor: tutorToEdit.dni_tutor || '',
                        email: tutorToEdit.email || '',
                        telefono: tutorToEdit.telefono || '',
                        direccion: tutorToEdit.direccion || '',
                        parentesco: tutorToEdit.parentesco || '',
                        estado: tutorToEdit.estado || 'activo',
                        // Datos no editables
                        username: tutorToEdit.username || 'N/A',
                        email_usuario: tutorToEdit.email_usuario || 'N/A',
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
                    setIsSaving(true);
                    setError(null);
                    
                    try {
                        // Solo enviamos los campos editables
                        const dataToUpdate = {
                            nombre: formData.nombre,
                            apellido: formData.apellido,
                            dni_tutor: formData.dni_tutor,
                            email: formData.email,
                            telefono: formData.telefono,
                            direccion: formData.direccion,
                            parentesco: formData.parentesco,
                            estado: formData.estado
                        };
                        
                        await editarTutorPorId(tutorToEdit.id_tutor, dataToUpdate);
                        onSave(); // Callback para refrescar la lista
                    } catch (err) {
                        console.error('Error al actualizar tutor:', err);
                        setError(err.message || 'No se pudo actualizar el tutor.');
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
                    <h3 className="wizard-header">Editar Tutor</h3>

                    {/* Datos de Acceso (si tiene usuario vinculado) */}
                    {tutorToEdit?.username && (
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

                    {/* Datos Personales */}
                    <fieldset className="wizard-fieldset">
                        <legend className="wizard-legend">Datos Personales (Editables)</legend>
                        
                        <div className="form-row">
                            <div className="wizard-form-group">
                                <label htmlFor="dni_tutor" className="wizard-label">DNI: *</label>
                                <input
                                    type="text"
                                    id="dni_tutor"
                                    name="dni_tutor"
                                    value={formData.dni_tutor}
                                    onChange={handleChange}
                                    required
                                    pattern="[0-9]{7,8}"
                                    title="Ingrese un DNI válido (7-8 dígitos)"
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
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="wizard-form-group">
                                <label htmlFor="nombre" className="wizard-label">Nombre: *</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="wizard-input"
                                />
                            </div>
                            
                            <div className="wizard-form-group">
                                <label htmlFor="apellido" className="wizard-label">Apellido: *</label>
                                <input
                                    type="text"
                                    id="apellido"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    required
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
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    placeholder="381-1234567"
                                    className="wizard-input"
                                />
                            </div>

                            <div className="wizard-form-group">
                                <label htmlFor="estado" className="wizard-label">Parentesco: *</label>
                                <select
                                    id="parentesco"
                                    name="parentesco"
                                    value={formData.parentesco}
                                    onChange={handleChange}
                                    required
                                    className="wizard-select"
                                >
                                    <option value="padre">Padre</option>
                                    <option value="madre">Madre</option>
                                    <option value="tutor legal">Tutor legal</option>
                                    <option value="abuelo/a">Abuelo/a</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    {/* Información adicional (solo lectura) */}
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
  )
}

export default ModalEditTutor