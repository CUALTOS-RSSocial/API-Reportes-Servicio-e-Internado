/* eslint-disable linebreak-style */
import AlmacenamientoUsuario from './AlmacenamientoUsuario';
import AlmacenamientoTrimestre from './AlmacenamientoTrimestre';
import AlmacenamientoReporteParcial from './AlmacenamientoReporteParcial';
import AlmacenamientoReporteFinalDos from './AlmacenamientoReporteFinalDos';
import AlmacenamientoActividadDeUsuario from './AlmacenamientoActividadDeUsuario';
import AlmacenamientoActividadRealizada from './AlmacenamientoActividadRealizada';
import AlmacenamientoAtencionRealizada from './AlmacenamientoAtencionRealizada';
import AlmacenamientoServicioGeneral from './AlmacenamientoServicioGeneral';
import conexion from './conexion';

class Database {
  almacenamientoUsuario: AlmacenamientoUsuario;

  almacenamientoTrimestre: AlmacenamientoTrimestre;

  almacenamientoReporteParcial: AlmacenamientoReporteParcial;

  almacenamientoReporteFinalDos: AlmacenamientoReporteFinalDos;

  almacenamientoActividadDeUsuario: AlmacenamientoActividadDeUsuario;

  almacenamientoActividadRealizada: AlmacenamientoActividadRealizada;

  almacenamientoAtencionRealizada: AlmacenamientoAtencionRealizada;

  almacenamientoServicioGeneral: AlmacenamientoServicioGeneral;

  constructor() {
    this.almacenamientoUsuario = new AlmacenamientoUsuario(conexion);
    this.almacenamientoTrimestre = new AlmacenamientoTrimestre(conexion);
    this.almacenamientoReporteParcial = new AlmacenamientoReporteParcial(conexion);
    this.almacenamientoReporteFinalDos = new AlmacenamientoReporteFinalDos(conexion);
    this.almacenamientoActividadDeUsuario = new AlmacenamientoActividadDeUsuario(conexion);
    this.almacenamientoActividadRealizada = new AlmacenamientoActividadRealizada(conexion);
    this.almacenamientoAtencionRealizada = new AlmacenamientoAtencionRealizada(conexion);
    this.almacenamientoServicioGeneral = new AlmacenamientoServicioGeneral(conexion);
  }
}

const database: Database = new Database();

export default database;
