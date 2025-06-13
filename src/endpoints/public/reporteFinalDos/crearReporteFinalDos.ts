/* eslint-disable linebreak-style */
import baseDatos from '../../../database';
import ReporteParcial from '../../../resources/models/ReporteParcial';

export default async function crearReporteFinalDos(req: any, res: any) {
  const { usuario } = req;

  try {
    const parciales: ReporteParcial[] = await baseDatos
      .almacenamientoReporteParcial.obtenerReportesPorIdServicio(usuario.idServicio);
    if (parciales.length !== 2) {
      return res.status(400).send({ code: 'Error: reportes parciales no completados' });
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
