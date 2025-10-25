import React, { useState, useEffect } from 'react';
// 1. Importamos los servicios que necesitamos
import { createDocente, updateDocente } from '../../services/docenteService';
import '../../styles/docentesmodal.css';

// 2. Estado inicial con los campos de TU backend
const initialState = {
    nombre: '',
    apellido: '',
    dni_docente: '',
    email: '',
    telefono: '',
    especialidad: '',
    estado: 'activo' // Tu service pone 'activo' por defecto
     // Campo de tu tabla
};

const DocenteModal = ({ docenteToEdit, onClose, onSave }) => {

    const [formData, setFormData] = useState(initialState);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = Boolean(docenteToEdit);

    useEffect(() => {
        if (isEditMode) {
            // 3. Llenamos el form con los datos del docente a editar
            setFormData({
                nombre: docenteToEdit.nombre || '',
                apellido: docenteToEdit.apellido || '',
                dni_docente: docenteToEdit.dni_docente || '',
                email: docenteToEdit.email || '',
                telefono: docenteToEdit.telefono || '',
                especialidad: docenteToEdit.especialidad || '',
                estado: docenteToEdit.estado || 'activo',
                
            });
        } else {
            setFormData(initialState); 
        }
    }, [docenteToEdit, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            // Manejar 'id_usuario' como número si no es un string vacío
            [name]: name === 'id_usuario' ? (value === '' ? null : Number(value)) : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación simple del DNI (tu controller también valida)
        if (!formData.dni_docente || !formData.nombre || !formData.apellido) {
            setError('DNI, Nombre y Apellido son obligatorios.');
            return;
        }
        
        setIsSaving(true);
        setError(null);

        try {
            if (isEditMode) {
                // 4. Usamos 'updateDocente' (PUT) y pasamos el 'id_docente'
                await updateDocente(docenteToEdit.id_docente, formData);
            } else {
                // 5. Usamos 'createDocente' (POST)
                await createDocente(formData);
            }
            onSave(); 
        } catch (err) {
            console.error("Error al guardar docente:", err);
            // 'err' viene del interceptor de Axios (o del service)
            // y ya debería tener el mensaje de error de tu API (ej: "El DNI ya está registrado")
            setError(err.message || 'No se pudo guardar.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>{isEditMode ? 'Editar Docente' : 'Agregar Nuevo Docente'}</h3>
                
                <form onSubmit={handleSubmit}>
                    {/* 6. Inputs ajustados a los campos del backend */}
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="apellido">Apellido:</label>
                        <input type="text" id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="dni_docente">DNI:</label>
                        <input type="text" id="dni_docente" name="dni_docente" value={formData.dni_docente} onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
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

                    {error && <p className="error-message">{error}</p>}

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-cancel" disabled={isSaving}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-save" disabled={isSaving}>
                            {isSaving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocenteModal;