import React from 'react';
import '../../styles/paginador.css';

const Paginador = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  totalItems 
}) => {
  const pages = [];
  const maxVisiblePages = 5;

  // Calcular rango de páginas visibles
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages === 0) return null;

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
      </div>
      
      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="pagination-button"
          title="Primera página"
        >
          «
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
          title="Anterior"
        >
          ‹
        </button>

        {startPage > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className="pagination-button">
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button onClick={() => onPageChange(totalPages)} className="pagination-button">
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
          title="Siguiente"
        >
          ›
        </button>
        
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-button"
          title="Última página"
        >
          »
        </button>
      </div>

      <select 
        value={itemsPerPage} 
        onChange={(e) => onPageChange(1, Number(e.target.value))}
        className="pagination-select"
      >
        <option value={10}>10 por página</option>
        <option value={25}>25 por página</option>
        <option value={50}>50 por página</option>
        <option value={100}>100 por página</option>
      </select>
    </div>
  );
};

export default Paginador;