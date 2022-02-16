/* eslint-disable linebreak-style */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-useless-catch */
import mysql = require('mysql');
import ReporteParcial from '../resources/models/ReporteParcial';
import ObjetoNoEncontrado from './errors/ObjetoNoEncontrado';
import AlmacenamientoActividadRealizada from './AlmacenamientoActividadRealizada';
import AlmacenamientoAtencionRealizada from './AlmacenamientoAtencionRealizada';

export default class AlmacenamientoReporteParcial {
    private conexion: mysql.Pool;

    private actividad: AlmacenamientoActividadRealizada;

    private atencion: AlmacenamientoAtencionRealizada;

    constructor(con: mysql.Pool) {
      this.conexion = con;
      this.actividad = new AlmacenamientoActividadRealizada(con);
      this.atencion = new AlmacenamientoAtencionRealizada(con);
    }

    async crearReporteParcial(reporteParcial: ReporteParcial): Promise<ReporteParcial> {
      const consulta = 'INSERT INTO reporte_parcial(servicio_id, trimestre_id, actualizado, horas_realizadas) VALUES (?, ?, ?, ?)';
      const args = [
        reporteParcial.idServicio,
        reporteParcial.idTrimestre,
        reporteParcial.actualizado,
        reporteParcial.horasRealizadas,
      ];
      const promesaReporteParcial: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            reject(err);
          } else {
            const nuevoReporteParcial = reporteParcial;
            nuevoReporteParcial.id = res.insertId;
            resolve(nuevoReporteParcial);
          }
        });
      });
      return promesaReporteParcial;
    }

    public async obtenerReportesPorIdUsuario(idUsuario: number): Promise<ReporteParcial[]> {
      const select = 'SELECT reporte_parcial.* FROM servicio '
      + 'JOIN reporte_parcial ON reporte_parcial.servicio_id = servicio.id '
      + 'WHERE servicio.usuario_id = ?';
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(select, [idUsuario], async (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            const reportesParciales: ReporteParcial[] = [];
            resolve(reportesParciales);
          } else {
            const datos: ReporteParcial[] = [];
            for (let i = 0; i < res.length; i += 1) {
              const aux: ReporteParcial = {
                id: res[i].id,
                idServicio: res[i].servicio_id,
                idTrimestre: res[i].trimestre_id,
                actualizado: res[i].actualizado,
                horasRealizadas: res[i].horas_realizadas,
                actividadesRealizadas: await this.actividad.obtenerPorIdReporte(res[i].id),
                atencionesRealizadas: await this.atencion.obtenerPorIdReporte(res[i].id),
              };
              datos.push(aux);
            }
            resolve(datos);
          }
        });
      });
      return promise;
    }

    public async obtenerReportesPorIdServicio(idServicio: number): Promise<ReporteParcial[]> {
      const select = 'SELECT reporte_parcial.* FROM servicio '
      + 'JOIN reporte_parcial ON reporte_parcial.servicio_id = servicio.id '
      + 'WHERE servicio.id = ?';
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(select, [idServicio], async (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            const reportesParciales: ReporteParcial[] = [];
            resolve(reportesParciales);
          } else {
            const reportesParciales: ReporteParcial[] = [];
            for (let i = 0; i < res.length; i += 1) {
              const aux: ReporteParcial = {
                id: res[i].id,
                idServicio: res[i].servicio_id,
                idTrimestre: res[i].trimestre_id,
                actualizado: res[i].actualizado,
                horasRealizadas: res[i].horas_realizadas,
                actividadesRealizadas: await this.actividad.obtenerPorIdReporte(res[i].id),
                atencionesRealizadas: await this.atencion.obtenerPorIdReporte(res[i].id),
              };
              reportesParciales.push(aux);
            }
            resolve(reportesParciales);
          }
        });
      });
      return promise;
    }

    async actualizarReporteParcial(reporteParcial: ReporteParcial): Promise<ReporteParcial> {
      const consulta = 'UPDATE reporte_parcial SET servicio_id=?, trimestre_id=?, actualizado=?, horas_realizadas=? WHERE id=?';
      const args = [
        reporteParcial.idServicio,
        reporteParcial.idTrimestre,
        reporteParcial.actualizado,
        reporteParcial.horasRealizadas,
        String(reporteParcial.id),
      ];
      const promesaReporteParcial: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            reject(err);
          } else if (res.affectedRows < 1) {
            reject(new ObjetoNoEncontrado());
          } else {
            resolve(reporteParcial);
          }
        });
      });
      return promesaReporteParcial;
    }
}
