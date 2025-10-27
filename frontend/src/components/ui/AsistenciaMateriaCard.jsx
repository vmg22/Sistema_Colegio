import React from 'react';

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    backgroundColor: '#303f9f', // Primary Dark
    color: 'white',
    padding: '12px 20px',
    borderTopLeftRadius: '15px',
    borderTopRightRadius: '15px',
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.1rem', // 18px
    fontWeight: 600,
    color: 'white',
  },
  body: {
    padding: '20px',
  },
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: '20px',
  },
  statBlock: {
    width: '100px', // Ancho fijo para alinear
  },
  statValue: {
    fontSize: '2.25rem', // 36px
    fontWeight: 600,
    margin: 0,
  },
  statLabel: {
    fontSize: '0.9rem', // 14px
    color: '#555',
    margin: 0,
  },
  detailsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 10px',
    fontSize: '0.875rem', // 14px
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  presenteDot: {
    backgroundColor: '#4caf50', // Success
  },
  ausenteDot: {
    backgroundColor: '#f44336', // Error
  },
  presenteText: {
    color: '#333',
  },
  ausenteText: {
    color: '#333',
  },
};

const AsistenciaMateriaCard = ({ materiaNombre, stats }) => {
  // Lógica para el color
  const esBajo = stats.porcentaje < 75;
  const colorAsistencia = esBajo ? '#f44336' : '#4caf50'; // Rojo (Error) si es bajo, Verde (Success) si no

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h4 style={styles.headerTitle}>{materiaNombre}</h4>
      </div>
      <div style={styles.body}>
        <div style={styles.statsContainer}>
          {/* Bloque Asistencia */}
          <div style={styles.statBlock}>
            <h2 style={{ ...styles.statValue, color: colorAsistencia }}>
              {stats.porcentaje}%
            </h2>
            <p style={styles.statLabel}>Asistencia</p>
          </div>
          {/* Bloque Faltas */}
          <div style={styles.statBlock}>
            <h2 style={styles.statValue}>{stats.faltas}</h2>
            <p style={styles.statLabel}>Faltas</p>
          </div>
        </div>
        <div style={styles.detailsContainer}>
          {/* Detalle Presente */}
          <div style={styles.detailItem}>
            <span style={{ ...styles.dot, ...styles.presenteDot }}></span>
            <span style={styles.presenteText}>Presente: {stats.presentes} clases</span>
          </div>
          {/* Detalle Ausente */}
          <div style={styles.detailItem}>
            <span style={{ ...styles.dot, ...styles.ausenteDot }}></span>
            <span style={styles.ausenteText}>Ausente: {stats.faltas} clases</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsistenciaMateriaCard;
