/* eslint-disable linebreak-style */
/* eslint-disable no-useless-catch */
import mysql = require('mysql');
import Trimestre from '../resources/models/Trimestre';
import ObjetoNoEncontrado from './errors/ObjetoNoEncontrado';

export default class AlmacenamientoTrimestre {
    private conexion: mysql.Pool;

    constructor(con: mysql.Pool) {
      this.conexion = con;
    }

    async crearTrimestre(trimestre: Trimestre): Promise<Trimestre> {
      const consulta = 'INSERT INTO trimestre(fecha_inicio, fecha_fin) VALUES (?, ?)';
      const args = [
        trimestre.fechaInicio,
        trimestre.fechaFin,
      ];
      const promesaTrimestre: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            reject(err);
          } else {
            const nuevoTrimestre = trimestre;
            nuevoTrimestre.id = res.insertId;
            resolve(nuevoTrimestre);
          }
        });
      });
      return promesaTrimestre;
    }

    async obtenerTrimestre(id: number): Promise<Trimestre> {
      const consulta = 'SELECT * FROM trimestre WHERE id=?';
      const promesaTrimestre: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, [String(id)], (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            reject(new ObjetoNoEncontrado());
          } else {
            const trimestre = {
              id: res[0].id,
              fechaInicio: res[0].fecha_inicio,
              fechaFin: res[0].fecha_fin,
            };
            resolve(trimestre);
          }
        });
      });
      return promesaTrimestre;
    }

    public async obtenerPorFechas(fechaInicio: string, fechaFin: string): Promise<Trimestre[]> {
      const consulta = 'SELECT * FROM trimestre '
      + 'WHERE trimestre.fecha_inicio BETWEEN ? AND ? '
      + 'AND trimestre.fecha_fin BETWEEN ? AND ? ';
      const datos: Trimestre[] = [];
      const args = [
        fechaInicio, fechaFin, fechaInicio, fechaFin,
      ];
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            resolve(datos);
          } else {
            for (let i = 0; i < res.length; i += 1) {
              const aux = {
                id: res[i].id,
                fechaInicio: res[i].fecha_inicio,
                fechaFin: res[i].fecha_fin,
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
