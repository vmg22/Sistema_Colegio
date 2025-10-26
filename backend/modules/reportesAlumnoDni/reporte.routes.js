const express = require("express");
const router = express.Router();
const { getReporteAlumnoPorDNIyAnio } = require("./reporte.controller");


// Endpoint: /api/v1/reportes/alumnos/:dni/:anio
router.get("/:dni/:anio", getReporteAlumnoPorDNIyAnio);

module.exports = router;

