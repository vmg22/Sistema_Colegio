import React from 'react';
import '../../styles/docentescrud.css'; // Usa el mismo archivo CSS

function TableCrud({ columns, data, renderActions, isLoading, error, getKey }) {
  
  const colCount = columns.length + (renderActions ? 1 : 0);

  return (
    // 1. Usamos 'data-table' para que coincida con tu CSS
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.header}>{col.header}</th>
          ))}
          {renderActions && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {/* 2. Lógica de carga, error y vacío movida DENTRO del tbody */}
        {isLoading ? (
          <tr>
            <td colSpan={colCount} style={{ textAlign: 'center' }}>
              Cargando datos...
            </td>
          </tr>
        ) : error ? (
          <tr>
            <td colSpan={colCount} style={{ textAlign: 'center' }}>
              <div className="error-message">Error: {error}</div>
            </td>
          </tr>
        ) : !data || data.length === 0 ? (
          <tr>
            <td colSpan={colCount} style={{ textAlign: 'center' }}>
              No se encontraron datos.
            </td>
          </tr>
        ) : (
          // 3. Renderizado de datos (tu lógica original)
          data.map((item) => (
            <tr key={getKey(item)}>
              {columns.map((col) => (
                <td key={col.accessor}>
                  {col.cell ? col.cell(item) : item[col.accessor]}
                </td>
              ))}
              {renderActions && (
                <td className="actions-cell">
                  {renderActions(item)}
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default TableCrud;