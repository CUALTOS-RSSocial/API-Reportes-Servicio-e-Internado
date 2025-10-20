/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* Archivo y clase Store para la tabla de Atenciones Realizadas
 * Esta clase permite realizar todas las operaciones de tipo
 * CRUD a la tabla de atencion_realizada de la base de datos, para ser utilizada
 * como parte de la clase Database.
 *
 * Escrito por Ramón Paredes Sánchez.
 */
/* ============================================================================
  Clase: AlmacenamientoAtencionRealizadaSemestral
  ============================================================================
  Esta clase permite realizar operaciones CRUD sobre la tabla
  `atencion_realizada_semestral` en la base de datos MySQL.
  
  Funcionalidades principales:
  - Crear registros de atenciones realizadas semestrales.
  - Consultar atenciones realizadas por ID de reporte parcial semestral.
  - Consultar atenciones realizadas por ID de usuario.
  - Eliminar atenciones asociadas a un reporte semestral.
  
  Forma parte de la capa de acceso a datos (DAO/Store) de la clase `Database`.
  ============================================================================ */

import mysql = require('mysql');
import AtencionesRealizadas from '../resources/models/AtencionesRealizadasSemestral';

export default class AlmacenamientoAtencionRealizadaSemestral {
  // Conexión al pool de MySQL. Se utiliza para ejecutar queries en la base de datos.
    private conexion : mysql.Pool;

    constructor(con: mysql.Pool) {
      this.conexion = con;
    }

    /** Insertar valores en la tabla atencion_realizada de MySQL */
    // Inserta un nuevo registro en la tabla `atencion_realizada_semestral` con los datos proporcionados en el objeto `atencion`.
    public async crearAtencionRealizada(atencion: AtencionesRealizadas): Promise<AtencionesRealizadas> {
      const consulta = 'INSERT INTO atencion_realizada_semestral(usuario_id, reporte_parcial_semestral_id, tipo, cantidad) '
      + 'VALUES(?, ?, ?, ?)';
      const args = [
        atencion.idUsuario,
        atencion.idReporteParcialSemestral,
        atencion.tipo,
        atencion.cantidad,
      ];
      const insertInfo: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else {
            // Construir el objeto con el ID autogenerado
            const atencionRegistrada = {
              id: res.insertId,
              idReporteParcial: atencion.idReporteParcialSemestral,
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
    // Realiza una consulta para obtener todas las atenciones realizadas asociadas a un reporte parcial semestral específico
    public async obtenerPorIdReporte(idReporte: number): Promise<AtencionesRealizadas[]> {
      const consulta = 'SELECT * FROM atencion_realizada_semestral WHERE reporte_parcial_semestral_id = ?';
      const datos: AtencionesRealizadas[] = [];
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, [idReporte], (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.length < 1) {
            // No hay atenciones para este reporte
            resolve(datos);
          } else {
            // Mapear filas a objetos de AtencionesRealizadas
            for (let i = 0; i < res.length; i += 1) {
              const aux = {
                id: res[i].id,
                idReporteParcialSemestral: res[i].reporte_parcial_semestral_id,
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
    // Realiza una consulta para obtener todas las atenciones realizadas asociadas a un usuario específico
    public async obtenerPorIdUsuario(idUsuario: number): Promise<AtencionesRealizadas[]> {
      const consulta = 'SELECT * FROM atencion_realizada_semestral '
      + 'WHERE usuario_id = ?';
      const datos: AtencionesRealizadas[] = [];
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, [idUsuario], (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.length < 1) {
            // No hay atenciones para este usuario
            resolve(datos);
          } else {
            // Mapear filas a objetos de AtencionesRealizadas
            for (let i = 0; i < res.length; i += 1) {
              const aux = {
                id: res[i].id,
                idReporteParcialSemestral: res[i].reporte_parcial_semestral_id,
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
    // Eliminar atenciones relacionadas con un reporte parcial semestral específico
    async eliminarAtencionesDeReporte(idReporte: number): Promise<boolean> {
      const consulta = 'DELETE FROM atencion_realizada_semestral WHERE reporte_parcial_semestral_id=?';
      const args = [idReporte];
      const deleteInfo: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err) => {
          //  Si hay un error al eliminar, rechazar la promesa
          if (err) {
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
