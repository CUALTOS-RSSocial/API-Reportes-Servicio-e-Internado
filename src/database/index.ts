/* eslint-disable linebreak-style */
import AlmacenamientoUsuario from './AlmacenamientoUsuario';
import AlmacenamientoTrimestre from './AlmacenamientoTrimestre';
import AlmacenamientoSemestre from './AlmacenamientoSemestre';
import AlmacenamientoReporteParcial from './AlmacenamientoReporteParcial';
import AlmacenamientoReporteParcialSemestral from './AlmacenamientoReporteParcialSemestral';
import AlmacenamientoReporteFinalDos from './AlmacenamientoReporteFinalDos';
import AlmacenamientoActividadDeUsuario from './AlmacenamientoActividadDeUsuario';
import AlmacenamientoActividadRealizada from './AlmacenamientoActividadRealizada';
import AlmacenamientoActividadRealizadaSemestral from './AlmacenamientoActividadRealizadaSemestral';
import AlmacenamientoAtencionRealizada from './AlmacenamientoAtencionRealizada';
import AlmacenamientoAtencionRealizadaSemestral from './AlmacenamientoAtencionRealizadaSemestral';
import AlmacenamientoServicioGeneral from './AlmacenamientoServicioGeneral';
import conexion from './conexion';

class Database {
  almacenamientoUsuario: AlmacenamientoUsuario;

  almacenamientoTrimestre: AlmacenamientoTrimestre;

  almacenamientoSemestre: AlmacenamientoSemestre; 

  almacenamientoReporteParcial: AlmacenamientoReporteParcial;

  almacenamientoReporteParcialSemestral : AlmacenamientoReporteParcialSemestral;

  almacenamientoReporteFinalDos: AlmacenamientoReporteFinalDos;

  almacenamientoActividadDeUsuario: AlmacenamientoActividadDeUsuario;

  almacenamientoActividadRealizada: AlmacenamientoActividadRealizada;

  almacenamientoActividadRealizadaSemestral : AlmacenamientoActividadRealizadaSemestral;

  almacenamientoAtencionRealizada: AlmacenamientoAtencionRealizada;

  almacenamientoAtencionRealizadaSemestral: AlmacenamientoAtencionRealizadaSemestral;

  almacenamientoServicioGeneral: AlmacenamientoServicioGeneral;

  constructor() {
    this.almacenamientoUsuario = new AlmacenamientoUsuario(conexion);
    this.almacenamientoTrimestre = new AlmacenamientoTrimestre(conexion);
    this.almacenamientoSemestre = new AlmacenamientoSemestre(conexion);
    this.almacenamientoReporteParcial = new AlmacenamientoReporteParcial(conexion);
    this.almacenamientoReporteParcialSemestral = new AlmacenamientoReporteParcialSemestral(conexion);
    this.almacenamientoReporteFinalDos = new AlmacenamientoReporteFinalDos(conexion);
    this.almacenamientoActividadDeUsuario = new AlmacenamientoActividadDeUsuario(conexion);
    this.almacenamientoActividadRealizada = new AlmacenamientoActividadRealizada(conexion);
    this.almacenamientoActividadRealizadaSemestral = new AlmacenamientoActividadRealizadaSemestral(conexion);
    this.almacenamientoAtencionRealizada = new AlmacenamientoAtencionRealizada(conexion);
    this.almacenamientoAtencionRealizadaSemestral = new AlmacenamientoAtencionRealizadaSemestral(conexion);
    this.almacenamientoServicioGeneral = new AlmacenamientoServicioGeneral(conexion);
  }
}

const database: Database = new Database();

export default database;
