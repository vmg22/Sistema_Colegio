import React, { useState, useEffect, useCallback, useRef } from "react";
import { getMaterias, deleteMateria } from "../../../services/materiasaltasService";
import MateriaModal from "../../../components/modals/MateriaModal";
import TableCrud from "../../../components/crud/TableCrud";
import Paginador from "../../../components/crud/Paginador";
import Swal from "sweetalert2";
import { useDebounce } from "use-debounce";
import "../../../styles/docentescrud.css";
import BtnVolver from "../../../components/ui/BtnVolver";

const Materias = () => {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [materiaAEditar, setMateriaAEditar] = useState(null);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  const isInitialMount = useRef(true);

  // Carga de datos
  const cargarMaterias = useCallback(async (buscar) => {
    try {
      setLoading(true);
      setError(null);
      const materiasArray = await getMaterias({ buscar: buscar });
      setMaterias(materiasArray || []);
    } catch (err) {
      const errorMsg = err.message || "Error al cargar las materias.";
      setError(errorMsg);
      // <-- MODIFICADO: Alerta de error en la carga -->
      Swal.fire(
        "Error de Carga",
        errorMsg,
        "error"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []); // El array de dependencias vacío estaba correcto aquí

  // Búsqueda con debounce (Sin cambios, ya funcionaba "mientras escribes")
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      cargarMaterias("");
      return;
    }
    cargarMaterias(debouncedSearchTerm);
  }, [debouncedSearchTerm, cargarMaterias]);

  // Handlers Modal
  const handleOpenCreate = () => {
    setMateriaAEditar(null);
    setShowModal(true);
  };

  const handleOpenEdit = (materia) => {
    setMateriaAEditar(materia);
    setShowModal(true);
  };

  // <-- MODIFICADO: Limpiar estado al cerrar -->
  const handleCloseModal = () => {
    setShowModal(false);
    setMateriaAEditar(null); // Importante para la lógica de handleSave
  };

  // <-- MODIFICADO: Alerta de éxito al guardar -->
  const handleSave = () => {
    // 1. Verificamos si era una edición ANTES de cerrar
    const isEdit = materiaAEditar !== null;
    
    // 2. Cerramos el modal
    handleCloseModal();
    
    // 3. Recargamos los datos de la vista actual
    cargarMaterias(debouncedSearchTerm);

    // 4. Mostramos la alerta de éxito
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

  // Handler Delete (Sin cambios, ya usaba Swal correctamente)
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
          cargarMaterias(debouncedSearchTerm); // Recarga la vista actual
        } catch (err) {
          Swal.fire("Error", err.message || "No se pudo eliminar.", "error");
        }
      }
    });
  };

  // Botón "Buscar"
  const handleSearch = () => {
    setCurrentPage(1); // Reset page on search
    cargarMaterias(searchTerm);
  };

  // Lógica de Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = materias.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(materias.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Definición de columnas (Sin cambios)
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

  // Función para renderizar los botones de acción (Sin cambios)
  const renderActions = (materia) => {
    return (
      <>
        <button
          onClick={() => handleOpenEdit(materia)}
          className="action-button view"
          title="Ver Materia"
        >
          <span className="material-symbols-outlined">visibility</span>
        </button>
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

  // Renderizado (Sin cambios)
  return (
    <div className="gestion-page-container">
      {/* Header */}
      <div className="gestion-header">
        <BtnVolver/>
        <h2 className='mx-4'>Gestión de Materias</h2>
      </div>

      {/* Barra de búsqueda y botones */}
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

      {/* Contenedor de la tabla */}
      <div className="list-container">
        <div className="list-header">
          <h3>Listado de Materias</h3>
          {!loading && !error && <span>Total: {materias.length}</span>}
        </div>

        <TableCrud
          columns={columns}
          data={currentItems}
          isLoading={loading}
          error={error}
          renderActions={renderActions}
          getKey={(materia) => materia.id_materia}
        />

        {/* Paginador */}
        {!loading && !error && materias.length > 0 && (
          <Paginador
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={materias.length}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      <MateriaModal
        show={showModal}
        onHide={handleCloseModal}
        onSave={handleSave} // Esta función ahora dispara el Swal
        materiaAEditar={materiaAEditar}
      />
    </div>
  );
};

export default Materias;