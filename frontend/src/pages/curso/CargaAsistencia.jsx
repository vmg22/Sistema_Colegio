import React from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);
setDefaultLocale("es", es);
import Swal from "sweetalert2"; // <-- 1. IMPORTADO
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import EncabezadoCurso from "../../components/curso/EncabezadoCurso.jsx";
import { useConsultaStore } from "../../store/consultaStore.js";
import { obtenerListaClase , guardarAsistenciasClase} from "../../services/asistenciaService.js";
import { getReporteCurso } from "../../services/reportesService.js"
import { useEffect } from "react";
import "../../styles/cargaAsistencia.css"

const CargaAsistencia = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [alumnos, setAlumnos] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const { reporteCurso, setReporteCurso } = useConsultaStore(); 
  console.log(reporteCurso);

  const formatToMySQLDateTime = (date) => {
    if (!date) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getAsistencia = async () => {
    if (!reporteCurso?.filtros) {
      setError("No se pudieron cargar los filtros del curso.");
      return;
    }

    try {
      setError(null);
      const filtros = {
        id_materia: reporteCurso.filtros.materia,
        fecha_clase: formatToMySQLDateTime(fechaSeleccionada),
        id_curso: reporteCurso.filtros.curso,
        anio_lectivo: reporteCurso.filtros.anioLectivo,
      };

      const data = await obtenerListaClase(filtros);
      setAlumnos(data);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.mensaje || "Error al cargar la lista";
      setError(errorMsg);
      // <-- 2. ALERTA DE ERROR EN CARGA -->
      Swal.fire("Error", errorMsg, "error");
      setAlumnos([]);
    }
  };

  useEffect(() => {
    getAsistencia();
  }, [fechaSeleccionada, reporteCurso]);

  const cargaAsistencia = (idAlumno, nuevoEstado) => {
    setAlumnos((alumnosActuales) =>
      alumnosActuales.map((alumno) => {
        if (alumno.id_alumno === idAlumno) {
          return { ...alumno, estado: nuevoEstado };
        }
        return alumno;
      })
    );
  };

  const refrescarReporte = async () => {
    try {
      const { materia, curso, anioLectivo, cuatrimestre } = reporteCurso.filtros;
      const reporteActualizado = await getReporteCurso(
        curso,
        materia,
        anioLectivo,
        cuatrimestre
      );
      
      setReporteCurso({
        ...reporteCurso,
        alumnos: reporteActualizado.alumnos,
        totalAlumnos: reporteActualizado.totalAlumnos
      });

      sessionStorage.setItem('reporteCurso', JSON.stringify({
        ...reporteCurso,
        alumnos: reporteActualizado.alumnos,
        totalAlumnos: reporteActualizado.totalAlumnos
      }));

      console.log("✅ Reporte actualizado automáticamente");
    } catch (error) {
      console.error("Error al refrescar reporte:", error);
      // <-- 3. ALERTA DE ERROR EN REFRESCO -->
      Swal.fire("Error", "No se pudo refrescar el reporte de asistencias.", "error");
    }
  };

  const handleGuardarAsistencia = async () => {
    setIsSaving(true);
    setError(null);

    const alumnosParaGuardar = alumnos
      .filter((a) => a.estado)
      .map((a) => ({
        id_alumno: a.id_alumno,
        estado: a.estado,
      }));

    if (alumnosParaGuardar.length === 0) {
      // <-- 4. ALERTA DE ADVERTENCIA (VALIDACIÓN) -->
      Swal.fire("Atención", "No se ha marcado ninguna asistencia.", "warning");
      setIsSaving(false);
      return;
    }

    const ID_DOCENTE_PLACEHOLDER = 1; // TODO: REEMPLAZAR ESTO

    const payload = {
      id_materia: reporteCurso.filtros.materia,
      id_curso: reporteCurso.filtros.curso,
      id_docente: ID_DOCENTE_PLACEHOLDER,
      anio_lectivo: reporteCurso.filtros.anioLectivo,
      fecha_clase: formatToMySQLDateTime(fechaSeleccionada),
      alumnos: alumnosParaGuardar,
    };

    try {
      const resultado = await guardarAsistenciasClase(payload);
      
      // <-- 5. ALERTA DE ÉXITO (REEMPLAZA ALERT) -->
      Swal.fire({
        title: "¡Guardado!",
        text: resultado.mensaje || "Asistencias guardadas con éxito",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
      
      await refrescarReporte();
      await getAsistencia();

    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.mensaje || "Error al guardar";
      setError(errorMsg);
      // <-- 6. ALERTA DE ERROR EN GUARDADO -->
      Swal.fire("Error", errorMsg, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const BotonCalendario = React.forwardRef(({ value, onClick }, ref) => (
    <button className="mi-boton-calendario" onClick={onClick} ref={ref}>
      {value || "Seleccionar fecha"}
    </button>
  ));

  alumnos.map((a)=>console.log(a))
  return (
    <div className="curso-dashboard-container">
      <BtnVolver />
      <div className="curso-dashboard-header">
        <span className="material-symbols-outlined curso-dashboard-icon">
          event_available
        </span>
        <h2 className="curso-dashboard-title">Carga de Asistencia</h2>
      </div>

      <EncabezadoCurso />

      <div className="d-flex align-items-center fecha-carga">
        <h5>
          Fecha:{" "}
          <DatePicker
            selected={fechaSeleccionada}
            onChange={(date) => setFechaSeleccionada(date)}
            customInput={<BotonCalendario />}
            dateFormat="dd/MM/yyyy"
          />
        </h5>
      </div>

      <div className="tablaCargaAsistencia">
        <table className="carga-asistencia-table">
          <thead>
            <tr>
              <th className="reporte-curso-th">DNI</th>
              <th className="reporte-curso-th">Alumno</th>
              <th className="reporte-curso-th">Asistencia</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map((item) => (
              <tr key={item.id_alumno}>
                <td className="reporte-curso-td">
                  {item.dni_alumno}
                </td>
                <td className="reporte-curso-td">
                  {item.apellido_alumno} {item.nombre_alumno}
                </td>
                <td className="reporte-curso-td">
                  <div>
                    <button
                      className={`btn mx-3 ${
                        item.estado === "presente"
                          ? "btn-success"
                          : "btn-outline-success"
                      }`}
                      onClick={() => cargaAsistencia(item.id_alumno, "presente")}
                    >
                      P
                    </button>
                    <button
                      className={`btn ${
                        item.estado === "ausente"
                          ? "btn-danger"
                          : "btn-outline-danger"
                      }`}
                      onClick={() => cargaAsistencia(item.id_alumno, "ausente")}
                    >
                      A
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end mt-3">
        <button
          className="btn btn-primary"
          onClick={handleGuardarAsistencia}
          disabled={isSaving}
        >
          {isSaving ? "Guardando..." : "Guardar Asistencia"}
        </button>
      </div>
    </div>
  );
};

export default CargaAsistencia;