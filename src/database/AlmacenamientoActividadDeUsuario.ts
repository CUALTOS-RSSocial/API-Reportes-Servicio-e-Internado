/* Archivo y clase Store para la tabla de Actividades de Usuario
 * Esta clase permite realizar todas las operaciones de tipo
 * CRUD a la tabla de actividad_de_usuario de la base de datos, para ser utilizada
 * como parte de la clase Database.
 *
 * Escrito por Ramón Paredes Sánchez.
 */
/* ============================================================================
  Clase: AlmacenamientoActividadDeUsuario
  ============================================================================
  Esta clase permite realizar operaciones CRUD sobre la tabla
  `actividad_de_usuario` en la base de datos MySQL.
  
  Funcionalidades principales:
  - Crear registros de actividades asociadas a un servicio.
  - Consultar actividades de un usuario en base a su ID.
  
  Forma parte de la capa de acceso a datos (DAO/Store) de la clase `Database`.
  ============================================================================ */

import mysql = require('mysql');
import ActividadesDeUsuario from '../resources/models/ActividadesDeUsuario';

//Clase encargada de gestionar la persistencia de actividades de usuario.
export default class AlmacenamientoActividadDeUsuario {
    private conexion : mysql.Pool;

    constructor(con: mysql.Pool) {
      this.conexion = con;
    }

    //Insertar valores en la tabla actividad_de_usuario de MySQL 
    // eslint-disable-next-line max-len
    // Inserta un nuevo registro en la tabla `actividad_de_usuario` con los datos proporcionados en el objeto `actividad`.
    public async crearActividadDeUsuario(actividad: ActividadesDeUsuario): Promise<ActividadesDeUsuario> {
      const consulta = 'INSERT INTO actividad_de_usuario(servicio_id, descripcion) VALUES (?, ?)';
      const args = [
        actividad.idServicio,
        actividad.descripcion,
      ];
      // Ejecutar la consulta como promesa
      const insertInfo: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            reject(err);
          } else {
          // Construir el objeto con el ID autogenerado  
            const actividadRegistrada = {
              id: res.insertId,
              idServicio: actividad.idServicio,
              descripcion: actividad.descripcion,
            };
            resolve(actividadRegistrada);
          }
        });
      });
      return insertInfo;
    }

    /** Método para obtener las actividades de un usuario */
    //Realiza un `JOIN` entre las tablas `servicio` y `actividad_de_usuario` * para traer todas las actividades relacionadas con un usuario específico.
   
    public async obtenerPorIdUsuario(idUsuario: number): Promise<ActividadesDeUsuario[]> {
      const consulta = 'SELECT actividad_de_usuario.* FROM servicio JOIN actividad_de_usuario '
      + 'ON actividad_de_usuario.servicio_id = servicio.id '
      + 'WHERE servicio.usuario_id = ?';
      const datos: ActividadesDeUsuario[] = [];
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, [idUsuario], (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            //Si no hay registros, retornar arreglo vacío
            resolve(datos);
          } else {
            //Mapear cada fila a un objeto ActividadesDeUsuario
            for (let i = 0; i < res.length; i += 1) {
              const aux = {
                id: res[i].id,
                idServicio: res[i].servicio_id,
                descripcion: res[i].descripcion,
              };
              datos.push(aux);
            }
            resolve(datos);
          }
        });
      });
      return promise;
    }
}
