import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import BtnVolver from "../../../components/ui/BtnVolver";
import TableCrud from "../../../components/crud/TableCrud";
import Paginador from "../../../components/crud/Paginador";
import { getAllAlumnos, deleteAlumno } from "../../../services/alumnosService";
import AlumnoEditModal from "../../../components/modals/AlumnoEditModal";
import AlumnoWizardModal from "../../../components/modals/AlumnoWizardModal";
import "../../../styles/alumnocrud.css"

const Alumnos = () => {
  // Estados existentes
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAlumno, setCurrentAlumno] = useState(null);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const _navigate = useNavigate();

  // Cargar todos los alumnos
  const loadAlumnos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllAlumnos();
      setAlumnos(data);
      setAlumnosFiltrados(data); // Inicialmente muestra todos
    } catch (err) {
      console.error("Error al cargar alumnos:", err);
      const errorMsg = err.message || 'Error al cargar alumnos.';
      setError(errorMsg);
      // <-- 2. ALERTA DE ERROR EN CARGA -->
      Swal.fire("Error", errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadAlumnos();
  }, []);

  // Filtrar alumnos en tiempo real (Esta lógica ya estaba, no se toca)
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setAlumnosFiltrados(alumnos);
      setError(null);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = alumnos.filter(alumno => 
        alumno.nombre_alumno?.toLowerCase().includes(term) ||
        alumno.apellido_alumno?.toLowerCase().includes(term) ||
        alumno.dni_alumno?.includes(term) ||
        alumno.email?.toLowerCase().includes(term)
      );
      
      setAlumnosFiltrados(filtered);
      
      if (filtered.length === 0) {
        setError("No se encontraron alumnos que coincidan con la búsqueda.");
      } else {
        setError(null);
      }
    }
  }, [searchTerm, alumnos]);

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // <-- 3. ALERTAS EN BORRADO -->
  const handleDelete = async (id_alumno) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará el alumno.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAlumno(id_alumno);
          Swal.fire(
            '¡Eliminado!',
            'El alumno ha sido eliminado.',
            'success'
          );
          loadAlumnos(); // Recargar la lista completa
        } catch (err) {
          const errorMsg = err.message || 'No se pudo eliminar el alumno.';
          setError(errorMsg);
          Swal.fire("Error", errorMsg, "error");
        }
      }
    });
  };

  // Abrir modal de edición
  const handleOpenEditModal = (alumno) => {
    setCurrentAlumno(alumno);
    setShowWizardModal(false);
    setShowEditModal(true);
  };

  // Abrir modal de alta
  const handleOpenWizardModal = () => {
    setCurrentAlumno(null);
    setShowEditModal(false);
    setShowWizardModal(true);
  };

  // Cerrar modales
  const handleCloseModal = () => {
    setShowWizardModal(false);
    setShowEditModal(false);
    setCurrentAlumno(null);
  };

  // <-- 4. ALERTA EN GUARDADO EXITOSO -->
  const handleSaveSuccess = () => {
    // Verificamos si era una edición ANTES de cerrar el modal
    const isEdit = currentAlumno !== null;

    handleCloseModal();
    setSearchTerm(""); // Limpiar búsqueda
    loadAlumnos(); // Recargar lista

    Swal.fire({
      title: isEdit ? '¡Actualizado!' : '¡Creado!',
      text: isEdit 
          ? 'El alumno se actualizó correctamente.' 
          : 'El alumno se creó correctamente.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  };

  // Definiciones de columnas
  const columns = [
    { header: "ID", accessor: "id_alumno" },
    { header: "DNI", accessor: "dni_alumno" },
    {
      header: "Nombre y Apellido",
      accessor: "nombre",
      cell: (item) => `${item.nombre_alumno} ${item.apellido_alumno}`,
    },
    {
      header: "Email (Login)",
      accessor: "email",
      cell: (item) => item.email || "Sin vincular",
    },
    {
      header: "Estado",
      accessor: "estado",
      cell: (item) => (
        <span
          className={`status-alumno ${item.estado?.toLowerCase() || "inactivo"}`}
        >
          {item.estado}
        </span>
      ),
    },
  ];

  // Calcular datos paginados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const alumnosPaginados = alumnosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(alumnosFiltrados.length / itemsPerPage);

  // Manejar cambio de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Manejar cambio de elementos por página
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Renderizar acciones
  const renderActions = (alumno) => (
    <div className="action-buttons">
      <button
        className="edit-button"
        onClick={() => handleOpenEditModal(alumno)}
        title="Editar"
      >
        <span className="material-symbols-outlined">edit</span>
      </button>
      <button
        className="delete-button"
        onClick={() => handleDelete(alumno.id_alumno)}
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
        <h2>Gestión de Alumnos</h2>
      </div>

      <div className="search-add-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, DNI o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="clear-search"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>
        <button className="add-button" onClick={handleOpenWizardModal}>
          <span className="material-symbols-outlined add-icon" style={{marginRight: '5px'}}>add</span>
          Agregar alumno
        </button>
      </div>

      <div className="list-container">
        <div className="list-header">
          <h3>Listado de Alumnos</h3>
          {!isLoading && (
            <span>
              {searchTerm 
                ? `${alumnosFiltrados.length} de ${alumnos.length} alumnos`
                : `Total: ${alumnos.length}`
              }
            </span>
          )}
        </div>

        <TableCrud
          columns={columns}
          data={alumnosPaginados}
          isLoading={isLoading}
          error={error}
          renderActions={renderActions}
          getKey={(alumno) => alumno.id_alumno}
        />

        {!isLoading && !error && alumnosFiltrados.length > 0 && (
          <Paginador
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={alumnosFiltrados.length}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      {showEditModal && (
        <AlumnoEditModal
          alumnoToEdit={currentAlumno}
          onClose={handleCloseModal}
          onSave={handleSaveSuccess}
        />
      )}

      {showWizardModal && (
        <AlumnoWizardModal
          onClose={handleCloseModal}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default Alumnos;