import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useConsultaStore } from "../../store/consultaStore";
import { getReporteAlumno } from "../../services/reportesService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../../styles/actaVolanteExamen.css";

const ActaVolanteExamen = () => {
  const navigate = useNavigate();
  
  const { alumnoDni, alumnoAnio, reporteAlumno, setReporteAlumno } = useConsultaStore();

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [datosFormulario, setDatosFormulario] = useState({
    establecimiento: "",
    examenes: "",
    asignatura: "",
    anio: "",
    division: "",
    turno: "",
    dia: "",
    mes: "",
    anioActual: "",
    alumnos: Array(31).fill(null).map((_, index) => ({
      numero: index + 1,
      permiso: "",
      apellidoNombres: "",
      esc: "",
      oral: "",
      prom: "",
      escBolilla: "",
      oralBolilla: "",
      documento: ""
    })),
    presidente: "",
    vocal1: "",
    vocal2: "",
    totalAlumnos: "",
    aprobados: "",
    aplazados: "",
    ausentes: ""
  });
  
  const refActa = useRef();

  // Memoizar función auxiliar
  const obtenerMesActual = useMemo(() => {
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
    ];
    return meses[new Date().getMonth()];
  }, []);

  // Cargar datos del alumno
  useEffect(() => {
    const cargarDatos = async () => {
      if (!alumnoDni) {
        setError("No se encontró el DNI del alumno. Por favor, vuelve a realizar la consulta.");
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        let data = reporteAlumno;

        if (!data || data.dni !== alumnoDni) {
          const response = await getReporteAlumno(alumnoDni, alumnoAnio);
          data = response.data || response;
          setReporteAlumno(data);
        }

        const alumnoCompleto = `${data.apellido || ""}, ${data.nombre || ""}`.trim();
        const alumnos = Array(31).fill(null).map((_, index) => ({
          numero: index + 1,
          permiso: index === 0 ? "001" : "",
          apellidoNombres: index === 0 ? alumnoCompleto : "",
          esc: "",
          oral: "",
          prom: "",
          escBolilla: "",
          oralBolilla: "",
          documento: index === 0 ? (data.dni || alumnoDni) : ""
        }));

        setDatosFormulario({
          establecimiento: "Escuela...",
          examenes: "Exámenes de Alumnos",
          asignatura: "",
          anio: data.curso?.nombre || data.curso?.curso_nombre || "",
          division: data.curso?.division || data.curso?.curso_division || "",
          turno: data.curso?.turno || data.curso?.curso_turno || "",
          dia: new Date().getDate().toString(),
          mes: obtenerMesActual,
          anioActual: new Date().getFullYear().toString(),
          alumnos,
          presidente: "",
          vocal1: "",
          vocal2: "",
          totalAlumnos: "",
          aprobados: "",
          aplazados: "",
          ausentes: ""
        });

        setError("");
      } catch (err) {
        console.error("❌ Error al cargar datos:", err);
        setError(
          err.message || 
          err.data?.message || 
          "Error al cargar los datos del alumno. Por favor, intenta nuevamente."
        );
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [alumnoDni, alumnoAnio, reporteAlumno, setReporteAlumno, obtenerMesActual]);

  // Manejadores memoizados
  const manejarCambio = useCallback((e) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));
  }, []);

  const manejarCambioAlumno = useCallback((index, campo, valor) => {
    setDatosFormulario((prev) => {
      const nuevosAlumnos = [...prev.alumnos];
      nuevosAlumnos[index] = {
        ...nuevosAlumnos[index],
        [campo]: valor
      };
      return { ...prev, alumnos: nuevosAlumnos };
    });
  }, []);

  const manejarImprimir = useCallback(() => {
    window.print();
  }, []);

  const manejarDescargarPDF = useCallback(async () => {
    try {
      const element = refActa.current;
      
      // Configuración ultra-mejorada para máximo contraste
      const canvas = await html2canvas(element, { 
        scale: 4, // Máxima calidad
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector('.acta-container');
          if (clonedElement) {
            // Forzar máximo contraste en todo
            clonedElement.style.backgroundColor = '#ffffff';
            clonedElement.style.color = '#000000';
            
            // Aplicar estilos ultra-oscuros a todos los elementos
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach(el => {
              el.style.color = '#000000';
              
              // Inputs y labels más oscuros
              if (el.tagName === 'INPUT' || el.classList.contains('label')) {
                el.style.color = '#000000';
                el.style.fontWeight = '700';
              }
              
              // Bordes de tabla ultra-oscuros
              if (el.tagName === 'TH' || el.tagName === 'TD') {
                el.style.borderColor = '#000000';
                el.style.borderWidth = '1.5px';
                el.style.color = '#000000';
                el.style.fontWeight = '700';
              }
              
              // Headers de tabla con fondo
              if (el.tagName === 'TH') {
                el.style.backgroundColor = '#cccccc';
              }
            });
            
            // Forzar líneas divisorias
            clonedElement.querySelectorAll('.input-underline, .input-box').forEach(el => {
              el.style.borderBottom = '2px solid #000000';
            });
            
            clonedElement.querySelectorAll('.date-box').forEach(el => {
              el.style.border = '2px solid #000000';
            });
          }
        }
      });
      
      // Aumentar contraste del canvas
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Aplicar filtro de contraste
      const contrast = 1.5; // Factor de contraste
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] = factor * (data[i] - 128) + 128;     // Red
        data[i + 1] = factor * (data[i + 1] - 128) + 128; // Green
        data[i + 2] = factor * (data[i + 2] - 128) + 128; // Blue
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Primera página
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Páginas adicionales si necesario
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save(`ActaVolante_${datosFormulario.asignatura || 'examen'}_${datosFormulario.dia}${datosFormulario.mes}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF:", err);
      alert("Error al generar el PDF. Por favor, intenta de nuevo.");
    }
  }, [datosFormulario.asignatura, datosFormulario.dia, datosFormulario.mes]);

  const manejarVolver = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Estados visuales
  if (cargando) {
    return (
      <div className="acta-body">
        <div className="acta-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando acta volante...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="acta-body">
        <div className="acta-container">
          <div className="error-container">
            <span className="material-symbols-outlined error-icon">error</span>
            <h3>Error al cargar el acta</h3>
            <p>{error}</p>
            <button onClick={manejarVolver} className="btn-back">
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render principal
  return (
    <div className="acta-body">
      <div className="acta-container" ref={refActa}>
        <div className="acta-header">
          <h1>ACTA VOLANTE DE EXAMEN</h1>
          
          <div className="header-info">
            <div className="info-line">
              <span className="label">Establecimiento</span>
              <input
                type="text"
                name="establecimiento"
                value={datosFormulario.establecimiento}
                onChange={manejarCambio}
                className="input-underline"
              />
            </div>
            
            <div className="date-box">
              <div className="date-field">
                <label>Día</label>
                <input
                  type="text"
                  name="dia"
                  value={datosFormulario.dia}
                  onChange={manejarCambio}
                  className="input-box"
                />
              </div>
              <div className="date-field">
                <label>Mes</label>
                <input
                  type="text"
                  name="mes"
                  value={datosFormulario.mes}
                  onChange={manejarCambio}
                  className="input-box"
                />
              </div>
              <div className="date-field">
                <label>Año</label>
                <input
                  type="text"
                  name="anioActual"
                  value={datosFormulario.anioActual}
                  onChange={manejarCambio}
                  className="input-box"
                />
              </div>
            </div>
          </div>

          <div className="info-line">
            <span className="label">Exámenes de Alumnos</span>
            <input
              type="text"
              name="examenes"
              value={datosFormulario.examenes}
              onChange={manejarCambio}
              className="input-underline"
            />
          </div>

          <div className="asignatura-line">
            <div className="asignatura-field">
              <span className="label">Asignatura</span>
              <input
                type="text"
                name="asignatura"
                value={datosFormulario.asignatura}
                onChange={manejarCambio}
                className="input-underline flex-grow"
              />
            </div>
            <div className="curso-info">
              <span className="label">Año</span>
              <input
                type="text"
                name="anio"
                value={datosFormulario.anio}
                onChange={manejarCambio}
                className="input-small"
              />
              <span className="label">Div.</span>
              <input
                type="text"
                name="division"
                value={datosFormulario.division}
                onChange={manejarCambio}
                className="input-small"
              />
              <span className="label">Turno</span>
              <input
                type="text"
                name="turno"
                value={datosFormulario.turno}
                onChange={manejarCambio}
                className="input-small"
              />
            </div>
          </div>
        </div>

        <table className="tabla-alumnos">
          <thead>
            <tr>
              <th rowSpan="2">N° de Orden</th>
              <th rowSpan="2">N° de Permiso</th>
              <th rowSpan="2">APELLIDO Y NOMBRES</th>
              <th colSpan="3">Calificaciones</th>
              <th colSpan="2">N° de Bolillas</th>
              <th rowSpan="2">DOCUMENTO DE IDENTIDAD</th>
            </tr>
            <tr>
              <th>Esc.</th>
              <th>Oral</th>
              <th>Prom</th>
              <th>Esc.</th>
              <th>Oral</th>
            </tr>
          </thead>
          <tbody>
            {datosFormulario.alumnos.map((alumno, index) => (
              <tr key={index}>
                <td className="numero-orden">{alumno.numero}</td>
                <td>
                  <input
                    type="text"
                    value={alumno.permiso}
                    onChange={(e) => manejarCambioAlumno(index, 'permiso', e.target.value)}
                    className="input-tabla"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={alumno.apellidoNombres}
                    onChange={(e) => manejarCambioAlumno(index, 'apellidoNombres', e.target.value)}
                    className="input-tabla apellido-input"
                    placeholder={index === 0 ? "" : "..................................................."}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={alumno.esc}
                    onChange={(e) => manejarCambioAlumno(index, 'esc', e.target.value)}
                    className="input-tabla small"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={alumno.oral}
                    onChange={(e) => manejarCambioAlumno(index, 'oral', e.target.value)}
                    className="input-tabla small"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={alumno.prom}
                    onChange={(e) => manejarCambioAlumno(index, 'prom', e.target.value)}
                    className="input-tabla small"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={alumno.escBolilla}
                    onChange={(e) => manejarCambioAlumno(index, 'escBolilla', e.target.value)}
                    className="input-tabla small"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={alumno.oralBolilla}
                    onChange={(e) => manejarCambioAlumno(index, 'oralBolilla', e.target.value)}
                    className="input-tabla small"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={alumno.documento}
                    onChange={(e) => manejarCambioAlumno(index, 'documento', e.target.value)}
                    className="input-tabla"
                  />
                </td>
              </tr>
            ))}
            <tr className="firma-row">
              <td colSpan="9" className="firma-nota">
                Acont. del alumno deberá firmar la secretaria
              </td>
            </tr>
          </tbody>
        </table>

        <div className="footer-section">
          <div className="vocales-section">
            <div className="vocal-field">
              <span className="label">Presidente</span>
              <input
                type="text"
                name="presidente"
                value={datosFormulario.presidente}
                onChange={manejarCambio}
                className="input-underline"
              />
            </div>
            <div className="vocal-field">
              <span className="label">Vocal</span>
              <input
                type="text"
                name="vocal1"
                value={datosFormulario.vocal1}
                onChange={manejarCambio}
                className="input-underline"
              />
            </div>
            <div className="vocal-field">
              <span className="label">Vocal</span>
              <input
                type="text"
                name="vocal2"
                value={datosFormulario.vocal2}
                onChange={manejarCambio}
                className="input-underline"
              />
            </div>
          </div>

          <div className="estadisticas-section">
            <div className="stat-field">
              <span className="label">Total de alumnos</span>
              <input
                type="text"
                name="totalAlumnos"
                value={datosFormulario.totalAlumnos}
                onChange={manejarCambio}
                className="input-underline short"
              />
            </div>
            <div className="stat-field">
              <span className="label">Aprobados</span>
              <input
                type="text"
                name="aprobados"
                value={datosFormulario.aprobados}
                onChange={manejarCambio}
                className="input-underline short"
              />
            </div>
            <div className="stat-field">
              <span className="label">Aplazados</span>
              <input
                type="text"
                name="aplazados"
                value={datosFormulario.aplazados}
                onChange={manejarCambio}
                className="input-underline short"
              />
            </div>
            <div className="stat-field">
              <span className="label">Ausentes</span>
              <input
                type="text"
                name="ausentes"
                value={datosFormulario.ausentes}
                onChange={manejarCambio}
                className="input-underline short"
              />
            </div>
          </div>

          <div className="fecha-footer">
            <span>De</span>
            <input
              type="text"
              name="dia"
              value={datosFormulario.dia}
              onChange={manejarCambio}
              className="input-underline tiny"
            />
            <span>de 20</span>
          </div>
        </div>

        <div className="pie-pagina">
          <div className="info-contacto">
            <strong>MUNDO ESCOLAR</strong> Cel 381 - 155888654 - 4000 - San Miguel de Tucumán - mundo.escolar.tuc@hotmail.com
          </div>
        </div>
      </div>

      {/* Botones de acción - fuera del contenedor para que no se impriman */}
      <div className="actions no-print">
        <button onClick={manejarVolver} className="btn-secondary">
          <span className="material-symbols-outlined">arrow_back</span>
          Volver
        </button>
        <button onClick={manejarDescargarPDF} className="btn-primary">
          <span className="material-symbols-outlined">download</span>
          Descargar PDF
        </button>
        <button onClick={manejarImprimir} className="btn-primary">
          <span className="material-symbols-outlined">print</span>
          Imprimir
        </button>
      </div>
    </div>
  );
};

export default ActaVolanteExamen;