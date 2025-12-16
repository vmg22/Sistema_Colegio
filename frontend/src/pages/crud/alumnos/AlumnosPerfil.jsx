import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAlumnoId,
  getCursoYMateriasActual,
} from "../../../services/alumnosService";
import { useParams } from "react-router-dom";
import { getAlumnoTutorId, getTutor } from "../../../services/alumnoTutor";
import ModalEditTutor from "../../../components/modals/ModalEditTutor";
import ModalAddCursoMateria from "../../../components/modals/ModalAddCursoMateria";
import "../../../styles/alumnoperfil.css";

const AlumnosPerfil = () => {
  const [alumno, setAlumno] = useState({});
  const [tutor, setTutor] = useState({});
  const [curso, setCurso] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCursoModalOpen, setIsCursoModalOpen] = useState(false);

  const { id } = useParams();

  const traerDatos = useCallback(async () => {
    try {
      setIsLoading(true);
      setCurso(null);
      setTutor({});

      // Traer datos del alumno
      const responseAlumno = await getAlumnoId(id);
      setAlumno(responseAlumno);

      // Traer datos del tutor
      try {
        const responseAlumnoTutor = await getAlumnoTutorId(id);
        const idTutor =
          responseAlumnoTutor?.datos[0]?.id_tutor ||
          responseAlumnoTutor?.id_tutor;
        
        if (idTutor) {
          const responseTutor = await getTutor(idTutor);
          
          // 🔍 DEBUG
          console.log("📌 responseTutor completo:", responseTutor);
          
          // ✅ SOLUCIÓN: Extraer correctamente los datos
          let datosTutor;
          
          // El backend devuelve { success: true, datos: {...} }
          if (responseTutor?.datos) {
            datosTutor = responseTutor.datos;
          } else {
            datosTutor = responseTutor;
          }

          console.log("📌 datosTutor extraído:", datosTutor);

          // ✅ Incluir id_tutor explícitamente
          setTutor({
            ...datosTutor,
            id_tutor: idTutor,
          });

          console.log("✅ Tutor cargado con id_tutor:", idTutor);
        }
      } catch (tutorError) {
        console.warn("El alumno no tiene un tutor asignado.");
      }

      // Traer datos del curso
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
      Swal.fire(
        "Error",
        error.message || "Error al cargar los datos del perfil.",
        "error"
      );
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

  const handleSaveTutor = () => {
    setIsModalOpen(false);
    traerDatos();
    Swal.fire({
      title: "¡Guardado!",
      text: "Los datos del tutor se actualizaron correctamente.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleOpenCursoModal = () => {
    setIsCursoModalOpen(true);
  };

  const handleCloseCursoModal = () => {
    setIsCursoModalOpen(false);
  };

  const handleSaveCurso = () => {
    setIsCursoModalOpen(false);
    traerDatos();
    Swal.fire({
      title: "¡Guardado!",
      text: "El curso del alumno se actualizó correctamente.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="gestion-page-container">
      <div className="gestion-header">

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
              </dl>
            </div>

            {/* Caja Derecha: Información del Tutor */}
            <div className="perfil-alumno-box">
              <h4>Información del Tutor</h4>

              {tutor && Object.keys(tutor).length > 0 && tutor.nombre ? (
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
                  <div className="d-flex justify-content-end">
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

      {/* Modal de Curso */}
      {isCursoModalOpen && (
        <ModalAddCursoMateria
          show={isCursoModalOpen}
          onClose={handleCloseCursoModal}
          onSave={handleSaveCurso}
          idAlumno={alumno.id_alumno}
        />
      )}
    </div>
  );
};

export default AlumnosPerfil;