import React, { useEffect, useMemo, useState } from "react";
import BtnVolver from "../../components/ui/BtnVolver";
import EncabezadoCurso from "../../components/curso/EncabezadoCurso";
import { useConsultaStore } from "../../store/consultaStore";
import { getReporteCurso } from "../../services/reportesService";
import { Spinner } from "react-bootstrap";
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
    setReporteCurso, //  OBTENER LA FUNCIÓN PARA ACTUALIZAR EL STORE
  } = useConsultaStore();

  const [searchTerm, setSearchTerm] = useState("");

  // Extraemos los filtros para usarlos como dependencia
  const filtros = reporteCurso?.filtros; // OBTENER LOS FILTROS

  // useEffect SE ENCARGARÁ DE BUSCAR LOS DATOS
  useEffect(() => {
    const traerAlumnos = async () => {
      if (
        !filtros ||
        !filtros.curso ||
        !filtros.materia ||
        !filtros.anioLectivo ||
        !filtros.cuatrimestre
      ) {
        return;
      }
      try {
        const data = await getReporteCurso(
          filtros.curso,
          filtros.materia,
          filtros.anioLectivo,
          filtros.cuatrimestre
        );
        setReporteCurso(data);
      } catch (error) {
        console.error("Error al traer los alumnos:", error);
      }
    };
    traerAlumnos();
  }, [filtros, setReporteCurso]); //  EJECUTA CUANDO CAMBIEN LOS FILTROS

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

  // useMemo se re-ejecutará cuando 'reporteCurso.alumnos' cambie
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

  // Esta función se la pasaremos al modal para que la llame
  // cuando termine de guardar exitosamente.
  const handleSaveSuccess = async () => {
    try {
      // Recargar los datos
      const data = await getReporteCurso(
        filtros.curso,
        filtros.materia,
        filtros.anioLectivo,
        filtros.cuatrimestre
      );
      setReporteCurso(data);
      console.log("Datos recargados exitosamente después de guardar.");
    } catch (error) {
      console.error("Error al recargar los datos:", error);
      alert(`Error al recargar: ${error.message}`);
    }
  };

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

      <table className="reporte-curso-table mt-4">
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

      {/* Ya no hay un bloque gigante de JSX aquí.
          Solo llamamos al componente y le pasamos los props */}
      <ModalEditarCalificacion
        show={show}
        handleClose={handleClose}
        alumno={alumnoSeleccionado}
        filtros={filtros} // Pasamos los filtros
        onSaveSuccess={handleSaveSuccess} // Pasamos la función de recarga
      />
    </div>
  );
};

export default CargaCalificaciones;
