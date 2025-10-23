const  pool  = require("../../config/db");
const { QUERY_REPORTE_ALUMNO } = require("./reporte.queries");

exports.getReporteAlumnoPorDNIyAnio = async (req, res) => {
  const { dni, anio } = req.params;

  console.log("🔍 Parámetros recibidos:", dni, anio);

  try {
    console.log("🟡 Ejecutando consulta SQL...");
    const result = await pool.execute(QUERY_REPORTE_ALUMNO, [dni, anio]);
    console.log("✅ Resultado SQL:", result);

    const [rows] = result;
    console.log("📊 Filas:", rows);

    if (!rows.length) {
      return res.status(404).json({ message: "No se encontraron datos." });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error en reporte alumno:", error);
    res.status(500).json({ message: "Error interno del servidor al generar el reporte." });
  }
};
