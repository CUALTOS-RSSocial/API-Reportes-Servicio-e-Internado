/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* Archivo y clase Store para la tabla de Atenciones Realizadas
 * Esta clase permite realizar todas las operaciones de tipo
 * CRUD a la tabla de atencion_realizada de la base de datos, para ser utilizada
 * como parte de la clase Database.
 *
 * Escrito por Ramón Paredes Sánchez.
 */

import mysql = require('mysql');
import AtencionesRealizadas from '../resources/models/AtencionesRealizadas';

export default class AlmacenamientoAtencionRealizada {
    private conexion : mysql.Pool;

    constructor(con: mysql.Pool) {
      this.conexion = con;
    }

    /** Insertar valores en la tabla atencion_realizada de MySQL */
    public async crearAtencionRealizada(atencion: AtencionesRealizadas): Promise<AtencionesRealizadas> {
      const consulta = 'INSERT INTO atencion_realizada(usuario_id, reporte_parcial_id, tipo, cantidad) '
      + 'VALUES(?, ?, ?, ?)';
      const args = [
        atencion.idUsuario,
        atencion.idReporteParcial,
        atencion.tipo,
        atencion.cantidad,
      ];
      const insertInfo: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            reject(err);
          } else {
            const atencionRegistrada = {
              id: res.insertId,
              idReporteParcial: atencion.idReporteParcial,
              idUsuario: atencion.idUsuario,
              tipo: atencion.tipo,
              cantidad: atencion.cantidad,
            };
            resolve(atencionRegistrada);
          }
        });
      });
      return insertInfo;
    }

    /** Método para obtener todas las atenciones realizadas de un reporte */
    public async obtenerPorIdReporte(idReporte: number): Promise<AtencionesRealizadas[]> {
      const consulta = 'SELECT * FROM atencion_realizada WHERE reporte_parcial_id = ?';
      const datos: AtencionesRealizadas[] = [];
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
                idReporteParcial: res[i].reporte_parcial_id,
                idUsuario: res[i].usuario_id,
                tipo: res[i].tipo,
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

    /** Método para obtener todas las atenciones realizadas de un usuario */
    public async obtenerPorIdUsuario(idUsuario: number): Promise<AtencionesRealizadas[]> {
      const consulta = 'SELECT * FROM atencion_realizada '
      + 'WHERE usuario_id = ?';
      const datos: AtencionesRealizadas[] = [];
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
                idReporteParcial: res[i].reporte_parcial_id,
                idUsuario: res[i].usuario_id,
                tipo: res[i].tipo,
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

    async eliminarAtencionesDeReporte(idReporte: number): Promise<boolean> {
      const consulta = 'DELETE FROM atencion_realizada WHERE reporte_parcial_id=?';
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
