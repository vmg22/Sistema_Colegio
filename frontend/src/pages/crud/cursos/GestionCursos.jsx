import React, { useState, useEffect, useMemo } from 'react';
import { getCursos, deleteCurso } from '../../../services/cursosService';
import CursoModal from '../../../components/modals/CursoModal';
import TableCrud from '../../../components/crud/TableCrud';
import Paginador from '../../../components/ui/Paginador';
import Swal from 'sweetalert2';
import '../../../styles/docentescrud.css';


const GestionCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [cursoAEditar, setCursoAEditar] = useState(null);
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCursos();
      setCursos(response.datos || []);
    } catch (err) {
      const errorMsg = err.message || 'Error al cargar los cursos.';
      setError(errorMsg);
      Swal.fire(
        "Error de Carga",
        errorMsg,
        "error"
      );
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
    setCursoAEditar(null);
  };

  const handleSave = () => {
    const isEdit = cursoAEditar !== null;
    
    handleCloseModal();
    cargarCursos(); 

    Swal.fire({
      title: isEdit ? "¡Actualizado!" : "¡Creado!",
      text: isEdit
        ? "El curso se actualizó correctamente."
        : "El curso se creó correctamente.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Quieres eliminar este curso?",
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
    setCurrentPage(1); // Resetear a página 1 al buscar
    cargarCursos();
  };

  // Filtrado memoizado
  const cursosFiltrados = useMemo(() => {
    return cursos.filter(curso => 
      searchTerm === '' || 
      curso.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.anio?.toString().includes(searchTerm) ||
      curso.division?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [cursos, searchTerm]); 

  // Calcular paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCursos = cursosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cursosFiltrados.length / itemsPerPage);

  const handlePageChange = (page, newItemsPerPage) => {
    if (newItemsPerPage) {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }
  };

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

  const renderActions = (curso) => {
    return (
      <>
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
        <h2 className='mx-4'>Gestión de Cursos</h2>
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
          data={currentCursos} 
          isLoading={loading}
          error={error}
          renderActions={renderActions}
          getKey={(curso) => curso.id_curso}
        />

        <Paginador
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={cursosFiltrados.length}
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