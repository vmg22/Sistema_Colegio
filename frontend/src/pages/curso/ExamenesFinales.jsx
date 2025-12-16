import React, { useEffect, useMemo, useState, useCallback } from "react";
import EncabezadoCurso from "../../components/curso/EncabezadoCurso";
import { useConsultaStore } from "../../store/consultaStore";
import { obtenerAlumnosEnFinal, obtenerAlumnosAprobados } from "../../services/examenesFinalesService";
import { Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import "../../styles/cargaCalificaciones.css";
import ModalRegistrarExamen from "../../components/curso/ModalRegistrarExamen";

const ExamenesFinales = () => {
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [show, setShow] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosAprobados, setAlumnosAprobados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setShow(false);
    setAlumnoSeleccionado(null);
  };
  const handleShow = () => setShow(true);

  const {
    reporteCurso,
    selectedCursoNombre,
    selectedMateriaNombre,
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
    };
  }, [filtros?.curso, filtros?.materia, filtros?.anioLectivo]);

  // Cargar alumnos en estado "final"
  const cargarAlumnos = useCallback(async () => {
    if (!filtrosMemorizados) return;

    const { curso, materia, anioLectivo } = filtrosMemorizados;

    if (!curso || !materia || !anioLectivo) {
      return;
    }

    setIsLoading(true);
    console.log('🔍 Cargando alumnos en estado final con:', { curso, materia, anioLectivo });
    try {
      const [dataPendientes, dataAprobados] = await Promise.all([
        obtenerAlumnosEnFinal(curso, materia, anioLectivo),
        obtenerAlumnosAprobados(curso, materia, anioLectivo)
      ]);
      
      console.log('✅ Alumnos pendientes:', dataPendientes);
      console.log('📊 Cantidad pendientes:', dataPendientes.length);
      console.log('✅ Alumnos aprobados:', dataAprobados);
      console.log('📊 Cantidad aprobados:', dataAprobados.length);
      
      setAlumnos(dataPendientes);
      setAlumnosAprobados(dataAprobados);
    } catch (error) {
      console.error("❌ Error al cargar alumnos:", error);
      Swal.fire(
        "Error",
        error.message || "No se pudo cargar la lista de alumnos.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [filtrosMemorizados]);

  useEffect(() => {
    cargarAlumnos();
  }, [cargarAlumnos]);


  // Filtrar alumnos por DNI
  const alumnosParaMostrar = useMemo(() => {
    if (!alumnos || alumnos.length === 0) {
      return [];
    }
    const alumnosOrdenados = [...alumnos].sort((a, b) => {
      return a.nombreCompleto.localeCompare(b.nombreCompleto);
    });
    if (!searchTerm) {
      return alumnosOrdenados;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return alumnosOrdenados.filter((item) => {
      const dniString = String(item.dni ?? "");
      return dniString.toLowerCase().includes(lowerCaseSearchTerm);
    });
  }, [alumnos, searchTerm]);

  const handleAbrirModal = (alumno) => {
    setAlumnoSeleccionado(alumno);
    handleShow();
  };

  const handleSaveSuccess = useCallback(async () => {
    await cargarAlumnos();
    Swal.fire({
      title: "¡Guardado!",
      text: "El examen final se registró correctamente.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    });
  }, [cargarAlumnos]);

  if (!selectedCursoNombre || !selectedMateriaNombre) {
    return (
      <div className="encabezado-curso-card">
        <Spinner animation="border" variant="primary" />
        <p>Cargando...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="encabezado-curso-card">
        <Spinner animation="border" variant="primary" />
        <p>Cargando alumnos...</p>
      </div>
    );
  }

  return (
    <div className="curso-dashboard-container">
      <div className="curso-dashboard-header mt-3">
        <span className="material-symbols-outlined curso-dashboard-icon">
          school
        </span>
        <h2 className="curso-dashboard-title">Exámenes Finales</h2>
      </div>
      <EncabezadoCurso />

      {alumnosParaMostrar.length === 0 ? (
        <div className="text-center mt-4">
          <p className="text-muted">No hay alumnos en estado "final" para esta materia</p>
        </div>
      ) : (
        <table className="carga-asistencia-table mt-4">
          <thead>
            <tr>
              <th className="reporte-curso-th">DNI</th>
              <th className="reporte-curso-th">Alumno</th>
              <th className="reporte-curso-th">Estado</th>
              <th className="reporte-curso-th">Diciembre</th>
              <th className="reporte-curso-th">Febrero</th>
              <th className="reporte-curso-th">Marzo</th>
              <th className="reporte-curso-th">Acción</th>
            </tr>
          </thead>
          <tbody>
            {alumnosParaMostrar.map((alumno) => {
              // Buscar exámenes por instancia
              const examenDiciembre = alumno.examenes?.find(e => e.instancia === 'diciembre');
              const examenFebrero = alumno.examenes?.find(e => e.instancia === 'febrero');
              const examenMarzo = alumno.examenes?.find(e => e.instancia === 'marzo');

              return (
                <tr key={alumno.id_alumno}>
                  <td className="reporte-curso-td">{alumno.dni ?? "-"}</td>
                  <td className="reporte-curso-td">{alumno.nombreCompleto}</td>
                  <td className={`reporte-curso-td reporte-curso-estado-final`}>
                    Final
                  </td>
                  <td className="reporte-curso-td">
                    {examenDiciembre ? (
                      <span className={examenDiciembre.aprobada ? "text-success fw-bold" : "text-danger"}>
                        {examenDiciembre.nota_obtenida}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="reporte-curso-td">
                    {examenFebrero ? (
                      <span className={examenFebrero.aprobada ? "text-success fw-bold" : "text-danger"}>
                        {examenFebrero.nota_obtenida}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="reporte-curso-td">
                    {examenMarzo ? (
                      <span className={examenMarzo.aprobada ? "text-success fw-bold" : "text-danger"}>
                        {examenMarzo.nota_obtenida}
                      </span>
                    ) : "-"}
                  </td>
                  <td className="reporte-curso-td">
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        handleAbrirModal(alumno);
                      }}
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* SECCIÓN DE HISTORIAL - ALUMNOS APROBADOS Y PREVIAS */}
      <div className="mt-5">
        <div className="curso-dashboard-header">
        <span className="material-symbols-outlined curso-dashboard-icon">
          history_edu
        </span>
        <h2 className="curso-dashboard-title">Historial de Exámenes Finales</h2>
      </div>
        
        {alumnosAprobados.length === 0 ? (
          <div className="text-center mt-3">
            <p className="text-muted">No hay alumnos con registro de exámenes finales aún</p>
          </div>
        ) : (
          <table className="carga-asistencia-table">
            <thead>
              <tr>
                <th className="reporte-curso-th">DNI</th>
                <th className="reporte-curso-th">Alumno</th>
                <th className="reporte-curso-th">Diciembre</th>
                <th className="reporte-curso-th">Febrero</th>
                <th className="reporte-curso-th">Marzo</th>
                <th className="reporte-curso-th">Instancia Aprobada</th>
                <th className="reporte-curso-th">Estado Final</th>
              </tr>
            </thead>
            <tbody>
              {alumnosAprobados.map((alumno) => {
                // Determinar en qué instancia aprobó
                let instanciaAprobada = "-";
                if (alumno.aprobada_diciembre) instanciaAprobada = "Diciembre";
                else if (alumno.aprobada_febrero) instanciaAprobada = "Febrero";
                else if (alumno.aprobada_marzo) instanciaAprobada = "Marzo";

                return (
                  <tr key={alumno.id_alumno}>
                    <td className="reporte-curso-td">{alumno.dni ?? "-"}</td>
                    <td className="reporte-curso-td">{alumno.nombreCompleto}</td>
                    
                    {/* Diciembre */}
                    <td className="reporte-curso-td">
                      {alumno.nota_diciembre !== null ? (
                        <span className={alumno.aprobada_diciembre ? "text-success fw-bold" : "text-danger fw-bold"}>
                          {alumno.nota_diciembre}
                        </span>
                      ) : "-"}
                    </td>
                    
                    {/* Febrero */}
                    <td className="reporte-curso-td">
                      {alumno.nota_febrero !== null ? (
                        <span className={alumno.aprobada_febrero ? "text-success fw-bold" : "text-danger fw-bold"}>
                          {alumno.nota_febrero}
                        </span>
                      ) : "-"}
                    </td>
                    
                    {/* Marzo */}
                    <td className="reporte-curso-td">
                      {alumno.nota_marzo !== null ? (
                        <span className={alumno.aprobada_marzo ? "text-success fw-bold" : "text-danger fw-bold"}>
                          {alumno.nota_marzo}
                        </span>
                      ) : "-"}
                    </td>
                    
                    {/* Instancia Aprobada */}
                    <td className="reporte-curso-td">
                      {instanciaAprobada !== "-" ? (
                        <span className="badge bg-success">{instanciaAprobada}</span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    
                    {/* Estado final */}
                    <td className="reporte-curso-td">
                      {alumno.estado === 'aprobada' ? (
                        <span className="badge bg-success">Aprobado</span>
                      ) : alumno.estado === 'previa' ? (
                        <span className="badge bg-warning text-dark">Previa</span>
                      ) : (
                        <span className="badge bg-secondary">{alumno.estado}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <ModalRegistrarExamen
        show={show}
        handleClose={handleClose}
        alumno={alumnoSeleccionado}
        filtros={filtros}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default ExamenesFinales;
