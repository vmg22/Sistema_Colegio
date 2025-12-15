import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { registrarExamenFinal } from "../../services/examenesFinalesService";
import Swal from "sweetalert2";
import "../../styles/modalEditar.css";


const ModalRegistrarExamen = ({ show, handleClose, alumno, filtros, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    instancia: "",
    fecha_examen: "",
    nota_obtenida: ""
  });
  const [isLoading, setIsLoading] = useState(false);


  // Resetear formulario cuando cambia el alumno o se abre el modal
  useEffect(() => {
    if (alumno && show) {
      setFormData({
        instancia: "",
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

  // Verificar qué instancias ya fueron rendidas
  const getInstanciasDisponibles = () => {
    if (!alumno || !alumno.examenes) {
      return ['diciembre', 'febrero', 'marzo'];
    }

    const instanciasRendidas = alumno.examenes.map(e => e.instancia);
    const todasInstancias = ['diciembre', 'febrero', 'marzo'];
    
    return todasInstancias.filter(inst => !instanciasRendidas.includes(inst));
  };

  const handleGuardar = async () => {
    if (!alumno) return;

    // Validaciones
    if (!formData.instancia) {
      Swal.fire("Error", "Debe seleccionar una instancia", "error");
      return;
    }
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
      const datosExamen = {
        id_alumno: alumno.id_alumno,
        id_materia: filtros.materia,
        id_curso: filtros.curso,
        anio_lectivo: filtros.anioLectivo,
        instancia: formData.instancia,
        fecha_examen: formData.fecha_examen,
        nota_obtenida: nota,
        id_docente: 1 // Esto debería venir del usuario logueado
      };


      const resultado = await registrarExamenFinal(datosExamen);

      // Mostrar mensaje según el resultado
      let mensajeTitulo = "Examen Registrado";
      let mensajeTexto = resultado.mensajeEstado;
      let tipoMensaje = "success";

      if (resultado.nuevoEstado === "aprobada") {
        mensajeTitulo = "¡Aprobado!";
        tipoMensaje = "success";
      } else if (resultado.nuevoEstado === "previa") {
        mensajeTitulo = "Estado: Previa";
        tipoMensaje = "warning";
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
      console.error("Error al registrar examen:", error);
      Swal.fire("Error", error.message || "No se pudo registrar el examen", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!alumno) {
    return null;
  }

  const instanciasDisponibles = getInstanciasDisponibles();

  return (
    <div className="d-flex justify-content-center">
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            📝 Registrar Examen Final: {alumno.nombreCompleto}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-calificaciones-form">
            <div className="row g-3">
              {/* Instancia */}
              <div className="col-12">
                <div className="mb-3">
                  <label htmlFor="instancia" className="form-label">
                    <strong>Instancia</strong>
                  </label>
                  <select
                    className="form-select"
                    id="instancia"
                    value={formData.instancia}
                    onChange={handleFormChange}
                    disabled={isLoading || instanciasDisponibles.length === 0}
                  >
                    <option value="">Seleccione una instancia</option>
                    {instanciasDisponibles.map(inst => (
                      <option key={inst} value={inst}>
                        {inst.charAt(0).toUpperCase() + inst.slice(1)}
                      </option>
                    ))}
                  </select>
                  {instanciasDisponibles.length === 0 && (
                    <small className="text-warning">
                      El alumno ya rindió todas las instancias disponibles
                    </small>
                  )}
                </div>
              </div>

              {/* Fecha del Examen */}
              <div className="col-md-6">
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
              <div className="col-md-6">
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

              {/* Información adicional */}
              {alumno.examenes && alumno.examenes.length > 0 && (
                <div className="col-12">
                  <div className="alert alert-info">
                    <strong>Exámenes rendidos:</strong>
                    <ul className="mb-0 mt-2">
                      {alumno.examenes.map((ex, idx) => (
                        <li key={idx}>
                          <strong>{ex.instancia.charAt(0).toUpperCase() + ex.instancia.slice(1)}:</strong> {ex.nota_obtenida} 
                          {ex.aprobada ? " ✅" : " ❌"}
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
            disabled={isLoading || instanciasDisponibles.length === 0}
          >
            {isLoading ? "Guardando..." : "Guardar Examen"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalRegistrarExamen;
