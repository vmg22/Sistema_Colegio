import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useConsultaStore } from "../../store/consultaStore";
import { getReporteAlumno } from "../../services/reportesService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../../styles/constAluTramite.css";

const Constancia = () => {
  const navigate = useNavigate();
  
  // ✅ Obtenemos datos del store de Zustand
  const { alumnoDni, alumnoAnio, reporteAlumno, setReporteAlumno } = useConsultaStore();

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [datosFormulario, setDatosFormulario] = useState({});
  const refCertificado = useRef();

  // 🗓️ Función auxiliar para mostrar el mes actual en texto
  const obtenerMesActual = () => {
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
    ];
    return meses[new Date().getMonth()];
  };

  // 🔄 Cargar datos del alumno
  useEffect(() => {
    const cargarDatos = async () => {
      // Validar que tengamos DNI
      if (!alumnoDni) {
        setError("No se encontró el DNI del alumno. Por favor, vuelve a realizar la consulta.");
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        let data = reporteAlumno;

        // Si no hay datos en el store, hacer la petición
        if (!data || data.dni !== alumnoDni) {
          console.log("📡 Cargando datos del alumno desde el backend...");
          const response = await getReporteAlumno(alumnoDni, alumnoAnio);
          
          // El backend devuelve { success: true, data: {...} }
          data = response.data || response;
          
          // Guardar en el store para futuras consultas
          setReporteAlumno(data);
        } else {
          console.log("✅ Usando datos del store de Zustand");
        }

        // 🔁 Procesar materias
        const materiasAdeudadas = data.materias
          ? Object.entries(data.materias)
              .filter(([, mat]) => mat.estado_final !== "aprobada")
              .map(([nombre]) => nombre)
              .join(", ") || "Ninguna"
          : "Sin información";

        const idiomaExtranjero = data.materias
          ? Object.keys(data.materias).find((m) =>
              m.toLowerCase().includes("inglés") ||
              m.toLowerCase().includes("idioma") ||
              m.toLowerCase().includes("english")
            ) || "Ninguno"
          : "Ninguno";

        // 🔁 Construir datos del formulario
        setDatosFormulario({
          nombreEstudiante: `${data.nombre || ""} ${data.apellido || ""}`.trim(),
          numeroDocumento: data.dni || alumnoDni,
          curso: data.curso?.nombre || data.curso?.curso_nombre || "",
          division: data.curso?.division || data.curso?.curso_division || "",
          turno: data.curso?.turno || data.curso?.curso_turno || "",
          anioLectivo: data.curso?.anio_lectivo || alumnoAnio || "",
          materiasAdeudadas,
          idiomaExtranjero,
          solicitante: "",
          autoridad: "",
          ciudad: "San Miguel de Tucumán",
          dia: new Date().getDate().toString(),
          mes: obtenerMesActual(),
          anioActual: new Date().getFullYear().toString().slice(-2),
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
  }, [alumnoDni, alumnoAnio, reporteAlumno, setReporteAlumno]);

  // ✏️ Manejadores
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const manejarImprimir = () => window.print();

  const manejarDescargarPDF = async () => {
    try {
      const element = refCertificado.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Constancia_${datosFormulario.numeroDocumento}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF:", err);
      alert("Error al generar el PDF. Por favor, intenta de nuevo.");
    }
  };

  const manejarVolver = () => navigate(-1);

  // 🧩 Estados visuales
  if (cargando) {
    return (
      <div className="constancia-body">
        <div className="certificate-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando constancia...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="constancia-body">
        <div className="certificate-container">
          <div className="error-container">
            <span className="material-symbols-outlined error-icon">error</span>
            <h3>Error al cargar la constancia</h3>
            <p>{error}</p>
            <button onClick={manejarVolver} className="btn-back">
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🧾 Render principal
  return (
    <div className="constancia-body">
      <div className="certificate-container" ref={refCertificado}>
        <h1 className="certificate-header">Constancia de Alumno Regular</h1>

        <p>
          Se deja constancia de que{" "}
          <b>{datosFormulario.nombreEstudiante}</b>, DNI{" "}
          <b>{datosFormulario.numeroDocumento}</b>, cursa el año{" "}
          <b>{datosFormulario.curso}</b> división{" "}
          <b>{datosFormulario.division}</b>, turno{" "}
          <b>{datosFormulario.turno}</b>, correspondiente al ciclo lectivo{" "}
          <b>{datosFormulario.anioLectivo}</b>.
        </p>

        <p>
          Materias adeudadas: <b>{datosFormulario.materiasAdeudadas}</b>
        </p>

        <p>
          Idioma extranjero: <b>{datosFormulario.idiomaExtranjero}</b>
        </p>

        <p>
          A pedido de{" "}
          <b>{datosFormulario.solicitante || "..."}</b> se extiende la presente
          constancia para ser presentada ante las autoridades de{" "}
          <b>{datosFormulario.autoridad || "..."}</b>.
        </p>

        <p>
          En la ciudad de {datosFormulario.ciudad}, a los{" "}
          {datosFormulario.dia} días del mes de {datosFormulario.mes} de 20
          {datosFormulario.anioActual}.
        </p>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br /><br />
        


        
        

        <div className="signature-space">
          <div className="signature-box">Firma del Secretario / Prosecretario</div>
          <div className="signature-box">Firma del Rector</div>
        </div>

        <div className="seal-space">
          <div className="seal">Sello Escolar</div>
          <div className="seal">Sello del Establecimiento</div>
        </div>
      </div>

      {/* Botones de acción */}
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
      <div className="form-group editable">
          <label>Solicitante:</label>
          <input
            type="text"
            name="solicitante"
            placeholder="Ej: Juan Pérez"
            value={datosFormulario.solicitante}
            onChange={manejarCambio}
          />
        </div>

        <div className="form-group editable">
          <label>Autoridad destinataria:</label>
          <input
            type="text"
            name="autoridad"
            placeholder="Ej: Ministerio de Educación"
            value={datosFormulario.autoridad}
            onChange={manejarCambio}
          />
        </div>
    </div>
  );
  
};

export default Constancia;