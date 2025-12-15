import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { registrarIntentoPrevia } from "../../services/previasService";
import Swal from "sweetalert2";
import "../../styles/modalEditar.css";


const ModalRegistrarPrevia = ({ show, handleClose, alumno, filtros, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    fecha_examen: "",
    nota_obtenida: ""
  });
  const [isLoading, setIsLoading] = useState(false);


  // Resetear formulario cuando cambia el alumno o se abre el modal
  useEffect(() => {
    if (alumno && show) {
      setFormData({
        fecha_examen: "",
        nota_obtenida: ""
      });
    }
  }, [alumno, show]);

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleGuardar = async () => {
    if (!alumno) return;

    // Validaciones
    if (!formData.fecha_examen) {
      Swal.fire("Error", "Debe ingresar la fecha del examen", "error");
      return;
    }
    if (formData.nota_obtenida === "" || formData.nota_obtenida === null) {
      Swal.fire("Error", "Debe ingresar la nota obtenida", "error");
      return;
    }

    const nota = parseFloat(formData.nota_obtenida);
    if (isNaN(nota) || nota < 0 || nota > 10) {
      Swal.fire("Error", "La nota debe estar entre 0 y 10", "error");
      return;
    }

    setIsLoading(true);

    try {
      const datosPrevia = {
        id_alumno: alumno.id_alumno,
        id_materia: filtros.materia,
        id_curso: filtros.curso,
        anio_lectivo: filtros.anioLectivo,
        fecha_examen: formData.fecha_examen,
        nota_obtenida: nota,
        id_docente: 1 // Esto debería venir del usuario logueado
      };


      const resultado = await registrarIntentoPrevia(datosPrevia);

      // Mostrar mensaje según el resultado
      let mensajeTitulo = "Intento Registrado";
      let mensajeTexto = resultado.mensajeEstado;
      let tipoMensaje = "success";

      if (resultado.nuevoEstado === "aprobada") {
        mensajeTitulo = "¡Aprobado!";
        tipoMensaje = "success";
      } else if (resultado.nuevoEstado === "previa") {
        mensajeTitulo = "Intento Registrado";
        tipoMensaje = "info";
      }

      await Swal.fire({
        title: mensajeTitulo,
        text: mensajeTexto,
        icon: tipoMensaje,
        timer: 3000,
        showConfirmButton: true
      });

      onSaveSuccess();
      handleClose();
    } catch (error) {
      console.error("Error al registrar intento de previa:", error);
      Swal.fire("Error", error.message ||"No se pudo registrar el intento", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!alumno) {
    return null;
  }

  return (
    <div className="d-flex justify-content-center">
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            📝 Registrar Intento de Previa: {alumno.nombreCompleto}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-calificaciones-form">
            <div className="row g-3">
              {/* Fecha del Examen */}
              <div className="col-12">
                <div className="mb-3">
                  <label htmlFor="fecha_examen" className="form-label">
                    <strong>Fecha del Examen</strong>
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="fecha_examen"
                    value={formData.fecha_examen}
                    onChange={handleFormChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Nota Obtenida */}
              <div className="col-12">
                <div className="mb-3">
                  <label htmlFor="nota_obtenida" className="form-label">
                    <strong>Nota Obtenida</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="nota_obtenida"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.nota_obtenida}
                    onChange={handleFormChange}
                    placeholder="Ingrese nota (0-10)"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Información adicional - Intentos previos */}
              {alumno.intentos && alumno.intentos.length > 0 && (
                <div className="col-12">
                  <div className="alert alert-info">
                    <strong>Intentos anteriores ({alumno.intentos.length}):</strong>
                    <ul className="mb-0 mt-2">
                      {alumno.intentos.map((intento, idx) => (
                        <li key={idx}>
                          <strong>{intento.fecha_examen}:</strong> {intento.nota_obtenida} 
                          {intento.aprobada ? " ✅" : " ❌"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleGuardar} 
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar Intento"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalRegistrarPrevia;
