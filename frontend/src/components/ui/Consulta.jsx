// src/components/ui/ConsultaMonitor.jsx
import React from 'react';
import { useConsultaStore } from '../../store/consultaStore'; // Importar tu store

const Consulta = () => {
    // 1. Leer los valores del estado global de Zustand
    const alumnoDni = useConsultaStore(state => state.alumnoDni);
    const alumnoAnio = useConsultaStore(state => state.alumnoAnio);

    return (
        <div style={{ 
            border: '1px solid #ccc', 
            padding: '10px', 
            marginTop: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '5px'
        }}>
            <h5>Estado Global (Zustand) - Prueba:</h5>
            <p>
                <strong>DNI Alumno:</strong> 
                <span style={{ color: alumnoDni ? 'green' : 'red', fontWeight: 'bold' }}>
                    {alumnoDni || "VACÍO"}
                </span>
            </p>
            <p>
                <strong>Año de Consulta:</strong> 
                <span style={{ color: 'green', fontWeight: 'bold' }}>
                    {alumnoAnio}
                </span>
            </p>
            <small>Este componente se actualiza automáticamente.</small>
        </div>
    );
};

export default Consulta;