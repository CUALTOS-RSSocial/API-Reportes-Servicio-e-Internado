/* eslint-disable linebreak-style */
/* eslint-disable no-useless-catch */
/* ============================================================================
  Clase: AlmacenamientoUsuario
  ============================================================================
  Esta clase gestiona la persistencia y recuperación de usuarios en la tabla
  `usuario` de la base de datos MySQL.
  Clase Store para la tabla "usuario" en la base de datos.
  Permite realizar operaciones CRUD básicas sobre la tabla `usuario`.
 */
import mysql = require('mysql');
import Usuario from '../resources/models/Usuario';
import ObjetoNoEncontrado from './errors/ObjetoNoEncontrado';

export default class AlmacenamientoUsuario {
  // Conexión al pool de MySQL para ejecutar consultas en la base de datos.
    private conexion: mysql.Pool;

    constructor(con: mysql.Pool) {
      this.conexion = con;
    }
    // Crear un nuevo usuario en la base de datos
    async crearUsuario(usuario: Usuario): Promise<Usuario> {
      const consulta = 'INSERT INTO usuario(id, rol) VALUES (?, ?)';
      const args = [
        usuario.id,
        usuario.rol,
      ];
      // Realiza la inserción y retorna el usuario creado
      const promesaUsuario: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err) => {
          if (err) {
            //  Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else {
            // Retornar el usuario creado
            resolve(usuario);
          }
        });
      });
      return promesaUsuario;
    }
    // Obtener un usuario por su ID
    async obtenerUsuario(id: number): Promise<Usuario> {
      const consulta = 'SELECT * FROM usuario WHERE id=?';
      const promesaUsuario: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, [String(id)], (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.length < 1) {
            // Si no se encuentra el usuario, rechazar con ObjetoNoEncontrado
            resolve(new ObjetoNoEncontrado());
          } else {
            // Construir el objeto Usuario con los datos obtenidos
            const usuario: Usuario = {
              id: res[0].id,
              rol: res[0].rol,
              nombre: '',
              carrera: '',
            };
            resolve(usuario);
          }
        });
      });
      return promesaUsuario;
    }
}
