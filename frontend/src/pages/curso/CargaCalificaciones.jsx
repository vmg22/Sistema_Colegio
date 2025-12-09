import React, { useEffect, useMemo, useState, useCallback } from "react";
import BtnVolver from "../../components/ui/BtnVolver";
import EncabezadoCurso from "../../components/curso/EncabezadoCurso";
import { useConsultaStore } from "../../store/consultaStore";
import { getReporteCurso } from "../../services/reportesService";
import { Spinner } from "react-bootstrap";
import Swal from "sweetalert2"; // <-- 1. IMPORTADO
import "../../styles/cargaCalificaciones.css";
import ModalEditarCalificacion from "../../components/curso/ModalEditarCalificacion";

const CargaCalificaciones = () => {
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setAlumnoSeleccionado(null);
  };
  const handleShow = () => setShow(true);

  const {
    reporteCurso,
    selectedCursoNombre,
    selectedMateriaNombre,
    setReporteCurso,
  } = useConsultaStore();

  const [searchTerm, setSearchTerm] = useState("");

  // Extraemos los filtros una sola vez
  const filtros = reporteCurso?.filtros;

  // Memoizar los valores de los filtros
  const filtrosMemorizados = useMemo(() => {
    if (!filtros) return null;
    return {
      curso: filtros.curso,
      materia: filtros.materia,
      anioLectivo: filtros.anioLectivo,
      cuatrimestre: filtros.cuatrimestre,
    };
  }, [filtros?.curso, filtros?.materia, filtros?.anioLectivo, filtros?.cuatrimestre]);

  // Carga de datos
  useEffect(() => {
    const traerAlumnos = async () => {
      if (!filtrosMemorizados) return;
      
      const { curso, materia, anioLectivo, cuatrimestre } = filtrosMemorizados;
      
      if (!curso || !materia || !anioLectivo || !cuatrimestre) {
        return;
      }

      try {
        const data = await getReporteCurso(curso, materia, anioLectivo, cuatrimestre);
        setReporteCurso(data);
      } catch (error) {
        console.error("Error al traer los alumnos:", error);
        // <-- 2. ALERTA DE ERROR EN CARGA -->
        Swal.fire(
          "Error",
          error.message || "No se pudo cargar la lista de alumnos.",
          "error"
        );
      }
    };
    
    traerAlumnos();
  }, [filtrosMemorizados, setReporteCurso]); // Dependencia de setReporteCurso eliminada en tu código original

  if (
    !selectedCursoNombre ||
    !selectedMateriaNombre ||
    !reporteCurso ||
    !reporteCurso.alumnos
  ) {
    return (
      <div className="encabezado-curso-card">
        <Spinner animation="border" variant="primary" />
        <p>Cargando...</p>
      </div>
    );
  }

  const alumnosParaMostrar = useMemo(() => {
    if (!reporteCurso.alumnos) {
      return [];
    }
    const alumnosOrdenados = [...reporteCurso.alumnos].sort((a, b) => {
      return a.alumno.nombreCompleto.localeCompare(b.alumno.nombreCompleto);
    });
    if (!searchTerm) {
      return alumnosOrdenados;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return alumnosOrdenados.filter((item) => {
      const dniString = String(item.alumno.dni ?? "");
      return dniString.toLowerCase().includes(lowerCaseSearchTerm);
    });
  }, [reporteCurso.alumnos, searchTerm]);

  const handleAbrirModal = (item) => {
    setAlumnoSeleccionado(item);
    handleShow();
  };

  // <-- 3 y 4. ALERTAS DE ÉXITO Y ERROR AL GUARDAR/RECARGAR -->
  const handleSaveSuccess = useCallback(async () => {
    if (!filtrosMemorizados) return;
    
    const { curso, materia, anioLectivo, cuatrimestre } = filtrosMemorizados;

    try {
      const data = await getReporteCurso(curso, materia, anioLectivo, cuatrimestre);
      setReporteCurso(data);
      
      // 3. ALERTA DE ÉXITO
      Swal.fire({
        title: "¡Guardado!",
        text: "Las calificaciones se actualizaron correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
      
    } catch (error) {
      console.error("Error al recargar los datos:", error);
      // 4. ALERTA DE ERROR (reemplazando el alert nativo)
      Swal.fire(
        "Error al Recargar",
        error.message || "No se pudieron actualizar los datos en la vista.",
        "error"
      );
    }
  }, [filtrosMemorizados, setReporteCurso]);

  return (
    <div className="curso-dashboard-container">
      <BtnVolver />
      <div className="curso-dashboard-header">
        <span className="material-symbols-outlined curso-dashboard-icon">
          sticky_note_2
        </span>
        <h2 className="curso-dashboard-title">Carga de Calificaciones</h2>
      </div>
      <EncabezadoCurso />

      <div className="d-flex justify-content-center">
        <input
          type="text"
          className="reporte-curso-search-input"
          placeholder="Buscar alumno por DNI"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="reporte-curso-search-btn">Buscar alumno</button>
      </div>

      <table className="carga-asistencia-table mt-4">
        <thead>
          <tr>
            <th className="reporte-curso-th">DNI</th>
            <th className="reporte-curso-th">Alumno</th>
            <th className="reporte-curso-th">Nota 1</th>
            <th className="reporte-curso-th">Nota 2</th>
            <th className="reporte-curso-th">Nota 3</th>
            <th className="reporte-curso-th">Periodo Complementario</th>
            <th className="reporte-curso-th">Promedio</th>
            <th className="reporte-curso-th">Nota Final</th>
            <th className="reporte-curso-th">Estado</th>
            <th className="reporte-curso-th">Acción</th>
          </tr>
        </thead>
        <tbody>
          {alumnosParaMostrar.map((item) => (
            <tr key={item.alumno.id}>
              <td className="reporte-curso-td">{item.alumno.dni ?? "-"}</td>
              <td className="reporte-curso-td">{item.alumno.nombreCompleto}</td>
              <td className="reporte-curso-td">
                {item.calificaciones?.nota1 ?? "-"}
              </td>
              <td className="reporte-curso-td">
                {item.calificaciones?.nota2 ?? "-"}
              </td>
              <td className="reporte-curso-td">
                {item.calificaciones?.nota3 ?? "-"}
              </td>
              <td className="reporte-curso-td">
                {item.calificaciones?.periodoComplementario ?? "-"}
              </td>
              <td className="reporte-curso-td">
                {item.calificaciones?.promedio ?? "-"}
              </td>
              <td className="reporte-curso-td">
                {item.calificaciones?.definitiva ?? "-"}
              </td>
              {item.calificaciones?.estado ? (
                <td
                  className={`reporte-curso-td reporte-curso-estado-${item.calificaciones.estado}`}
                >
                  {item.calificaciones.estado === "aprobada" && "Aprobado"}
                  {item.calificaciones.estado === "desaprobada" &&
                    "Desaprobado"}
                  {item.calificaciones.estado === "cursando" && "Cursando"}
                  {item.calificaciones.estado === "libre" && "Libre"}
                </td>
              ) : (
                <td className="reporte-curso-td">-</td>
              )}

              <td className="reporte-curso-td">
                <button
                  className="btn btn-warning"
                  onClick={() => {
                    handleAbrirModal(item);
                  }}
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ModalEditarCalificacion
        show={show}
        handleClose={handleClose}
        alumno={alumnoSeleccionado}
        filtros={filtros}
        onSaveSuccess={handleSaveSuccess} // Esta función ahora dispara el Swal
      />
    </div>
  );
};

export default CargaCalificaciones;