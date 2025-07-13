/* eslint-disable linebreak-style */
import baseDatos from '../../../database';
import ReporteParcial from '../../../resources/models/ReporteParcial';

export default async function crearReporteFinalDos(req: any, res: any) {
  const { usuario } = req;

  try {
    const parciales: ReporteParcial[] = await baseDatos
      .almacenamientoReporteParcial.obtenerReportesPorIdServicio(usuario.idServicio);

    //Se obtiene la información del servicio del usuario, para obtener la fecha de inicio
    const servicio = await baseDatos.almacenamientoServicioGeneral.obtenerServicioGeneral(usuario);

    //Aseguramiento de la comparación de las fechas del servicio 
    const fechaLimite = new Date('2025-02-01');
    const fechaInicio = new Date(servicio.fechaInicio);

    if (fechaInicio >= fechaLimite){
      if (parciales.length !== 2) {
        return res.status(400).send({ code: 'Error: reportes parciales no completados' });
      }
    }else{
      if (parciales.length !== 4) {
        return res.status(400).send({ code: 'Error: reportes parciales no completados' });
      }
    }

    const nuevoReporteFinalDos = await baseDatos
      .almacenamientoReporteFinalDos.crearReporteFinalDos({
        id: 0,
        idServicio: usuario.idServicio,
        metasAlcanzadas: req.body.metasAlcanzadas,
        metodologiaUtilizada: req.body.metodologiaUtilizada,
        innovacionAportada: req.body.innovacionAportada,
        conclusiones: req.body.conclusiones,
        propuestas: req.body.propuestas,
      });

    return res.status(201).send(nuevoReporteFinalDos);
  } catch (err) {
    if (err.errno === 1366) {
      return res.status(404).send({ codigo: 'DATOS_INVALIDOS' });
    }

    return res.status(404).send(err);
  }
}
