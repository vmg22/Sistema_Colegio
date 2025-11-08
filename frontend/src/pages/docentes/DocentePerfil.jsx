import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import * as docenteService from "../../services/docenteService";
import * as asignacionService from "../../services/asignacionService";
import * as materiaService from "../../services/materiasServices";
import * as cursoService from "../../services/cursosService";

import TableCrud from "../../components/crud/TableCrud";
import AsignacionModal from "../../components/modals/AsignacionModal";

import "../../styles/docentescrud.css";
import "../../styles/docenteperfil.css";

const DocentePerfil = () => {
  const { id } = useParams(); // El ID del docente desde la URL
  const navigate = useNavigate();

  // --- Estados del Perfil ---
  const [docente, setDocente] = useState(null);
  const [asignaciones, setAsignaciones] = useState([]); 

  // --- Estados para los Dropdowns de los Modales ---
  const [materiasList, setMateriasList] = useState([]);
  const [cursosList, setCursosList] = useState([]);

  // --- Estados de Carga y Error ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Estados de los Modales ---
  const [showEditPerfilModal, setShowEditPerfilModal] = useState(false);
  const [showAsignacionModal, setShowAsignacionModal] = useState(false);
  const [asignacionToEdit, setAsignacionToEdit] = useState(null);

  // --- Carga de Datos ---
  const fetchData = async () => {
    try {
      if (!id) return;
      setIsLoading(true);
      setError(null);

      // 4. Cargamos todo en paralelo
      const [docenteData, asignacionesData, materiasData, cursosData] =
        await Promise.all([
          docenteService.getDocenteById(id),
          asignacionService.getAsignaciones({ id_docente: id }),
          materiaService.getMaterias(),
          cursoService.getCursos(),
        ]);

      setDocente(docenteData);
      setAsignaciones(asignacionesData);
      setMateriasList(materiasData);
      setCursosList(cursosData);
    } catch (err) {
      setError(err.message || "Error al cargar los datos del perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]); // Se recarga si el ID cambia

  // --- Handlers para Asignaciones ---
  const handleOpenAsignacionModal = (asignacion = null) => {
    setAsignacionToEdit(asignacion);
    setShowAsignacionModal(true);
  };

  const handleCloseModal = () => {
    setShowEditPerfilModal(false);
    setShowAsignacionModal(false);
    setAsignacionToEdit(null);
  };

  const handleSave = () => {
    handleCloseModal();
    fetchData(); // Recarga toda la data de la página
  };

  const handleDeleteAsignacion = async (id_asignacion) => {
    if (window.confirm("¿Estás seguro de quitar esta asignación?")) {
      try {
        await asignacionService.deleteAsignacion(id_asignacion);
        fetchData(); // Recarga
      } catch (err) {
        setError(err.message || "No se pudo eliminar la asignación.");
      }
    }
  };

  // --- Definiciones de la Tabla de Asignaciones ---
  const columnsAsignaciones = [
    { header: "ID", accessor: "id_asignacion" },
    { header: "Materia", accessor: "materia_nombre" },
    {
      header: "Curso",
      accessor: "curso_nombre",
      cell: (item) =>
        `${item.curso_nombre} (${item.curso_anio}° ${item.curso_division})`,
    },
    { header: "Año Lectivo", accessor: "anio_lectivo" },
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

  const renderAsignacionActions = (asignacion) => (
    <>
      <button
        onClick={() => handleOpenAsignacionModal(asignacion)}
        className="action-button edit"
        title="Editar Año/Estado"
      >
        <span className="material-symbols-outlined">edit</span>
      </button>
      <button
        onClick={() => handleDeleteAsignacion(asignacion.id_asignacion)}
        className="action-button delete"
        title="Eliminar Asignación"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </>
  );

  // --- Renderizado de la Página ---
  if (isLoading)
    return (
      <div className="gestion-page-container">
        <p>Cargando perfil...</p>
      </div>
    );
  // No mostramos el error principal si solo es un error de carga de asignaciones
  if (error && !docente)
    return (
      <div className="gestion-page-container">
        <p className="error-message">{error}</p>
      </div>
    );
  if (!docente)
    return (
      <div className="gestion-page-container">
        <p>Docente no encontrado.</p>
      </div>
    );

  return (
    <div className="gestion-page-container">
      {/* Header (Tu código - sin cambios) */}
      <div className="gestion-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← VOLVER
        </button>
        <h2>Perfil del Docente</h2>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="perfil-banner">
        <div className="avatar-icon">
          {docente.nombre?.charAt(0).toUpperCase() || "D"}
        </div>
        <div className="docente-info">
          <h3>
            {docente.nombre} {docente.apellido}
          </h3>
          <p className="docente-username">
            @{docente.username || "sin-usuario"}
          </p>
        </div>
      </div>

      {/* --- 2. GRID PRINCIPAL (Tu 'perfil-card' renombrado) --- */}
      <div className="perfil-grid">
        {/* Caja Izquierda: Información Docente */}
        <div className="perfil-info-box">
          <h4>Información Docente</h4>

          <dl>
            <dt>Nombre y Apellido</dt>
            <dd>
              {docente.nombre} {docente.apellido}
            </dd>

            <dt>DNI</dt>
            <dd>{docente.dni_docente}</dd>

            <dt>Email de Contacto</dt>
            <dd>{docente.email || "N/A"}</dd>

            <dt>Teléfono</dt>
            <dd>{docente.telefono || "N/A"}</dd>

            <dt>Fecha de Inscripción</dt>
            <dd>{new Date(docente.created_at).toLocaleDateString()}</dd>

            <dt>Estado</dt>
            <dd>
              <span
                className={`status-badge ${
                  docente.estado_docente?.toLowerCase() || "inactivo"
                }`}
              >
                {docente.estado_docente}
              </span>
            </dd>
          </dl>
        </div>

        {/* Caja Derecha: Materias Asignadas */}
        <div className="perfil-cursos-box">
          <h4>Curso - Materias Asignadas</h4>
          <ul className="materias-list">
            {asignaciones.length > 0 ? (
              asignaciones.map((asig) => (
                <li key={asig.id_asignacion}>
                  {asig.materia_nombre} - {asig.curso_anio}°{" "}
                  {asig.curso_division}
                </li>
              ))
            ) : (
              <li>No hay materias asignadas.</li>
            )}
          </ul>
        </div>
      </div>

      {/* --- Sección de Carga Horaria (Asignaciones) --- */}
      <div className="list-container">
        <div className="list-header">
          <h3>Carga Horaria (Asignaciones)</h3>
          <button
            onClick={() => handleOpenAsignacionModal()}
            className="add-button"
          >
            <span className="add-icon"></span>
            Asignar Materia/Curso
          </button>
        </div>

        <TableCrud
          columns={columnsAsignaciones}
          data={asignaciones}
          isLoading={isLoading} // El loading principal ya pasó
          error={null} // El error se maneja arriba
          renderActions={renderAsignacionActions}
          getKey={(item) => item.id_asignacion}
          emptyMessage="Este docente no tiene materias asignadas."
        />
      </div>

      {/* --- Modales --- */}

      {/* Modal para CREAR o EDITAR una ASIGNACIÓN */}
      {showAsignacionModal && (
        <AsignacionModal
          onClose={handleCloseModal}
          onSave={handleSave}
          docente={docente}
          cursosList={cursosList}
          materiasList={materiasList.materias || []}
          asignacionToEdit={asignacionToEdit}
        />
      )}
    </div>
  );
};

export default DocentePerfil;
