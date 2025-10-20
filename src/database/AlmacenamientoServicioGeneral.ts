/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* Archivo y clase Store para la tabla de Servicio General
 * Incluye las operaciones CRUD solo para la tabla de servicio de datos generales.
 * Esta clase permite realizar todas las operaciones de tipo
 * CRUD a la tabla de servicio de la base de datos, para ser utilizada
 * como parte de la clase Database.
 *
 * Escrito por Ramón Paredes Sánchez.
 */
/* ============================================================================
  Clase: AlmacenamientoServicioGeneral
  ============================================================================
  Esta clase gestiona la persistencia y recuperación de los servicios generales
  en la tabla `servicio` de la base de datos MySQL.
 
  Funcionalidades:
  - Crear un nuevo servicio general.
  - Obtener un servicio por su ID.
  - Obtener un servicio a partir del ID de usuario.
  - Actualizar los datos de un servicio existente. 
  
  Pertenece a la capa de acceso a datos (DAO/Store).
 ============================================================================ */

import mysql = require('mysql');
import DatosGeneralesServicio from '../resources/models/DatosGeneralesServicio';
import ObjetoNoEncontrado from './errors/ObjetoNoEncontrado';

export default class AlmacenamientoServicioGeneral {
  // Conexión al pool de MySQL. Se utiliza para ejecutar queries en la base de datos.
    private conexion : mysql.Pool;

    constructor(con: mysql.Pool) {
      this.conexion = con;
    }

    /** Insertar valores en la tabla servicio de MySQL */
    public async crearServicioGeneral(servicio: DatosGeneralesServicio): Promise<DatosGeneralesServicio> {
      const consulta = 'INSERT INTO servicio(usuario_id, entidad_receptora, receptor, programa,'
      + 'objetivos_programa, fecha_inicio, fecha_fin, horario_hora_inicio, horario_hora_fin)'
      + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const args = [
        servicio.idUsuario,
        servicio.entidadReceptora,
        servicio.receptor,
        servicio.programa,
        servicio.objetivosDelPrograma,
        servicio.fechaInicio,
        servicio.fechaFin,
        servicio.horarioHoraInicio,
        servicio.horarioHoraFin,
      ];
      // Ejecutar la consulta de inserción
      const insertInfo: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else {
            // Construir el objeto con el ID autogenerado
            const servicioRegistrado = {
              id: res.insertId,
              idUsuario: servicio.idUsuario,
              entidadReceptora: servicio.entidadReceptora,
              receptor: servicio.receptor,
              programa: servicio.programa,
              objetivosDelPrograma: servicio.objetivosDelPrograma,
              fechaInicio: servicio.fechaInicio,
              fechaFin: servicio.fechaFin,
              horarioHoraInicio: servicio.horarioHoraInicio,
              horarioHoraFin: servicio.horarioHoraFin,
            };
            resolve(servicioRegistrado);
          }
        });
      });
      return insertInfo;
    }

    /** Obtener todos los valores de la tabla servicio de MySQL */
    public async obtenerServicioGeneral(id: number): Promise<DatosGeneralesServicio> {
      const consulta = 'SELECT * FROM servicio WHERE id=?';
      const args = [id];
      const selectInfo: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.length < 1) {
            // Si no se encuentra el servicio, rechazar con ObjetoNoEncontrado
            reject(new ObjetoNoEncontrado());
          } else {
            // Construir el objeto DatosGeneralesServicio con los datos obtenidos
            const datosServicio: DatosGeneralesServicio = {
              id: res[0].id,
              idUsuario: res[0].usuario_id,
              entidadReceptora: res[0].entidad_receptora,
              receptor: res[0].receptor,
              programa: res[0].programa,
              objetivosDelPrograma: res[0].objetivos_programa,
              fechaInicio: res[0].fecha_inicio,
              fechaFin: res[0].fecha_fin,
              horarioHoraInicio: res[0].horario_hora_inicio,
              horarioHoraFin: res[0].horario_hora_fin,
            };
            resolve(datosServicio);
          }
        });
      });
      return selectInfo;
    }

    /** Método para obtener los datos generales de un servicio a partir de un ID de usuario */
    public async obtenerPorIdUsuario(idUsuario: number): Promise<DatosGeneralesServicio> {
      const consulta = 'SELECT * FROM `servicio` WHERE usuario_id = ?';
      const promise: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, [idUsuario], (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.length < 1) {
            // No se encontró ningún servicio para este usuario
            resolve(false);
          } else {
            // Construir el objeto DatosGeneralesServicio con los datos obtenidos
            const datos: DatosGeneralesServicio = {
              id: res[0].id,
              idUsuario: res[0].usuario_id,
              entidadReceptora: res[0].entidad_receptora,
              receptor: res[0].receptor,
              programa: res[0].programa,
              objetivosDelPrograma: res[0].objetivos_programa,
              fechaInicio: res[0].fecha_inicio,
              fechaFin: res[0].fecha_fin,
              horarioHoraInicio: res[0].horario_hora_inicio,
              horarioHoraFin: res[0].horario_hora_fin,
            };
            resolve(datos);
          }
        });
      });
      return promise;
    }

    /** Actualizar todos los valores de un campo de la tabla servicio de MySQL */
    // Actualiza los datos de un servicio existente en la base de datos.
    public async actualizarServicioGeneral(servicio: DatosGeneralesServicio): Promise<DatosGeneralesServicio> {
      const consulta = 'UPDATE servicio SET usuario_id=?, entidad_receptora=?, receptor=?, programa=?,'
      + 'objetivos_programa=?, fecha_inicio=?, fecha_fin=?, horario_hora_inicio=?,'
      + 'horario_hora_fin=? WHERE id=?';
      const args = [
        servicio.idUsuario,
        servicio.entidadReceptora,
        servicio.receptor,
        servicio.programa,
        servicio.objetivosDelPrograma,
        servicio.fechaInicio,
        servicio.fechaFin,
        servicio.horarioHoraInicio,
        servicio.horarioHoraFin,
        servicio.id,
      ];
      // Ejecutar la consulta de actualización
      const updateInfo: any = await new Promise((resolve, reject) => {
        this.conexion.query(consulta, args, (err, res) => {
          if (err) {
            // Si hay un error en la consulta, rechazar la promesa
            reject(err);
          } else if (res.affectedRows < 1) {
            // Si no se encuentra el servicio, rechazar con ObjetoNoEncontrado
            reject(new ObjetoNoEncontrado());
          } else {
            // Retornar el objeto servicio actualizado
            resolve(servicio);
          }
        });
      });
      return updateInfo;
    }
}
