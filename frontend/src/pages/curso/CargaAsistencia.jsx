import React from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);
setDefaultLocale("es");
import BtnVolver from "../../components/ui/BtnVolver.jsx";
import EncabezadoCurso from "../../components/curso/EncabezadoCurso.jsx";
import { useConsultaStore } from "../../store/consultaStore.js";
import { obtenerListaClase } from "../../services/asistenciaService.js";
import { useEffect } from "react";
import "../../styles/cargaAsistencia.css"

const CargaAsistencia = () => {
  // Aquí guardamos la fecha como un objeto Date,
  // la librería se encarga de formatearlo.
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [alumnos, setAlumnos] = useState([]);
  const { reporteCurso } = useConsultaStore();
  console.log(reporteCurso);
  //reporteCurso.filtros
  //   anioLectivo: 2025
  // cuatrimestre: 1
  // curso: 1
  // materia: 1
  //  id_materia, fecha_clase, id_curso, anio_lectivo

  // Función helper para formatear la fecha a YYYY-MM-DD HH:mm:ss
  const formatToMySQLDateTime = (date) => {
    if (!date) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getAsistencia = async () => {
    try {
      const filtros = {
        id_materia: reporteCurso.filtros.materia,
        fecha_clase: formatToMySQLDateTime(fechaSeleccionada),
        id_curso: reporteCurso.filtros.curso,
        anio_lectivo: reporteCurso.filtros.anioLectivo,
      };
      console.log(filtros);
      const data = await obtenerListaClase(filtros);
      setAlumnos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAsistencia();
  }, [fechaSeleccionada]);

  // Creamos el botón personalizado
  // Esto es lo que pide react-datepicker para funcionar con un botón
  const BotonCalendario = React.forwardRef(({ value, onClick }, ref) => (
    <button className="mi-boton-calendario" onClick={onClick} ref={ref}>
      {/* Mostramos la fecha seleccionada en el botón */}
      {value || "Seleccionar fecha"}
    </button>
  ));

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
            // 3. Aquí le decimos que use nuestro botón
            customInput={<BotonCalendario />}
            // Opcional: Formato de fecha
            dateFormat="dd/MM/yyyy"
          />
        </h5>
      </div>

<div className="tablaCargaAsistencia">
      <table className="carga-asistencia-table">
        <thead>
          <tr>
            <th className="reporte-curso-th">Alumno</th>
            <th className="reporte-curso-th">Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((item) => (
            <tr>
              <td className="reporte-curso-td">
                {item.apellido_alumno} {item.nombre_alumno}
              </td>
              <td className="reporte-curso-td">
                <div >
                  <button className="btn btn-success mx-3">P</button>
                  <button className="btn btn-danger">A</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
</div>

      <div className="d-flex justify-content-end mt-3">
      <button className="btn btn-primary">Guardar Asistencia</button>

      </div>
    </div>
  );
};

export default CargaAsistencia;
