/* eslint-disable linebreak-style */
/* eslint-disable no-useless-catch */
/* ============================================================================
  Clase ALmacenamientoTrimestre
  ============================================================================
  Clase Store para la tabla "trimestre" en la base de datos.
  Permite realizar operaciones de lectura sobre la tabla `trimestre`,
  principalmente para obtener trimestres por ID o por rango de fechas.
 */
import mysql = require('mysql');
import Trimestre from '../resources/models/Trimestre'; 
import ObjetoNoEncontrado from './errors/ObjetoNoEncontrado'; //Si no encuentra algo, manda este error (any)

export default class AlmacenamientoTrimestre {
  // Conexión al pool de MySQL para ejecutar consultas en la base de datos.
    private conexion: mysql.Pool;

    constructor(con: mysql.Pool) {
      this.conexion = con;
    }
    // Obtener un trimestre por su ID
    async obtenerTrimestre(id: number): Promise<Trimestre> {
      const consulta = 'SELECT * FROM trimestre WHERE id=?'; 
      const promesaTrimestre: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, [String(id)], (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.length < 1) {
            // Si no se encuentra el trimestre, rechazar con ObjetoNoEncontrado
            reject(new ObjetoNoEncontrado());
          } else {
            // Construir el objeto Trimestre con los datos obtenidos
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
    // Obtener trimestres dentro de un rango de fechas
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
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.length < 1) {
            resolve(datos);//si no hay trimestre, da un array vacío
          } else {
            // Mapear filas a objetos de Trimestre
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
