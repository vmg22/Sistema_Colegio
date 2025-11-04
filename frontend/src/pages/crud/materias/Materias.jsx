import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- ¡CAMBIO AQUÍ! ---
import * as materiasaltasService from '../../../services/materiasaltasService'; 
import MateriaModal from '../../../components/modals/MateriaModal';
import TableCrud from '../../../components/crud/TableCrud';
import '../../../styles/docentescrud.css'; // ¡Reutilizamos el mismo CSS!

const Materias = () => {
    const navigate = useNavigate();
    const [materias, setMaterias] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [modoPapelera, setModoPapelera] = useState(false); 
    
    const [showModal, setShowModal] = useState(false);
    const [currentMateria, setCurrentMateria] = useState(null);

    const loadMaterias = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = { buscar: searchTerm.trim() || undefined };
            let data;
            
            if (modoPapelera) {
                // --- ¡CAMBIO AQUÍ! ---
                data = await materiasaltasService.getMateriasEliminadas(); 
            } else {
                // --- ¡CAMBIO AQUÍ! ---
                data = await materiasaltasService.getMaterias(params);
            }
            
            setMaterias(data); 

            if (data.length === 0 && !searchTerm.trim()) {
                 setError(modoPapelera ? "La papelera está vacía." : "No se encontraron materias.");
            }
        } catch (err) {
            setError(err.message || 'Error al cargar materias.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { 
        loadMaterias(); 
    }, [modoPapelera]);

    const handleSearch = () => { loadMaterias(); };

    const handleDelete = async (id_materia) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta materia? (Se enviará a la papelera)')) {
            try {
                // --- ¡CAMBIO AQUÍ! ---
                await materiasaltasService.deleteMateria(id_materia);
                loadMaterias(); 
            } catch (err) {
                setError(err.message || 'No se pudo eliminar la materia.');
            }
        }
    };
    
    const handleRestaurar = async (id_materia) => {
        if (window.confirm('¿Estás seguro de que quieres restaurar esta materia?')) {
            try {
                // --- ¡CAMBIO AQUÍ! ---
                await materiasaltasService.restaurarMateria(id_materia);
                loadMaterias();
            } catch (err) {
                setError(err.message || 'No se pudo restaurar la materia.');
            }
        }
    };

    const handleOpenModal = (materia = null) => {
        setCurrentMateria(materia); 
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentMateria(null);
    };
    
    const handleSaveSuccess = () => {
        handleCloseModal();
        setSearchTerm('');
        loadMaterias();
    };

    // --- Definiciones de la Tabla (sin cambios) ---
    const columns = [
        { header: 'ID', accessor: 'id_materia' },
        { header: 'Nombre', accessor: 'nombre' },
        { header: 'Nivel/Año', accessor: 'nivel' },
        { header: 'Ciclo', accessor: 'ciclo' },
        { header: 'Carga Horaria', accessor: 'carga_horaria', cell: (item) => item.carga_horaria ? `${item.carga_horaria} hs` : 'N/A' },
        { 
          header: 'Estado', 
          accessor: 'estado',
          cell: (item) => (
            <span className={`status-badge ${item.estado?.toLowerCase()}`}>
              {item.estado}
            </span>
          )
        }
    ];

    const renderActions = (materia) => {
        if (modoPapelera) {
            return (
                <button 
                    onClick={() => handleRestaurar(materia.id_materia)}
                    className="action-button restore"
                    title="Restaurar Materia"
                >
                    <span className="material-symbols-outlined">restore</span>
                </button>
            );
        }
        return (
            <>
                <button 
                    onClick={() => handleOpenModal(materia)}
                    className="action-button edit"
                    title="Editar Materia"
                >
                    <span className="material-symbols-outlined">edit</span>
                </button>
                <button 
                    onClick={() => handleDelete(materia.id_materia)} 
                    className="action-button delete"
                    title="Eliminar Materia"
                >
                    <span className="material-symbols-outlined">delete</span>
                </button>
            </>
        );
    };

    return (
        <div className="gestion-page-container">
            <div className="gestion-header">
                <button onClick={() => navigate(-1)} className="back-button">← VOLVER</button>
                <h2>Gestión de Materias</h2>
            </div>
            
            <div className="search-add-bar">
                <div className="search-box">
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input 
                        type="text" 
                        placeholder={modoPapelera ? "Buscar en la papelera..." : "Buscar materia..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        disabled={modoPapelera}
                    />
                </div>
                <button onClick={handleSearch} className="search-button" disabled={modoPapelera}>Buscar</button>
                
                {!modoPapelera && (
                    <button onClick={() => handleOpenModal()} className="add-button">
                        <span className="add-icon"></span>
                        Agregar materia
                    </button>
                )}
                
                <button 
                    onClick={() => setModoPapelera(!modoPapelera)} 
                    className="toggle-papelera-button"
                >
                    {modoPapelera ? "Ver Activas" : "Ver Papelera"}
                </button>
            </div>

            <div className="list-container">
                <div className="list-header">
                    <h3>{modoPapelera ? "Papelera de Materias" : "Listado de Materias"}</h3>
                    {!isLoading && !error && <span>Total: {materias.length}</span>}
                </div>
                
                <TableCrud
                    columns={columns}
                    data={materias}
                    isLoading={isLoading}
                    error={error}
                    renderActions={renderActions}
                    getKey={(materia) => materia.id_materia}
                    emptyMessage={modoPapelera ? "La papelera está vacía." : "No se encontraron materias."}
                />
            </div>

            {showModal && (
                <MateriaModal 
                    materiaToEdit={currentMateria}
                    onClose={handleCloseModal}
                    onSave={handleSaveSuccess}
                />
            )}
        </div>
    );
};

export default Materias;