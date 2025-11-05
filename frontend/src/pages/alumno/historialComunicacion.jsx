import React, { useState, useEffect, useCallback } from "react";

const HistorialComunicaciones = () => {
  const [reporte, setReporte] = useState(null);
  const [comunicaciones, setComunicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [comunicacionesPorPagina] = useState(10);

  // Configuración de la API
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const cargarComunicaciones = useCallback(async (idAlumno) => {
    try {
      setLoading(true);

      console.log("🔍 Cargando comunicaciones para alumno ID:", idAlumno);
      
      const url = `${API_URL}/api/v1/comunicaciones/alumno/${idAlumno}`;
      console.log("📡 URL de la petición:", url);
      
      const response = await fetch(url);
      
      console.log("📊 Response status:", response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log("ℹ️ No se encontraron comunicaciones (404)");
          setComunicaciones([]);
          setLoading(false);
          return;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("✅ Datos recibidos del servidor:", result);
      console.log("📊 Tipo de result:", typeof result);
      console.log("📊 Es array?:", Array.isArray(result));
      console.log("📊 result.datos existe?:", !!result.datos);
      console.log("📊 result.datos es array?:", Array.isArray(result.datos));
      console.log("📊 result.data existe?:", !!result.data);
      console.log("📊 result.exito:", result.exito);
      
      // Extrae las comunicaciones del formato de respuesta
      let comunicacionesData = [];
      
      // IMPORTANTE: La API devuelve "datos" no "data"
      if (result.exito && Array.isArray(result.datos)) {
        comunicacionesData = result.datos;
        console.log("📋 Formato detectado: {exito, datos}");
      } else if (result.datos && Array.isArray(result.datos)) {
        comunicacionesData = result.datos;
        console.log("📋 Formato detectado: {datos}");
      } else if (result.data && Array.isArray(result.data)) {
        comunicacionesData = result.data;
        console.log("📋 Formato detectado: {data}");
      } else if (Array.isArray(result)) {
        comunicacionesData = result;
        console.log("📋 Formato detectado: Array directo");
      } else {
        console.log("⚠️ Formato de respuesta no reconocido");
        console.log("⚠️ Estructura completa:", JSON.stringify(result, null, 2));
      }
      
      console.log("✨ Comunicaciones procesadas:", comunicacionesData);
      console.log("🔢 Cantidad de comunicaciones:", comunicacionesData.length);
      console.log("🔢 Primera comunicación:", comunicacionesData[0]);
      
      // CRITICAL: Actualiza el estado
      console.log("⚡ Actualizando estado con", comunicacionesData.length, "comunicaciones");
      setComunicaciones(comunicacionesData);
      console.log("✅ Estado actualizado");
      
    } catch (err) {
      console.error('❌ Error al cargar comunicaciones:', err);
      setComunicaciones([]);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    const storedData = sessionStorage.getItem("reporteAlumno");
    
    console.log("🔎 Verificando sessionStorage...");
    
    if (storedData) {
      try {
        const dataToSet = JSON.parse(storedData);
        console.log("📦 Datos del sessionStorage:", dataToSet);
        setReporte(dataToSet);
        
        // Intenta obtener el ID de diferentes formas
        const idAlumno = dataToSet?.alumno?.id_alumno || 
                        dataToSet?.alumno?.id || 
                        dataToSet?.id_alumno || 
                        dataToSet?.id;
        
        console.log("🆔 ID del alumno encontrado:", idAlumno);
        
        if (idAlumno) {
          cargarComunicaciones(idAlumno);
        } else {
          console.error("❌ No se encontró id del alumno");
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Error al parsear datos:", error);
        setLoading(false);
      }
    } else {
      console.error("❌ No hay datos en sessionStorage");
      setLoading(false);
    }
  }, [cargarComunicaciones]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha no disponible";
    
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) return fecha;
      
      return date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return fecha;
    }
  };

  const handleVolver = useCallback(() => {
    window.history.back();
  }, []);

  // Cálculos de paginación
  const indexUltimaComunicacion = paginaActual * comunicacionesPorPagina;
  const indexPrimeraComunicacion = indexUltimaComunicacion - comunicacionesPorPagina;
  const comunicacionesActuales = comunicaciones.slice(indexPrimeraComunicacion, indexUltimaComunicacion);
  const totalPaginas = Math.ceil(comunicaciones.length / comunicacionesPorPagina);

  // Función para cambiar de página
  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // LOADING STATE
  if (loading) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5"
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p style={{ marginTop: "20px", color: "#666" }}>Cargando comunicaciones...</p>
      </div>
    );
  }

  // ERROR STATE - No hay reporte
  if (!reporte) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px"
      }}>
        <span className="material-symbols-outlined" style={{
          fontSize: "64px",
          color: "#dc3545",
          marginBottom: "20px"
        }}>
          error_outline
        </span>
        <h5>No se encontraron datos del alumno.</h5>
        <p style={{ color: "#6c757d" }}>
          Vuelve al perfil e intenta nuevamente.
        </p>
        <button 
          style={{
            padding: "10px 30px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
            fontSize: "16px",
            fontWeight: "500"
          }}
          onClick={handleVolver}
        >
          Volver
        </button>
      </div>
    );
  }

  console.log("🎨 Renderizando componente con", comunicaciones.length, "comunicaciones");

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      padding: "20px",
      position: "relative"
    }}>
      {/* Botón Volver */}
      <button
        onClick={handleVolver}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#1976d2",
          fontSize: "16px",
          fontWeight: "500",
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#e3f2fd";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Volver
      </button>

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "30px",
        marginTop: "60px"
      }}>
        <span className="material-symbols-outlined" style={{
          fontSize: "40px",
          color: "#1976d2"
        }}>
          chat
        </span>
        <h2 style={{
          margin: 0,
          color: "#333",
          fontSize: "28px"
        }}>
          Historial de Comunicaciones
        </h2>
      </div>

      {/* Card de Información del Alumno */}
      <div style={{
       backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: "20px"
      }}>
        <div style={{
          fontSize: "60px",
          color: "#1976d2"
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: "inherit" }}>
            account_circle
          </span>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: "0 0 10px 0",
            color: "#333",
            fontSize: "24px"
          }}>
            {reporte?.apellido || reporte?.alumno?.apellido || ''}, {reporte?.nombre || reporte?.alumno?.nombre || ''}
          </h3>
          <div style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            color: "#666",
            fontSize: "14px"
          }}>
            <span>
              <strong>DNI:</strong> {reporte?.dni || reporte?.alumno?.dni || 'N/A'}
            </span>
            {(reporte?.curso?.anio || reporte?.curso?.anio_curso) && (
              <span>
                <strong>Curso:</strong> {reporte?.curso?.anio || reporte?.curso?.anio_curso}° {reporte?.curso?.division || ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Contenedor de Comunicaciones */}
      <div>
        {comunicaciones.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            border: "2px dashed #dee2e6",
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: "64px",
              color: "#6c757d",
              marginBottom: "16px",
              display: "block"
            }}>
              mail_outline
            </span>
            <h5 style={{ color: "#495057", marginBottom: "8px" }}>
              No hay comunicaciones registradas
            </h5>
            <p style={{ color: "#6c757d", margin: 0 }}>
              Este alumno no tiene comunicaciones enviadas aún.
            </p>
          </div>
        ) : (
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "20px" 
          }}>
            <div style={{
              backgroundColor: "#d4edda",
              padding: "12px",
              borderRadius: "8px",
              color: "#155724",
              fontWeight: "500"
            }}>
              ✅ Se encontraron {comunicaciones.length} comunicación(es) | Página {paginaActual} de {totalPaginas}
            </div>

            {comunicacionesActuales.map((comunicacion, index) => {
              console.log("🎨 Renderizando comunicación", index, ":", comunicacion);
              return (
                <div
                  key={comunicacion.id_comunicacion || comunicacion.id || index}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    padding: "24px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "1px solid #e0e0e0",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      flex: 1,
                    }}>
                      <span className="material-symbols-outlined" style={{
                        color: "#1976d2",
                        fontSize: "28px",
                      }}>
                        email
                      </span>
                      <div>
                        <h5 style={{
                          margin: 0,
                          color: "#212529",
                          fontSize: "18px",
                          fontWeight: "600",
                        }}>
                          {comunicacion.asunto || comunicacion.titulo || "Sin asunto"}
                        </h5>
                        {(comunicacion.id_comunicacion || comunicacion.id) && (
                          <span style={{
                            display: "inline-block",
                            backgroundColor: "#1976d2",
                            color: "#fff",
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                            marginTop: "6px",
                          }}>
                            ID: {comunicacion.id_comunicacion || comunicacion.id}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#6c757d",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                        schedule
                      </span>
                      {formatearFecha(comunicacion.fecha_envio || comunicacion.fecha || comunicacion.createdAt)}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    borderLeft: "4px solid #1976d2",
                  }}>
                    <p style={{
                      margin: 0,
                      color: "#495057",
                      lineHeight: "1.6",
                      fontSize: "15px",
                      whiteSpace: "pre-wrap"
                    }}>
                      {comunicacion.contenido || comunicacion.mensaje || comunicacion.body || "Sin contenido"}
                    </p>
                  </div>

                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingTop: "12px",
                    borderTop: "1px solid #e0e0e0",
                  }}>
                    <span className="material-symbols-outlined" style={{
                      color: "#6c757d",
                      fontSize: "24px",
                    }}>
                      person
                    </span>
                    <div>
                      <strong style={{
                        display: "block",
                        color: "#212529",
                        fontSize: "14px",
                        marginBottom: "2px",
                      }}>
                        {comunicacion.nombre_tutor || comunicacion.remitente || comunicacion.autor || "Sistema"}
                      </strong>
                      {(comunicacion.email || comunicacion.email_remitente) && (
                        <small style={{
                          color: "#6c757d",
                          fontSize: "13px",
                        }}>
                          {comunicacion.email || comunicacion.email_remitente}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Controles de Paginación */}
            {totalPaginas > 1 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                marginTop: "30px",
                padding: "20px",
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}>
                {/* Botón Anterior */}
                <button
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: paginaActual === 1 ? "#e0e0e0" : "#1976d2",
                    color: paginaActual === 1 ? "#999" : "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: paginaActual === 1 ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (paginaActual !== 1) {
                      e.currentTarget.style.backgroundColor = "#1565c0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (paginaActual !== 1) {
                      e.currentTarget.style.backgroundColor = "#1976d2";
                    }
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                    chevron_left
                  </span>
                  Anterior
                </button>

                {/* Números de página */}
                <div style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                }}>
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numero) => (
                    <button
                      key={numero}
                      onClick={() => cambiarPagina(numero)}
                      style={{
                        padding: "10px 16px",
                        backgroundColor: paginaActual === numero ? "#1976d2" : "#fff",
                        color: paginaActual === numero ? "#fff" : "#1976d2",
                        border: `2px solid ${paginaActual === numero ? "#1976d2" : "#e0e0e0"}`,
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: paginaActual === numero ? "600" : "500",
                        minWidth: "45px",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (paginaActual !== numero) {
                          e.currentTarget.style.backgroundColor = "#e3f2fd";
                          e.currentTarget.style.borderColor = "#1976d2";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (paginaActual !== numero) {
                          e.currentTarget.style.backgroundColor = "#fff";
                          e.currentTarget.style.borderColor = "#e0e0e0";
                        }
                      }}
                    >
                      {numero}
                    </button>
                  ))}
                </div>

                {/* Botón Siguiente */}
                <button
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: paginaActual === totalPaginas ? "#e0e0e0" : "#1976d2",
                    color: paginaActual === totalPaginas ? "#999" : "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: paginaActual === totalPaginas ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (paginaActual !== totalPaginas) {
                      e.currentTarget.style.backgroundColor = "#1565c0";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (paginaActual !== totalPaginas) {
                      e.currentTarget.style.backgroundColor = "#1976d2";
                    }
                  }}
                >
                  Siguiente
                  <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                    chevron_right
                  </span>
                </button>
              </div>
            )}

            {/* Información de paginación */}
            {comunicaciones.length > 0 && (
              <div style={{
                textAlign: "center",
                marginTop: "15px",
                color: "#6c757d",
                fontSize: "14px",
              }}>
                Mostrando {indexPrimeraComunicacion + 1} - {Math.min(indexUltimaComunicacion, comunicaciones.length)} de {comunicaciones.length} comunicaciones
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistorialComunicaciones;