/* eslint-disable linebreak-style */
/* eslint-disable no-useless-catch */
import mysql = require('mysql');
import Trimestre from '../resources/models/Trimestre'; 
import ObjetoNoEncontrado from './errors/ObjetoNoEncontrado'; //Si no encuentra algo, manda este error (any)

export default class AlmacenamientoTrimestre {
    private conexion: mysql.Pool;

    constructor(con: mysql.Pool) {
      this.conexion = con;
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
            const Trimestre = {
              id: res[0].id,
              fechaInicio: res[0].fecha_inicio,
              fechaFin: res[0].fecha_fin,
            };
            resolve(Trimestre);
          }
        });
      });
      return promesaTrimestre;
    }

    public async obtenerPorFechas(fechaInicio: string, fechaFin: string): Promise<Trimestre[]> {
        const consulta = 'SELECT * FROM trimestre '
      + 'WHERE trimestre.fecha_inicio <= ?'
      + 'AND trimestre.fecha_fin >= ? '
      + 'ORDER BY trimestre.fecha_inicio ASC';

      const datos: Trimestre[] = [];
      const args = [ //Si es trimestre cuatro
        fechaFin, fechaInicio /*fechaInicio, fechaFin*/
      ];
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            resolve(datos);//si no hay trimestre, da un array vacío
          } else {
            for (let i = 0; i < res.length; i += 1) {
              const aux = {
                id: res[i].id,
                fechaInicio: res[i].fecha_inicio,
                fechaFin: res[i].fecha_fin,
              };
              datos.push(aux);
            }
            resolve(datos); //retorna los trimestre encontrados dentro del rango establecido
          } 
        });
      });
      
      return promise;
    }
}
