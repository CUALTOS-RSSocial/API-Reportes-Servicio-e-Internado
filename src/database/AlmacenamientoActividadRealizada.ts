/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* Archivo y clase Store para la tabla de Actividades Realizadas
 * Esta clase permite realizar todas las operaciones de tipo
 * CRUD a la tabla de actividad_realizada de la base de datos, para ser utilizada
 * como parte de la clase Database.
 *
 * Escrito por Ramón Paredes Sánchez.
 */

import mysql = require('mysql');
import ActividadesRealizadas from '../resources/models/ActividadesRealizadas';

export default class AlmacenamientoActividadRealizada {
    private conexion : mysql.Pool;

    constructor(con: mysql.Pool) {
      this.conexion = con;
    }

    /** Insertar valores en la tabla actividad_realizada de MySQL */
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
    public async obtenerPorIdReporte(idReporte: number): Promise<ActividadesRealizadas[]> {
      const consulta = 'SELECT * FROM actividad_realizada WHERE reporte_parcial_id = ?';
      const datos: ActividadesRealizadas[] = [];
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, [idReporte], (err, res) => {
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

    /** Método para obtener las actividades realizadas de un usuario */
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
