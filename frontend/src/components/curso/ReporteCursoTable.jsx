import React from 'react';
import { Table, Badge } from 'react-bootstrap';

// Estilos
const styles = {
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    overflow: 'hidden',
    fontFamily: "'Inter', sans-serif",
  },
  th: {
    backgroundColor: '#f4f7fa',
    color: '#303F9F',
    fontWeight: 600,
    fontSize: '0.9rem',
    verticalAlign: 'middle',
  },
  td: {
    verticalAlign: 'middle',
    fontSize: '0.95rem',
  },
  notaBuena: {
    color: '#333',
    fontWeight: 500,
  },
  notaMala: {
    color: '#f44336', // Rojo (Error)
    fontWeight: 700,
  },
  asistenciaBuena: {
    color: '#4caf50', // Verde (Success)
    fontWeight: 600,
  },
  asistenciaMala: {
    color: '#f44336', // Rojo (Error)
    fontWeight: 600,
  },
};

// Helper para estilo de notas
const getNotaStyle = (nota) => {
  const n = parseFloat(nota);
  return (n < 6) ? styles.notaMala : styles.notaBuena;
};

// Helper para calcular y estilar asistencia
const getAsistenciaStyle = (asistencias) => {
  const { presentes, total } = asistencias;
  if (total === 0) return { style: styles.notaBuena, text: '100%' };
  
  const porcentaje = Math.round((presentes / total) * 100);
  const style = (porcentaje < 75) ? styles.asistenciaMala : styles.asistenciaBuena;
  return { style, text: `${porcentaje}%` };
};

const ReporteCursoTable = ({ alumnos }) => {
  return (
    <div style={styles.tableContainer}>
      <Table hover responsive="lg">
        {/* --- Encabezado de la Tabla --- */}
        <thead>
          <tr>
            <th style={styles.th}>N°</th>
            <th style={styles.th}>Alumno (Nombre Completo)</th>
            <th style={styles.th}>DNI</th>
            <th style={{ ...styles.th, textAlign: 'center' }}>Nota 1</th>
            <th style={{ ...styles.th, textAlign: 'center' }}>Nota 2</th>
            <th style={{ ...styles.th, textAlign: 'center' }}>Nota 3</th>
            <th style={{ ...styles.th, textAlign: 'center' }}>Promedio</th>
            <th style={{ ...styles.th, textAlign: 'center' }}>Asistencia</th>
            <th style={{ ...styles.th, textAlign: 'center' }}>Faltas</th>
          </tr>
        </thead>
        
        {/* --- Cuerpo de la Tabla --- */}
        <tbody>
          {alumnos.map((item, index) => {
            const { alumno, calificaciones, asistencias } = item;
            const asistenciaInfo = getAsistenciaStyle(asistencias);

            return (
              <tr key={alumno.id}>
                <td style={styles.td}><strong>{index + 1}</strong></td>
                <td style={styles.td}>{alumno.nombreCompleto}</td>
                <td style={styles.td}>{alumno.dni}</td>
                
                {/* Calificaciones */}
                <td style={{ ...styles.td, ...getNotaStyle(calificaciones.nota1), textAlign: 'center' }}>
                  {calificaciones.nota1 ? parseFloat(calificaciones.nota1).toFixed(2) : '-'}
                </td>
                <td style={{ ...styles.td, ...getNotaStyle(calificaciones.nota2), textAlign: 'center' }}>
                  {calificaciones.nota2 ? parseFloat(calificaciones.nota2).toFixed(2) : '-'}
                </td>
                <td style={{ ...styles.td, ...getNotaStyle(calificaciones.nota3), textAlign: 'center' }}>
                  {calificaciones.nota3 ? parseFloat(calificaciones.nota3).toFixed(2) : '-'}
                </td>
                <td style={{ ...styles.td, ...getNotaStyle(calificaciones.promedio), textAlign: 'center', fontWeight: '700' }}>
                  {calificaciones.promedio ? parseFloat(calificaciones.promedio).toFixed(2) : '-'}
                </td>
                
                {/* Asistencias */}
                <td style={{ ...styles.td, ...asistenciaInfo.style, textAlign: 'center' }}>
                  {asistenciaInfo.text}
                </td>
                <td style={{ ...styles.td, textAlign: 'center', fontWeight: '500', color: asistencias.ausentes > 0 ? '#f44336' : '#333' }}>
                  {asistencias.ausentes}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default ReporteCursoTable;

