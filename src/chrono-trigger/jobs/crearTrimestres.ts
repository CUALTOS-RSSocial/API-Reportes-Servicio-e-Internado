/* Trabajo Crear Trimestre/Semestre Uno
 * Este trabajo permite crear todos los 2 semestres que corresponden
 * al periodo de servicio 1, de manera automática cada primero de febrero. 
 * A su vez, crear los 4 Trimestre que corresponden al periodo de servicio 1
 * 
 * Escrito por Ramón Paredes Sánchez 
 */

import database from '../../database'; 
import _CronJob from '../../resources/models/CronJob'; //invoca los trabajos automatizados
import Trimestre from '../../resources/models/Trimestre'; //invoca el modelo del trimestre

function obtenerAnio(): number {
  const fecha = new Date();
  return fecha.getFullYear();
}

async function crearTrimestres() {
  try {
    const anio = obtenerAnio();
    // Crear trimestre 1
    const trimestreUno: Trimestre = {
      id: 0, // dummy
      fechaInicio: `${anio}-02-01`,
      fechaFin: `${anio}-04-30`,
    };
    await database.almacenamientoTrimestre.crearTrimestre(trimestreUno);
    // Crear trimestre 2
    const trimestreDos: Trimestre = {
      id: 0, // dummy
      fechaInicio: `${anio}-05-01`,
      fechaFin: `${anio}-07-31`,
    };
    await database.almacenamientoTrimestre.crearTrimestre(trimestreDos);
    // Crear trimestre 3
    const trimestreTres: Trimestre = {
      id: 0, // dummy
      fechaInicio: `${anio}-08-01`,
      fechaFin: `${anio}-10-31`,
    };
    await database.almacenamientoTrimestre.crearTrimestre(trimestreTres);
    // Crear trimestre 4
    const anio2 = anio + 1;
    const trimestreCuatro: Trimestre = {
      id: 0, // dummy
      fechaInicio: `${anio}-11-01`,
      fechaFin: `${anio2}-01-31`,
    };
    await database.almacenamientoTrimestre.crearTrimestre(trimestreCuatro);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('ERROR: TAREA NO COMPLETADA, NO SE PUDIERON CREAR LOS TRIMESTRES.');
    throw err;
  }

  // eslint-disable-next-line no-console
  console.log('Se crearon todos los trimestres del año con exito');
}

const cronJob: _CronJob = {
  cron: '0 0 1 1 *', // minuto 0, de la hora 0, del día 1 del mes 1 de cualquier año
  job: () => {
    crearTrimestres();
  },
};

export default cronJob;