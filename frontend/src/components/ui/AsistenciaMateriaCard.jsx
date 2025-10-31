import React from 'react';
import '../../styles/asistenciaMateriaCard.css';

const AsistenciaMateriaCard = ({ materiaNombre, stats }) => {
  // Lógica para el color
  const esBajo = stats.porcentaje < 75;
  const colorClass = esBajo ? 'asistencia-card__stat-value--bajo' : 'asistencia-card__stat-value--alto';

  return (
    <div className="asistencia-card">
      <div className="asistencia-card__header">
        <h4 className="asistencia-card__header-title">{materiaNombre}</h4>
      </div>
      <div className="asistencia-card__body">
        <div className="asistencia-card__stats-container">
          {/* Bloque Asistencia */}
          <div className="asistencia-card__stat-block">
            <h2 className={`asistencia-card__stat-value ${colorClass}`}>
              {stats.porcentaje}%
            </h2>
            <p className="asistencia-card__stat-label">Asistencia</p>
          </div>
          {/* Bloque Faltas */}
          <div className="asistencia-card__stat-block">
            <h2 className="asistencia-card__stat-value">{stats.faltas}</h2>
            <p className="asistencia-card__stat-label">Faltas</p>
          </div>
        </div>
        <div className="asistencia-card__details-container">
          {/* Detalle Presente */}
          <div className="asistencia-card__detail-item">
            <span className="asistencia-card__dot asistencia-card__dot--presente"></span>
            <span className="asistencia-card__text">Presente: {stats.presentes} clases</span>
          </div>
          {/* Detalle Ausente */}
          <div className="asistencia-card__detail-item">
            <span className="asistencia-card__dot asistencia-card__dot--ausente"></span>
            <span className="asistencia-card__text">Ausente: {stats.faltas} clases</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsistenciaMateriaCard;