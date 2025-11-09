import React, { useState, useEffect } from 'react';
import { getCursos, deleteCurso } from '../../../services/cursosService';
import CursoModal from '../../../components/modals/CursoModal';
import TableCrud from '../../../components/crud/TableCrud';
import Swal from 'sweetalert2';
import '../../../styles/docentescrud.css';

const GestionCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [cursoAEditar, setCursoAEditar] = useState(null);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCursos();
      setCursos(response.datos || []);
    } catch (err) {
      setError(err.message || 'Error al cargar los cursos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCursos();
  }, []);

  const handleOpenCreate = () => {
    setCursoAEditar(null);
    setShowModal(true);
  };

  const handleOpenEdit = (curso) => {
    setCursoAEditar(curso);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    handleCloseModal();
    cargarCursos(); 
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará el curso (borrado lógico).",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCurso(id);
          Swal.fire('¡Eliminado!', 'El curso ha sido eliminado.', 'success');
          cargarCursos();
        } catch (err) {
          Swal.fire('Error', err.response?.data?.mensaje || 'No se pudo eliminar.', 'error');
        }
      }
    });
  };

  const handleSearch = () => {
    cargarCursos();
  };

  // Filtrar cursos por búsqueda
  const cursosFiltrados = cursos.filter(curso => 
    searchTerm === '' || 
    curso.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curso.anio?.toString().includes(searchTerm) ||
    curso.division?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Definición de columnas para TableCrud
  const columns = [
    { 
      header: 'Nombre', 
      accessor: 'nombre' 
    },
    { 
      header: 'Año', 
      accessor: 'anio', 
      cell: (item) => `${item.anio}°` 
    },
    { 
      header: 'División', 
      accessor: 'division', 
      cell: (item) => `"${item.division}"` 
    },
    { 
      header: 'Turno', 
      accessor: 'turno', 
      cell: (item) => item.turno ? item.turno.charAt(0).toUpperCase() + item.turno.slice(1) : '' 
    },
    { 
      header: 'Estado', 
      accessor: 'estado', 
      cell: (item) => (
        <span className={`status-badge ${item.estado?.toLowerCase()}`}>
          {item.estado}
        </span>
      ) 
    }
  ];

  // Función para renderizar los botones de acción
  const renderActions = (curso) => {
    return (
      <>
        <button 
          onClick={() => handleOpenEdit(curso)} 
          className="action-button view"
          title="Ver Curso"
        >
          <span className="material-symbols-outlined">visibility</span>
        </button>
        <button 
          onClick={() => handleOpenEdit(curso)} 
          className="action-button edit"
          title="Editar"
        >
          <span className="material-symbols-outlined">edit</span>
        </button>
        <button 
          onClick={() => handleDelete(curso.id_curso)} 
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
      {/* Header */}
      <div className="gestion-header">
        <button onClick={() => window.history.back()} className="back-button">
          ← VOLVER
        </button>
        <h2>Gestión de Cursos</h2>
      </div>

      {/* Barra de búsqueda y botones */}
      <div className="search-add-bar">
        <div className="search-box">
          <span className="material-symbols-outlined search-icon">search</span>
          <input 
            type="text"
            placeholder="Buscar curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <button onClick={handleSearch} className="search-button">
          Buscar
        </button>

        <button onClick={handleOpenCreate} className="add-button">
          <span className="material-symbols-outlined add-icon" style={{marginRight: '5px'}}>add</span>Nuevo Curso
        </button>
      </div>

      {/* Contenedor de la tabla */}
      <div className="list-container">
        <div className="list-header">
          <h3>Listado de Cursos</h3>
          {!loading && !error && <span>Total: {cursosFiltrados.length}</span>}
        </div>

        <TableCrud
          columns={columns}
          data={cursosFiltrados}
          isLoading={loading}
          error={error}
          renderActions={renderActions}
          getKey={(curso) => curso.id_curso}
        />
      </div>

      <CursoModal
        show={showModal}
        onHide={handleCloseModal}
        onSave={handleSave}
        cursoAEditar={cursoAEditar}
      />
    </div>
  );
};

export default GestionCursos;