
/* ============================================================================
  Trabajo Programado: Crear Trimestre/Semestre Uno
  ============================================================================
  Este trabajo automatizado se ejecuta cada **1° de enero** de cada año.
  Su función principal es:
   
  1. Crear automáticamente los **semestres** correspondientes al
    Periodo de Servicio 1 (febrero - enero).
  2. (Opcionalmente) también permite crear los **cuatro trimestres**
    del periodo, aunque actualmente esa parte está comentada.
   
  Periodos generados:
    - Semestre 1: 1 de febrero al 30 de junio (del año en curso)
    - Semestre 2: 1 de julio (año actual) al 31 de enero (año siguiente)
   
  Ramón Paredes Sánchez
   ============================================================================ */

import database from '../../database'; 
import _CronJob from '../../resources/models/CronJob'; //invoca los trabajos automatizados
import Semestre from '../../resources/models/Semestre'; //invoca el modelo del trimestre

function obtenerAnio(): number {
  const fecha = new Date();
  return fecha.getFullYear();
}

/*async function crearTrimestres() {
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
}*/

async function crearSemestres(){
  try{
    const anioS = obtenerAnio();
    
    // Crear semestre 1 
    const semestreUno: Semestre = {
      id: 0, // dummy
      fechaInicio: `${anioS}-02-01`,
      fechaFin: `${anioS}-06-30`,
    };
    await database.almacenamientoSemestre.crearSemestre(semestreUno);
    
    // Crear semestre 2 
    const anioS2 = anioS + 1;
    const semestreDos: Semestre = {
      id: 0, // dummy
      fechaInicio: `${anioS}-07-01`,
      fechaFin: `${anioS2}-01-31`,
    };
    await database.almacenamientoSemestre.crearSemestre(semestreDos);

  }catch(err){
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