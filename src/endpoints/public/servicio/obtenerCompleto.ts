/* eslint-disable max-len */
/* Archivo y función para obtener todos los datos de un servicio completo
 * Incluye llamadas a métodos que permiten obtener todos los datos con relación a
 * un servicio social y una función a ser exportada para llamarse desde un endpoint de la
 * API.
 * Escrito por Ramón Paredes Sánchez.
 */
import baseDatos from '../../../database';
import Servicio from '../../../resources/models/Servicio';
import SolicitudPersonalizada from '../../../resources/models/Request';
import Trimestre from '../../../resources/models/Trimestre';

export default async function obtenerCompleto(req: SolicitudPersonalizada, res: any) {
  let generales;

  try {
    generales = await baseDatos.almacenamientoServicioGeneral.obtenerPorIdUsuario(req.usuario.id);

    if (!generales) {
      return res.status(404).send({ code: 'SERVICIO_NO_ENCONTRADO' });
    }
  } catch (err) {
    return res.status(500).send({ code: 'ERROR_DE_BASE_DE_DATOS' });
  }

  try {
    const parciales = await baseDatos.almacenamientoReporteParcial.obtenerReportesPorIdUsuario(req.usuario.id);

    const reportesParciales: any[] = [];
    await Promise.all(parciales.map(async (element: any) => {
      const trimestre: Trimestre = await baseDatos.almacenamientoTrimestre.obtenerTrimestre(element.idTrimestre);
      const reporte : any = element;
      reporte.fechaInicio = trimestre.fechaInicio;
      reporte.fechaFin = trimestre.fechaFin;
      reportesParciales.push(reporte);
    }));

    const final = await baseDatos.almacenamientoReporteFinalDos.obtenerPorIdUsuario(req.usuario.id);
    const actividades = await baseDatos.almacenamientoActividadDeUsuario.obtenerPorIdUsuario(req.usuario.id);

    const servicio : Servicio = {
      id: generales.id,
      idUsuario: generales.idUsuario,
      entidadReceptora: generales.entidadReceptora,
      receptor: generales.receptor,
      programa: generales.programa,
      objetivosDelPrograma: generales.objetivosDelPrograma,
      fechaInicio: generales.fechaInicio,
      fechaFin: generales.fechaFin,
      horarioHoraInicio: generales.horarioHoraInicio,
      horarioHoraFin: generales.horarioHoraFin,
      reportesParciales,
      reporteFinalDos: final,
      actividadesDeUsuario: actividades,
    };

    return res.status(200).send(servicio);
  } catch (err) {
    return res.status(500).send({ code: 'ERROR_DE_BASE_DE_DATOS' });
  }
}
