import React, { useState, useRef } from "react";
import "../../styles/asistenciaCurso.css";

const BodyAsistenciaCurso = () => {
  // 🔹 Formatear fecha en formato legible (ej: 31 de octubre de 2025)
  const formatearFecha = (dateObj) => {
    const opciones = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("es-ES", opciones).format(dateObj);
  };

  // 🔹 Obtener fecha en formato ISO (YYYY-MM-DD)
  const getFechaISO = (dateObj) => {
    const anio = dateObj.getFullYear();
    const mes = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dia = String(dateObj.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
  };

  // 🔹 Estados principales
  const [fecha, setFecha] = useState(formatearFecha(new Date()));
  const [busqueda, setBusqueda] = useState("");
  const [alumnos, setAlumnos] = useState([
    { id: 1, nombre: "González, María", asistencia: "" },
    { id: 2, nombre: "López, Carlos", asistencia: "" },
    { id: 3, nombre: "Martínez, Ana", asistencia: "" },
    { id: 4, nombre: "Rodríguez, Pedro", asistencia: "" },
  ]);

  // 🔹 Referencia al input de fecha (oculto)
  const dateInputRef = useRef(null);

  // 🔹 Filtrado por nombre de alumno
  const alumnosFiltrados = alumnos.filter((alumno) =>
    alumno.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🔹 Cambiar tipo de asistencia (P, A, J, T)
  const handleAsistenciaChange = (id, tipo) => {
    setAlumnos((prevAlumnos) =>
      prevAlumnos.map((alumno) =>
        alumno.id === id ? { ...alumno, asistencia: tipo } : alumno
      )
    );
  };

  // 🔹 Actualizar fecha al seleccionar una nueva
  const handleDateChange = (e) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split("-");
      const nuevaFecha = new Date(year, month - 1, day);
      setFecha(formatearFecha(nuevaFecha));
    }
  };

  return (
    <div className="asistencia-panel">
      {/* 🔹 Sección de fecha */}
      <div className="fecha-section">
        <input
          type="date"
          ref={dateInputRef}
          style={{ opacity: 0, position: "absolute", width: 0, height: 0, zIndex: -1 }}
          onChange={handleDateChange}
          defaultValue={getFechaISO(new Date())}
        />

        <h2>Hoy: {fecha}</h2>
        <button
          className="btn-cambiar-fecha"
          onClick={() => dateInputRef.current?.click()}
        >
          Cambiar Fecha
        </button>
      </div>

      <hr />

      {/* 🔹 Sección de búsqueda */}
      <div className="busqueda-section">
        <h3>Buscar alumno...</h3>
        <input
          type="text"
          className="busqueda-input"
          placeholder="Escribe el nombre del alumno..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* 🔹 Lista de alumnos */}
      <div className="lista-alumnos">
        {alumnosFiltrados.map((alumno) => (
          <div key={alumno.id} className="alumno-item">
            <span className="nombre-alumno">{alumno.nombre}</span>
            <div className="opciones-asistencia">
              {["P", "A", "J", "T"].map((tipo) => (
                <button
                  key={tipo}
                  className={`btn-asistencia ${
                    alumno.asistencia === tipo ? "active" : ""
                  }`}
                  onClick={() => handleAsistenciaChange(alumno.id, tipo)}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <hr />

      {/* 🔹 Acciones */}
      <div className="acciones-section">
        <button className="btn-resumen">Ver Resumen Mensual</button>
        <div className="botones-accion">
          <button className="btn-cancelar">Cancelar</button>
          <button className="btn-guardar">Guardar Asistencia</button>
        </div>
      </div>
    </div>
  );
};

export default BodyAsistenciaCurso;
