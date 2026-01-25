import React, { useEffect, useMemo, useState, useCallback } from "react";
import EncabezadoCurso from "../../components/curso/EncabezadoCurso";
import { useConsultaStore } from "../../store/consultaStore";
import { obtenerAlumnosEnFinal, obtenerAlumnosAprobados } from "../../services/examenesFinalesService";
import { obtenerCandidatosRegular } from "../../services/planillasService"; // Importar servicio de planillas
import { Spinner, Tabs, Tab } from "react-bootstrap"; // Importar Tabs
import Swal from "sweetalert2";
import "../../styles/cargaCalificaciones.css";
import ModalRegistrarExamen from "../../components/curso/ModalRegistrarExamen";
import PlanillaRegularPreviaView from "../../components/planillas/PlanillaRegularPreviaView"; // Importar vista de planilla

const ExamenesFinales = () => {
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [show, setShow] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosAprobados, setAlumnosAprobados] = useState([]);
  const [datosRegular, setDatosRegular] = useState([]); // Estado para datos de planilla regular
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState('gestion'); // Estado para controlar tabs

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

  const filtros = reporteCurso?.filtros;

  const filtrosMemorizados = useMemo(() => {
    if (!filtros) return null;
    return {
      curso: filtros.curso,
      materia: filtros.materia,
      anioLectivo: filtros.anioLectivo,
    };
  }, [filtros?.curso, filtros?.materia, filtros?.anioLectivo]);

  const cargarAlumnos = useCallback(async () => {
    if (!filtrosMemorizados) return;

    const { curso, materia, anioLectivo } = filtrosMemorizados;

    if (!curso || !materia || !anioLectivo) {
      return;
    }

    setIsLoading(true);
    try {
      // Cargar todo en paralelo: pendientes, aprobados y datos para la planilla regular
      const [dataPendientes, dataAprobados, dataRegular] = await Promise.all([
        obtenerAlumnosEnFinal(curso, materia, anioLectivo),
        obtenerAlumnosAprobados(curso, materia, anioLectivo),
        obtenerCandidatosRegular(anioLectivo, curso, materia)
      ]);

      setAlumnos(dataPendientes);
      setAlumnosAprobados(dataAprobados);
      setDatosRegular(dataRegular);
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
        <p>Cargando datos...</p>
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

      <div className="mt-4">

        <Tabs
          id="examenes-tabs"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3 custom-tabs"
          fill
        >
          <Tab eventKey="gestion" title="Gestión de Exámenes">
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

            {/* SECCIÓN DE HISTORIAL */}
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
                      let instanciaAprobada = "-";
                      if (alumno.aprobada_diciembre) instanciaAprobada = "Diciembre";
                      else if (alumno.aprobada_febrero) instanciaAprobada = "Febrero";
                      else if (alumno.aprobada_marzo) instanciaAprobada = "Marzo";

                      return (
                        <tr key={alumno.id_alumno}>
                          <td className="reporte-curso-td">{alumno.dni ?? "-"}</td>
                          <td className="reporte-curso-td">{alumno.nombreCompleto}</td>
                          <td className="reporte-curso-td">
                            {alumno.nota_diciembre !== null ? (
                              <span className={alumno.aprobada_diciembre ? "text-success fw-bold" : "text-danger fw-bold"}>
                                {alumno.nota_diciembre}
                              </span>
                            ) : "-"}
                          </td>
                          <td className="reporte-curso-td">
                            {alumno.nota_febrero !== null ? (
                              <span className={alumno.aprobada_febrero ? "text-success fw-bold" : "text-danger fw-bold"}>
                                {alumno.nota_febrero}
                              </span>
                            ) : "-"}
                          </td>
                          <td className="reporte-curso-td">
                            {alumno.nota_marzo !== null ? (
                              <span className={alumno.aprobada_marzo ? "text-success fw-bold" : "text-danger fw-bold"}>
                                {alumno.nota_marzo}
                              </span>
                            ) : "-"}
                          </td>
                          <td className="reporte-curso-td">
                            {instanciaAprobada !== "-" ? (
                              <span className="badge bg-success">{instanciaAprobada}</span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
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
          </Tab>

          <Tab eventKey="planilla" title="Planilla Regular (Acta Volante)">
            <PlanillaRegularPreviaView
              tipo="REGULAR"
              datos={datosRegular}
              cursoNombre={selectedCursoNombre}
              materiaNombre={selectedMateriaNombre}
              anioLectivo={filtrosMemorizados?.anioLectivo}
            />
          </Tab>
        </Tabs>
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
