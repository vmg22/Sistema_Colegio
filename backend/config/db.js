const mysql = require('mysql2/promise'); // Usa la versión con promesas
const dotenv = require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});




// Función para verificar la conexión
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conectado con éxito a la base de datos');
    connection.release(); // libera la conexión
  } catch (error) {
    console.error(' Error de conexión a la base de datos:', error);
  }
}

// Ejecutar la verificación
testConnection();

console.log('Pool de conexiones a la DB creado');

module.exports = pool;