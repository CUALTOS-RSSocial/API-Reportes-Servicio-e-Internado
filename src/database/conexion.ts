/**
 Configuración y creación del pool de conexión a MySQL.
 
 Este archivo establece los parámetros de conexión a la base de datos
 usando los valores definidos en el archivo de configuración `config`.
 Se utiliza un pool de conexiones para optimizar el manejo de múltiples
 consultas concurrentes sin necesidad de abrir y cerrar la conexión
 repetidamente.
 
 Exporta un objeto `conexion` que puede ser importado por cualquier
 módulo que necesite interactuar con la base de datos.
 */
import mysql = require('mysql');
import config from '../../configuracion';

const databaseConfig = {
  connectionLimit: 10,
  host: config.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
};

const conexion = mysql.createPool(databaseConfig);
export default conexion;
