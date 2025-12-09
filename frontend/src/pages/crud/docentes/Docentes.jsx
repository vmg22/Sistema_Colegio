import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // <-- Importado
import { useDebounce } from 'use-debounce'; // <-- Importado

import * as docenteService from '../../../services/docenteService'; 
import DocenteWizardModal from '../../../components/modals/DocenteWizardModal'; 
import DocenteEditModal from '../../../components/modals/DocenteEditModal'; 

import TableCrud from '../../../components/crud/TableCrud';
import '../../../styles/docentescrud.css'; 
import BtnVolver from '../../../components/ui/BtnVolver';
import Paginador from '../../../components/ui/Paginador';

const Docentes = () => {
    const navigate = useNavigate();
    const [docentes, setDocentes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // --- 1. Lógica de Debounce para el buscador ---
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const isInitialMount = useRef(true);

    const [showWizardModal, setShowWizardModal] = useState(false); 
    const [showEditModal, setShowEditModal] = useState(false);     
    const [currentDocente, setCurrentDocente] = useState(null); 

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const loadDocentes = useCallback(async (buscar) => { // <-- Modificado para aceptar 'buscar'
        setIsLoading(true);
        setError(null);
        try {
            const params = {};
            // Usa el argumento 'buscar' en lugar de leer 'searchTerm'
            if (buscar && buscar.trim() !== '') {
                params.buscar = buscar.trim();
            }
            const data = await docenteService.getDocentes(params);
            setDocentes(data); 

            if (data.length === 0 && buscar && buscar.trim() !== '') {
                setError("No se encontraron docentes.");
            }
        } catch (err) {
            const errorMsg = err.message || 'Error al cargar docentes.';
            setError(errorMsg);
            // --- 2. Alerta de error en carga ---
            Swal.fire("Error", errorMsg, "error");
        } finally {
            setIsLoading(false);
        }
    }, []); // useCallback con dependencias vacías

    // --- 1. useEffect para búsqueda en tiempo real ---
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            loadDocentes(""); // Carga inicial
            return;
        }
        loadDocentes(debouncedSearchTerm);
    }, [debouncedSearchTerm, loadDocentes]); 
    
    // Botón de búsqueda (opcional, ahora fuerza la búsqueda)
    const handleSearch = () => { 
        loadDocentes(searchTerm); 
    };

    // --- 2. Alerta en Borrado ---
    const handleDelete = async (id_docente) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres eliminar este docente? (borrado lógico)",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await docenteService.deleteDocente(id_docente);
                    Swal.fire(
                        '¡Eliminado!',
                        'El docente ha sido eliminado.',
                        'success'
                    );
                    loadDocentes(debouncedSearchTerm); // Recarga la búsqueda actual
                } catch (err) {
                    Swal.fire(
                        'Error',
                        err.message || 'No se pudo eliminar el docente.',
                        'error'
                    );
                }
            }
        });
    };

    const handleOpenAddModal = () => {
        setCurrentDocente(null);
        setShowEditModal(false);
        setShowWizardModal(true); 
    };
    
    const handleOpenEditModal = (docente) => {
        setCurrentDocente(docente);
        setShowWizardModal(false);
        setShowEditModal(true); 
    };

    const handleCloseModal = () => {
        setShowWizardModal(false);
        setShowEditModal(false);
        setCurrentDocente(null);
    };
    
    // --- 2. Alerta en Guardado (Crear/Editar) ---
    const handleSaveSuccess = () => {
        // Verificamos si era edición ANTES de cerrar el modal
        const isEdit = currentDocente !== null;

        handleCloseModal();
        setSearchTerm(''); // Limpiamos la búsqueda
        loadDocentes(""); // Recargamos la lista principal

        Swal.fire({
            title: isEdit ? '¡Actualizado!' : '¡Creado!',
            text: isEdit 
                ? 'El docente se actualizó correctamente.' 
                : 'El docente se creó correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
    };

    // Filtrar docentes por búsqueda
    const docentesFiltrados = docentes.filter(docente => {
        const fullName = `${docente.nombre} ${docente.apellido}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });

    // Calcular paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDocentes = docentesFiltrados.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(docentesFiltrados.length / itemsPerPage);

    const handlePageChange = (page, newItemsPerPage) => {
        if (newItemsPerPage) {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
        } else {
            setCurrentPage(page);
        }
    };

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
        <button
          onClick={() => navigate(`/docentes/${docente.id_docente}`)}
          // 1. Usamos una NUEVA clase CSS
          className="action-button-text view"
          title="Ver Asignaciones"
        >
          {/* 2. El icono va primero */}
          <span className="material-symbols-outlined">visibility</span>
        </button>

        <button
          onClick={() => handleOpenEditModal(docente)}
          className="action-button edit"
          title="Editar"
        >
          <span className="material-symbols-outlined">edit</span>
        </button>
        <button
          onClick={() => handleDelete(docente.id_docente)}
          className="action-button delete"
          title="Eliminar"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </>
    );

    return (
        <div className="gestion-page-container">
        
            <div className="gestion-header">
                <BtnVolver/>
                <h2 className='mx-4'>Gestión de Docentes</h2>
            </div>
            
        
            <div className="search-add-bar">
                <div className="search-box">
                    <span className="search-icon material-symbols-outlined">search</span>
                    <input 
                        type="text" 
                        placeholder="Buscar docente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        // onKeyPress se mantiene por si quieren usar Enter
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()} 
                    />
                </div>
                <button onClick={handleSearch} className="search-button">Buscar</button>
                <button onClick={handleOpenAddModal} className="add-button">
                    <span className="material-symbols-outlined add-icon" style={{marginRight: '5px'}}>add</span>
                    Agregar docente
                </button>
            </div>

        
            <div className="list-container">
                <div className="list-header">
                    <h3>Listado de Docentes</h3>
                    {!isLoading && !error && <span>Total: {docentes.length}</span>}
                </div>
                
                <TableCrud
                    columns={columns}
                    data={currentDocentes}
                    isLoading={isLoading}
                    error={error}
                    renderActions={renderActions}
                    getKey={(docente) => docente.id_docente}
                />
            </div>

            <Paginador
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={docentesFiltrados.length}
            />

            {showWizardModal && (
                <DocenteWizardModal 
                    onClose={handleCloseModal}
                    onSave={handleSaveSuccess}
                />
            )}
            
            
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