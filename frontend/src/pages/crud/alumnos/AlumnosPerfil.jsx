import React, { useEffect, useState } from "react";
import BtnVolver from "../../../components/ui/BtnVolver";
import { getAlumnoId } from "../../../services/alumnosService";
import { useParams } from "react-router-dom";
import { getAlumnoTutorId, getTutor } from "../../../services/alumnoTutor";

const AlumnosPerfil = () => {
  const [alumno, setAlumno] = useState({});
  const [tutor, setTutor] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const traerDatos = async () => {
      try {
        setIsLoading(true);
        
        // Traer datos del alumno
        const responseAlumno = await getAlumnoId(id);
        setAlumno(responseAlumno);

        // Traer relación alumno-tutor
        const responseAlumnoTutor = await getAlumnoTutorId(id);
        console.log("Alumno-Tutor:", responseAlumnoTutor);

        // Obtener el id_tutor de la respuesta
        const idTutor = responseAlumnoTutor?.datos[0].id_tutor || responseAlumnoTutor?.id_tutor;
        console.log(idTutor)
        if (idTutor) {
          // Traer datos del tutor
          const responseTutor = await getTutor(idTutor);
          console.log("Respuesta Tutor completa:", responseTutor);
          
          // IMPORTANTE: El backend envuelve la respuesta en 'datos'
          const datosTutor = responseTutor?.datos || responseTutor;
          console.log("Datos Tutor extraídos:", datosTutor);
          
          setTutor(datosTutor);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    traerDatos();
  }, [id]); // Agregado 'id' como dependencia

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
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

          <div className="perfil-grid">
            {/* Caja Izquierda: Información alumno */}
            <div className="perfil-info-box">
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
                    className={`status-badge ${
                      alumno.estado?.toLowerCase() || "inactivo"
                    }`}
                  >
                    {alumno.estado}
                  </span>
                </dd>
              </dl>
            </div>

            {/* Caja Derecha: Información del Tutor */}
            <div className="perfil-cursos-box">
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
                    className={`status-badge ${
                      tutor.estado?.toLowerCase() || "inactivo"
                    }`}
                  >
                    {tutor.estado}
                  </span>
                </dd>
                </dl>
              ) : (
                <p>No hay tutor asignado.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AlumnosPerfil;