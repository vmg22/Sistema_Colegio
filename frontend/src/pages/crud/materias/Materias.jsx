import React, { useState, useEffect, useCallback, useRef } from "react";
import { getMaterias, deleteMateria } from "../../../services/materiasaltasService";
import MateriaModal from "../../../components/modals/MateriaModal";
import TableCrud from "../../../components/crud/TableCrud";
import Paginador from '../../../components/ui/Paginador';
import Swal from "sweetalert2";
import { useDebounce } from "use-debounce";
import "../../../styles/docentescrud.css";

const Materias = () => {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [materiaAEditar, setMateriaAEditar] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const isInitialMount = useRef(true);

  const cargarMaterias = useCallback(async (buscar) => {
    try {
      setLoading(true);
      setError(null);
      const materiasArray = await getMaterias({ buscar: buscar });
      setMaterias(materiasArray || []);
    } catch (err) {
      const errorMsg = err.message || "Error al cargar las materias.";
      setError(errorMsg);
      Swal.fire("Error de Carga", errorMsg, "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      cargarMaterias("");
      return;
    }
    cargarMaterias(debouncedSearchTerm);
  }, [debouncedSearchTerm, cargarMaterias]);

  const handleOpenCreate = () => {
    setMateriaAEditar(null);
    setShowModal(true);
  };

  const handleOpenEdit = (materia) => {
    setMateriaAEditar(materia);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMateriaAEditar(null);
  };

  const handleSave = () => {
    const isEdit = materiaAEditar !== null;
    
    handleCloseModal();
    cargarMaterias(debouncedSearchTerm);

    Swal.fire({
      title: isEdit ? "¡Actualizada!" : "¡Creada!",
      text: isEdit
        ? "La materia se actualizó correctamente."
        : "La materia se creó correctamente.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "La materia se moverá a la papelera.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMateria(id);
          Swal.fire("¡Movido a Papelera!", "La materia ha sido eliminada.", "success");
          cargarMaterias(debouncedSearchTerm);
        } catch (err) {
          Swal.fire("Error", err.message || "No se pudo eliminar.", "error");
        }
      }
    });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    cargarMaterias(searchTerm);
  };

  // Filtrado
  const materiasFiltradas = materias.filter(materia => {
    return (
      materia.nombre.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (materia.descripcion && materia.descripcion.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );
  });

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterias = materiasFiltradas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(materiasFiltradas.length / itemsPerPage);

  const handlePageChange = (page, newItemsPerPage) => {
    if (newItemsPerPage) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

  const columns = [
    {
      header: "Nombre",
      accessor: "nombre",
      cell: (item) => (
        <div>
          {item.nombre}
          {item.descripcion && (
            <small style={{ display: "block", color: "#6c757d", marginTop: "4px" }}>
              {item.descripcion}
            </small>
          )}
        </div>
      ),
    },
    {
      header: "Nivel (Año)",
      accessor: "nivel",
      cell: (item) => `${item.nivel}°`,
    },
    {
      header: "Ciclo",
      accessor: "ciclo",
      cell: (item) => item.ciclo ? item.ciclo.charAt(0).toUpperCase() + item.ciclo.slice(1) : "",
    },
    {
      header: "Carga Horaria",
      accessor: "carga_horaria",
      cell: (item) => item.carga_horaria ? `${item.carga_horaria} hs.` : "N/A",
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

  const renderActions = (materia) => {
    return (
      <>
        <button
          onClick={() => handleOpenEdit(materia)}
          className="action-button edit"
          title="Editar"
        >
          <span className="material-symbols-outlined">edit</span>
        </button>
        <button
          onClick={() => handleDelete(materia.id_materia)}
          className="action-button delete"
          title="Eliminar"
        >
          <span className="material-symbols-outlined">delete</span>
        </button>
      </>
    );
  };

  return (
<div className="gestion-page-container">
      <div className="gestion-header">
        <h2 className='mx-4'>Gestión de Materias</h2>
      </div>

      <div className="search-add-bar">
        <div className="search-box">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <button onClick={handleSearch} className="search-button">
          Buscar
        </button>

        <button onClick={handleOpenCreate} className="add-button">
          <span className="material-symbols-outlined add-icon" style={{marginRight: '5px'}}>add</span>Nueva Materia
        </button>
      </div>

      <div className="list-container">
        <div className="list-header">
          <h3>Listado de Materias</h3>
          {!loading && !error && <span>Total: {materiasFiltradas.length}</span>}
        </div>

        <TableCrud
          columns={columns}
          data={currentMaterias}
          isLoading={loading}
          error={error}
          renderActions={renderActions}
          getKey={(materia) => materia.id_materia}
        />

        <Paginador
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={materiasFiltradas.length}
        />
      </div>

      <MateriaModal
        show={showModal}
        onHide={handleCloseModal}
        onSave={handleSave}
        materiaAEditar={materiaAEditar}
      />
    </div>
    
  );
};

export default Materias;