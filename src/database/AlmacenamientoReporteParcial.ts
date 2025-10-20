/* eslint-disable linebreak-style */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-useless-catch */
/* ============================================================================
  Clase: AlmacenamientoReporteParcial
  ============================================================================
  Esta clase gestiona el almacenamiento y recuperación de reportes parciales
  de servicio social en la tabla `reporte_parcial` de MySQL.
  
  Funcionalidades:
  - Crear un nuevo reporte parcial.
  - Obtener reportes parciales por ID de usuario.
  - Obtener reportes parciales por ID de servicio.
  - Actualizar información de un reporte parcial existente.
  
  Además, integra otras clases de almacenamiento para obtener información
  relacionada con actividades y atenciones realizadas.
  
  Pertenece a la capa de acceso a datos (DAO/Store).
  Autor: Ramón Paredes Sánchez
  ============================================================================ */
import mysql = require('mysql');
import ReporteParcial from '../resources/models/ReporteParcial'; 
import ObjetoNoEncontrado from './errors/ObjetoNoEncontrado';
import AlmacenamientoActividadRealizada from './AlmacenamientoActividadRealizada';
import AlmacenamientoAtencionRealizada from './AlmacenamientoAtencionRealizada';

export default class AlmacenamientoReporteParcial {
  // Conexión al pool de MySQL para ejecutar consultas en la base de datos.
    private conexion: mysql.Pool;
  // Instancia para gestionar actividades realizadas.
    private actividad: AlmacenamientoActividadRealizada;
  // Instancia para gestionar atenciones realizadas.
    private atencion: AlmacenamientoAtencionRealizada;
  // Constructor que inicializa la conexión y las instancias de almacenamiento relacionadas.
    constructor(con: mysql.Pool) {
      this.conexion = con;
      this.actividad = new AlmacenamientoActividadRealizada(con);
      this.atencion = new AlmacenamientoAtencionRealizada(con);
    }
    // Insertar un nuevo reporte parcial en la base de datos
    async crearReporteParcial(reporteParcial: ReporteParcial): Promise<ReporteParcial> {
      const consulta = 'INSERT INTO reporte_parcial(servicio_id, trimestre_id, actualizado, horas_realizadas) VALUES (?, ?, ?, ?)';
      const args = [
        reporteParcial.idServicio,
        reporteParcial.idTrimestre,
        reporteParcial.actualizado,
        reporteParcial.horasRealizadas,
      ];
      // Realiza la inserción y retorna el reporte parcial creado
      const promesaReporteParcial: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else {
            // Construir el objeto con el ID autogenerado
            const nuevoReporteParcial = reporteParcial;
            nuevoReporteParcial.id = res.insertId;
            resolve(nuevoReporteParcial);
          }
        });
      });
      return promesaReporteParcial;
    }
    // Obtener reportes parciales por ID de usuario
    //Junta la información de actividades y atenciones realizadas para cada reporte
    public async obtenerReportesPorIdUsuario(idUsuario: number): Promise<ReporteParcial[]> {
      const select = 'SELECT reporte_parcial.* FROM servicio '
      + 'JOIN reporte_parcial ON reporte_parcial.servicio_id = servicio.id '
      + 'WHERE servicio.usuario_id = ?';
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(select, [idUsuario], async (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.length < 1) {
            // Si no se encuentran reportes, retornar un arreglo vacío
            const reportesParciales: ReporteParcial[] = [];
            resolve(reportesParciales);
          } else {
            //  Mapear cada fila a un objeto ReporteParcial con actividades y atenciones asociadas
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
    // Obtener reportes parciales por ID de servicio
    public async obtenerReportesPorIdServicio(idServicio: number): Promise<ReporteParcial[]> {
      const select = 'SELECT reporte_parcial.* FROM servicio '
      + 'JOIN reporte_parcial ON reporte_parcial.servicio_id = servicio.id '
      + 'WHERE servicio.id = ?';
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(select, [idServicio], async (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.length < 1) {
            // Si no se encuentran reportes, retornar un arreglo vacío
            const reportesParciales: ReporteParcial[] = [];
            resolve(reportesParciales);
          } else {
            // Mapear cada fila a un objeto ReporteParcial con actividades y atenciones asociadas
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
    // Actualizar un reporte parcial existente en la base de datos
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
            // Si hay un error en la consulta, rechazar la promesa
          } else if (res.affectedRows < 1) {
            // Si no se actualizó ningún registro, el reporte no existe
            reject(new ObjetoNoEncontrado());
          } else {
            // Retornar el objeto reporte actualizado
            resolve(reporteParcial);
          }
        });
      });
      return promesaReporteParcial;
    }
}
