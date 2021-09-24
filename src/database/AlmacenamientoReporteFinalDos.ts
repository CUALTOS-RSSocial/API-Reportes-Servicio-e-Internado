/* eslint-disable linebreak-style */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-useless-catch */
import mysql = require('mysql');
import ReporteFinalDos from '../resources/interfaces/ReporteFinalDos';
import ObjetoNoEncontrado from './errors/ObjetoNoEncontrado';
import AlmacenamientoActividadRealizada from './AlmacenamientoActividadRealizada';
import AlmacenamientoAtencionRealizada from './AlmacenamientoAtencionRealizada';

export default class AlmacenamientoReporteFinalDos {
    private conection: mysql.Connection;

    private actividad: AlmacenamientoActividadRealizada;

    private atencion: AlmacenamientoAtencionRealizada;

    constructor(databaseConfig: any) {
      this.conection = mysql.createConnection(databaseConfig);
      this.actividad = new AlmacenamientoActividadRealizada(databaseConfig);
      this.atencion = new AlmacenamientoAtencionRealizada(databaseConfig);
      this.conection.connect((err) => {
        if (err) throw err;
      });
    }

    async crearReporteFinalDos(reporteFinalDos: ReporteFinalDos): Promise<ReporteFinalDos> {
      const consulta = 'INSERT INTO reporte_final'
          + ' (servicio_id, metas_alcanzadas, metodologia, innovacion, conclusion, propuestas)'
          + ' VALUES (?, ?, ?, ?, ?, ?)';
      const args = [
        reporteFinalDos.idServicio,
        reporteFinalDos.metasAlcanzadas,
        reporteFinalDos.metodologiaUtilizada,
        reporteFinalDos.innovacionAportada,
        reporteFinalDos.conclusiones,
        reporteFinalDos.propuestas,
      ];
      const promesaReporteFinalDos: any = await new Promise((resolve, reject) => {
        this.conection.query(consulta, args, (err, res) => {
          if (err) {
            reject(err);
          } else {
            const nuevoReporteFinalDos = reporteFinalDos;
            nuevoReporteFinalDos.id = res.insertId;
            resolve(nuevoReporteFinalDos);
          }
        });
      });

      return promesaReporteFinalDos;
    }

    async obtenerReporteFinalDos(id: number): Promise<ReporteFinalDos> {
      const consulta = 'SELECT * FROM reporte_final WHERE id=?';
      const promesaReporteFinalDos: any = await new Promise((resolve, reject) => {
        this.conection.query(consulta, [String(id)], (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            reject(new ObjetoNoEncontrado());
          } else {
            const reporteFinalDos = {
              id: res[0].id,
              idServicio: res[0].servicio_id,
              metasAlcanzadas: res[0].metas_alcanzadas,
              metodologiaUtilizada: res[0].metodologia,
              innovacionAportada: res[0].innovacion,
              conclusiones: res[0].conclusion,
              propuestas: res[0].propuestas,
            };
            resolve(reporteFinalDos);
          }
        });
      });

      return promesaReporteFinalDos;
    }

    public async obtenerPorIdUsuario(idUsuario: number): Promise<ReporteFinalDos> {
      const select = 'SELECT reporte_final.* FROM servicio '
      + 'JOIN reporte_final ON reporte_final.servicio_id = servicio.id '
      + 'WHERE servicio.usuario_id = ?';
      const promise: any = await new Promise((resolve, reject) => {
        this.conection.query(select, [idUsuario], async (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            const datos = {};
            resolve(datos);
          } else {
            const datos = {
              id: res[0].id,
              idServicio: res[0].servicio_id,
              metasAlcanzadas: res[0].metas_alcanzadas,
              metodologiaUtilizada: res[0].metodologia,
              innovacionAportada: res[0].innovacion,
              conclusiones: res[0].conclusion,
              propuestas: res[0].propuestas,
              actividadesRealizadas: await this.actividad.obtenerPorIdUsuario(idUsuario),
              atencionesRealizadas: await this.atencion.obtenerPorIdUsuario(idUsuario),
            };
            resolve(datos);
          }
        });
      });

      return promise;
    }

    async actualizarReporteFinalDos(reporteFinalDos: ReporteFinalDos): Promise<ReporteFinalDos> {
      const consulta = 'UPDATE reporte_final'
        + ' SET servicio_id=?, metas_alcanzadas=?, metodologia=?, innovacion=?, conclusion=?, propuestas=?'
        + ' WHERE id=?';
      const args = [
        reporteFinalDos.idServicio,
        reporteFinalDos.metasAlcanzadas,
        reporteFinalDos.metodologiaUtilizada,
        reporteFinalDos.innovacionAportada,
        reporteFinalDos.conclusiones,
        reporteFinalDos.propuestas,
        String(reporteFinalDos.id),
      ];
      const promesaReporteFinalDos: any = await new Promise((resolve, reject) => {
        this.conection.query(consulta, args, (err, res) => {
          if (err) {
            reject(err);
          } else if (res.affectedRows < 1) {
            reject(new ObjetoNoEncontrado());
          } else {
            resolve(reporteFinalDos);
          }
        });
      });

      return promesaReporteFinalDos;
    }

    async eliminarReporteFinalDos(id: number): Promise<boolean> {
      const consulta = 'DELETE FROM reporte_final WHERE id=?';
      const promesaReporteParcial: any = await new Promise((resolve, reject) => {
        this.conection.query(consulta, [String(id)], (err, res) => {
          if (err) {
            reject(err);
          } else if (res.affectedRows < 1) {
            reject(new ObjetoNoEncontrado());
          } else {
            resolve(true);
          }
        });
      });

      return promesaReporteParcial;
    }
}
