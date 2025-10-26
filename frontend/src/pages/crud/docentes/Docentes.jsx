 // src/pages/DocentesPage.jsx (Ajustado para búsqueda en Backend)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as docenteService from '../../../services/docenteService'; 
import DocentesModal from '../../../components/modals/DocentesModal';
import '../../../styles/docentescrud.css';

const Docentes = () => {
    const navigate = useNavigate();

    // --- Estados (más simple) ---
    const [docentes, setDocentes] = useState([]); // Solo una lista
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Solo para el input

    // --- Estados para el Modal ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDocente, setCurrentDocente] = useState(null);

    // --- Carga de Datos ---
    const loadDocentes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Preparamos los params para el servicio
            const params = {};
            if (searchTerm.trim() !== '') {
                params.buscar = searchTerm.trim();
            }

            // 2. Llamamos al servicio con los params
            // Si searchTerm está vacío, params será {} y traerá todos
            // Si tiene algo, params será { buscar: '...' } y el backend filtrará
            const data = await docenteService.getDocentes(params);
            
            setDocentes(data); 

            if (data.length === 0 && searchTerm.trim() !== '') {
                 setError("No se encontraron docentes con ese criterio.");
            }
        } catch (err) {
            console.error("Error al cargar docentes:", err);
            setError(err.message || 'Error al cargar docentes.');
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Ahora useEffect depende de 'loadDocentes'
    // Para que se llame solo una vez, usamos un truco de 'useCallback'
    // (O lo dejamos así y lo llamamos en 'handleSearch')
    // Por simplicidad, lo llamaremos al inicio y con el botón.
    useEffect(() => {
        loadDocentes(); // Carga inicial
    }, []); // Se ejecuta solo una vez al inicio

    
    // --- Manejadores de Eventos ---
    
    // Al hacer clic en el botón "Buscar"
    const handleSearch = () => {
        // 4. Simplemente volvemos a llamar a loadDocentes
        // esta función ya sabe cómo usar el 'searchTerm'
        loadDocentes(); 
    };

    // (El resto de los manejadores: handleOpenAddModal, handleOpenEditModal,
    // handleDelete, handleCloseModal... siguen exactamente igual)

    const handleOpenAddModal = () => {
        setCurrentDocente(null); 
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (docente) => {
        setCurrentDocente(docente); 
        setIsModalOpen(true);
    };

    const handleDelete = async (id_docente) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este docente?')) {
            try {
                await docenteService.deleteDocente(id_docente);
                loadDocentes(); 
            } catch (err) {
                setError(err.message || 'No se pudo eliminar el docente.');
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentDocente(null);
    };
    
    // Al guardar, limpiamos la búsqueda para mostrar todo
    const handleSaveSuccess = () => {
        setIsModalOpen(false);
        setCurrentDocente(null);
        setSearchTerm(''); // Limpiamos el término de búsqueda
        loadDocentes(); // Recargamos (ahora sin filtro)
    };

    // --- Renderizado (JSX) ---
    // El JSX (return) que te pasé en la respuesta anterior
    // funciona perfectamente con esta nueva lógica.
    // Solo asegúrate de que estás mapeando el estado 'docentes'.

    return (
        <div className="gestion-page-container">
            {/* ... Header (igual) ... */}
            <div className="gestion-header">
                <button onClick={() => navigate(-1)} className="back-button">← VOLVER</button>
                <h2>Gestión de Docentes</h2>
            </div>
            
            {/* ... Barra de Búsqueda (igual) ... */}
            <div className="search-add-bar">
                <div className="search-box">
                    <span className="search-icon">👤</span>
                    <input 
                        type="text" 
                        placeholder="Buscar docente por DNI o Apellido"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <button onClick={handleSearch} className="search-button">Buscar</button>
                <button onClick={handleOpenAddModal} className="add-button">
                    <span className="add-icon"></span>
                    Agregar docente
                </button>
            </div>

            {/* ... Contenedor de la Tabla (igual) ... */}
            <div className="list-container">
                <div className="list-header">
                    <h3>Listado de Docentes</h3>
                    <span>Total: {docentes.length} docentes</span>
                </div>

                {isLoading && <p>Cargando...</p>}
                {/* 5. Mostramos el error si existe */}
                {error && <p className="error-message">{error}</p>}
                
                {!isLoading && (
                    <table className="data-table">
                        {/* ... thead (igual) ... */}
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre y Apellido</th>
                                <th>DNI</th>
                                <th>Email</th>
                                <th>Especialidad</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 6. Mapeamos la lista 'docentes' (que ya viene filtrada del backend) */}
                            {docentes.length > 0 ? (
                                docentes.map((docente) => (
                                    <tr key={docente.id_docente}> 
                                        <td>{docente.id_docente}</td>
                                        <td>{`${docente.nombre} ${docente.apellido}`}</td>
                                        <td>{docente.dni_docente}</td>
                                        <td>{docente.email || 'N/A'}</td>
                                        <td>{docente.especialidad || 'N/A'}</td>
                                        <td>
                                            <span className={`status-badge ${docente.estado?.toLowerCase() || 'inactivo'}`}>
                                                {docente.estado}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <button 
                                                onClick={() => handleOpenEditModal(docente)} 
                                                className="action-button edit"
                                                title="Editar"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(docente.id_docente)} 
                                                className="action-button delete"
                                                title="Eliminar"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center' }}>
                                        {/* 7. Si hay un error, no mostramos este mensaje */}
                                        {error ? null : 'No se encontraron docentes.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ... Modal (igual) ... */}
            {isModalOpen && (
                <DocentesModal 
                    docenteToEdit={currentDocente}
                    onClose={handleCloseModal}
                    onSave={handleSaveSuccess}
                />
            )}
        </div>
    );
};

export default Docentes;