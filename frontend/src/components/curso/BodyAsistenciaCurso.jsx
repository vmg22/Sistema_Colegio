import React from 'react'
import { useState, useRef } from 'react';
import "../../styles/asistenciaCurso.css"

const BodyAsistenciaCurso = () => {
const formatearFecha = (dateObj) => {
    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Intl.DateTimeFormat('es-ES', opciones).format(dateObj);
};

const getFechaISO = (dateObj) => {
    const anio = dateObj.getFullYear();
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dia = String(dateObj.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
}

  const [fecha, setFecha] = useState(formatearFecha(new Date()));
  const [busqueda, setBusqueda] = useState("");
  const [alumnos, setAlumnos] = useState([
        { id: 1, nombre: "González, María", asistencia: "" },
        { id: 2, nombre: "López, Carlos", asistencia: "" },
        { id: 3, nombre: "Martínez, Ana", asistencia: "" },
        { id: 4, nombre: "Rodríguez, Pedro", asistencia: "" }
  ]);

  // 5. Crea una referencia para el input de fecha
  const dateInputRef = useRef(null);

  const alumnosFiltrados = alumnos.filter(alumno =>
        alumno.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleAsistenciaChange = (id, tipo) => {
        setAlumnos(alumnos.map(alumno =>
            alumno.id === id ? { ...alumno, asistencia: tipo } : alumno
        ));
  };

  // 6. Handler para cuando la fecha cambia en el input
  const handleDateChange = (e) => {
        if (e.target.value) {
            // El valor viene como "YYYY-MM-DD"
            const [year, month, day] = e.target.value.split('-');
            // Creamos el objeto Date (cuidado, mes es 0-indexado)
            const dateObj = new Date(year, month - 1, day);
            
            // Actualizamos el estado 'fecha' con el string formateado
            setFecha(formatearFecha(dateObj));
        }
  };

    return (
        <div className="asistencia-panel">
            <div className="fecha-section">
                <input
                    type="date"
                    ref={dateInputRef}
                    style={{
                        opacity: 0,
                        position: 'absolute',
                        width: 0,
                        height: 0,
                        zIndex: -1,
                    }}
                    onChange={handleDateChange}
                    defaultValue={getFechaISO(new Date())} 
                />
                {/* (Le volví a poner el "Hoy:" para que se entienda) */}
                <h2>Hoy: {fecha}</h2>
                
                <button 
                    className="btn-cambiar-fecha"
                    onClick={() => dateInputRef.current?.click()}
                >
                    Cambiar Fecha
                </button>

            </div>

            <hr />

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

            {/* Lista de alumnos */}
            <div className="lista-alumnos">
                {alumnosFiltrados.map((alumno) => (
                    <div key={alumno.id} className="alumno-item">
                        <span className="nombre-alumno">{alumno.nombre}</span>
                        <div className="opciones-asistencia">
                            <button
                                className={`btn-asistencia ${alumno.asistencia === 'P' ? 'active' : ''}`}
                                onClick={() => handleAsistenciaChange(alumno.id, 'P')}
                            >
                                P
                            </button>
                            <button
                                className={`btn-asistencia ${alumno.asistencia === 'A' ? 'active' : ''}`}
                                onClick={() => handleAsistenciaChange(alumno.id, 'A')}
                            >
                                A
                            </button>
                            <button
                                className={`btn-asistencia ${alumno.asistencia === 'J' ? 'active' : ''}`}
                                onClick={() => handleAsistenciaChange(alumno.id, 'J')}
                            >
                                J
                            </button>
                            <button
                                className={`btn-asistencia ${alumno.asistencia === 'T' ? 'active' : ''}`}
                                onClick={() => handleAsistenciaChange(alumno.id, 'T')}
                            >
                                T
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <hr />

            {/* Resumen y acciones */}
            <div className="acciones-section">
                <button className="btn-resumen">
                    Ver Resumen Mensual
                </button>
                
                <div className="botones-accion">
                    <button className="btn-cancelar">
                        Cancelar
                    </button>
                    <button className="btn-guardar">
                        Guardar Asistencia
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BodyAsistenciaCurso