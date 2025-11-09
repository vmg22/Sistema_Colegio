import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Usamos useNavigate en lugar de BtnVolver
import Swal from 'sweetalert2';
import { getAniosLectivos, deleteAnioLectivo } from '../../../services/aniosServices';
import AnioLectivoModal from '../../../components/modals/AnioLectivoModal';
import TableCrud from '../../../components/crud/TableCrud';

// Importamos el MISMO archivo CSS que usan Docentes y Alumnos
import "../../../styles/docentescrud.css";

const GestionAniosLectivos = () => {
  const navigate = useNavigate(); // Hook para navegación

  // --- Estados ---
  const [aniosLectivos, setAniosLectivos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [showModal, setShowModal] = useState(false);
  const [anioAEditar, setAnioAEditar] = useState(null);

  // --- Carga de Datos ---
  const loadAnios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAniosLectivos();
      setAniosLectivos(response.datos || response || []); 
    } catch (err) {
      setError(err.message || 'Error al cargar los años lectivos.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnios();
  }, []);

  // --- Handlers ---
  const handleSearch = () => {
    loadAnios(); // Recarga (implementar filtro en backend si es necesario)
  };

  const handleOpenCreate = () => {
    setAnioAEditar(null);
    setShowModal(true);
  };

  const handleOpenEdit = (anio) => {
    setAnioAEditar(anio);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAnioAEditar(null);
  };

  const handleSaveSuccess = () => { // Renombrado a handleSaveSuccess para consistencia
    handleCloseModal();
    loadAnios();
  };

  const handleDelete = async (id) => {
    // Usamos window.confirm para mantener el estilo simple, 
    // o puedes seguir usando Swal si lo prefieres.
    if (window.confirm('¿Estás seguro de eliminar este año lectivo?')) {
        try {
            await deleteAnioLectivo(id);
            loadAnios();
        } catch (err) {
            // Si prefieres Swal para errores, úsalo aquí
            alert(err.message || 'No se pudo eliminar.');
        }
    }
  };

  // --- Definición de Columnas (Igual que antes) ---
  const columns = [
    { header: "Año", accessor: "anio" },
    { header: "Fecha Inicio", accessor: "fecha_inicio", cell: (row) => new Date(row.fecha_inicio).toLocaleDateString() },
    { header: "Fecha Fin", accessor: "fecha_fin", cell: (row) => new Date(row.fecha_fin).toLocaleDateString() },
    { 
      header: "Estado", 
      accessor: "estado", 
      cell: (row) => (
        // Usamos la clase 'status-badge' de tu CSS personalizado
        <span className={`status-badge ${row.estado?.toLowerCase()}`}>
          {row.estado}
        </span>
      ) 
    }
  ];

  // --- Definición de Acciones (Usando tus clases .action-button) ---
  const renderActions = (anio) => (
    <>
      <button 
        onClick={() => handleOpenEdit(anio)}
        className="action-button edit"
        title="Editar"
      >
        <span className="material-symbols-outlined">edit</span>
      </button>
      <button 
        onClick={() => handleDelete(anio.id_anio_lectivo)}
        className="action-button delete"
        title="Eliminar"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </>
  );

  // --- Renderizado (Usando la estructura de 'docentescrud.css') ---
  return (
    <div className="gestion-page-container">
        
        {/* 1. Header de la Página */}
        <div className="gestion-header">
            <button onClick={() => navigate(-1)} className="back-button">← VOLVER</button>
            <h2>Gestión de Años Lectivos</h2>
        </div>

        {/* 2. Barra de Búsqueda y Botón Agregar */}
        <div className="search-add-bar">
            <div className="search-box">
                <span className="material-symbols-outlined search-icon">search</span>
                <input 
                    type="text" 
                    placeholder="Buscar año lectivo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    // Puedes añadir onKeyPress para buscar con Enter
                />
            </div>
            <button onClick={handleSearch} className="search-button">Buscar</button>
            
            <button onClick={handleOpenCreate} className="add-button">
                <span className="material-symbols-outlined add-icon" style={{marginRight: '5px'}}>add</span>
                Nuevo Año Lectivo
            </button>
        </div>

        {/* 3. Contenedor de la Tabla */}
        <div className="list-container">
            <div className="list-header">
                <h3>Listado de Años Lectivos</h3>
                {/* Mostramos el total solo si no está cargando */}
                {!isLoading && !error && <span>Total: {aniosLectivos.length}</span>}
            </div>

            <TableCrud 
                columns={columns}
                data={aniosLectivos}
                isLoading={isLoading}
                error={error}
                renderActions={renderActions}
                getKey={(item) => item.id_anio_lectivo}
                emptyMessage="No hay años lectivos registrados."
            />
        </div>

        {/* 4. Modal (Asegúrate de que tu AnioLectivoModal use también tus estilos personalizados si quieres que coincida al 100%) */}
        {showModal && (
            <AnioLectivoModal
                show={showModal} // O 'isOpen', depende de cómo esté hecho tu modal
                onHide={handleCloseModal} // O 'onClose'
                onSave={handleSaveSuccess}
                anioAEditar={anioAEditar}
            />
        )}

    </div>
  );
};

export default GestionAniosLectivos;