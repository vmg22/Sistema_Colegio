import React, { useState } from 'react';
// Importamos los NUEVOS servicios
import { createDocentePerfil, createUsuarioParaDocente } from '../../services/docenteService'; 
import '../../styles/docentesmodal.css'; // Reutilizamos el mismo CSS del modal anterior

// Datos iniciales para ambos pasos
const initialPerfilState = {
    dni_docente: '',
    nombre: '',
    apellido: '',
    email: '', // Email de contacto (opcional)
    telefono: '',
    especialidad: '',
    estado: 'activo',
};
const initialUsuarioState = {
    username: '',
    email: '', // Email de login (obligatorio)
    password: '',
};

const DocenteWizardModal = ({ onClose, onSave }) => {
    const [step, setStep] = useState(1); // Controla el paso (1 o 2)
    const [perfilData, setPerfilData] = useState(initialPerfilState);
    const [usuarioData, setUsuarioData] = useState(initialUsuarioState);
    
    // Almacena el docente creado en el paso 1
    const [createdDocente, setCreatedDocente] = useState(null); 

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

    // Manejador genérico para los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (step === 1) {
            setPerfilData(prev => ({ ...prev, [name]: value }));
        } else {
            setUsuarioData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Al presionar "Siguiente" (Paso 1)
    const handleStep1Submit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        try {
            // Llama al nuevo servicio para crear SOLO el perfil
            const docente = await createDocentePerfil(perfilData);
            setCreatedDocente(docente); // Guardamos el docente creado
            setStep(2); // Avanzamos al siguiente paso
        } catch (err) {
            setError(err.message || 'No se pudo guardar el perfil.');
        } finally {
            setIsSaving(false);
        }
    };

    // Al presionar "Guardar" (Paso 2)
    const handleStep2Submit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        try {
            // Llama al nuevo servicio para crear y vincular el usuario
            await createUsuarioParaDocente(createdDocente.id_docente, usuarioData);
            onSave(); // Llama a 'handleSaveSuccess' del padre
        } catch (err) {
            setError(err.message || 'No se pudo crear el usuario.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        setStep(1);
        setError(null);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                {/* --- PASO 1: PERFIL DEL DOCENTE --- */}
                {step === 1 && (
                    <form onSubmit={handleStep1Submit}>
                        <h3>Alta de Docente (Paso 1 de 2: Perfil)</h3>
                        <fieldset>
                            <legend>Datos Personales (Perfil)</legend>
                            <div className="form-group">
                                <label htmlFor="dni_docente">DNI:</label>
                                <input type="text" id="dni_docente" name="dni_docente" value={perfilData.dni_docente} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre:</label>
                                <input type="text" id="nombre" name="nombre" value={perfilData.nombre} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apellido">Apellido:</label>
                                <input type="text" id="apellido" name="apellido" value={perfilData.apellido} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email de Contacto (Opcional):</label>
                                <input type="email" id="email" name="email" value={perfilData.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="telefono">Teléfono (Opcional):</label>
                                <input type="text" id="telefono" name="telefono" value={perfilData.telefono} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="especialidad">Especialidad (Opcional):</label>
                                <input type="text" id="especialidad" name="especialidad" value={perfilData.especialidad} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="estado">Estado:</label>
                                <select id="estado" name="estado" value={perfilData.estado} onChange={handleChange}>
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
                                {isSaving ? 'Guardando...' : 'Siguiente'}
                            </button>
                        </div>
                    </form>
                )}
                
                {/* --- PASO 2: CUENTA DE USUARIO --- */}
                {step === 2 && (
                    <form onSubmit={handleStep2Submit}>
                        <h3>Alta de Docente (Paso 2 de 2: Cuenta)</h3>
                        <p>Creando cuenta para: <strong>{createdDocente.nombre} {createdDocente.apellido}</strong></p>
                        
                        <fieldset>
                            <legend>Datos de Acceso (Cuenta)</legend>
                            <div className="form-group">
                                <label htmlFor="username">Username:</label>
                                <input type="text" id="username" name="username" value={usuarioData.username} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email_usuario">Email (para login):</label>
                                <input type="email" id="email_usuario" name="email" value={usuarioData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Contraseña:</label>
                                <input type="password" id="password" name="password" value={usuarioData.password} onChange={handleChange} required />
                            </div>
                        </fieldset>

                        {error && <p className="error-message">{error}</p>}

                        <div className="modal-actions">
                            <button type="button" onClick={handleBack} className="btn-cancel" disabled={isSaving}>Atrás</button>
                            <button type="submit" className="btn-save" disabled={isSaving}>
                                {isSaving ? 'Creando...' : 'Finalizar Alta'}
                            </button>
                        </div>
                    </form>
                )}
                
            </div>
        </div>
    );
};

export default DocenteWizardModal;