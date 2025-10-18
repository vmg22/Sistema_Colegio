import React, { useState } from 'react';
import { GestionDocentes } from '../../components/gestion/GestionDocentes';
// Asumo que tienes un CSS para los estilos de esta página
import '../../styles/Admin.css'; 

// Renombramos el componente a "Admin" para que coincida con tu archivo
export const Admin = () => {
  // Estado local para manejar la pestaña activa
  const [activeTab, setActiveTab] = useState('docentes'); // 'docentes' por defecto

  // Función para renderizar el contenido de la pestaña
  const renderTabContent = () => {
    switch (activeTab) {
      case 'alumnos':
        return <GestionAlumnos />;
      case 'docentes':
        return <GestionDocentes />;
      case 'materias':
        return <GestionMaterias />;
      case 'equivalencias':
        return <div>Contenido de Plan de Equivalencias</div>;
      default:
        return null;
    }
  };

  return (
    <div className="gestion-academica-container">
      {/* (Aquí iría tu <Header> o <Navbar> principal si no está en App.jsx) */}
      
      <div className="gestion-header">
        <h1>Gestión Académica</h1>
        <p>Administración de Alumnos, Docentes y Materias</p>
      </div>

      {/* Navegación de Pestañas (Tabs) */}
      <div className="tab-navigation">
        <button 
          className={activeTab === 'alumnos' ? 'active' : ''}
          onClick={() => setActiveTab('alumnos')}
        >
          Alumnos
        </button>
        <button 
          className={activeTab === 'docentes' ? 'active' : ''}
          onClick={() => setActiveTab('docentes')}
        >
          Docentes
        </button>
        <button 
          className={activeTab === 'materias' ? 'active' : ''}
          onClick={() => setActiveTab('materias')}
        >
          Materias
        </button>
        <button 
          className={activeTab === 'equivalencias' ? 'active' : ''}
          onClick={() => setActiveTab('equivalencias')}
        >
          Plan de Equivalencias
        </button>
      </div>

      {/* Contenido de la Pestaña Activa */}
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

// Exporta por defecto para que funcione con tu enrutador
export default Admin;