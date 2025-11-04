import React from "react";
import "../../styles/estadoAcademicoCard.css";

// Función para asignar clase al estado
const getEstadoClass = (estado) => {
  switch (estado) {
    case "aprobado":
    case "aprobada":
      return "estado-academico-card__estado--aprobado";
    case "reprobado":
    case "desaprobada":
    case "libre":
    case "previa":
      return "estado-academico-card__estado--reprobado";
    case "cursando":
    default:
      return "estado-academico-card__estado--cursando";
  }
};

const EstadoAcademicoCard = ({ materiaNombre, data }) => {
  const { calificaciones, estado_final } = data;
  // Buscamos la calificación definitiva DENTRO del array 'calificaciones'.
  // Encontramos el primer cuatrimestre que tenga un valor en 'calificacion_definitiva'.
  const cuatrimestreConDefinitiva = calificaciones.find(
    (c) => c.calificacion_definitiva
  );
  // 3. Obtenemos el valor, o 'null' si no se encontró
  const notaFinal = cuatrimestreConDefinitiva
    ? cuatrimestreConDefinitiva.calificacion_definitiva
    : null;
  console.log(data);
  return (
    <div className="estado-academico-card">
      {/* --- Header --- */}
      <div className="estado-academico-card__header">
        <h3 className="estado-academico-card__header-title">{materiaNombre}</h3>
      </div>

      {/* --- Contenido --- */}
      <div className="estado-academico-card__content">
        {/* --- Sección Cuatrimestres --- */}
        <div className="estado-academico-card__section">
          <h4 className="estado-academico-card__section-title">
            Cuatrimestres
          </h4>
          <div className="estado-academico-card__cuatrimestre-container">
            {calificaciones && calificaciones.length > 0 ? (
              calificaciones.map((c) => (
                <div
                  key={c.cuatrimestre}
                  className="estado-academico-card__cuatrimestre-box"
                >
                  {/* Etiqueta del Cuatrimestre */}
                  <p className="estado-academico-card__cuatrimestre-label">
                    {c.cuatrimestre}° Cuat.
                  </p>

                  {/* Detalle de Notas Individuales */}
                  <div className="estado-academico-card__notas-container">
                    {c.notas && c.notas.length > 0 ? (
                      c.notas.map((nota, index) => (
                        <div
                          key={index}
                          className={
                            nota
                              ? "estado-academico-card__nota-box"
                              : "estado-academico-card__nota-box--null"
                          }
                        >
                          {nota ? parseFloat(nota).toFixed(1) : "-"}
                        </div>
                      ))
                    ) : (
                      <p className="estado-academico-card__no-data">
                        Sin notas
                      </p>
                    )}
                  </div>

                  {/* Promedio separado */}
                  <div className="estado-academico-card__promedio-container">
                    <p className="estado-academico-card__promedio-label">
                      Promedio
                    </p>
                    <p className="estado-academico-card__cuatrimestre-promedio">
                      {c.promedio ? parseFloat(c.promedio).toFixed(2) : "-"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="estado-academico-card__no-data">
                Sin datos de cuatrimestres.
              </p>
            )}
          </div>
        </div>

        {/* --- Sección Estado Final --- */}
        <div className="estado-academico-card__section">
          <h4 className="estado-academico-card__section-title">Estado Final</h4>
          <div className="estado-academico-card__final-container">
            <div className="estado-academico-card__final-box">
              <p className="estado-academico-card__final-label">Estado</p>
              <p
                className={`estado-academico-card__final-value ${getEstadoClass(
                  estado_final
                )}`}
              >
                {estado_final || "-"}
              </p>
            </div>
            <div className="estado-academico-card__final-box">
              <p className="estado-academico-card__final-label">Nota Final</p>
              <p className="estado-academico-card__nota-final">
                {notaFinal ? parseFloat(notaFinal).toFixed(2) : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadoAcademicoCard;
