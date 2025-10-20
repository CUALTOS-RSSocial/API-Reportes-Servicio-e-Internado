/* eslint-disable linebreak-style */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-useless-catch */
/* ============================================================================
  Clase: AlmacenamientoReporteFinalDos
  ============================================================================
  Esta clase gestiona el almacenamiento y recuperación de datos relacionados con
  los reportes finales de servicio social en la tabla `reporte_final` de MySQL.
  
  Funcionalidades:
  - Crear un nuevo reporte final.
  - Obtener un reporte final por ID de usuario (incluyendo actividades y atenciones).
  - Actualizar información de un reporte final existente.
  
  Además, integra otras clases de almacenamiento para obtener información
  relacionada con actividades y atenciones realizadas, tanto en modalidad
  regular como semestral.
  
  Pertenece a la capa de acceso a datos (DAO/Store).
  Autor: Ramón Paredes Sánchez
  ============================================================================ */
import mysql = require('mysql');
import ReporteFinalDos from '../resources/models/ReporteFinalDos';
import ObjetoNoEncontrado from './errors/ObjetoNoEncontrado';
import AlmacenamientoActividadRealizada from './AlmacenamientoActividadRealizada';
import AlmacenamientoActividadRealizadaSemestral from './AlmacenamientoActividadRealizadaSemestral';
import AlmacenamientoAtencionRealizada from './AlmacenamientoAtencionRealizada';
import AlmacenamientoAtencionRealizadaSemestral from './AlmacenamientoAtencionRealizadaSemestral';

export default class AlmacenamientoReporteFinalDos {
  // Conexión al pool de MySQL para ejecutar consultas en la base de datos.
    private conexion: mysql.Pool;
  // Instancia para gestionar actividades realizadas en modalidad regular.
    private actividad: AlmacenamientoActividadRealizada;
  // Instancia para gestionar actividades realizadas en modalidad semestral.
    private actividadSemestral : AlmacenamientoActividadRealizadaSemestral;
  // Instancia para gestionar atenciones realizadas en modalidad regular.
    private atencion: AlmacenamientoAtencionRealizada;
  // Instancia para gestionar atenciones realizadas en modalidad semestral.
    private atencionSemestral : AlmacenamientoAtencionRealizadaSemestral;
  // Constructor que inicializa la conexión y las instancias de almacenamiento relacionadas.
    constructor(con: mysql.Pool) {
      this.conexion = con;
      this.actividad = new AlmacenamientoActividadRealizada(con);
      this.atencion = new AlmacenamientoAtencionRealizada(con);
      this.actividadSemestral = new AlmacenamientoActividadRealizadaSemestral(con);
      this.atencionSemestral = new AlmacenamientoAtencionRealizadaSemestral(con);
    }

    /** Insertar un nuevo reporte final en la base de datos */
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
      // Realiza la inserción y retorna el reporte con su ID asignado
      const promesaReporteFinalDos: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            //  Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else {
            //  Construir el objeto reporte con el ID autogenerado
            const nuevoReporteFinalDos = reporteFinalDos;
            nuevoReporteFinalDos.id = res.insertId;
            resolve(nuevoReporteFinalDos);
          }
        });
      });
      return promesaReporteFinalDos;
    }
    // Obtener un reporte final por ID de usuario, incluyendo actividades y atenciones realizadas
    public async obtenerPorIdUsuario(idUsuario: number): Promise<ReporteFinalDos> {
      const select = 'SELECT reporte_final.* FROM servicio '
      + 'JOIN reporte_final ON reporte_final.servicio_id = servicio.id '
      + 'WHERE servicio.usuario_id = ?';
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(select, [idUsuario], async (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.length < 1) {
            // Si no se encuentra el reporte, retornar un objeto vacío
            const datos = {};
            resolve(datos);
          } else {
            // Determinar si se deben usar datos semestrales o regulares según la fecha de inicio
            const fechaLimite = new Date('2025-02-01');
            const fechaInicio = new Date(res[0].fechaInicio);
            // Obtener actividades y atenciones realizadas según la modalidad
            const actividadesRealizadas = fechaInicio >= fechaLimite
              ? await this.actividadSemestral.obtenerPorIdUsuario(idUsuario)
              : await this.actividad.obtenerPorIdUsuario(idUsuario);
            // Obtener atenciones realizadas según la modalidad
            const atencionesRealizadas =  fechaInicio >= fechaLimite
              ? await this.atencionSemestral.obtenerPorIdUsuario(idUsuario)
              : await this.atencion.obtenerPorIdUsuario(idUsuario);
            // Construir el objeto reporte final con toda la información
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
    // Actualizar un reporte final existente en la base de datos
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
      // Realiza la actualización y retorna el reporte actualizado
      const promesaReporteFinalDos: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.affectedRows < 1) {
            // Si no se actualizó ningún registro, el reporte no existe
            reject(new ObjetoNoEncontrado());
          } else {
            // Retornar el objeto reporte actualizado
            resolve(reporteFinalDos);
          }
        });
      });
      return promesaReporteFinalDos;
    }
}
