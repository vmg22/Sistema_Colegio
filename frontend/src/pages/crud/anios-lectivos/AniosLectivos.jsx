import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import BtnVolver from "../../../components/ui/BtnVolver";
import TableCrud from "../../../components/crud/TableCrud";
import Paginador from "../../../components/crud/Paginador";
import { getAllAniosLectivos, deleteAnioLectivo } from "../../../services/aniosLectivosService";
import AnioLectivoEditModal from "../../../components/modals/AnioLectivoEditModal";
import AnioLectivoCreateModal from "../../../components/modals/AnioLectivoCreateModal";
import "../../../styles/aniolectivocrud.css";

const AniosLectivos = () => {
  const [aniosLectivos, setAniosLectivos] = useState([]);
  const [aniosFiltrados, setAniosFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAnio, setCurrentAnio] = useState(null);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadAniosLectivos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllAniosLectivos();
      setAniosLectivos(data);
      setAniosFiltrados(data);
    } catch (err) {
      console.error("Error al cargar años lectivos:", err);
      const errorMsg = err.message || 'Error al cargar años lectivos.';
      setError(errorMsg);
      Swal.fire("Error", errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAniosLectivos();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setAniosFiltrados(aniosLectivos);
      setError(null);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = aniosLectivos.filter(anio => 
        anio.anio?.toString().includes(term) ||
        anio.estado?.toLowerCase().includes(term)
      );
      
      setAniosFiltrados(filtered);
      
      if (filtered.length === 0) {
        setError("No se encontraron años lectivos que coincidan con la búsqueda.");
      } else {
        setError(null);
      }
    }
    setCurrentPage(1);
  }, [searchTerm, aniosLectivos]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleDelete = async (id_anio_lectivo) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará el año lectivo.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAnioLectivo(id_anio_lectivo);
          Swal.fire('¡Eliminado!', 'El año lectivo ha sido eliminado.', 'success');
          loadAniosLectivos();
        } catch (err) {
          const errorMsg = err.message || 'No se pudo eliminar el año lectivo.';
          setError(errorMsg);
          Swal.fire("Error", errorMsg, "error");
        }
      }
    });
  };

  const handleOpenEditModal = (anio) => {
    setCurrentAnio(anio);
    setShowCreateModal(false);
    setShowEditModal(true);
  };

  const handleOpenCreateModal = () => {
    setCurrentAnio(null);
    setShowEditModal(false);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setCurrentAnio(null);
  };

  const handleSaveSuccess = () => {
    const isEdit = currentAnio !== null;
    handleCloseModal();
    setSearchTerm("");
    loadAniosLectivos();
    Swal.fire({
      title: isEdit ? '¡Actualizado!' : '¡Creado!',
      text: isEdit ? 'El año lectivo se actualizó correctamente.' : 'El año lectivo se creó correctamente.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const columns = [
    { header: "ID", accessor: "id_anio_lectivo" },
    { header: "Año", accessor: "anio" },
    {
      header: "Fecha Inicio",
      accessor: "fecha_inicio",
      cell: (item) => new Date(item.fecha_inicio).toLocaleDateString('es-AR'),
    },
    {
      header: "Fecha Fin",
      accessor: "fecha_fin",
      cell: (item) => new Date(item.fecha_fin).toLocaleDateString('es-AR'),
    },
    {
      header: "Estado",
      accessor: "estado",
      cell: (item) => (
        <span className={`status-badge ${item.estado?.toLowerCase()}`}>
          {item.estado}
        </span>
      ),
    },
  ];

  // Calcular datos paginados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const aniosPaginados = aniosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(aniosFiltrados.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const renderActions = (anio) => (
    <div className="action-buttons">
      <button
        className="edit-button"
        onClick={() => handleOpenEditModal(anio)}
        title="Editar"
      >
        <span className="material-symbols-outlined">edit</span>
      </button>
      <button
        className="delete-button"
        onClick={() => handleDelete(anio.id_anio_lectivo)}
        title="Eliminar"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  );

  return (
    <div className="gestion-page-container">
      <div className="gestion-header">
        <BtnVolver />
        <h2>Gestión de Años Lectivos</h2>
      </div>

      <div className="search-add-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por año o estado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={handleClearSearch} className="clear-search" title="Limpiar búsqueda">
              ✕
            </button>
          )}
        </div>
        <button className="add-button" onClick={handleOpenCreateModal}>
          <span className="material-symbols-outlined add-icon" style={{marginRight: '5px'}}>add</span>
          Agregar año lectivo
        </button>
      </div>

      <div className="list-container">
        <div className="list-header">
          <h3>Listado de Años Lectivos</h3>
          {!isLoading && (
            <span>
              {searchTerm 
                ? `${aniosFiltrados.length} de ${aniosLectivos.length} años`
                : `Total: ${aniosLectivos.length}`
              }
            </span>
          )}
        </div>

        <TableCrud
          columns={columns}
          data={aniosPaginados}
          isLoading={isLoading}
          error={error}
          renderActions={renderActions}
          getKey={(anio) => anio.id_anio_lectivo}
        />

        {!isLoading && !error && aniosFiltrados.length > 0 && (
          <Paginador
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={aniosFiltrados.length}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      {showEditModal && (
        <AnioLectivoEditModal
          anioToEdit={currentAnio}
          onClose={handleCloseModal}
          onSave={handleSaveSuccess}
        />
      )}

      {showCreateModal && (
        <AnioLectivoCreateModal
          onClose={handleCloseModal}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default AniosLectivos;