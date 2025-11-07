import React, { useCallback, useEffect, useState } from "react";
import BtnVolver from "../../../components/ui/BtnVolver";
import { getAlumnoId } from "../../../services/alumnosService";
import { useParams } from "react-router-dom";
import { getAlumnoTutorId, getTutor } from "../../../services/alumnoTutor";
import ModalEditTutor from "../../../components/modals/ModalEditTutor";
import ModalAddCursoMateria from "../../../components/modals/ModalAddCursoMateria";
import "../../../styles/alumnoperfil.css"
const AlumnosPerfil = () => {
  const [alumno, setAlumno] = useState({});
  const [tutor, setTutor] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams();

  // 3. REFACTORIZA traerDatos CON useCallback
  // Lo इamos para poder llamarlo tanto en el useEffect como después de guardar
  const traerDatos = useCallback(async () => {
    try {
      setIsLoading(true);

      // Traer datos del alumno
      const responseAlumno = await getAlumnoId(id);
      setAlumno(responseAlumno);

      // Traer relación alumno-tutor
      const responseAlumnoTutor = await getAlumnoTutorId(id);
      console.log("Alumno-Tutor:", responseAlumnoTutor);

      // Obtener el id_tutor de la respuesta
      const idTutor =
        responseAlumnoTutor?.datos[0].id_tutor || responseAlumnoTutor?.id_tutor;

      if (idTutor) {
        // Traer datos del tutor
        const responseTutor = await getTutor(idTutor);
        console.log("Respuesta Tutor completa:", responseTutor);

        const datosTutor = responseTutor?.datos || responseTutor;
        console.log("Datos Tutor extraídos:", datosTutor);

        setTutor(datosTutor);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
      // Aquí podrías setear un estado de error para mostrar al usuario
    } finally {
      setIsLoading(false);
    }
  }, [id]); // La dependencia es 'id'

  // useEffect ahora solo llama a traerDatos
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
  
  // Esta función se llamará cuando el modal guarde exitosamente
  const handleSaveTutor = () => {
    setIsModalOpen(false); // Cierra el modal
    traerDatos(); // Vuelve a cargar los datos para refrescar la vista
  };

  // Esta función cierra el modal (puedes llamarla desde el botón Cancelar o el overlay)
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Esta función se llamará cuando el modal guarde exitosamente
  const handleSaveAlumno = () => {
    setIsModalOpen(false); // Cierra el modal
    traerDatos(); // Vuelve a cargar los datos para refrescar la vista
  };

  // Esta función abre el modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
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

                  <dt>Dirección</dt>
                  <dd>{tutor.direccion || "N/A"}</dd>

                  <dt>Teléfono</dt>
                  <dd>{tutor.telefono || "N/A"}</dd>

                  <dt>Email</dt>
                  <dd>{tutor.email || "N/A"}</dd>

                  <dt>Domicilio</dt>
                  <dd>{tutor.direccion || "N/A"}</dd>

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
              <h4>Curso y Materias</h4></div>
          </div>
        </>
      )}

      {isModalOpen && (
        <ModalEditTutor
          tutorToEdit={tutor} // Pasa el objeto tutor que ya cargaste
          onClose={handleCloseModal} // Pasa la función para cerrar
          onSave={handleSaveTutor} // Pasa la función para guardar y refrescar
        />
      )}
    </div>
  );
};

export default AlumnosPerfil;
