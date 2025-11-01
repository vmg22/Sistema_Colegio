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
            <th>Total Clases</th>
            <th>Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((a, index) => {
            const presentes = Number(a.asistencias?.presentes || 0);
            const total = Number(a.asistencias?.total || 0);
            const ausentes = total - presentes;
            const porc = total > 0 ? ((presentes / total) * 100).toFixed(1) : 100;

            const isCritico = porc < 75;
            const rowClass = `reporte-table-row ${isCritico ? 'reporte-table-row--critical' : 'reporte-table-row--good'}`;

            return (
              <tr
                key={index}
                className={rowClass}
              >
                <td>{index + 1}</td>
                <td>{a.alumno?.nombreCompleto || "—"}</td>
                <td>{presentes}</td>
                <td>{ausentes}</td>
                <td>{total}</td>
                <td>
                  {porc}%{" "}
                  {isCritico ? "⚠️" : porc >= 95 ? "🌟" : porc >= 85 ? "✅" : ""}
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