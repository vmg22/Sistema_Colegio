import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDebounce } from "use-debounce";

import * as docenteService from "../../../services/docenteService";
import DocenteWizardModal from "../../../components/modals/DocenteWizardModal";
import DocenteEditModal from "../../../components/modals/DocenteEditModal";

import TableCrud from '../../../components/crud/TableCrud';
import '../../../styles/docentescrud.css'; 
import BtnVolver from '../../../components/ui/BtnVolver';
import Paginador from '../../../components/ui/Paginador';

const Docentes = () => {
  const navigate = useNavigate();
  const [docentes, setDocentes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const isInitialMount = useRef(true);

  const [showWizardModal, setShowWizardModal] = useState(false); 
  const [showEditModal, setShowEditModal] = useState(false);     
  const [currentDocente, setCurrentDocente] = useState(null); 

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadDocentes = useCallback(async (buscar) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (buscar && buscar.trim() !== "") {
        params.buscar = buscar.trim();
      }
      const data = await docenteService.getDocentes(params);
      
      // ✅ Ordenar del más nuevo al más viejo (por id_docente descendente)
      const ordenados = data.sort((a, b) => b.id_docente - a.id_docente);
      
      setDocentes(ordenados);

      if (data.length === 0 && buscar && buscar.trim() !== "") {
        setError("No se encontraron docentes.");
      }
    } catch (err) {
      const errorMsg = err.message || "Error al cargar docentes.";
      setError(errorMsg);
      Swal.fire("Error", errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      loadDocentes("");
      return;
    }
    loadDocentes(debouncedSearchTerm);
  }, [debouncedSearchTerm, loadDocentes]);

  const handleSearch = () => {
    setCurrentPage(1);
    loadDocentes(searchTerm);
  };

  const handleDelete = async (id_docente) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres eliminar este docente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await docenteService.deleteDocente(id_docente);
          Swal.fire("¡Eliminado!", "El docente ha sido eliminado.", "success");
          loadDocentes(debouncedSearchTerm);
        } catch (err) {
          Swal.fire(
            "Error",
            err.message || "No se pudo eliminar el docente.",
            "error"
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

  const handleSaveSuccess = () => {
    const isEdit = currentDocente !== null;

    handleCloseModal();
    setSearchTerm("");
    loadDocentes("");

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
      cell: (item) => {
        // ✅ Convertir a string si es objeto
        const estado = typeof item.estado_docente === 'object' 
          ? (item.estado_docente?.nombre || 'inactivo')
          : (item.estado_docente || 'inactivo');
        
        return (
          <span className={`status-badge ${estado.toLowerCase()}`}>
            {estado}
          </span>
        );
      }
    }
  ];

  const renderActions = (docente) => (
    <>
      <button
        onClick={() => navigate(`/docentes/${docente.id_docente}`)}
        className="action-button-text view"
        title="Ver Asignaciones"
      >
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
          {!isLoading && !error && <span>Total: {docentesFiltrados.length}</span>}
        </div>
        
        <TableCrud
          columns={columns}
          data={currentDocentes}
          isLoading={isLoading}
          error={error}
          renderActions={renderActions}
          getKey={(docente) => docente.id_docente}
        />

        <Paginador
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={docentesFiltrados.length}
        />
      </div>

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