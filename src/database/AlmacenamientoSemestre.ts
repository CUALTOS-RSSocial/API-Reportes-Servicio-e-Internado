/* eslint-disable linebreak-style */
/* eslint-disable no-useless-catch */
/* ============================================================================
  Clase: AlmacenamientoSemestre
  ============================================================================
  Esta clase gestiona la persistencia y recuperación de semestres en la tabla
  `semestre` de la base de datos MySQL.
 
  Funcionalidades:
  - Crear un nuevo semestre.
  - Obtener un semestre por su ID.
  - Obtener semestres dentro de un rango de fechas.
 
  Pertenece a la capa de acceso a datos (DAO/Store).
  Autor: Ramón Paredes Sánchez
  ============================================================================ */
import mysql = require('mysql');
import Semestre from '../resources/models/Semestre'; 
import ObjetoNoEncontrado from './errors/ObjetoNoEncontrado'; //Si no encuentra algo, manda este error (any)

export default class AlmacenamientoSemestre {
  // Conexión al pool de MySQL para ejecutar consultas en la base de datos.
    private conexion: mysql.Pool;
  // Constructor que inicializa la conexión.
    constructor(con: mysql.Pool) {
      this.conexion = con;
    }
    // Crear un nuevo semestre en la base de datos
    async crearSemestre(semestre: Semestre): Promise<Semestre> { //Esto afecta la carpeta de chrono-trigger/jobs
      const consulta = 'INSERT INTO semestre(fecha_inicio, fecha_fin) VALUES (?, ?)'; //afecta la bd
      const args = [
        semestre.fechaInicio,
        semestre.fechaFin,
      ];
      // Realiza la inserción y retorna el semestre creado
      const promesaSemestre: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            //  Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else {
            // Construir el objeto con el ID autogenerado
            const nuevoSemestre = semestre;
            nuevoSemestre.id = res.insertId;
            resolve(nuevoSemestre);
          }
        });
      });
      return promesaSemestre;
    }
    // Obtener un semestre por su ID
    async obtenerSemestre(id: number): Promise<Semestre> {
      const consulta = 'SELECT * FROM semestre WHERE id=?'; //afecta la bd
      const promesaSemestre: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, [String(id)], (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.length < 1) {
            // Si no se encuentra el semestre, rechazar con ObjetoNoEncontrado
            reject(new ObjetoNoEncontrado());
          } else {
            // Construir el objeto Semestre con los datos obtenidos
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
    // Obtener semestres dentro de un rango de fechas
    public async obtenerPorFechas(fechaInicio: string, fechaFin: string): Promise<Semestre[]> {
       const consulta = 'SELECT * FROM semestre '  
      + 'WHERE semestre.fecha_fin >= ? AND semestre.fecha_inicio <= ? '
      + 'ORDER BY semestre.fecha_inicio ASC';
      // Consulta para obtener semestres que se solapan con el rango dado
      const datos: Semestre[] = [];
      const args = [ //Si son para semestres, solo ocupa dos, si es trimestre cuatro
        fechaInicio, fechaFin /*fechaInicio, fechaFin*/
      ];
      // Ejecutar la consulta y mapear los resultados a objetos Semestre
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.length < 1) {
            resolve(datos);//si no hay semestres/trimestre, da un array vacío
          } else {
            // Mapear filas a objetos de Semestre
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
