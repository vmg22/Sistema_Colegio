import React from 'react';
import '../../styles/paginador.css';

const Paginador = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  totalItems,
  onItemsPerPageChange 
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

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = Number(e.target.value);
    onItemsPerPageChange(newItemsPerPage);
    onPageChange(1); // Resetear a primera página
  };

  return (
    <div className="paginador-container-crud">
      <div className="paginador-info-crud">
        Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
      </div>
      
      <div className="paginador-controls-crud">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="paginador-button-crud paginador-button-first-crud"
          title="Primera página"
        >
          «
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="paginador-button-crud paginador-button-prev-crud"
          title="Anterior"
        >
          ‹
        </button>

        {startPage > 1 && (
          <>
            <button 
              onClick={() => onPageChange(1)} 
              className="paginador-button-crud paginador-button-page-crud"
            >
              1
            </button>
            {startPage > 2 && <span className="paginador-ellipsis-crud">...</span>}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`paginador-button-crud paginador-button-page-crud ${
              currentPage === page ? 'paginador-button-active-crud' : ''
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="paginador-ellipsis-crud">...</span>}
            <button 
              onClick={() => onPageChange(totalPages)} 
              className="paginador-button-crud paginador-button-page-crud"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="paginador-button-crud paginador-button-next-crud"
          title="Siguiente"
        >
          ›
        </button>
        
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="paginador-button-crud paginador-button-last-crud"
          title="Última página"
        >
          »
        </button>
      </div>

      <select 
        value={itemsPerPage} 
        onChange={handleItemsPerPageChange}
        className="paginador-select-crud"
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