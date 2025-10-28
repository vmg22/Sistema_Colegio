import React from 'react';

/**
 * Componente de tabla genérico para los CRUDs.
 *
 * @param {Object} props
 * @param {string} props.title - Título de la tabla (ej: "Listado de Docentes").
 * @param {Array<string>} props.columns - Array de strings para los encabezados (ej: ['ID', 'Nombre', 'DNI']).
 * @param {Array<Object>} props.data - El array de datos a renderizar.
 * @param {boolean} props.isLoading - Estado de carga.
 * @param {string | null} props.error - Mensaje de error.
 * @param {function} props.renderRow - Función que recibe un item y devuelve un <tr>.
 * @param {string} [props.emptyMessage] - Mensaje si 'data' está vacío.
 */
const CrudTable = ({ 
  title, 
  columns, 
  data, 
  isLoading, 
  error, 
  renderRow, 
  emptyMessage = "No se encontraron datos." 
}) => {

  return (
    <div className="list-container">
      <div className="list-header">
        <h3>{title}</h3>
        {/* Mostramos el total solo si no hay error y no está cargando */}
        {!isLoading && !error && <span>Total: {data.length}</span>}
      </div>

      {/* Estado de Carga */}
      {isLoading && <p>Cargando...</p>}
      
      {/* Estado de Error */}
      {error && <p className="error-message">{error}</p>}
      
      {/* Estado de Datos (Tabla) */}
      {!isLoading && !error && (
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              // Mapeamos los datos y llamamos a la función 'renderRow'
              // que nos pasa el componente padre para CADA item.
              data.map(renderRow)
            ) : (
              // Estado Vacío
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CrudTable;