/* eslint-disable linebreak-style */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
import baseDatos from '../../../database';
import ActividadesDeUsuario from '../../../resources/models/ActividadesDeUsuario';
import ActividadesRealizadas from '../../../resources/models/ActividadesRealizadas';
import AtencionesRealizadas from '../../../resources/models/AtencionesRealizadas';
import ReporteParcial from '../../../resources/models/ReporteParcial'; //invoca el modelo del reporte parcial

function obtenerFecha(): string {
  const fecha = new Date();
  const dia = (`0${fecha.getDate()}`).slice(-2);
  const mes = (`0${fecha.getMonth() + 1}`).slice(-2);
  const anio = fecha.getFullYear();

  return `${anio}-${mes}-${dia}`;
}

export default async function actualizarReporte(req: any, res: any) {
  const { usuario } = req;
  let idUsuario = 0;
  let idServicio = 0;
  let actividadesDeUsuario: any[] = [];
  let atencionesRealizadas: any[] = [];
  let numeroReporte = 0;
  let horasRealizadas = 0;
  let nuevoReporte: ReporteParcial;

  // 1.- Obtener los datos del body
  try {
    idUsuario = usuario.id;
    idServicio = usuario.idServicio;
    actividadesDeUsuario = req.body.actividadesUsuario;
    atencionesRealizadas = req.body.atencionesRealizadas;
    horasRealizadas = req.body.horasRealizadas;
    numeroReporte = req.params.numeroReporte;

    if (numeroReporte < 1 || numeroReporte > 4) {
      return res.status(404).send({ code: 'NUMERO_REPORTE_NO_VALIDO' });
    }
  } catch (err) {
    return res.status(400).send({ code: 'DATOS_ENVIADOS_NO_SON_VALIDOS' });
  }

  // 2.- Validar que exista el servicio
  try {
    if (!await baseDatos.almacenamientoServicioGeneral.obtenerPorIdUsuario(idUsuario)) {
      return res.status(404).send({ code: 'SERVICIO_NO_ENCONTRADO' });
    }
  } catch (err) {
    return res.status(500).send({ code: 'ERROR_AL_OBTENER_SERVICIO' });
  }

  // 3.- Actualizar reporte
  try {
    const reportes = await baseDatos.almacenamientoReporteParcial.obtenerReportesPorIdUsuario(idUsuario);
    if (reportes.length < numeroReporte) {
      return res.status(404).send({ code: 'REPORTE_NO_ENCONTRADO' });
    }

    nuevoReporte = reportes[numeroReporte - 1];
    const auxReporte: ReporteParcial = {
      id: nuevoReporte.id,
      idServicio: nuevoReporte.idServicio,
      idTrimestre: nuevoReporte.idTrimestre,
      actualizado: obtenerFecha(),
      horasRealizadas,
      actividadesRealizadas: [],
      atencionesRealizadas: [],
    };

    nuevoReporte = await baseDatos.almacenamientoReporteParcial.actualizarReporteParcial(auxReporte);
  } catch (err) {
    if (err.errno === 1292) {
      return res.status(404).send({ codigo: 'DATOS_INVALIDOS' });
    }

    return res.status(500).send({ code: 'ERROR_AL_ACTUALIZAR_REPORTE' });
  }

  // 4.- Eliminar actividades realizadas y atenciones realizadas anteriores
  try {
    await baseDatos.almacenamientoActividadRealizada.eliminarActividadesDeReporte(nuevoReporte.id);
    await baseDatos.almacenamientoAtencionRealizada.eliminarAtencionesDeReporte(nuevoReporte.id);
  } catch (err) {
    return res.status(500).send({ code: 'ERROR_AL_ELIMINAR_ACTIVIDADES_Y_ATENCIONES' });
  }

  // 5.- Insertar nuevas atenciones realizadas y nuevas actividades realizadas
  try {
    const idNuevoReporte = nuevoReporte.id;
    for (let i = 0; i < atencionesRealizadas.length; i += 1) {
      let nuevaAtencion: AtencionesRealizadas = {
        id: 0,
        idReporteParcial: idNuevoReporte,
        idUsuario,
        tipo: i,
        cantidad: atencionesRealizadas[i].cantidad,
      };

      nuevaAtencion = await baseDatos.almacenamientoAtencionRealizada
        .crearAtencionRealizada(nuevaAtencion); // Se almacena por cuestión de la promesa, aunque no se vuelve a usuar.
      nuevoReporte.atencionesRealizadas.push(nuevaAtencion);
    }
  } catch (err) {
    if (err.errno === 1366) {
      return res.status(404).send({ codigo: 'DATOS_INVALIDOS' });
    }

    return res.status(500).send({ code: 'ERROR_AL_ACTUALIZAR_ACTIVIDADES_Y_ATENCIONES' });
  }

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
        idReporteParcial: nuevoReporte.id,
        cantidad: actividadesDeUsuario[i].cantidad,
      };

      nuevaRealizada = await baseDatos.almacenamientoActividadRealizada
        .crearActividadRealizada(nuevaRealizada);
      nuevoReporte.actividadesRealizadas.push(nuevaRealizada);
    }
  } catch (err) {
    if (err.errno === 1366) {
      return res.status(404).send({ codigo: 'DATOS_INVALIDOS' });
    }

    return res.status(500).send({ code: 'ERROR_DE_BASE_DE_DATOS' });
  }

  return res.status(201).send({ ...nuevoReporte });
}
