/* eslint-disable linebreak-style */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-useless-catch */
import mysql = require('mysql');
import ReporteFinalDos from '../resources/models/ReporteFinalDos';
import ObjetoNoEncontrado from './errors/ObjetoNoEncontrado';
import AlmacenamientoActividadRealizada from './AlmacenamientoActividadRealizada';
import AlmacenamientoActividadRealizadaSemestral from './AlmacenamientoActividadRealizadaSemestral';
import AlmacenamientoAtencionRealizada from './AlmacenamientoAtencionRealizada';
import AlmacenamientoAtencionRealizadaSemestral from './AlmacenamientoAtencionRealizadaSemestral';

export default class AlmacenamientoReporteFinalDos {
    private conexion: mysql.Pool;

    private actividad: AlmacenamientoActividadRealizada;

    private actividadSemestral : AlmacenamientoActividadRealizadaSemestral;

    private atencion: AlmacenamientoAtencionRealizada;

    private atencionSemestral : AlmacenamientoAtencionRealizadaSemestral;

    constructor(con: mysql.Pool) {
      this.conexion = con;
      this.actividad = new AlmacenamientoActividadRealizada(con);
      this.atencion = new AlmacenamientoAtencionRealizada(con);
      this.actividadSemestral = new AlmacenamientoActividadRealizadaSemestral(con);
      this.atencionSemestral = new AlmacenamientoAtencionRealizadaSemestral(con);
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
        this.conexion.query(consulta, args, (err, res) => {
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

    public async obtenerPorIdUsuario(idUsuario: number): Promise<ReporteFinalDos> {
      const select = 'SELECT reporte_final.* FROM servicio '
      + 'JOIN reporte_final ON reporte_final.servicio_id = servicio.id '
      + 'WHERE servicio.usuario_id = ?';
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(select, [idUsuario], async (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            const datos = {};
            resolve(datos);
          } else {
            const fechaLimite = new Date('2025-02-01');
            const fechaInicio = new Date(res[0].fechaInicio);

            const actividadesRealizadas = fechaInicio >= fechaLimite
              ? await this.actividadSemestral.obtenerPorIdUsuario(idUsuario)
              : await this.actividad.obtenerPorIdUsuario(idUsuario);

            const atencionesRealizadas =  fechaInicio >= fechaLimite
              ? await this.atencionSemestral.obtenerPorIdUsuario(idUsuario)
              : await this.atencion.obtenerPorIdUsuario(idUsuario);

            const datos = {
              id: res[0].id,
              idServicio: res[0].servicio_id,
              metasAlcanzadas: res[0].metas_alcanzadas,
              metodologiaUtilizada: res[0].metodologia,
              innovacionAportada: res[0].innovacion,
              conclusiones: res[0].conclusion,
              propuestas: res[0].propuestas,
              actividadesRealizadas,
              atencionesRealizadas,
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
        this.conexion.query(consulta, args, (err, res) => {
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
}
