import React from "react";
import Table from "react-bootstrap/Table";
import "../../styles/reporteAsistenciaTable.css";

const ReporteAsistenciasTable = ({ alumnos = [] }) => {
  if (!alumnos.length) {
    return (
      <div className="reporte-table-container">
        <h5>No se encontraron registros de asistencia.</h5>
      </div>
    );
  }

  return (
    <div className="reporte-table-container">
      <h4 className="reporte-table-title">📋 Detalle de Asistencias por Alumno</h4>
      <Table responsive hover className="reporte-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Alumno</th>
            <th>Presentes</th>
            <th>Ausentes</th>
            <th>Tardes</th>
            <th>Total Clases</th>
            <th>Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((a, index) => {
            const presentes = Number(a.asistencias?.presentes || 0);
            const ausentes = Number(a.asistencias?.ausentes || 0);
            const tardes = Number(a.asistencias?.tardes || 0);
            const total = Number(a.asistencias?.total || 0);
            
            // Cálculo del porcentaje de asistencia
            const porc = total > 0 
              ? ((presentes / total) * 100).toFixed(1) 
              : "0.0";

            const isCritico = parseFloat(porc) < 75;
            const isExcelente = parseFloat(porc) >= 95;
            const isBueno = parseFloat(porc) >= 85;
            
            const rowClass = `reporte-table-row ${
              isCritico 
                ? 'reporte-table-row--critical' 
                : 'reporte-table-row--good'
            }`;

            return (
              <tr 
                key={a.alumno?.id || index} 
                className={rowClass}
              >
                <td>{index + 1}</td>
                <td className="reporte-table-alumno">
                  {a.alumno?.nombreCompleto || "—"}
                </td>
                <td className="reporte-table-presentes">
                  <span className="badge bg-success">{presentes}</span>
                </td>
                <td className="reporte-table-ausentes">
                  <span className="badge bg-danger">{ausentes}</span>
                </td>
                <td className="reporte-table-tardes">
                  <span className="badge bg-warning text-dark">{tardes}</span>
                </td>
                <td className="reporte-table-total">{total}</td>
                <td className="reporte-table-porcentaje">
                  <span className={`badge ${
                    isCritico 
                      ? 'bg-danger' 
                      : isExcelente 
                      ? 'bg-success' 
                      : isBueno 
                      ? 'bg-primary' 
                      : 'bg-warning text-dark'
                  }`}>
                    {porc}%
                  </span>
                  {" "}
                  {isCritico 
                    ? "⚠️" 
                    : isExcelente 
                    ? "🌟" 
                    : isBueno 
                    ? "✅" 
                    : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default ReporteAsistenciasTable;