/* eslint-disable no-useless-catch */
/* Clase ChronoTrigger.
 * Esta clase permite ejecutar trabajos en fechas determinadas
 * de manera automatizada. Las tareas se definen como parte de la
 * interfaz "CronJob" y se almacenan en la carpeta "jobs"
 *
 * Escrito por Ramón Paredes Sánchez.
 */
/*
  ChronoTrigger
  ============================================================================
  Esta clase actúa como **gestor centralizado de cron jobs**.
  
  Permite:
  - Registrar múltiples tareas programadas al iniciar la aplicación.
  - Ejecutarlas automáticamente según la expresión CRON definida.
  
  Internamente utiliza:
  - `node-schedule` → Librería de Node.js para programar tareas en base a CRON.
  
  Ejemplo de expresión CRON: `0 0 1 1 *`
  -> Se ejecuta a las 00:00 hrs, el 1 de enero de cada año.
 */
import _CronJob from '../resources/models/CronJob';

const schedule = require('node-schedule');

export default class ChronoTrigger {
    private jobs: _CronJob[];

    constructor(jobs: _CronJob[]) {
      this.jobs = jobs;
    }

    public init() {
      try {
        this.jobs.forEach((CronJob: _CronJob) => {
          schedule.scheduleJob(CronJob.cron, CronJob.job);
        });
      } catch (err) {
        throw err;
      }
    }
}
