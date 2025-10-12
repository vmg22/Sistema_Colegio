import React from 'react';

const ButtonShowcase = () => {
  return (
    <div className="container my-5">
      <h2 className="mb-4">Sistema de Botones</h2>
      
      {/* Botones Primarios */}
      <div className="mb-5">
        <h4 className="mb-3">Botones Primarios</h4>
        <div className="d-flex gap-3 flex-wrap">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-primary" disabled>Primary Disabled</button>
          <button className="btn btn-primary btn-sm">Small Primary</button>
          <button className="btn btn-primary btn-lg">Large Primary</button>
          <button className="btn btn-outline-primary">Outline Primary</button>
        </div>
      </div>
      
      {/* Botones Secundarios */}
      <div className="mb-5">
        <h4 className="mb-3">Botones Secundarios</h4>
        <div className="d-flex gap-3 flex-wrap">
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-secondary" disabled>Secondary Disabled</button>
          <button className="btn btn-secondary btn-sm">Small Secondary</button>
          <button className="btn btn-secondary btn-lg">Large Secondary</button>
          <button className="btn btn-outline-secondary">Outline Secondary</button>
        </div>
      </div>
      
      {/* Botones de Estado */}
      <div className="mb-5">
        <h4 className="mb-3">Botones de Estado</h4>
        <div className="d-flex gap-3 flex-wrap">
          <button className="btn btn-success">Success Button</button>
          <button className="btn btn-warning">Warning Button</button>
          <button className="btn btn-danger">Error Button</button>
          <button className="btn btn-success btn-sm">Small Success</button>
          <button className="btn btn-warning btn-lg">Large Warning</button>
        </div>
      </div>
      
      {/* Botones con Iconos */}
      <div className="mb-5">
        <h4 className="mb-3">Botones con Iconos</h4>
        <div className="d-flex gap-3 flex-wrap">
          <button className="btn btn-primary">
            <i className="fas fa-plus"></i>
            Agregar Item
          </button>
          <button className="btn btn-secondary btn-icon">
            <i className="fas fa-cog"></i>
          </button>
          <button className="btn btn-success">
            <i className="fas fa-check"></i>
            Confirmar
          </button>
          <button className="btn btn-danger">
            <i className="fas fa-trash"></i>
            Eliminar
          </button>
        </div>
      </div>
      
      {/* Estados de Loading */}
      <div className="mb-5">
        <h4 className="mb-3">Estados de Carga</h4>
        <div className="d-flex gap-3 flex-wrap">
          <button className="btn btn-primary btn-loading">Cargando...</button>
          <button className="btn btn-secondary btn-loading">Procesando</button>
        </div>
      </div>
    </div>
  );
};

export default ButtonShowcase;