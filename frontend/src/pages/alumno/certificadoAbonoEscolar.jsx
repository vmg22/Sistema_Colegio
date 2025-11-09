import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useConsultaStore } from "../../store/consultaStore";
import { getReporteAlumno } from "../../services/reportesService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../../styles/certificadoAbonoEscolar.css";
import BtnVolver from "../../components/ui/BtnVolver";

const CertificadoAbonoEscolar = () => {
  const navigate = useNavigate();
  
  const { alumnoDni, alumnoAnio, reporteAlumno, setReporteAlumno } = useConsultaStore();

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [datosFormulario, setDatosFormulario] = useState({});
  const refCertificado = useRef();

  // 🎂 CALCULAR EDAD AUTOMÁTICAMENTE con useMemo
  const edadCalculada = useMemo(() => {
    if (!reporteAlumno?.fecha_nacimiento) {
      return "";
    }

    try {
      const fechaNac = new Date(reporteAlumno.fecha_nacimiento);
      const hoy = new Date();
      
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();
      
      // Ajustar si aún no cumplió años este año
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
      }
      
      return edad.toString();
    } catch (err) {
      console.error("Error al calcular edad:", err);
      return "";
    }
  }, [reporteAlumno?.fecha_nacimiento]);

  const obtenerMesActual = () => {
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
    ];
    return meses[new Date().getMonth()];
  };

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
          console.log("📡 Cargando datos del alumno desde el backend...");
          const response = await getReporteAlumno(alumnoDni, alumnoAnio);
          data = response.data || response;
          setReporteAlumno(data);
        } else {
          console.log("✅ Usando datos del store de Zustand");
        }

        const tutores = data.tutores || [];

        // 🔍 Debug: Ver qué datos llegan antes de construir el formulario
        console.log("🏗️ Construyendo formulario con data:", {
          direccion: tutores[0].direccion,
          fecha_nacimiento: data.fecha_nacimiento,
          nombre: data.nombre,
          apellido: data.apellido
        });

        setDatosFormulario({
          nombreEstudiante: `${data.nombre || ""} ${data.apellido || ""}`.trim(),
          numeroDocumento: data.dni || alumnoDni,
          curso: data.curso?.nombre || data.curso?.curso_nombre || "",
          division: data.curso?.division || data.curso?.curso_division || "",
          turno: data.curso?.turno || data.curso?.curso_turno || "",
          anioLectivo: data.curso?.anio_lectivo || alumnoAnio || "",
          edad: edadCalculada, // ✅ Edad calculada automáticamente
          direccion:data.direccion,
          lineaOmnibus: "",
          ciudad: "San Miguel de Tucumán",
          dia: new Date().getDate().toString(),
          mes: obtenerMesActual(),
          anioActual: new Date().getFullYear().toString().slice(-2),
        });
        
        // ✅ Log final para confirmar
        console.log("✅ Formulario construido con dirección:", data.direccion);

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
  }, [alumnoDni, alumnoAnio, reporteAlumno, setReporteAlumno, edadCalculada]);

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
      pdf.save(`Certificado_Abono_Escolar_${datosFormulario.numeroDocumento}.pdf`);
    } catch (err) {
      console.error("Error al generar PDF:", err);
      alert("Error al generar el PDF. Por favor, intenta de nuevo.");
    }
  };

  const manejarVolver = () => navigate(-1);

  if (cargando) {
    return (
      <div className="constancia-body">
        <div className="certificate-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando certificado...</p>
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
            <h3>Error al cargar el certificado</h3>
            <p>{error}</p>
            <button onClick={manejarVolver} className="btn-back">
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="no-print">
        <BtnVolver/>
      </div>
<div className="constancia-body-certificado">
      {/* 📝 PANEL DE EDICIÓN - ARRIBA A LA IZQUIERDA (FIJO) */}
      <div className="edit-panel no-print mt-3">
        <h3>✏️ Datos Editables</h3>
        
        <div className="form-group editable">
          <label>Línea de Ómnibus:</label>
          <input
            type="text"
            name="lineaOmnibus"
            placeholder="Ej: línea de colectivo"
            value={datosFormulario.lineaOmnibus}
            onChange={manejarCambio}
          />
        </div>
      </div>

      {/* 📄 CERTIFICADO PRINCIPAL */}
      <div className="certificate-container" ref={refCertificado}>
        <h1 className="certificate-header">Certificado Abono Escolar</h1>

        <p>
          Lugar y Fecha: {datosFormulario.ciudad}, {" "}
          {datosFormulario.dia} días del mes de {datosFormulario.mes} de 20
          {datosFormulario.anioActual}.
        </p>
        
        <p>
          Establecimiento: Instituto Carlos Guido Spano
        </p>
        
        <p>
          Domicilio: Monteagudo 638
        </p>
        
        <p>
          Nombre del Alumno: <b>{datosFormulario.nombreEstudiante}</b>
        </p>
        
        <p>
          Turno <b>{datosFormulario.turno}</b> Grado <b>{datosFormulario.curso}</b>{" "}
          Edad <b>{datosFormulario.edad}</b>
        </p>
        
        <p>
          Domiciliado en <b>{datosFormulario.direccion || "Sin dirección registrada"}</b>
        </p>
        
        <p>
          Línea de Ómnibus <b>{datosFormulario.lineaOmnibus || "..."}</b>
        </p>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <div className="signature-space">
          <div className="signature-box">Sello</div>
          <div className="signature-box">Firma Autorizada</div>
        </div>

        <div className="seal-space">
          <div className="seal">Sello Escolar</div>
          <div className="seal">Sello del Establecimiento</div>
        </div>
      </div>

      {/* 🎯 BOTONES DE ACCIÓN */}
      <div className="actions no-print">
        <button onClick={manejarDescargarPDF} className="btn btn-primary">
          <span className="material-symbols-outlined">download</span>
          Descargar PDF
        </button>
        <button onClick={manejarImprimir} className="btn btn-primary">
          <span className="material-symbols-outlined">print</span>
          Imprimir
        </button>
      </div>
    </div>
    </div>
    
  );
};

export default CertificadoAbonoEscolar;