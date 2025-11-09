import React, { useCallback, useEffect, useState } from "react";
import BtnVolver from "../../../components/ui/BtnVolver";
import {
  getAlumnoId,
  getCursoYMateriasActual,
  matricularAlumnoEnCurso,
} from "../../../services/alumnosService";
import { useParams } from "react-router-dom";
import { getAlumnoTutorId, getTutor } from "../../../services/alumnoTutor";
import ModalEditTutor from "../../../components/modals/ModalEditTutor";
import ModalAddCursoMateria from "../../../components/modals/ModalAddCursoMateria";
import "../../../styles/alumnoperfil.css";
const AlumnosPerfil = () => {
  const [alumno, setAlumno] = useState({});
  const [tutor, setTutor] = useState({});
  const [curso, setCurso] = useState(null); // Para guardar el curso actual
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal Tutor
  const [isCursoModalOpen, setIsCursoModalOpen] = useState(false); // Modal Curso

  const { id } = useParams();

  const traerDatos = useCallback(async () => {
    try {
      setIsLoading(true);
      setCurso(null); // Resetea el curso
      setTutor({}); // Resetea el tutor

      // Traer datos del alumno
      const responseAlumno = await getAlumnoId(id);
      setAlumno(responseAlumno);

      // 4. TRAER DATOS DEL TUTOR (en su propio try/catch)
      try {
        const responseAlumnoTutor = await getAlumnoTutorId(id);
        const idTutor =
          responseAlumnoTutor?.datos[0]?.id_tutor ||
          responseAlumnoTutor?.id_tutor;
        if (idTutor) {
          const responseTutor = await getTutor(idTutor);
          const datosTutor = responseTutor?.datos || responseTutor;
          setTutor(datosTutor);
        }
      } catch (tutorError) {
        console.warn("El alumno no tiene un tutor asignado.");
      }

      // 5. TRAER DATOS DEL CURSO (en su propio try/catch)
      try {
        const responseCurso = await getCursoYMateriasActual(id);
        if (responseCurso && responseCurso.curso) {
          setCurso(responseCurso.curso);
        }
      } catch (cursoError) {
        console.warn("El alumno no tiene un curso asignado.");
      }
    } catch (error) {
      console.error("Error al cargar datos del perfil:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    traerDatos();
  }, [traerDatos]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  // --- Handlers Modal Tutor ---
  const handleSaveTutor = () => {
    setIsModalOpen(false);
    traerDatos();
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // 6. AÑADIR HANDLERS PARA EL MODAL DE CURSO
  const handleOpenCursoModal = () => {
    setIsCursoModalOpen(true);
  };
  const handleCloseCursoModal = () => {
    setIsCursoModalOpen(false);
  };
  const handleSaveCurso = () => {
    // Cuando el modal de curso guarda, cerramos y refrescamos todo
    setIsCursoModalOpen(false);
    traerDatos();
  };

  return (
    <div className="gestion-page-container">
      <div className="gestion-header">
        <BtnVolver />
        <h2>Perfil del Alumno</h2>
      </div>

      {isLoading ? (
        <div className="loading-message">Cargando datos del alumno...</div>
      ) : (
        <>
          <div className="perfil-banner">
            <div className="avatar-icon">
              {alumno.nombre_alumno?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="docente-info">
              <h3>
                {alumno.nombre_alumno} {alumno.apellido_alumno}
              </h3>
              <p className="docente-username">
                DNI: {alumno.dni_alumno || "sin-usuario"}
              </p>
            </div>
          </div>

          <div className="perfil-alumno">
            {/* Caja Izquierda: Información alumno */}
            <div className="perfil-alumno-box">
              <h4>Información del Alumno</h4>
              <dl>
                <dt>Nombre y Apellido</dt>
                <dd>
                  {alumno.nombre_alumno} {alumno.apellido_alumno}
                </dd>

                <dt>DNI</dt>
                <dd>{alumno.dni_alumno}</dd>

                <dt>Domicilio</dt>
                <dd>{alumno.direccion || "N/A"}</dd>

                <dt>Fecha de Nacimiento</dt>
                <dd>{formatDate(alumno.fecha_nacimiento)}</dd>

                <dt>Lugar de Nacimiento</dt>
                <dd>{alumno.lugar_nacimiento || "N/A"}</dd>

                <dt>Email de Contacto</dt>
                <dd>{alumno.email || "N/A"}</dd>

                <dt>Teléfono</dt>
                <dd>{alumno.telefono || "N/A"}</dd>

                <dt>Fecha de Inscripción</dt>
                <dd>{formatDate(alumno.fecha_inscripcion)}</dd>

                <dt>Estado</dt>
                <dd>
                  <span
                    className={`status-alumno ${
                      alumno.estado?.toLowerCase() || "inactivo"
                    }`}
                  >
                    {alumno.estado}
                  </span>
                </dd>
                {/* <div className="d-flex justify-content-end ">
                  <button className="add-button" onClick={handleOpenModal}>
                    <span className="add-icon"></span>
                    Agregar curso/materia
                  </button>
                </div> */}
              </dl>
            </div>

            {/* Caja Derecha: Información del Tutor */}
            <div className="perfil-alumno-box">
              <h4>Información del Tutor</h4>

              {tutor ? (
                <dl>
                  <dt>Nombre y Apellido</dt>
                  <dd>
                    {tutor.nombre} {tutor.apellido}
                  </dd>

                  <dt>DNI</dt>
                  <dd>{tutor.dni_tutor || "N/A"}</dd>

                  <dt>Domicilio</dt>
                  <dd>{tutor.direccion || "N/A"}</dd>

                  <dt>Teléfono</dt>
                  <dd>{tutor.telefono || "N/A"}</dd>

                  <dt>Email</dt>
                  <dd>{tutor.email || "N/A"}</dd>

                  <dt>Relación con el Alumno</dt>
                  <dd>{tutor.parentesco || "N/A"}</dd>

                  <dt>Estado</dt>
                  <dd>
                    <span
                      className={`status-alumno ${
                        tutor.estado?.toLowerCase() || "inactivo"
                      }`}
                    >
                      {tutor.estado}
                    </span>
                  </dd>
                  <div className="d-flex justify-content-end ">
                    <button
                      className="btn btn-primary"
                      onClick={handleOpenModal}
                    >
                      Editar Tutor
                    </button>
                  </div>
                </dl>
              ) : (
                <p>No hay tutor asignado.</p>
              )}
            </div>
            <div className="perfil-alumno-box">
              <h4>Curso asignado</h4>

              {curso ? (
                // Si el alumno YA tiene un curso
                <div>
                  <dl>
                    <dt>Curso Actual ({curso.anio_lectivo})</dt>
                    <dd>
                      {curso.nombre_curso} ({curso.anio_curso}° "
                      {curso.division}")
                    </dd>
                    <dt>Turno</dt>
                    <dd>{curso.turno}</dd>
                  </dl>
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-primary"
                      onClick={handleOpenCursoModal}
                    >
                      Cambiar Curso
                    </button>
                  </div>
                </div>
              ) : (
                // Si el alumno NO tiene curso
                <div>
                  <p className="text-muted">
                    Este alumno no está matriculado en ningún curso para el año
                    lectivo actual.
                  </p>
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-primary"
                      onClick={handleOpenCursoModal}
                    >
                      Asignar Curso
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal de Tutor */}
      {isModalOpen && (
        <ModalEditTutor
          tutorToEdit={tutor}
          onClose={handleCloseModal}
          onSave={handleSaveTutor}
        />
      )}

      {/* 8. AÑADIR EL MODAL DE CURSO */}
      {isCursoModalOpen && (
        <ModalAddCursoMateria
          show={isCursoModalOpen}
          onClose={handleCloseCursoModal}
          onSave={handleSaveCurso}
          idAlumno={alumno.id_alumno}
          // Si ya tiene un curso, se lo pasamos al modal (aún no lo usa, pero es buena práctica)
          // cursoActual={curso}
        />
      )}
    </div>
  );
};

export default AlumnosPerfil;
