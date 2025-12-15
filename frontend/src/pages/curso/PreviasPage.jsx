import React, { useEffect, useState, useMemo, useCallback } from "react";
import BtnVolver from "../../components/ui/BtnVolver";
import EncabezadoCurso from "../../components/curso/EncabezadoCurso";
import { useConsultaStore } from "../../store/consultaStore";
import { obtenerAlumnosPendientes, obtenerAlumnosAprobados } from "../../services/previasService";
import ModalRegistrarPrevia from "../../components/curso/ModalRegistrarPrevia";
import { Spinner, Button } from "react-bootstrap";
import "../../styles/cargaCalificaciones.css";

const PreviasPage = () => {
  const [alumnosPendientes, setAlumnosPendientes] = useState([]);
  const [alumnosAprobados, setAlumnosAprobados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

  const { reporteCurso } = useConsultaStore();

  // Extraer filtros del reporte de curso
  const filtrosMemorizados = useMemo(() => {
    if (!reporteCurso?.filtros) {
      console.warn("⚠️ No hay filtros en reporteCurso");
      return { curso: null, materianull, anioLectivo: null };
    }

    return {
      curso: reporteCurso.filtros.curso,
      materia: reporteCurso.filtros.materia,
      anioLectivo: reporteCurso.filtros.anioLectivo,
    };
  }, [reporteCurso]);

  // Función para cargar datos
  const cargarDatos = useCallback(async () => {
    const { curso, materia, anioLectivo } = filtrosMemorizados;

    if (!curso || !materia || !anioLectivo) {
      console.warn("⚠️ Faltan parámetros para cargar datos de previas");
      return;
    }

    setIsLoading(true);
    console.log('🔍 Cargando datos de previas:', { curso, materia, anioLectivo });
    
    try {
      // Cargar pendientes y aprobados en paralelo
      const [pendientes, aprobados] = await Promise.all([
        obtenerAlumnosPendientes(curso, materia, anioLectivo),
        obtenerAlumnosAprobados(curso, materia, anioLectivo)
      ]);
      
      console.log('✅ Alumnos pendientes:', pendientes);
      console.log('✅ Alumnos aprobados:', aprobados);
      
      setAlumnosPendientes(pendientes);
      setAlumnosAprobados(aprobados);
    } catch (error) {
      console.error("❌ Error al cargar datos de previas:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filtrosMemorizados]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleRegistrarIntento = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setShowModal(true);
  };

 const handleCloseModal = () => {
    setShowModal(false);
    setAlumnoSeleccionado(null);
  };

  const handleSaveSuccess = () => {
    // Recargar datos después de guardar
    cargarDatos();
  };

  if (isLoading) {
    return (
      <div className="d-flexjustify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="nombre_vista">
      <EncabezadoCurso />
      
      <div className="contenedor-boton-volver">
        <BtnVolver />
      </div>

      {/* SECCIÓN 1: ALUMNOS PENDIENTES */}
      <div className="contenedor-tabla-calificaciones mb-5">
        <h3 className="titulo-seccion mb-4">
          📋 Alumnos con Previas Pendientes
        </h3>

        {alumnosPendientes.length === 0 ? (
          <div className="alert alert-info">
            No hay alumnos con previas pendientes para este curso/materia.
          </div>
        ) : (
          <table className="carga-asistencia-table">
            <thead>
              <tr>
                <th className="reporte-curso-th">DNI</th>
                <th className="reporte-curso-th">Alumno</th>
                <th className="reporte-curso-th">Intentos</th>
                <th className="reporte-curso-th">Última Nota</th>
                <th className="reporte-curso-th">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnosPendientes.map((alumno) => {
                const totalIntentos = alumno.intentos?.length || 0;
                const ultimoIntento = alumno.intentos?.[0]; // Ya viene ordenado DESC
                
                return (
                  <tr key={alumno.id_alumno}>
                    <td className="reporte-curso-td">{alumno.dni ?? "-"}</td>
                    <td className="reporte-curso-td">{alumno.nombreCompleto}</td>
                    <td className="reporte-curso-td">
                      {totalIntentos > 0 ? (
                        <span className="badge bg-secondary">{totalIntentos}</span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="reporte-curso-td">
                      {ultimoIntento ? (
                        <span className="text-danger fw-bold">
                          {ultimoIntento.nota_obtenida} ({ultimoIntento.fecha_examen})
                        </span>
                      ) : (
                        <span className="text-muted">Sin intentos</span>
                      )}
                    </td>
                    <td className="reporte-curso-td">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleRegistrarIntento(alumno)}
                      >
                        Registrar Intento
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* SECCIÓN 2: HISTORIAL DE APROBADOS */}
      <div className="contenedor-tabla-calificaciones">
        <h3 className="titulo-seccion mb-4">
          ✅ Historial: Aprobados por Previa
        </h3>

        {alumnosAprobados.length === 0 ? (
          <div className="alert alert-info">
            Aún no hay alumnos que hayan aprobado por previa.
          </div>
        ) : (
          <table className="carga-asistencia-table">
            <thead>
              <tr>
                <th className="reporte-curso-th">DNI</th>
                <th className="reporte-curso-th">Alumno</th>
                <th className="reporte-curso-th">Nota Final</th>
                <th className="reporte-curso-th">Total Intentos</th>
                <th className="reporte-curso-th">Fecha Aprobación</th>
              </tr>
            </thead>
            <tbody>
              {alumnosAprobados.map((alumno) => (
                <tr key={alumno.id_alumno}>
                  <td className="reporte-curso-td">{alumno.dni ?? "-"}</td>
                  <td className="reporte-curso-td">{alumno.nombreCompleto}</td>
                  <td className="reporte-curso-td">
                    <span className="text-success fw-bold">
                      {alumno.nota_final ?? alumno.nota_aprobacion}
                    </span>
                  </td>
                  <td className="reporte-curso-td">
                    <span className="badge bg-info">{alumno.total_intentos}</span>
                  </td>
                  <td className="reporte-curso-td">
    { (alumno.fecha_aprobacion || alumno.fecha_ultimo_intento) &&
(alumno.fecha_aprobacion ?? alumno.fecha_ultimo_intento).split('T')[0]
    }
</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL PARA REGISTRAR INTENTO */}
      <ModalRegistrarPrevia
        show={showModal}
        handleClose={handleCloseModal}
        alumno={alumnoSeleccionado}
        filtros={filtrosMemorizados}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default PreviasPage;
