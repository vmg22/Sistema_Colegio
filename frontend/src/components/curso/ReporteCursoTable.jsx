import React from "react";
import "../../styles/reporteCursoTable.css";

const ReporteCursoTable = ({ alumnos = [] }) => {
  const getNotaClass = (nota) => {
    if (nota >= 7) return "reporte-curso-nota-excelente";
    if (nota >= 4) return "reporte-curso-nota-regular";
    return "reporte-curso-nota-insuficiente";
  };

  const getAsistenciaClass = (asistencia) => {
    const porcentaje = asistencia?.porcentaje ?? 0;
    if (porcentaje >= 85) return "reporte-curso-asistencia-excelente";
    if (porcentaje >= 70) return "reporte-curso-asistencia-regular";
    return "reporte-curso-asistencia-insuficiente";
  };

  const formatNota = (nota) => {
    if (nota === undefined || nota === null || isNaN(nota)) return "-";
    return Number(nota).toFixed(1);
  };

  const handleMouseEnter = (e, index) => {
    e.currentTarget.classList.add("reporte-curso-tr-hover");
  };

  const handleMouseLeave = (e, index) => {
    e.currentTarget.classList.remove("reporte-curso-tr-hover");
    if (index % 2 === 0) {
      e.currentTarget.classList.add("reporte-curso-tr-even");
    }
  };

  return (
    <div className="reporte-curso-container">
      <table className="reporte-curso-table">
        <thead>
          <tr>
            <th className="reporte-curso-th">DNI</th>
            <th className="reporte-curso-th">Nombre</th>
            <th className="reporte-curso-th">Apellido</th>
            <th className="reporte-curso-th">Nota 1</th>
            <th className="reporte-curso-th">Nota 2</th>
            <th className="reporte-curso-th">Nota 3</th>
            <th className="reporte-curso-th">Promedio</th>
            <th className="reporte-curso-th">Asistencia (%)</th>
            <th className="reporte-curso-th">Faltas</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.length > 0 ? (
            alumnos.map((item, index) => {
              const { alumno = {}, calificaciones, asistencias } = item || {};
              const safeCalificaciones = calificaciones ?? {};
              const safeAsistencias = asistencias ?? {};
              const asistenciaClass = getAsistenciaClass(safeAsistencias);
              const faltas = Number(safeAsistencias.ausentes ?? 0);

              const rowClass = index % 2 === 0 ? "reporte-curso-tr-even" : "";

              return (
                <tr
                  key={index}
                  className={rowClass}
                  onMouseEnter={(e) => handleMouseEnter(e, index)}
                  onMouseLeave={(e) => handleMouseLeave(e, index)}
                >
                  <td className="reporte-curso-td">{alumno.dni ?? "-"}</td>
                  <td className="reporte-curso-td">{alumno.nombre ?? "-"}</td>
                  <td className="reporte-curso-td">{alumno.apellido ?? "-"}</td>
                  <td className={`reporte-curso-td ${getNotaClass(safeCalificaciones.nota1)}`}>
                    {formatNota(safeCalificaciones.nota1)}
                  </td>
                  <td className={`reporte-curso-td ${getNotaClass(safeCalificaciones.nota2)}`}>
                    {formatNota(safeCalificaciones.nota2)}
                  </td>
                  <td className={`reporte-curso-td ${getNotaClass(safeCalificaciones.nota3)}`}>
                    {formatNota(safeCalificaciones.nota3)}
                  </td>
                  <td className={`reporte-curso-td reporte-curso-nota-promedio ${getNotaClass(safeCalificaciones.promedio)}`}>
                    {formatNota(safeCalificaciones.promedio)}
                  </td>
                  <td className={`reporte-curso-td reporte-curso-asistencia ${asistenciaClass}`}>
                    {safeAsistencias.porcentaje ?? 0}%
                  </td>
                  <td className="reporte-curso-td">{faltas}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="9" className="reporte-curso-td">
                No hay registros disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReporteCursoTable;