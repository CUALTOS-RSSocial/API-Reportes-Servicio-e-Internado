/* Trabajo Crear Semestre Uno
 * Este trabajo permite crear todos los 2 semestres que corresponden
 * al periodo de servicio 1, de manera automática cada primero de febrero.
 *
 * Escrito por Ramón Paredes Sánchez | Cambiado por otra prestadora de servicio
 */

import database from '../../database'; 
import _CronJob from '../../resources/models/CronJob'; //invoca los trabajos automatizados
import Semestre from '../../resources/models/Semestre'; //invoca el modelo del semestre

function obtenerAnio(): number {
  const fecha = new Date();
  return fecha.getFullYear();
}

async function crearSemestres() {
  try {
    const anio = obtenerAnio();
    // Crear semestre 1
    const semestreUno: Semestre = {
      id: 0, // dummy
      fechaInicio: `${anio}-02-01`,
      fechaFin: `${anio}-07-31`,
    };
    await database.almacenamientoSemestre.crearSemestre(semestreUno);
    //Solo se ocupan dos reportes por año
    // Crear semestre 2
    const semestreDos: Semestre = {
      id: 0, // dummy
      fechaInicio: `${anio}-08-01`,
      fechaFin: `${anio}-12-31`, //si se pone 01-31, puede existir un problema en la lógica
    };
    await database.almacenamientoSemestre.crearSemestre(semestreDos);
    //Solo se ocupan dos reportes por año
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('ERROR: TAREA NO COMPLETADA, NO SE PUDIERON CREAR LOS SEMESTRES.');
    throw err;
  }

  // eslint-disable-next-line no-console
  console.log('Se crearon todos los semestres del año con exito');
}

const cronJob: _CronJob = {
  cron: '0 0 1 1 *', // minuto 0, de la hora 0, del día 1 del mes 1 de cualquier año
  job: () => {
    crearSemestres();
  },
};

export default cronJob;
