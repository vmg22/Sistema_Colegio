import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import TableCrud from "../../../components/crud/TableCrud";
import Paginador from "../../../components/crud/Paginador";
import { getAllCursos, deleteCurso } from "../../../services/cursosService";
import CursoEditModal from "../../../components/modals/CursoEditModal";
import CursoCreateModal from "../../../components/modals/CursoCreateModal";
import "../../../styles/cursocrud.css";

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentCurso, setCurrentCurso] = useState(null);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadCursos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllCursos();
      setCursos(data);
      setCursosFiltrados(data);
    } catch (err) {
      console.error("Error al cargar cursos:", err);
      const errorMsg = err.message || 'Error al cargar cursos.';
      setError(errorMsg);
      Swal.fire("Error", errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCursos();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setCursosFiltrados(cursos);
      setError(null);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = cursos.filter(curso => 
        curso.anio_curso?.toString().includes(term) ||
        curso.division?.toLowerCase().includes(term) ||
        curso.turno?.toLowerCase().includes(term)
      );
      
      setCursosFiltrados(filtered);
      
      if (filtered.length === 0) {
        setError("No se encontraron cursos que coincidan con la búsqueda.");
      } else {
        setError(null);
      }
    }
    setCurrentPage(1);
  }, [searchTerm, cursos]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleDelete = async (id_curso) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará el curso.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCurso(id_curso);
          Swal.fire('¡Eliminado!', 'El curso ha sido eliminado.', 'success');
          loadCursos();
        } catch (err) {
          const errorMsg = err.message || 'No se pudo eliminar el curso.';
          setError(errorMsg);
          Swal.fire("Error", errorMsg, "error");
        }
      }
    });
  };

  const handleOpenEditModal = (curso) => {
    setCurrentCurso(curso);
    setShowCreateModal(false);
    setShowEditModal(true);
  };

  const handleOpenCreateModal = () => {
    setCurrentCurso(null);
    setShowEditModal(false);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setCurrentCurso(null);
  };

  const handleSaveSuccess = () => {
    const isEdit = currentCurso !== null;
    handleCloseModal();
    setSearchTerm("");
    loadCursos();
    Swal.fire({
      title: isEdit ? '¡Actualizado!' : '¡Creado!',
      text: isEdit ? 'El curso se actualizó correctamente.' : 'El curso se creó correctamente.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  const columns = [
    { header: "ID", accessor: "id_curso" },
    {
      header: "Curso",
      accessor: "curso",
      cell: (item) => `${item.anio_curso}° ${item.division}`,
    },
    { header: "Turno", accessor: "turno" },
    {
      header: "Año Lectivo",
      accessor: "anio_lectivo",
      cell: (item) => item.anio_lectivo || "N/A",
    },
  ];

  // Calcular datos paginados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const cursosPaginados = cursosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cursosFiltrados.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const renderActions = (curso) => (
    <div className="action-buttons">
      <button
        className="edit-button"
        onClick={() => handleOpenEditModal(curso)}
        title="Editar"
      >
        <span className="material-symbols-outlined">edit</span>
      </button>
      <button
        className="delete-button"
        onClick={() => handleDelete(curso.id_curso)}
        title="Eliminar"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  );

  return (
    <div className="gestion-page-container">
      <div className="gestion-header">

        <h2>Gestión de Cursos</h2>
      </div>

      <div className="search-add-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por año, división o turno..."
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
          Agregar curso
        </button>
      </div>

      <div className="list-container">
        <div className="list-header">
          <h3>Listado de Cursos</h3>
          {!isLoading && (
            <span>
              {searchTerm 
                ? `${cursosFiltrados.length} de ${cursos.length} cursos`
                : `Total: ${cursos.length}`
              }
            </span>
          )}
        </div>

        <TableCrud
          columns={columns}
          data={cursosPaginados}
          isLoading={isLoading}
          error={error}
          renderActions={renderActions}
          getKey={(curso) => curso.id_curso}
        />

        {!isLoading && !error && cursosFiltrados.length > 0 && (
          <Paginador
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={cursosFiltrados.length}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      {showEditModal && (
        <CursoEditModal
          cursoToEdit={currentCurso}
          onClose={handleCloseModal}
          onSave={handleSaveSuccess}
        />
      )}

      {showCreateModal && (
        <CursoCreateModal
          onClose={handleCloseModal}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default Cursos;