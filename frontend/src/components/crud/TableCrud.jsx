import React from 'react';
import '../../styles/docentescrud.css'; // Usa el mismo archivo CSS
import { Table } from 'react-bootstrap';

/**
 * Un componente de tabla reutilizable.
 * @param {Array} columns - Array de objetos: { header: 'Titulo', accessor: 'clave_dato', cell?: (value) => ReactNode }
 * @param {Array} data - Array de objetos con los datos.
 * @param {Function} renderActions - Función (item) => ReactNode, para renderizar botones de acción.
 * @param {Boolean} isLoading - Si está cargando.
 * @param {String} error - Mensaje de error.
 * @param {Function} getKey - Función (item) => item.id, para la 'key' de React.
 */
function TableCrud({ columns, data, renderActions, isLoading, error, getKey }) {

  if (isLoading) {
    return <div>Cargando datos...</div>; // Puedes poner un spinner
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!data || data.length === 0) {
    return <div>No se encontraron datos.</div>;
  }

  return (
    <div className="tabla-container">
      <table className="styled-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header}>{col.header}</th>
            ))}
            {renderActions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={getKey(item)}>
              {columns.map((col) => (
                <td key={col.accessor}>
                  {/* Si la columna tiene una función 'cell', la usamos. Si no, mostramos el dato. */}
                  {col.cell ? col.cell(item[col.accessor]) : item[col.accessor]}
                </td>
              ))}
              {renderActions && (
                <td className="actions-cell">
                  {renderActions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableCrud;