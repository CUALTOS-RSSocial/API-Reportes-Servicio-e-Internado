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
