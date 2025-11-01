import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Importa el NUEVO servicio
import * as docenteService from '../../../services/docenteService'; 

// 2. Importa AMBOS modales
import DocenteWizardModal from '../../../components/modals/DocenteWizardModal'; // Para AGREGAR
import DocenteEditModal from '../../../components/modals/DocenteEditModal'; // Para EDITAR

// 3. Importa tu tabla y tu CSS
import TableCrud from '../../../components/crud/TableCrud';
import '../../../styles/docentescrud.css'; 

const Docentes = () => {
    const navigate = useNavigate();
    const [docentes, setDocentes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- Estados del Modal (separados) ---
    const [showWizardModal, setShowWizardModal] = useState(false); // Para el alta
    const [showEditModal, setShowEditModal] = useState(false);     // Para editar
    const [currentDocente, setCurrentDocente] = useState(null); // Para editar

    // --- (loadDocentes, handleSearch, handleDelete - sin cambios) ---
    const loadDocentes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {};
            if (searchTerm.trim() !== '') {
                // TODO: Implementar búsqueda en backend
                params.buscar = searchTerm.trim();
            }
            const data = await docenteService.getDocentes(params);
            setDocentes(data); 

            if (data.length === 0 && searchTerm.trim() !== '') {
                 setError("No se encontraron docentes.");
            }
        } catch (err) {
            setError(err.message || 'Error al cargar docentes.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadDocentes(); }, []); 
    const handleSearch = () => { loadDocentes(); };

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

    // --- Manejadores de Modales (Separados) ---
    const handleOpenAddModal = () => {
        setCurrentDocente(null);
        setShowEditModal(false);
        setShowWizardModal(true); // <-- Muestra el wizard
    };
    
    const handleOpenEditModal = (docente) => {
        setCurrentDocente(docente);
        setShowWizardModal(false);
        setShowEditModal(true); // <-- Muestra el modal de edición
    };

    const handleCloseModal = () => {
        setShowWizardModal(false);
        setShowEditModal(false);
        setCurrentDocente(null);
    };
    
    const handleSaveSuccess = () => {
        handleCloseModal();
        setSearchTerm('');
        loadDocentes();
    };

    // --- Definiciones de Tabla (Ajustadas a tu query) ---
    const columns = [
        { header: 'ID', accessor: 'id_docente' },
        { 
          header: 'Nombre y Apellido', 
          accessor: 'nombre',
          cell: (item) => `${item.nombre} ${item.apellido}`
        },
        { header: 'DNI', accessor: 'dni_docente' },
        
        { header: 'Email (Login)', accessor: 'email_usuario', cell: (item) => item.email_usuario || 'Sin vincular' },
        { 
          header: 'Estado', 
          accessor: 'estado_docente',
          cell: (item) => (
            <span className={`status-badge ${item.estado_docente?.toLowerCase() || 'inactivo'}`}>
              {item.estado_docente}
            </span>
          )
        }
    ];

    const renderActions = (docente) => (
      <>
        <button // Llama a 'navigate' con la ruta dinámica
          onClick={() => navigate(`/docentes/${docente.id_docente}`)}
          className="action-button view" // Clase para el icono (ver CSS)
          title="Ver Perfil"
        >
         👁️ 
        </button>

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
      </>
    );

    return (
        <div className="gestion-page-container">
            {/* ... Header ... */}
            <div className="gestion-header">
                <button onClick={() => navigate(-1)} className="back-button">← VOLVER</button>
                <h2>Gestión de Docentes</h2>
            </div>
            
            {/* ... Barra de Búsqueda ... */}
            <div className="search-add-bar">
                <div className="search-box">
                    <span className="search-icon">👤</span>
                    <input 
                        type="text" 
                        placeholder="Buscar docente..."
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

            {/* Contenedor de la Tabla */}
            <div className="list-container">
                <div className="list-header">
                    <h3>Listado de Docentes</h3>
                    {!isLoading && !error && <span>Total: {docentes.length}</span>}
                </div>
                
                <TableCrud
                    columns={columns}
                    data={docentes}
                    isLoading={isLoading}
                    error={error}
                    renderActions={renderActions}
                    getKey={(docente) => docente.id_docente}
                />
            </div>

            {/* --- Renderizado de Modales --- */}
            
            {/* Modal de 2 pasos para AGREGAR */}
            {showWizardModal && (
                <DocenteWizardModal 
                    onClose={handleCloseModal}
                    onSave={handleSaveSuccess}
                />
            )}
            
            {/* Modal simple para EDITAR */}
            {showEditModal && (
                <DocenteEditModal 
                    docenteToEdit={currentDocente}
                    onClose={handleCloseModal}
                    onSave={handleSaveSuccess}
                />
            )}
        </div>
    );
};

export default Docentes;