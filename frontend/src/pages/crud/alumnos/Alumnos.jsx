import React, { useState, useEffect } from "react";
import LinkCrud from "../../../components/crud/LinkCrud";
import HeaderCrud from "../../../components/crud/HeaderCrud";
import InputBusqueda from "../../../components/crud/InputBusqueda";
import BtnVolver from "../../../components/ui/BtnVolver";
import TableCrud from "../../../components/crud/TableCrud";
import { getAllAlumnos } from "../../../services/alumnosService";

const Alumnos = () => {
  // Estado para manejar los datos
  const [alumnos, setAlumnos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Definiciones de columnas
  const columns = [
    { header: 'ID', accessor: 'id_alumno' },
    { header: 'DNI', accessor: 'dni_alumno' },
    
    { 
      header: 'Nombre y Apellido', 
      accessor: 'nombre',
      cell: (item) => `${item.nombre_alumno} ${item.apellido_alumno}`
    },
    { header: 'Email (Login)', accessor: 'email', cell: (item) => item.email || 'Sin vincular' },
    { 
      header: 'Estado', 
      accessor: 'estado',
      cell: (item) => (
        <span className={`status-badge ${item.estado?.toLowerCase() || 'inactivo'}`}>
          {item.estado}
        </span>
      )
    }
  ];

  // Renderizar acciones (editar, eliminar, etc.)
  const renderActions = (alumno) => (
    <div className="table-actions">
      <button className="action-btn edit" title="Editar">
        ✏️
      </button>
      <button className="action-btn delete" title="Eliminar">
        🗑️
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
    </div>
  );
};

export default Alumnos;