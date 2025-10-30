import React from 'react';
import '../../styles/docentesmodal.css'; // Crearemos este CSS
import { FaTimes } from 'react-icons/fa';

/**
 * Props:
 * - isOpen: (boolean) Muestra u oculta el modal
 * - onClose: (function) Se llama al hacer clic en la "X" o en el fondo
 * - title: (string) Título del modal
 * - children: (ReactNode) El contenido que irá dentro del modal
 */
function DocentesModal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null;
  }

  // Evita que el clic en el contenido cierre el modal
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="modal-close-btn">
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DocentesModal;