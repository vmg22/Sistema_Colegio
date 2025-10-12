// index.js - VERSIÓN CORREGIDA
require('dotenv').config();

const express = require('express');
const cors = require('cors');

console.log('🔧 Iniciando sistema escolar SGGS...');

// Importar configuraciones
const { probarConexion } = require('./config/db');
const { logger } = require('./middleware/logger');
const { manejadorErrores } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES BÁSICOS
app.use(cors());
app.use(express.json());
app.use(logger); // ✅ Añadido middleware de logging

// RUTAS DEL SISTEMA
// Ruta principal
app.get('/', (req, res) => {
  res.json({
    sistema: 'Sistema de Gestión Escolar SGGS',
    estado: 'FUNCIONANDO OK', 
    entorno: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Ruta de salud del sistema
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Ruta de diagnóstico
app.get('/diagnostico', async (req, res) => {
  try {
    const { ejecutarConsulta } = require('./config/db');
    const [dbResult] = await ejecutarConsulta('SELECT VERSION() as version, NOW() as server_time');
    
    res.json({
      sistema: 'SGGS - Diagnóstico',
      estado: '✅ Todos los sistemas funcionando',
      base_datos: {
        version: dbResult.version,
        hora_servidor: dbResult.server_time,
        estado: 'CONECTADO'
      },
      servidor: {
        node_version: process.version,
        plataforma: process.platform,
        memoria: process.memoryUsage(),
        uptime: process.uptime()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      sistema: 'SGGS - Diagnóstico',
      estado: '❌ Error en el sistema',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Ruta de prueba de base de datos (existente)
app.get('/test-db', async (req, res) => {
  try {
    const { ejecutarConsulta } = require('./config/db');
    const resultado = await ejecutarConsulta('SELECT 1 + 1 as resultado, NOW() as fecha_servidor');
    
    res.json({
      estado: '✅ Base de datos funcionando',
      resultado: resultado[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      estado: '❌ Error en base de datos',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// MANEJO DE ERRORES
app.use(manejadorErrores); // ✅ Añadido middleware de errores

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    mensaje: `La ruta ${req.method} ${req.originalUrl} no existe`,
    timestamp: new Date().toISOString()
  });
});

// INICIALIZACIÓN DEL SISTEMA
async function iniciarSistema() {
  try {
    console.log('INICIANDO SISTEMA ESCOLAR SGGS');
    console.log('='.repeat(50));
    
    // 1. Verificar variables de entorno
    console.log('    Configuración del sistema:');
    console.log(`    Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`    Puerto: ${PORT}`);
    console.log(`    Base de datos: ${process.env.DB_NAME || 'No configurada'}`);
    console.log(`    Servidor BD: ${process.env.DB_HOST || 'localhost'}`);
    
    // 2. Verificar conexión a base de datos
    console.log('🔌 Verificando conexión a base de datos...');
    await probarConexion();
    console.log('   ✅ Conexión a BD exitosa');
    
    // 3. Iniciar servidor web
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log(' SISTEMA INICIADO CORRECTAMENTE');
      console.log(` Servidor: http://localhost:${PORT}`);
      console.log(` Base de datos: ${process.env.DB_NAME}`);
      console.log(` Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log('='.repeat(50));
      
      console.log('\n ENDPOINTS DISPONIBLES:');
      console.log(`    http://localhost:${PORT}/ - Página principal`);
      console.log(`    http://localhost:${PORT}/health - Salud del sistema`);
      console.log(`    http://localhost:${PORT}/diagnostico - Diagnóstico`);
      console.log(`    http://localhost:${PORT}/test-db - Test BD`);
      console.log('\n  El sistema está listo para usar');
    });
    
  } catch (error) {
    console.error('\n ERROR CRÍTICO AL INICIAR EL SISTEMA:');
    console.error(`    ${error.message}`);
    console.log('\n SOLUCIONES:');
    console.log('   1. Verificar que MySQL esté ejecutándose');
    console.log('   2. Revisar el archivo .env');
    console.log('   3. Verificar credenciales de la base de datos');
    console.log('   4. Asegurar que la base de datos exista');
    console.log('\n Configuración actual:');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Usuario: ${process.env.DB_USER}`);
    console.log(`   Base de datos: ${process.env.DB_NAME}`);
    console.log(`   Puerto: ${process.env.DB_PORT}`);
    process.exit(1);
  }
}

// Manejo elegante de cierre
process.on('SIGINT', () => {
  console.log('\n Señal de cierre recibida');
  console.log(' Cerrando sistema escolar...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n Señal de terminación recibida');
  console.log(' Cerrando sistema escolar...');
  process.exit(0);
});

// 🚀 INICIAR EL SISTEMA
iniciarSistema();