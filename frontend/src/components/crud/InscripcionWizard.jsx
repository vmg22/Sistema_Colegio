import React, { useState, useEffect } from 'react';

// (Asumimos que tienes una función para llamar a tu API)
// import { api } from '../services/api'; 

// Datos de ejemplo para los dropdowns. 
// ¡En una app real, cárgalos con useEffect!
const ANIOS_LECTIVOS_MOCK = [
  { id: 1, anio: 2025 }
];
const CURSOS_MOCK = [
  { id_curso: 1, nombre: "1ro A", anio: 1 },
  { id_curso: 2, nombre: "2do A", anio: 2 }
];


function InscripcionWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Estados para los datos de los formularios
  const [alumnoData, setAlumnoData] = useState({
    dni_alumno: '',
    nombre_alumno: '',
    apellido_alumno: '',
    fecha_nacimiento: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  const [tutorData, setTutorData] = useState({
    dni_tutor: '',
    nombre: '',
    apellido: '',
    parentesco: 'madre',
    email: '',
    telefono: '',
  });

  const [inscripcionData, setInscripcionData] = useState({
    id_curso: CURSOS_MOCK[0].id_curso,
    anio_lectivo: ANIOS_LECTIVOS_MOCK[0].anio,
  });
  
  // --- Manejadores de Formularios ---

  const handleAlumnoChange = (e) => {
    setAlumnoData({ ...alumnoData, [e.target.name]: e.target.value });
  };
  
  const handleTutorChange = (e) => {
    setTutorData({ ...tutorData, [e.target.name]: e.target.value });
  };
  
  const handleInscripcionChange = (e) => {
    setInscripcionData({ ...inscripcionData, [e.target.name]: e.target.value });
  };
  
  // --- Búsqueda de Tutor por DNI (Opcional pero recomendado) ---
  const checkTutorDNI = async () => {
    if (tutorData.dni_tutor.length < 7) return;
    
    // setLoading(true);
    // const data = await api.get(`/api/tutores/dni/${tutorData.dni_tutor}`);
    // if (data) {
    //   setTutorData(data); // Autocompleta si existe
    // }
    // setLoading(false);
    console.log("Comprobando DNI del tutor...");
  };
  
  // --- Lógica del Wizard ---
  
  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  // --- Envío Final al Backend ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // 1. Armamos el JSON exacto que espera el backend
    const payload = {
      alumnoData,
      tutorData,
      inscripcionData
    };

    try {
      // 2. Enviamos el JSON
      const response = await fetch('http://localhost:4000/api/inscripciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
      }
      
      // 3. ¡Éxito!
      setSuccess(`¡Alumno inscrito con éxito! ID: ${data.id_alumno}`);
      setStep(1); // Opcional: resetear el form

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  // --- Renderizado ---

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div>
            <h3>Paso 1: Datos del Alumno</h3>
            <input name="dni_alumno" placeholder="DNI Alumno" value={alumnoData.dni_alumno} onChange={handleAlumnoChange} />
            <input name="nombre_alumno" placeholder="Nombre" value={alumnoData.nombre_alumno} onChange={handleAlumnoChange} />
            <input name="apellido_alumno" placeholder="Apellido" value={alumnoData.apellido_alumno} onChange={handleAlumnoChange} />
            <input name="fecha_nacimiento" type="date" value={alumnoData.fecha_nacimiento} onChange={handleAlumnoChange} />
            <input name="email" placeholder="Email" value={alumnoData.email} onChange={handleAlumnoChange} />
            <input name="telefono" placeholder="Teléfono" value={alumnoData.telefono} onChange={handleAlumnoChange} />
            <input name="direccion" placeholder="Dirección" value={alumnoData.direccion} onChange={handleAlumnoChange} />
          </div>
        );
      case 2:
        return (
          <div>
            <h3>Paso 2: Datos del Tutor</h3>
            <input name="dni_tutor" placeholder="DNI Tutor" value={tutorData.dni_tutor} onChange={handleTutorChange} onBlur={checkTutorDNI} />
            <input name="nombre" placeholder="Nombre Tutor" value={tutorData.nombre} onChange={handleTutorChange} />
            <input name="apellido" placeholder="Apellido Tutor" value={tutorData.apellido} onChange={handleTutorChange} />
            <input name="email" placeholder="Email Tutor" value={tutorData.email} onChange={handleTutorChange} />
            <input name="telefono" placeholder="Teléfono Tutor" value={tutorData.telefono} onChange={handleTutorChange} />
            <select name="parentesco" value={tutorData.parentesco} onChange={handleTutorChange}>
              <option value="madre">Madre</option>
              <option value="padre">Padre</option>
              <option value="tutor legal">Tutor Legal</option>
              <option value="otro">Otro</option>
            </select>
          </div>
        );
      case 3:
        return (
          <div>
            <h3>Paso 3: Datos Académicos</h3>
            <label>Año Lectivo:</label>
            <select name="anio_lectivo" value={inscripcionData.anio_lectivo} onChange={handleInscripcionChange}>
              {ANIOS_LECTIVOS_MOCK.map(a => <option key={a.id} value={a.anio}>{a.anio}</option>)}
            </select>
            <br/>
            <label>Inscribir al Curso:</label>
            <select name="id_curso" value={inscripcionData.id_curso} onChange={handleInscripcionChange}>
              {CURSOS_MOCK.map(c => <option key={c.id_curso} value={c.id_curso}>{c.nombre}</option>)}
            </select>
          </div>
        );
      case 4:
        return (
          <div>
            <h3>Paso 4: Resumen y Confirmar</h3>
            <p><strong>Alumno:</strong> {alumnoData.nombre_alumno} {alumnoData.apellido_alumno}</p>
            <p><strong>Tutor:</strong> {tutorData.nombre} {tutorData.apellido}</p>
            <p><strong>Curso:</strong> {CURSOS_MOCK.find(c => c.id_curso == inscripcionData.id_curso)?.nombre}</p>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}

      {renderStep()}

      <div style={{ marginTop: '20px' }}>
        {step > 1 && !success && <button type="button" onClick={prevStep}>Anterior</button>}
        {step < 4 && !success && <button type="button" onClick={nextStep}>Siguiente</button>}
        {step === 4 && !success && <button type="submit" disabled={loading}>{loading ? 'Inscribiendo...' : 'Confirmar e Inscribir'}</button>}
      </div>
    </form>
  );
}

export default InscripcionWizard;