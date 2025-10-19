import React, { useState, useEffect } from 'react';
import { useDocentes } from '../../context/DocenteContext';
import  AgregarDocenteModal  from '../modals/AgregarDocenteModal';
// Asumo que tienes un componente de tabla reutilizable
// import { Tabla } from '../ui/Tablas'; 
import '../../styles/gestion.css'
const GestionDocentes = () => {
  // Estado local para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado global de docentes
  const { docentes, getDocentes } = useDocentes();

  // useEffect para cargar datos (la forma moderna)
  useEffect(() => {
    getDocentes();
  }, []); // El array vacío [] significa "ejecutar solo al montar"

  return (
    <div>
      {/* Barra de herramientas (como en tu foto) */}
      <div className="gestion-toolbar">
        <input type="text" placeholder="Buscar docente" />
        <button>Buscar</button>
        <button className="btn-agregardocente" onClick={() => setIsModalOpen(true)}>
          Agregar docente
        </button>
      </div>

      {/* Tabla de Docentes */}
      <table className="gestion-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre y Apellido</th>
            <th>DNI</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {docentes.map((docente) => (
            <tr key={docente.id_docente}>
              <td>{docente.id_docente}</td>
              <td>{`${docente.nombre} ${docente.apellido}`}</td>
              <td>{docente.dni_docente}</td>
              <td>{docente.estado}</td>
              <td>
                <button>Editar</button>
                <button>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* El Modal (solo se renderiza si está abierto) */}
      <AgregarDocenteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default GestionDocentes