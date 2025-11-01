import React from 'react'
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
registerLocale("es", es);
setDefaultLocale("es");

const CargaAsistencia = () => {
      // Aquí guardamos la fecha como un objeto Date,
  // la librería se encarga de formatearlo.
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  // Creamos el botón personalizado
  // Esto es lo que pide react-datepicker para funcionar con un botón
  const BotonCalendario = React.forwardRef(({ value, onClick }, ref) => (
    <button className="mi-boton-calendario" onClick={onClick} ref={ref}>
      {/* Mostramos la fecha seleccionada en el botón */}
      {value || "Seleccionar fecha"}
    </button>
  ));
  return (
    <div>CargaAsistencia

              <div className="d-flex align-items-center fecha-carga">
        <h5>Fecha: <DatePicker
          selected={fechaSeleccionada}
          onChange={(date) => setFechaSeleccionada(date)}
          // 3. Aquí le decimos que use nuestro botón
          customInput={<BotonCalendario />}
          // Opcional: Formato de fecha
          dateFormat="dd/MM/yyyy"
        /></h5>

        
        
      </div>
    </div>
  )
}

export default CargaAsistencia