// 1. Importa 'useMemo' desde React
import React, { useMemo } from "react";
import BtnVolver from "../../components/ui/BtnVolver";
import EncabezadoCurso from "../../components/curso/EncabezadoCurso";
import { useConsultaStore } from "../../store/consultaStore";
import Table from "react-bootstrap/Table";
// ... tus imports de CSS y Spinner (asumo que Spinner está importado)

const CargaCalificaciones = () => {
  const {
    reporteCurso,
    selectedCursoNombre,
    selectedMateriaNombre,
    selectedPeriodoNombre,
    selectedAnioNombre,
  } = useConsultaStore();

  // Dejamos tu Spinner (con la mejora que te sugerí antes)
  if (!selectedCursoNombre || !selectedMateriaNombre || !reporteCurso) {
    return (
      <div className="encabezado-curso-card">
        {/* <Spinner animation="border" variant="primary" /> */}
        <p>Cargando...</p>
      </div>
    );
  }

  // 2. CREAMOS LA LISTA ORDENADA CON useMemo
  const alumnosOrdenados = useMemo(() => {
    if (!reporteCurso.alumnos) {
      return [];
    }

    return [...reporteCurso.alumnos].sort((a, b) => {
      return a.alumno.nombreCompleto.localeCompare(b.alumno.nombreCompleto);
    });
  }, [reporteCurso.alumnos]); // Solo se ejecuta si cambia el array.

  const totalAlumnos = reporteCurso?.totalAlumnos || 0;
  console.log(reporteCurso);

  return (
    <div className="curso-dashboard-container">
      <BtnVolver />

      {/* Encabezado */}
      <EncabezadoCurso />

      <div>
        <input type="text" />
        <button>Buscar alumno</button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Alumno</th>
            <th>Nota 1</th>
            <th>Nota 2</th>
            <th>Nota 3</th>
            <th>Promedio</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {alumnosOrdenados.map((item) => (
            <tr key={item.alumno.id}>
              <td>{item.alumno.id}</td>
              <td>{item.alumno.nombreCompleto}</td>
              <td>{item.calificaciones?.nota1 ?? "-"}</td>
              <td>{item.calificaciones?.nota2 ?? "-"}</td>
              <td>{item.calificaciones?.nota3 ?? "-"}</td>
              <td>{item.calificaciones?.promedio ?? "-"}</td>
              <td>
                <button className="btn btn-warning">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CargaCalificaciones;
