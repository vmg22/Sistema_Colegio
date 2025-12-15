import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  actualizarCalificacionParcial,
  crearCalificacion,
} from "../../services/calificacionesService"; 
import "../../styles/modalEditar.css"

// Recibimos todo lo que necesitamos del componente padre
const ModalEditarCalificacion = ({
  show,
  handleClose,
  alumno,
  filtros,
  onSaveSuccess,
}) => {
  // El estado del formulario ahora vive DENTRO del modal
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Estado para mostrar feedback al guardar

  // Este Effect se ejecuta CADA VEZ que el prop 'alumno' cambia.
  // Así, cada vez que abrimos el modal con un alumno diferente,
  // el formulario se inicializa con sus datos.
  useEffect(() => {
    if (alumno) {
      setFormData({
        nota1: alumno.calificaciones?.nota1 ?? "",
        nota2: alumno.calificaciones?.nota2 ?? "",
        nota3: alumno.calificaciones?.nota3 ?? "",
        periodoComplementario: alumno.calificaciones?.periodoComplementario ?? "",
        definitiva: alumno.calificaciones?.definitiva ?? "",
        estado: alumno.calificaciones?.estado ?? "cursando", // 'cursando' como default
      });
    } else {
      // Si no hay alumno (al cerrar), limpiamos el form
      setFormData({});
    }
  }, [alumno]); // Dependencia: se ejecuta si 'alumno' cambia

  // Este manejador es local porque solo afecta a 'formData'
  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // La lógica de guardar 
  const handleGuardar = async () => {
    if (!alumno || !filtros) return; // Seguridad
    setIsLoading(true); // Empezamos a cargar

    try {
      const toNullIfEmpty = (value) => {
        if (value === "" || value === null || value === undefined) return null;
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
      };

      const datosParaBackend = {
        nota_1: toNullIfEmpty(formData.nota1),
        nota_2: toNullIfEmpty(formData.nota2),
        nota_3: toNullIfEmpty(formData.nota3),
        periodo_complementario: toNullIfEmpty(formData.periodoComplementario),
        calificacion_definitiva: toNullIfEmpty(formData.definitiva),
        estado: formData.estado,
      };

      // CASO A: El alumno NO tiene calificaciones (CREAR)
      if (alumno.calificaciones === null) {
        const datosParaCrear = {
          ...datosParaBackend,
          id_alumno: alumno.alumno.id,
          id_materia: filtros.materia,
          id_curso: filtros.curso,
          anio_lectivo: filtros.anioLectivo,
          cuatrimestre: filtros.cuatrimestre,
          id_docente: 1, // Esto deberías obtenerlo del usuario logueado
        };
        await crearCalificacion(datosParaCrear);

      // CASO B: El alumno YA tiene calificaciones (ACTUALIZAR)
      } else {
        const idCalificacion = alumno.calificaciones.id;
        await actualizarCalificacionParcial(idCalificacion, datosParaBackend);
      }

      onSaveSuccess(); // Avisa al padre que todo salió bien
      handleClose(); // Cierra el modal (función del padre)

    } catch (error) {
      console.error("Error al guardar la calificación:", error);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setIsLoading(false); // Terminamos de cargar
    }
  };

  // Si no hay alumno, no renderizamos nada.
  // Esto evita errores como "cannot read property 'nombreCompleto' of null"
  if (!alumno) {
    return null;
  }

  // Usamos los props 'show' y 'handleClose' y el 'alumno'
  return (
    <div className="d-flex justify-content-center">
        <Modal show={show} onHide={handleClose} centered >
        <Modal.Header closeButton>
          <Modal.Title>
            📊 Editar Calificaciones: {alumno.alumno.nombreCompleto}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <div className="modal-calificaciones-form">
            <div className="row g-3">
              {/* Nota 1 */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="nota1" className="form-label">
                    <strong>Nota 1</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="nota1"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.nota1 || ""}
                    onChange={handleFormChange}
                    placeholder="Ingrese nota 1"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Nota 2 */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="nota2" className="form-label">
                    <strong>Nota 2</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="nota2"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.nota2 || ""}
                    onChange={handleFormChange}
                    placeholder="Ingrese nota 2"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Nota 3 */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="nota3" className="form-label">
                    <strong>Nota 3</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="nota3"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.nota3 || ""}
                    onChange={handleFormChange}
                    placeholder="Ingrese nota 3"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Periodo Complementario */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="periodoComplementario" className="form-label">
                    <strong>Periodo Complementario</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="periodoComplementario"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.periodoComplementario || ""}
                    onChange={handleFormChange}
                    placeholder="Ingrese periodo complementario"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Nota Final */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="definitiva" className="form-label">
                    <strong>Nota Final</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="definitiva"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.definitiva || ""}
                    onChange={handleFormChange}
                    placeholder="Ingrese nota final"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Estado */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="estado" className="form-label">
                    <strong>Estado</strong>
                  </label>
                  <select
                    className="form-select"
                    id="estado"
                    value={formData.estado || "cursando"}
                    onChange={handleFormChange}
                    disabled={isLoading}
                  >
                    <option value="cursando">Cursando</option>
                    <option value="aprobada">Aprobado</option>
                    <option value="desaprobada">Desaprobado</option>
                    <option value="final">Final</option>
                    <option value="libre">Libre</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardar} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    
  );
};

export default ModalEditarCalificacion;