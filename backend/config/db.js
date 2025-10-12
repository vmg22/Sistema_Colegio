const mysql = require("mysql2");
require('dotenv').config();

// CONFIGURACIÓN MÍNIMA Y COMPATIBLE
const grupoConexiones = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  
  // SOLO OPCIONES COMPATIBLES
  connectionLimit: 20,
  waitForConnections: true,
  charset: 'utf8mb4'
});

// Función para probar la conexión
const probarConexion = () => {
  return new Promise((resolve, reject) => {
    grupoConexiones.getConnection((error, connection) => {
      if (error) {
        console.error('❌ Error de conexión a BD:', error.message);
        reject(error);
      } else {
        console.log('✅ Conectado a MySQL correctamente');
        connection.release();
        resolve(true);
      }
    });
  });
};

// Función para ejecutar consultas
const ejecutarConsulta = (consulta, parametros = []) => {
  return new Promise((resolve, reject) => {
    grupoConexiones.query(consulta, parametros, (error, resultados) => {
      if (error) {
        console.error('❌ Error en consulta SQL:', error.message);
        reject(error);
      } else {
        resolve(resultados);
      }
    });
  });
};

module.exports = {
  grupoConexiones,
  ejecutarConsulta,
  probarConexion
};