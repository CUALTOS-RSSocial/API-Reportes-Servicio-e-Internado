/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* Archivo y clase Store para la tabla de Actividades Realizadas
 * Esta clase permite realizar todas las operaciones de tipo
 * CRUD a la tabla de actividad_realizada de la base de datos, para ser utilizada
 * como parte de la clase Database.
 *
 * Escrito por Ramón Paredes Sánchez.
 */
/* ============================================================================
  Clase: AlmacenamientoActividadRealizada
  ============================================================================
  Esta clase permite realizar operaciones CRUD sobre la tabla
  `actividad_realizada` en la base de datos MySQL.
  
  Funcionalidades principales:
  - Crear registros de actividades realizadas.
  - Consultar actividades realizadas por ID de reporte parcial.
  - Consultar actividades realizadas por usuario.
  - Eliminar actividades de un reporte específico.
 
  Forma parte de la capa de acceso a datos (DAO/Store) de la clase `Database`.

  ============================================================================ */

import mysql = require('mysql');
import ActividadesRealizadas from '../resources/models/ActividadesRealizadas';

export default class AlmacenamientoActividadRealizada {
  // Conexión al pool de MySQL. Se utiliza para ejecutar queries en la base de datos.
    private conexion : mysql.Pool;

    constructor(con: mysql.Pool) {
      this.conexion = con;
    }

    /** Insertar valores en la tabla actividad_realizada de MySQL */
    //Inserta un nuevo registro en la tabla `actividad_realizada` con los datos proporcionados en el objeto `actividad`.
    public async crearActividadRealizada(actividad: ActividadesRealizadas): Promise<ActividadesRealizadas> {
      const consulta = 'INSERT INTO actividad_realizada(actividad_de_usuario_id, reporte_parcial_id, cantidad)'
      + 'VALUES (?, ?, ?)';
      const args = [
        actividad.idActividad,
        actividad.idReporteParcial,
        actividad.cantidad,
      ];
      const insertInfo: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            reject(err);
          } else {
            const actividadRegistrada = {
              id: res.insertId,
              idActividad: actividad.idActividad,
              idReporteParcial: actividad.idReporteParcial,
              cantidad: actividad.cantidad,
            };
            resolve(actividadRegistrada);
          }
        });
      });
      return insertInfo;
    }

    /** Método para obtener las actividades realizadas de un reporte */
    // Consulta todas las actividades registradas que pertenecen a un reporte parcial específico.
    public async obtenerPorIdReporte(idReporte: number): Promise<ActividadesRealizadas[]> {
      const consulta = 'SELECT * FROM actividad_realizada WHERE reporte_parcial_id = ?';
      const datos: ActividadesRealizadas[] = [];
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, [idReporte], (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            // No hay actividades para este reporte
            resolve(datos);
          } else {
            //Mapear filas a objetos de ActividadesRealizadas
            for (let i = 0; i < res.length; i += 1) {
              const aux = {
                id: res[i].id,
                idActividad: res[i].actividad_de_usuario_id,
                idReporteParcial: res[i].reporte_parcial_id,
                cantidad: res[i].cantidad,
              };
              datos.push(aux);
            }
            resolve(datos);
          }
        });
      });
      return promise;
    }

    /** Método para obtener las actividades realizadas de un usuario */
    // Realiza un `JOIN` entre las tablas `servicio`, `actividad_de_usuario` y `actividad_realizada`
    public async obtenerPorIdUsuario(idUsuario: number): Promise<ActividadesRealizadas[]> {
      const consulta = 'SELECT actividad_realizada.* FROM servicio '
      + 'JOIN actividad_de_usuario ON actividad_de_usuario.servicio_id = servicio.id '
      + 'JOIN actividad_realizada ON actividad_realizada.actividad_de_usuario_id = actividad_de_usuario.id '
      + 'WHERE servicio.usuario_id = ?';
      const datos: ActividadesRealizadas[] = [];
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, [idUsuario], (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            resolve(datos);
          } else {
            for (let i = 0; i < res.length; i += 1) {
              const aux = {
                id: res[i].id,
                idActividad: res[i].actividad_de_usuario_id,
                idReporteParcial: res[i].reporte_parcial_id,
                cantidad: res[i].cantidad,
              };
              datos.push(aux);
            }
            resolve(datos);
          }
        });
      });
      return promise;
    }
    // Eliminar actividades relacionadas con un reporte parcial específico
    public async eliminarActividadesDeReporte(idReporte: number): Promise<boolean> {
      const consulta = 'DELETE FROM actividad_realizada WHERE reporte_parcial_id=?';
      const args = [idReporte];
      const deleteInfo: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      });
      return deleteInfo;
    }
}
