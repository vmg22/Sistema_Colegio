import React from "react";
import { useState , useEffect} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);
setDefaultLocale("es");
import BtnVolver from "../../components/ui/BtnVolver.jsx"
import EncabezadoCurso from "../../components/curso/EncabezadoCurso.jsx"
import { useConsultaStore } from "../../store/consultaStore.js";
// Función helper para formatear la fecha a YYYY-MM-DD
const formatToYYYYMMDD = (date) => {
  return date.toISOString().split("T")[0];
};
const CargaAsistencia = () => {
  // Aquí guardamos la fecha como un objeto Date,
  // la librería se encarga de formatearlo.
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const { reporteCurso, cargando, error, setReporteCurso } = useConsultaStore();

  // 3. useEffect llama a la ACCIÓN DEL STORE
  useEffect(() => {
    if (!id_curso || !id_materia || !fechaSeleccionada) {
      return;
    }

    // Preparamos los filtros que espera la acción del store
    // (Uso los nombres de tu objeto 'filtros': materia, curso, anioLectivo)
    const filtros = {
      materia: id_materia,
      curso: id_curso,
      anioLectivo: fechaSeleccionada.getFullYear(),
      // IMPORTANTE: Tu backend 'obtenerListaClase' también pedía 'fecha_clase'.
      // Asegúrate de que tu store 'cargarReporteCurso' también la envíe.
      fecha_clase: formatToYYYYMMDD(fechaSeleccionada),
      // 'cuatrimestre: 1' (de tu log) parece ser un valor fijo.
      // Si necesitas pasarlo, agrégalo aquí.
      cuatrimestre: 1, 
    };

    // Llamamos a la acción del store para que haga el fetch
    setReporteCurso(filtros);

  }, [fechaSeleccionada, setReporteCurso]); // Dependencias
  // Creamos el botón personalizado
  // Esto es lo que pide react-datepicker para funcionar con un botón
  const BotonCalendario = React.forwardRef(({ value, onClick }, ref) => (
    <button className="mi-boton-calendario" onClick={onClick} ref={ref}>
      {/* Mostramos la fecha seleccionada en el botón */}
      {value || "Seleccionar fecha"}
    </button>
  ));

  // 4. Obtenemos la lista de alumnos del reporte (con optional chaining '?')
  const listaAlumnos = reporteCurso?.alumnos || [];

  // 5. Ajustamos el filtro a la nueva estructura anidada
  const alumnosFiltrados = listaAlumnos.filter((item) =>
    item.alumno.apellido_alumno.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alumno.nombre_alumno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

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
      
      {/* --- Controles de Búsqueda y Fecha --- */}
      <div className="d-flex justify-content-center">
        <input
          type="text"
          className="reporte-curso-search-input"
          placeholder="Buscar alumno por Apellido o Nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
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

      {/* 6. Renderizado de la lista (ajustado) */}
      <div className="lista-asistencia-container">
        {cargando && <p>Cargando lista...</p>}
        {error && <p className="text-danger">Error: {error.message || error}</p>}
        
        {!cargando && !error && alumnosFiltrados.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>Apellido</th>
                <th>Nombre</th>
                <th>Estado</th> {/* O controles para marcar asistencia */}
              </tr>
            </thead>
            <tbody>
              {/* 7. Ajustamos el .map() a la estructura anidada */}
              {alumnosFiltrados.map((item) => (
                <tr key={item.alumno.id_alumno}> {/* La key ahora está anidada */}
                  <td>{item.alumno.apellido_alumno}</td>
                  <td>{item.alumno.nombre_alumno}</td>
                  <td>
                    {/* Tu SQL 'listaClasePorDia' devolvía 'estado' (presente, ausente).
                      Tu nuevo objeto tiene 'asistencias: {}'
                      Adivino que el estado ahora está en 'item.asistencias.estado'
                      ¡Ajusta esto según tu estructura real!
                    */}
                    {item.asistencias?.estado || "Sin cargar"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!cargando && !error && listaAlumnos.length === 0 && (
          <p>No se encontraron alumnos para este curso y fecha.</p>
        )}
      </div>
    </div>
  );

};

export default CargaAsistencia;
