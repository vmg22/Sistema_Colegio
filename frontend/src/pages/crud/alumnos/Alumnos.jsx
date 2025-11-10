import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BtnVolver from "../../../components/ui/BtnVolver";
import TableCrud from "../../../components/crud/TableCrud";
import { getAllAlumnos, deleteAlumno } from "../../../services/alumnosService";
import AlumnoEditModal from "../../../components/modals/AlumnoEditModal";
import AlumnoWizardModal from "../../../components/modals/AlumnoWizardModal";
import "../../../styles/alumnocrud.css"
const Alumnos = () => {
  // Estados
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAlumno, setCurrentAlumno] = useState(null);
  
  const navigate = useNavigate();

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
      setError(err.message || 'Error al cargar alumnos.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadAlumnos();
  }, []);

  // Filtrar alumnos en tiempo real cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      // Si no hay búsqueda, mostrar todos
      setAlumnosFiltrados(alumnos);
      setError(null);
    } else {
      // Filtrar por término de búsqueda
      const term = searchTerm.toLowerCase();
      const filtered = alumnos.filter(alumno => 
        alumno.nombre_alumno?.toLowerCase().includes(term) ||
        alumno.apellido_alumno?.toLowerCase().includes(term) ||
        alumno.dni_alumno?.includes(term) ||
        alumno.email?.toLowerCase().includes(term)
      );
      
      setAlumnosFiltrados(filtered);
      
      // Mostrar mensaje si no hay resultados
      if (filtered.length === 0) {
        setError("No se encontraron alumnos que coincidan con la búsqueda.");
      } else {
        setError(null);
      }
    }
  }, [searchTerm, alumnos]); // Se ejecuta cada vez que cambia searchTerm o alumnos

  // Limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Eliminar alumno
  const handleDelete = async (id_alumno) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este alumno?')) {
      try {
        await deleteAlumno(id_alumno);
        loadAlumnos(); // Recargar la lista completa
      } catch (err) {
        setError(err.message || 'No se pudo eliminar el alumno.');
      }
    }
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

  // Al guardar exitosamente
  const handleSaveSuccess = () => {
    handleCloseModal();
    setSearchTerm(""); // Limpiar búsqueda
    loadAlumnos(); // Recargar lista
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

  // Renderizar acciones
  const renderActions = (alumno) => (
    <div className="table-actions">
      <button
        onClick={() => navigate(`/alumnos/${alumno.id_alumno}`)}
        className="action-button view"
        title="Ver Perfil"
      >
        <span className="material-symbols-outlined">visibility</span>
      </button>
      <button
        onClick={() => handleOpenEditModal(alumno)}
        className="action-button edit"
        title="Editar"
      >
        <span className="material-symbols-outlined">edit</span>
      </button>
      <button
        onClick={() => handleDelete(alumno.id_alumno)}
        className="action-button delete"
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

      {/* Barra de Búsqueda */}
      <div className="search-add-bar">
        <div className="search-box">
          <span className="search-icon">👤</span>
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

      {/* Contenedor de la Tabla */}
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
          data={alumnosFiltrados}
          isLoading={isLoading}
          error={error}
          renderActions={renderActions}
          getKey={(alumno) => alumno.id_alumno}
        />
      </div>

      {/* Modal de Edición */}
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