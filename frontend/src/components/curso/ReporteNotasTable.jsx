import React from "react";
import "../../styles/reporteNotasTable.css";

const ReporteNotasTable = ({ alumnos = [] }) => {
  const getNotaClass = (nota) => {
    if (nota >= 7) return "reporte-notas-nota-excelente";
    if (nota >= 4) return "reporte-notas-nota-regular";
    return "reporte-notas-nota-insuficiente";
  };

  const formatNota = (nota) => {
    if (nota === undefined || nota === null || isNaN(nota)) return "-";
    return Number(nota).toFixed(1);
  };

  const handleMouseEnter = (e, index) => {
    e.currentTarget.classList.add("reporte-notas-tr-hover");
  };

  const handleMouseLeave = (e, index) => {
    e.currentTarget.classList.remove("reporte-notas-tr-hover");
    if (index % 2 === 0) {
      e.currentTarget.classList.add("reporte-notas-tr-even");
    }
  };

  return (
    <div className="reporte-notas-container">
      <table className="reporte-notas-table">
        <thead>
          <tr>
            <th className="reporte-notas-th">DNI</th>
            <th className="reporte-notas-th">Nombre</th>
            <th className="reporte-notas-th">Apellido</th>
            <th className="reporte-notas-th">Nota 1</th>
            <th className="reporte-notas-th">Nota 2</th>
            <th className="reporte-notas-th">Nota 3</th>
            <th className="reporte-notas-th">Promedio</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.length > 0 ? (
            alumnos.map((item, index) => {
              const { alumno = {}, calificaciones } = item || {};
              const safeCalificaciones = calificaciones ?? {};
              
              const rowClass = index % 2 === 0 ? "reporte-notas-tr-even" : "";

              return (
                <tr
                  key={index}
                  className={rowClass}
                  onMouseEnter={(e) => handleMouseEnter(e, index)}
                  onMouseLeave={(e) => handleMouseLeave(e, index)}
                >
                  <td className="reporte-notas-td">{alumno.dni ?? "-"}</td>
                  <td className="reporte-notas-td">{alumno.nombre ?? "-"}</td>
                  <td className="reporte-notas-td">{alumno.apellido ?? "-"}</td>
                  <td className={`reporte-notas-td ${getNotaClass(safeCalificaciones.nota1)}`}>
                    {formatNota(safeCalificaciones.nota1)}
                  </td>
                  <td className={`reporte-notas-td ${getNotaClass(safeCalificaciones.nota2)}`}>
                    {formatNota(safeCalificaciones.nota2)}
                  </td>
                  <td className={`reporte-notas-td ${getNotaClass(safeCalificaciones.nota3)}`}>
                    {formatNota(safeCalificaciones.nota3)}
                  </td>
                  <td className={`reporte-notas-td reporte-notas-nota-promedio ${getNotaClass(safeCalificaciones.promedio)}`}>
                    {formatNota(safeCalificaciones.promedio)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="reporte-notas-td">
                No hay registros disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReporteNotasTable;