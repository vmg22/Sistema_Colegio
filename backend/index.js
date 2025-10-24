require('dotenv').config();
const express = require('express');
const cors = require('cors');

// --- IMPORTACIONES ---
const pool = require('./config/db'); 
const apiRoutes = require('./routes');
const { logger } = require('./middleware/logger');
const { manejadorErrores } = require('./middleware/errorHandler');

// --- CONFIGURACIÓN DE LA APP ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use(logger);

// --- RUTAS ---
// Ruta de bienvenida en la raíz para una experiencia más amigable.
app.get('/', (req, res) => {
  res.status(200).send(`
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px; background-color: #f4f4f9; border-radius: 10px;">
      <h1 style="color: #333;">🚀 Backend del Sistema Escolar SGGS</h1>
      <p style="color: #555; font-size: 1.2em;">¡El servidor está funcionando correctamente!</p>
      <p style="color: #777;">La API principal se encuentra en la ruta: <a href="/api/v1" style="color: #007bff; text-decoration: none;">/api/v1</a></p>
    </div>
  `);
});

// Usamos un prefijo para todas las rutas de la API, es una buena práctica.
app.use('/api/v1', apiRoutes);

// --- MANEJO DE ERRORES (el orden es crucial) ---
// 1. Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    mensaje: `El recurso ${req.method} ${req.originalUrl} no fue encontrado en el servidor.`
  });
});

// 2. Middleware de manejo de errores global (siempre al final)
app.use(manejadorErrores);

// --- FUNCIÓN DE INICIO DEL SISTEMA ---
async function iniciarSistema() {
  try {
    console.log('='.repeat(50));
    console.log('🚀 INICIANDO SISTEMA ESCOLAR SGGS');
    
    console.log('🔌 Verificando conexión a la base de datos...');
    const connection = await pool.getConnection();
    
    console.log('   ✅ Conexión a BD exitosa.'); 
    
    connection.release(); // ¡Muy importante liberar la conexión de vuelta al pool!
    
    // Iniciar servidor web
    app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log('   ✅ SISTEMA INICIADO CORRECTAMENTE');
      console.log(`   📡 Servidor escuchando en: http://localhost:${PORT}`);
      console.log(`   ✨ API disponible en: http://localhost:${PORT}/api/v1`);
      console.log('='.repeat(50));
    });
    
  } catch (error) {
    console.error('\n❌ ERROR CRÍTICO AL INICIAR EL SISTEMA:');
    console.error(`    Mensaje: ${error.message}`);
    process.exit(1);
  }
}

// --- MANEJO ELEGANTE DE CIERRE ---
const cerrarSistema = async () => {
  console.log('\n🔌 Cerrando conexiones y terminando el sistema...');
  try {
    await pool.end();
    console.log('   ✅ Pool de conexiones cerrado.');
    process.exit(0);
  } catch (error) {
    console.error('Error al cerrar el pool de conexiones:', error);
    process.exit(1);
  }
};

process.on('SIGINT', cerrarSistema);
process.on('SIGTERM', cerrarSistema);


// --- ARRANQUE DEL SISTEMA ---
iniciarSistema();
