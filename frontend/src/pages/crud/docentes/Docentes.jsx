import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Importa tus servicios y el modal
import * as docenteService from '../../../services/docenteService'; 
import DocentesModal from '../../../components/modals/DocentesModal';

// 2. Importa el CSS y la nueva tabla
import '../../../styles/docentescrud.css'; // <-- USA ESTE CSS
import CrudTable from '../../../components/crud/TableCrud'; // <-- IMPORTA LA TABLA

const Docentes = () => {
    const navigate = useNavigate();

    // --- Estados (igual que antes) ---
    const [docentes, setDocentes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDocente, setCurrentDocente] = useState(null);

    // --- Lógica (loadDocentes, handleSearch, etc. - sin cambios) ---
    const loadDocentes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = {};
            if (searchTerm.trim() !== '') {
                params.buscar = searchTerm.trim();
            }
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

    useEffect(() => {
        loadDocentes();
    }, []); 

    const handleSearch = () => {
        loadDocentes(); 
    };

    const handleOpenAddModal = (docente = null) => {
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
    
    const handleSaveSuccess = () => {
        setIsModalOpen(false);
        setCurrentDocente(null);
        setSearchTerm('');
        loadDocentes();
    };

    // --- 3. Definimos las columnas para la tabla ---
    const columns = [
        'ID',
        'Nombre y Apellido',
        'DNI',
        'Email',
        'Especialidad',
        'Estado',
        'Acciones'
    ];

    // --- 4. Definimos CÓMO se renderiza CADA fila ---
    // Esta función se la pasamos a CrudTable como prop
    const renderDocenteRow = (docente) => (
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
                    onClick={() => handleOpenAddModal(docente)} // <-- Llama a la misma función de agregar
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
    );

    // --- 5. El JSX ahora es mucho más limpio ---
    return (
        <div className="gestion-page-container">
            <div className="gestion-header">
                <button onClick={() => navigate(-1)} className="back-button">← VOLVER</button>
                <h2>Gestión de Docentes</h2>
            </div>
            
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
                <button onClick={() => handleOpenAddModal()} className="add-button">
                    <span className="add-icon"></span>
                    Agregar docente
                </button>
            </div>

            {/* --- 6. Aquí usamos el componente de tabla genérico --- */}
            <CrudTable
                title="Listado de Docentes"
                columns={columns}
                data={docentes}
                isLoading={isLoading}
                error={error}
                renderRow={renderDocenteRow} // Le pasamos nuestra función de renderizado
                emptyMessage="No se encontraron docentes."
            />
            {/* --- Fin de la tabla --- */}

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