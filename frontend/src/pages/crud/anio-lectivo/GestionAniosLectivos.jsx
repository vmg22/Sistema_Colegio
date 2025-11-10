import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // <-- Ya estaba importado, perfecto
import {
  getAniosLectivos,
  deleteAnioLectivo,
} from "../../../services/aniosServices";
import AnioLectorModal from "../../../components/modals/AnioLectivoModal";
import TableCrud from "../../../components/crud/TableCrud";
import "../../../styles/docentescrud.css";
import BtnVolver from "../../../components/ui/BtnVolver";

const GestionAniosLectivos = () => {
  const navigate = useNavigate();
  const [aniosLectivos, setAniosLectivos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [anioAEditar, setAnioAEditar] = useState(null);

  const loadAnios = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAniosLectivos();
      setAniosLectivos(response.datos || response || []);
    } catch (err) {
      setError(err.message || "Error al cargar los años lectivos.");
      // Mostramos un Swal de error si falla la carga inicial
      Swal.fire(
        "Error",
        err.message || "Error al cargar los años lectivos.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnios();
  }, []);

  const filteredAnios = useMemo(() => {
    if (!searchTerm) {
      return aniosLectivos;
    }
    return aniosLectivos.filter((anio) =>
      String(anio.anio).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, aniosLectivos]);

  const handleSearch = () => {
    loadAnios();
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

  // <-- MODIFICADO: Notificación de éxito al guardar (Crear / Editar) -->
  const handleSaveSuccess = () => {
    // Verificamos si era una edición o creación ANTES de cerrar el modal
    const isEdit = anioAEditar !== null;
    
    handleCloseModal();
    loadAnios();

    // Mostramos la alerta de éxito
    Swal.fire({
      title: isEdit ? "¡Actualizado!" : "¡Creado!",
      text: isEdit
        ? "El año lectivo se actualizó correctamente."
        : "El año lectivo se creó correctamente.",
      icon: "success",
      timer: 1500, // Se cierra solo después de 1.5 seg
      showConfirmButton: false,
    });
  };

  // <-- MODIFICADO: Notificación de confirmación y resultado al Eliminar -->
  const handleDelete = async (id) => {
    // 1. Pedir confirmación
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se eliminará el año lectivo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      // 2. Si confirma...
      if (result.isConfirmed) {
        try {
          // 3. Intentar eliminar
          await deleteAnioLectivo(id);
          
          // 4. Notificar éxito
          Swal.fire(
            "¡Eliminado!",
            "El año lectivo ha sido eliminado.",
            "success"
          );
          
          // 5. Recargar datos
          loadAnios();

        } catch (err) {
          // 6. Notificar error
          Swal.fire(
            "Error",
            err.message || "No se pudo eliminar el año lectivo.",
            "error"
          );
        }
      }
    });
  };

  const columns = [
    { header: "Año", accessor: "anio" },
    {
      header: "Fecha Inicio",
      accessor: "fecha_inicio",
      cell: (row) => new Date(row.fecha_inicio).toLocaleDateString(),
    },
    {
      header: "Fecha Fin",
      accessor: "fecha_fin",
      cell: (row) => new Date(row.fecha_fin).toLocaleDateString(),
    },
    {
      header: "Estado",
      accessor: "estado",
      cell: (row) => (
        <span className={`status-badge ${row.estado?.toLowerCase()}`}>
          {row.estado}
        </span>
      ),
    },
  ];

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

  return (
    <div className="gestion-page-container">
      <div className="gestion-header">
        <BtnVolver />
        <h2 className="mx-4">Gestión de Años Lectivos</h2>
      </div>

      <div className="search-add-bar">
        <div className="search-box">
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            placeholder="Buscar año lectivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={handleSearch} className="search-button">
          Buscar
        </button>
        <button onClick={handleOpenCreate} className="add-button">
          <span
            className="material-symbols-outlined add-icon"
            style={{ marginRight: "5px" }}
          >
            add
          </span>
          Nuevo Año Lectivo
        </button>
      </div>

      <div className="list-container">
        <div className="list-header">
          <h3>Listado de Años Lectivos</h3>
          {!isLoading && !error && <span>Total: {filteredAnios.length}</span>}
        </div>

        <TableCrud
          columns={columns}
          data={filteredAnios}
          isLoading={isLoading}
          error={error} // El componente TableCrud debería saber mostrar este error
          renderActions={renderActions}
          getKey={(item) => item.id_anio_lectivo}
          emptyMessage="No se encontraron años lectivos."
        />
      </div>

      {showModal && (
        <AnioLectorModal
          show={showModal}
          onHide={handleCloseModal}
          onSave={handleSaveSuccess} // Esta función ahora dispara el Swal
          anioAEditar={anioAEditar}
        />
      )}
    </div>
  );
};

export default GestionAniosLectivos;