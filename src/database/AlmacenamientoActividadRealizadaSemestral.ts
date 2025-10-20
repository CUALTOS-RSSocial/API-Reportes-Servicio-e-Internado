/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* Archivo y clase Store para la tabla de Actividades Realizadas
 * Esta clase permite realizar todas las operaciones de tipo
 * CRUD a la tabla de actividad_realizada de la base de datos, para ser utilizada
 * como parte de la clase Database.
 *
 * Escrito por Ramón Paredes Sánchez.
 */

/* ============================================================================
  Clase: AlmacenamientoActividadRealizadaSemestral
  ============================================================================
  Esta clase permite realizar operaciones CRUD sobre la tabla
  `actividad_realizada_semestral` en la base de datos MySQL.
  
  Funcionalidades principales:
  - Crear registros de actividades realizadas semestralmente.
  - Consultar actividades realizadas por ID de reporte parcial semestral.
  - Consultar actividades realizadas por usuario.
  - Eliminar actividades asociadas a un reporte parcial semestral.
 
  Forma parte de la capa de acceso a datos (DAO/Store) de la clase `Database`.
  ============================================================================ */
import mysql = require('mysql');
import ActividadesRealizadas from '../resources/models/ActividadesRealizadasSemestral';

export default class AlmacenamientoActividadRealizadaSemestral {
    private conexion : mysql.Pool;
    // Conexión al pool de MySQL. Se utiliza para ejecutar queries en la base de datos.
    constructor(con: mysql.Pool) {
      this.conexion = con;
    }

    /** Insertar valores en la tabla actividad_realizada de MySQL */
    // Inserta un nuevo registro en la tabla `actividad_realizada_semestral` con los datos proporcionados en el objeto `actividad`.
    public async crearActividadRealizada(actividad: ActividadesRealizadas): Promise<ActividadesRealizadas> {
      const consulta = 'INSERT INTO actividad_realizada_semestral(actividad_de_usuario_id, reporte_parcial_semestral_id, cantidad)'
      + 'VALUES (?, ?, ?)';
      const args = [
        actividad.idActividad,
        actividad.idReporteParcialSemestral,
        actividad.cantidad,
      ];
      const insertInfo: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else {
            // Construir el objeto con el ID autogenerado
            const actividadRegistrada = {
              id: res.insertId,
              idActividad: actividad.idActividad,
              idReporteParcialSemestral: actividad.idReporteParcialSemestral,
              cantidad: actividad.cantidad,
            };
            resolve(actividadRegistrada);
          }
        });
      });
      return insertInfo;
    }

    /** Método para obtener las actividades realizadas de un reporte */
    // Consulta todas las actividades registradas que pertenecen a un reporte parcial semestral específico.
    public async obtenerPorIdReporte(idReporte: number): Promise<ActividadesRealizadas[]> {
      const consulta = 'SELECT * FROM actividad_realizada_semestral WHERE reporte_parcial_semestral_id = ?';
      const datos: ActividadesRealizadas[] = [];
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, [idReporte], (err, res) => {
          if (err) {
            reject(err);
          } else if (res.length < 1) {
            // No hay actividades para este reporte
            resolve(datos);
          } else {
            // Mapear filas a objetos de ActividadesRealizadas
            for (let i = 0; i < res.length; i += 1) {
              const aux = {
                id: res[i].id,
                idActividad: res[i].actividad_de_usuario_id,
                idReporteParcialSemestral: res[i].reporte_parcial_semestral_id,
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
    // Realiza un `JOIN` entre las tablas `servicio`, `actividad_de_usuario` y `actividad_realizada_semestral`
    public async obtenerPorIdUsuario(idUsuario: number): Promise<ActividadesRealizadas[]> {
      const consulta = 'SELECT actividad_realizada_semestral.* FROM servicio '
      + 'JOIN actividad_de_usuario ON actividad_de_usuario.servicio_id = servicio.id '
      + 'JOIN actividad_realizada_semestral ON actividad_realizada_semestral.actividad_de_usuario_id = actividad_de_usuario.id '
      + 'WHERE servicio.usuario_id = ?';
      const datos: ActividadesRealizadas[] = [];
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, [idUsuario], (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.length < 1) {
            // No hay actividades para este usuario
            resolve(datos);
          } else {
            // Mapear filas a objetos de ActividadesRealizadas
            for (let i = 0; i < res.length; i += 1) {
              const aux = {
                id: res[i].id,
                idActividad: res[i].actividad_de_usuario_id,
                idReporteParcialSemestral: res[i].reporte_parcial_semestral_id,
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
    // Eliminar actividades relacionadas con un reporte parcial semestral específico
    public async eliminarActividadesDeReporte(idReporte: number): Promise<boolean> {
      const consulta = 'DELETE FROM actividad_realizada_semestral WHERE reporte_parcial_semestral_id=?';
      const args = [idReporte];
      const deleteInfo: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err) => {
          if (err) {
            //  Si hay un error al eliminar, rechazar la promesa
            reject(err);
          } else {
            // Retornar true si la eliminación fue exitosa
            resolve(true);
          }
        });
      });
      return deleteInfo;
    }
}
