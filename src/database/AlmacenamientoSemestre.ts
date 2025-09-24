/* eslint-disable linebreak-style */
/* eslint-disable no-useless-catch */
import mysql = require('mysql');
import Semestre from '../resources/models/Semestre'; 
import ObjetoNoEncontrado from './errors/ObjetoNoEncontrado'; //Si no encuentra algo, manda este error (any)

export default class AlmacenamientoSemestre {
    private conexion: mysql.Pool;

    constructor(con: mysql.Pool) {
      this.conexion = con;
    }
    
    async crearSemestre(semestre: Semestre): Promise<Semestre> { //Esto afecta la carpeta de chrono-trigger/jobs
      const consulta = 'INSERT INTO semestre(fecha_inicio, fecha_fin) VALUES (?, ?)'; //afecta la bd
      const args = [
        semestre.fechaInicio,
        semestre.fechaFin,
      ];
      const promesaSemestre: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            reject(err);
          } else {
            const nuevoSemestre = semestre;
            nuevoSemestre.id = res.insertId;
            resolve(nuevoSemestre);
          }
        });
      });
      return promesaSemestre;
    }

    async obtenerSemestre(id: number): Promise<Semestre> {
      const consulta = 'SELECT * FROM semestre WHERE id=?'; //afecta la bd
      const promesaSemestre: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, [String(id)], (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            reject(new ObjetoNoEncontrado());
          } else {
            const Semestre = {
              id: res[0].id,
              fechaInicio: res[0].fecha_inicio,
              fechaFin: res[0].fecha_fin,
            };
            resolve(Semestre);
          }
        });
      });
      return promesaSemestre;
    }

    public async obtenerPorFechas(fechaInicio: string, fechaFin: string): Promise<Semestre[]> {
       const consulta = 'SELECT * FROM semestre '  
      + 'WHERE semestre.fecha_fin >= ? AND semestre.fecha_inicio <= ? '
      + 'ORDER BY semestre.fecha_inicio ASC';

      const datos: Semestre[] = [];
      const args = [ //Si son para semestres, solo ocupa dos, si es trimestre cuatro
        fechaInicio, fechaFin /*fechaInicio, fechaFin*/
      ];
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            resolve(datos);//si no hay semestres/trimestre, da un array vacío
          } else {
            for (let i = 0; i < res.length; i += 1) {
              const aux = {
                id: res[i].id,
                fechaInicio: res[i].fecha_inicio,
                fechaFin: res[i].fecha_fin,
              };
              datos.push(aux);
            }
            resolve(datos); //retorna los semestres/trimestre encontrados dentro del rango establecido
          } 
        });
      });
      
      return promise;
    }
}
