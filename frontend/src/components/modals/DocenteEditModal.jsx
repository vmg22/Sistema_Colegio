import React, { useState, useEffect } from 'react';
import { updateDocenteParcial } from '../../services/docenteService'; 
import '../../styles/docentesmodal.css'; // Reutilizamos un CSS de modal

const DocenteEditModal = ({ docenteToEdit, onClose, onSave }) => {
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Llenamos el form con los datos del docente
        if (docenteToEdit) {
            setFormData({
                nombre: docenteToEdit.nombre || '',
                apellido: docenteToEdit.apellido || '',
                email: docenteToEdit.email || '', // Email de Contacto (editable)
                telefono: docenteToEdit.telefono || '',
                especialidad: docenteToEdit.especialidad || '',
                estado: docenteToEdit.estado_docente || 'activo',
                // Datos no editables (solo para mostrar)
                username: docenteToEdit.username || 'N/A',
                email_usuario: docenteToEdit.email_usuario || 'N/A',
                dni_docente: docenteToEdit.dni_docente || 'N/A',
            });
        }
    }, [docenteToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        try {
            // Solo enviamos los campos del perfil que son editables
            const dataToUpdate = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email, // Email de Contacto
                telefono: formData.telefono,
                especialidad: formData.especialidad,
                estado: formData.estado,
            };
            await updateDocenteParcial(docenteToEdit.id_docente, dataToUpdate);
            onSave();
        } catch (err) {
            setError(err.message || 'No se pudo actualizar.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h3>Editar Perfil de Docente</h3>
                    
                    <fieldset>
                        <legend>Datos de Acceso (No editables)</legend>
                        <div className="form-group">
                            <label>Username:</label>
                            <input type="text" value={formData.username} disabled />
                        </div>
                        <div className="form-group">
                            <label>Email (Login):</label>
                            <input type="text" value={formData.email_usuario} disabled />
                        </div>
                        <div className="form-group">
                            <label>DNI:</label>
                            <input type="text" value={formData.dni_docente} disabled />
                        </div>
                    </fieldset>
                    
                    <fieldset>
                        <legend>Datos Personales (Editables)</legend>
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre:</label>
                            <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="apellido">Apellido:</label>
                            <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email de Contacto (Perfil):</label>
                            <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono:</label>
                            <input type="text" id="telefono" name="telefono" value={formData.telefono || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="especialidad">Especialidad:</label>
                            <input type="text" id="especialidad" name="especialidad" value={formData.especialidad || ''} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="estado">Estado:</label>
                            <select id="estado" name="estado" value={formData.estado} onChange={handleChange}>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                                <option value="licencia">Licencia</option>
                            </select>
                        </div>
                    </fieldset>

                    {error && <p className="error-message">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel" disabled={isSaving}>Cancelar</button>
                        <button type="submit" className="btn-save" disabled={isSaving}>
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocenteEditModal;