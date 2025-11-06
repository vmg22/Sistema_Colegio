import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LinkCrud from "../../../components/crud/LinkCrud";
import HeaderCrud from "../../../components/crud/HeaderCrud";
import InputBusqueda from "../../../components/crud/InputBusqueda";
import BtnVolver from "../../../components/ui/BtnVolver";
import TableCrud from "../../../components/crud/TableCrud";
import { getAllAlumnos, getAlumnoId } from "../../../services/alumnosService";
import DocenteEditModal from "../../../components/modals/DocenteEditModal";

const Alumnos = () => {
  // Estado para manejar los datos
  const [alumnos, setAlumnos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWizardModal, setShowWizardModal] = useState(false); // Para el alta
  const [showEditModal, setShowEditModal] = useState(false); // Para editar
  const [currentAlumno, setCurrentAlumno] = useState(null); // Para editar
  const navigate = useNavigate();
  // Cargar datos al montar el componente
  useEffect(() => {
    const getAlumnos = async () => {
      try {
        setIsLoading(true);
        const data = await getAllAlumnos();
        console.log(data);
        setAlumnos(data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar alumnos:", err);
        setError("Error al cargar los alumnos");
      } finally {
        setIsLoading(false);
      }
    };

    getAlumnos();
  }, []);

  const loadAlumnos = async () => {
          setIsLoading(true);
          setError(null);
          try {
              const params = {};
              if (searchTerm.trim() !== '') {
                  params.buscar = searchTerm.trim();
              }
              const data = await getAlumnoId(params);
              setDocentes(data); 
  
              if (data.length === 0 && searchTerm.trim() !== '') {
                   setError("No se encontraron docentes.");
              }
          } catch (err) {
              setError(err.message || 'Error al cargar docentes.');
          } finally {
              setIsLoading(false);
          }
      };
  
      useEffect(() => { loadDocentes(); }, []); 
      const handleSearch = () => { loadDocentes(); };
  
      const handleDelete = async (id_docente) => {
          if (window.confirm('¿Estás seguro de que quieres eliminar este docente?')) {
              try {
                  await docenteService.deleteDocente(id_docente);
                  loadDocentes(); 
              } catch (err) {
                  setError(err.message || 'No se pudo eliminar el docente.');
              }
          }
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
          className={`status-badge ${item.estado?.toLowerCase() || "inactivo"}`}
        >
          {item.estado}
        </span>
      ),
    },
  ];

  const handleOpenEditModal = (alumno) => {
    setCurrentAlumno(alumno);
    setShowWizardModal(false);
    setShowEditModal(true);
  };
  const handleCloseModal = () => {
    setShowWizardModal(false);
    setShowEditModal(false);
    setCurrentAlumno(null);
  };

  const handleSaveSuccess = () => {
    handleCloseModal();
    setSearchTerm("");
    loadDocentes();
  };

  // Renderizar acciones (editar, eliminar, etc.)
  const renderActions = (alumno) => (
    <div className="table-actions">
      {console.log(alumno)}
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
      <button className="action-button delete" title="Eliminar">
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
          <input type="text" placeholder="Buscar alumno..." />
        </div>
        <button className="search-button">Buscar</button>
        <button className="add-button">
          <span className="add-icon"></span>
          Agregar alumno
        </button>
      </div>

      {/* Contenedor de la Tabla */}
      <div className="list-container">
        <div className="list-header">
          <h3>Listado de Alumnos</h3>
          {!isLoading && !error && <span>Total: {alumnos.length}</span>}
        </div>

        <TableCrud
          columns={columns}
          data={alumnos}
          isLoading={isLoading}
          error={error}
          renderActions={renderActions}
          getKey={(alumno) => alumno.id_alumno}
        />
      </div>

      {showEditModal && (
        <DocenteEditModal
          docenteToEdit={currentAlumno}
          onClose={handleCloseModal}
          onSave={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default Alumnos;
