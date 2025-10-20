/* eslint-disable linebreak-style */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
/* Archivo y función para crear un nuevo reporte para un usuario/servicio */
/**
  Función: crearReporte
  
  Controlador de tipo API para crear un nuevo reporte parcial semestral para un usuario y su servicio asociado.
  Esta función realiza las siguientes operaciones:
  
  1. Validación de datos recibidos en la petición HTTP:
     - req.usuario: información del usuario autenticado (id y idServicio).
     - req.body.actividadesUsuario: lista de actividades del usuario a registrar.
     - req.body.atencionesRealizadas: lista de atenciones realizadas a registrar.
     - req.body.horasRealizadas: número de horas realizadas.
     - req.params.numeroReporte: número del reporte que se quiere crear (1 o 2, según semestres).
  
  2. Obtención de los datos generales del servicio del usuario.
 
  3. Obtención de los semestres asociados a las fechas del servicio.
  
  4. Verificación de la secuencia de reportes:
     - No se pueden crear más de 2 reportes semestrales.
     - El reporte a crear debe corresponder al siguiente semestre disponible.
     - Se valida que el reporte anterior ya haya sido creado.
     - Se valida que la fecha actual sea igual o posterior al fin del semestre correspondiente.
  
  5. Creación del nuevo reporte semestral en la base de datos:
     - Inicializa arrays vacíos para actividades realizadas y atenciones realizadas.
     - Se asocia el reporte al servicio y al semestre correspondiente.
  
  6. Inserción de las atenciones realizadas proporcionadas:
     - Cada atención se asocia al nuevo reporte y al usuario.
  
  7. Inserción de las actividades del usuario y actividades realizadas:
     - Si la actividad ya existe, se reutiliza su id.
     - Si no existe, se crea una nueva actividad y luego se registra como realizada.
  
  8. Devuelve el reporte creado con todas las relaciones incluidas en la respuesta HTTP.
  
  Manejo de errores:
  - 400: Datos inválidos enviados en el body de la petición.
  - 404: 
     - Servicio no encontrado.
     - Número de reporte no válido.
     - Semestre correspondiente no existe.
     - El reporte anterior no ha sido creado.
     - El reporte ya ha sido creado.
     - Datos inválidos de actividades o atenciones.
  - 500: Error interno de servidor (fallo al obtener servicio, reportes, semestres o insertar datos).
  
  Funciones internas:
  - obtenerFecha(): Devuelve la fecha actual en formato 'YYYY-MM-DD' para marcar la creación del reporte.
  - esFechaPosterior(fecha1, fecha2): Compara dos fechas y devuelve true si fecha1 es igual o posterior a fecha2.
  
  Dependencias:
  - baseDatos: módulo que contiene las clases de almacenamiento para CRUD de reportes, actividades y atenciones.
  - Modelos: ReporteParcialSemestral, ActividadesDeUsuario, ActividadesRealizadasSemestral, AtencionesRealizadasSemestral, DatosGeneralesServicio, Semestre.
 */ 

import baseDatos from '../../../database';
import ObjetoNoEncontrado from '../../../database/errors/ObjetoNoEncontrado';
import ActividadesDeUsuario from '../../../resources/models/ActividadesDeUsuario';
import ActividadesRealizadas from '../../../resources/models/ActividadesRealizadasSemestral';
import AtencionesRealizadas from '../../../resources/models/AtencionesRealizadasSemestral';
import DatosGeneralesServicio from '../../../resources/models/DatosGeneralesServicio';
import Semestre from '../../../resources/models/Semestre';
import ReporteParcial from '../../../resources/models/ReporteParcialSemestral'; 

function obtenerFecha(): string {
  const fecha = new Date();
  const dia = (`0${fecha.getDate()}`).slice(-2);
  const mes = (`0${fecha.getMonth() + 1}`).slice(-2);
  const anio = fecha.getFullYear();

  return `${anio}-${mes}-${dia}`;
}

function esFechaPosterior(fecha1: string, fecha2: string) : boolean {
  const f1 = new Date(fecha1);
  const f2 = new Date(fecha2);
  return f1 >= f2;
}

export default async function crearReporte(req: any, res: any) {
  const { usuario } = req;
  let idUsuario = 0;
  let idServicio = 0;
  let actividadesDeUsuario: any[] = [];
  let atencionesRealizadas: any[] = [];
  let horasRealizadas = 0;
  let servicio: DatosGeneralesServicio;
  let semestres: Semestre[] = [];
  let reportes: ReporteParcial[] = [];
  let nuevoReporte: ReporteParcial;

  // 1.- Obtener los datos del body
  try {
    idUsuario = usuario.id;
    idServicio = usuario.idServicio;
    actividadesDeUsuario = req.body.actividadesUsuario;
    atencionesRealizadas = req.body.atencionesRealizadas;
    horasRealizadas = req.body.horasRealizadas;
  } catch (err) {
    return res.status(400).send({ code: 'DATOS_INVALIDOS' });
  }

  // 2.- Obtener los datos del servicio del usuario.
  try {
    servicio = await baseDatos.almacenamientoServicioGeneral.obtenerServicioGeneral(idServicio);
  } catch (err) {
    if (err instanceof ObjetoNoEncontrado) {
      return res.status(404).send({ code: 'SERVICIO_NO_ENCONTRADO' });
    }
    return res.status(500).send({ code: 'ERROR_DE_BASE_DE_DATOS' });
  }

  // 3.- Obtener los semestres de este servicio
  try {
    semestres = await baseDatos.almacenamientoSemestre
      .obtenerPorFechas(servicio.fechaInicio, servicio.fechaFin);
  } catch (err) {
    return res.status(500).send({ code: 'ERROR_AL_OBTENER_LAS_FECHAS' });
  }

  try {
    reportes = await baseDatos.almacenamientoReporteParcialSemestral.obtenerReportesPorIdUsuario(idUsuario);
  } catch (err) {
    return res.status(500).send({ code: 'ERROR_AL_OBTENER_REPORTES' });
  }

  // 4.- Obtener los reportes ya creados y crear el nuevo reporte.
  try {
    if (reportes.length >= 2) {
      return res.status(404).send({ code: 'NUMERO_DE_REPORTE_NO_VALIDO' });
    }

    if (semestres.length < reportes.length + 1) { // No existe semestre para este reporte
      return res.status(404).send({ code: 'EL_SEMESTRE_CORRESPONDIENTE_NO_EXISTE: Revisa las fechas del servicio' });
    }

    if (Number(req.params.numeroReporte) === reportes.length) { // El anterior tiene que estar creado
      return res.status(404).send({ code: 'ESTE_REPORTE_YA_HA_SIDO_CREADO.' });
    }

    if (Number(req.params.numeroReporte) > reportes.length + 1) { // El anterior tiene que estar creado
      return res.status(404).send({ code: 'EL_REPORTE_ANTERIOR_NO_HA_SIDO_CREADO' });
    }

    // El reporte se debe crear en una fecha igual o posterior al fin de su semestre
    if (!esFechaPosterior(obtenerFecha(), semestres[reportes.length].fechaFin)) {
      return res.status(404).send({ code: 'AUN_NO_PUEDES_REALIZAR_ESTE_REPORTE' });
    }

    const actualizado = obtenerFecha();
    const dummy: ActividadesRealizadas[] = []; 
    const dummy2: AtencionesRealizadas[] = []; 

    const idSemestre = semestres[reportes.length].id;

    nuevoReporte = {
      id: 0,
      idServicio,
      idSemestre,
      actualizado,
      horasRealizadas,
      actividadesRealizadas: dummy,
      atencionesRealizadas: dummy2,
    };

    nuevoReporte = await baseDatos.almacenamientoReporteParcialSemestral.crearReporteParcial(nuevoReporte);
  } catch (err) {
    if (err.errno === 1366) {
      return res.status(404).send({ codigo: 'DATOS_INVALIDOS' });
    }

    return res.status(500).send('ERROR_AL_CREAR_REPORTE');
  }

  // 6.- Guardar las atenciones con los datos del servicio y el nuevo reporte.
  try {
    const idNuevoReporte = nuevoReporte.id;

    for (let i = 0; i < atencionesRealizadas.length; i += 1) {
      let nuevaAtencion: AtencionesRealizadas = {
        id: 0,
        idReporteParcialSemestral: idNuevoReporte,
        idUsuario,
        tipo: i,
        cantidad: atencionesRealizadas[i].cantidad,
      };

      nuevaAtencion = await baseDatos.almacenamientoAtencionRealizadaSemestral
        .crearAtencionRealizada(nuevaAtencion); // Se almacena por cuestión de la promesa, aunque no se vuelve a usuar.

      nuevoReporte.atencionesRealizadas.push(nuevaAtencion);
    }
  } catch (err) {
    if (err.errno === 1366) {
      return res.status(404).send({ codigo: 'DATOS_INVALIDOS' });
    }

    return res.status(500).send({ code: 'ERROR_AL_CREAR_ATENCIONES' });
  }

  // 7.- Guardar actividades de usuario y actividades realizadas con los datos en variables.
  try {
    for (let i = 0; i < actividadesDeUsuario.length; i += 1) {
      let idActividadDeUsuario = 0;
      if (actividadesDeUsuario[i].id !== 0) { // ya existe, solo crear realizadas
        idActividadDeUsuario = actividadesDeUsuario[i].id;
      } else { // si no existe
        const nuevaActividad: ActividadesDeUsuario = {
          id: 0, // id dummy
          idServicio,
          descripcion: actividadesDeUsuario[i].descripcion,
        };
        const actividadCreada = await baseDatos.almacenamientoActividadDeUsuario
          .crearActividadDeUsuario(nuevaActividad);
        idActividadDeUsuario = actividadCreada.id;
      }
      let nuevaRealizada: ActividadesRealizadas = {
        id: 0,
        idActividad: idActividadDeUsuario,
        idReporteParcialSemestral: nuevoReporte.id,
        cantidad: actividadesDeUsuario[i].cantidad,
      };

      nuevaRealizada = await baseDatos.almacenamientoActividadRealizadaSemestral
        .crearActividadRealizada(nuevaRealizada);
      nuevoReporte.actividadesRealizadas.push(nuevaRealizada);
    }
  } catch (err) {
    if (err.errno === 1366) {
      return res.status(404).send({ codigo: 'DATOS_INVALIDOS' });
    }

    return res.status(500).send({ code: 'ERROR_AL_CREAR_ACTIVIDADES' });
  }

  return res.status(201).send(nuevoReporte);
}