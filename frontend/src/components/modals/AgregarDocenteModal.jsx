import React from 'react';
import { useForm } from 'react-hook-form';
import { useDocentes } from '../../context/DocenteContext';
import '../../styles/Modal.css'; // (Añade un CSS básico para el modal)

const AgregarDocenteModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { createDocente } = useDocentes(); // Traemos la función del context

  if (!isOpen) return null; // Práctica moderna: renderizado condicional

  const onSubmit = handleSubmit(async (data) => {
    // 'data' ya es un objeto con todos los campos
    const success = await createDocente(data);
    if (success) {
      reset(); // Limpia el formulario
      onClose(); // Cierra el modal
    }
    // Si hay error, el contexto lo maneja (podrías mostrarlo)
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Nuevo Docente</h2>
        
        <form onSubmit={onSubmit}>
          {/* DNI (requerido) */}
          <div className="form-group">
            <label>DNI</label>
            <input 
              type="text"
              {...register("dni_docente", { required: "El DNI es obligatorio" })} 
            />
            {errors.dni_docente && <span>{errors.dni_docente.message}</span>}
          </div>
          
          {/* Nombre (requerido) */}
          <div className="form-group">
            <label>Nombre</label>
            <input 
              type="text"
              {...register("nombre", { required: "El nombre es obligatorio" })} 
            />
            {errors.nombre && <span>{errors.nombre.message}</span>}
          </div>

          {/* Apellido (requerido) */}
          <div className="form-group">
            <label>Apellido</label>
            <input 
              type="text"
              {...register("apellido", { required: "El apellido es obligatorio" })} 
            />
            {errors.apellido && <span>{errors.apellido.message}</span>}
          </div>

          {/* Campos opcionales */}
          <div className="form-group">
            <label>Email</label>
            <input type="email" {...register("email")} />
          </div>
          <div className="form-group">
            <label>Teléfono</label>
            <input type="text" {...register("telefono")} />
          </div>
          <div className="form-group">
            <label>Especialidad</label>
            <input type="text" {...register("especialidad")} />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancelar">Cancelar</button>
            <button type="submit" className="btn-guardar">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarDocenteModal