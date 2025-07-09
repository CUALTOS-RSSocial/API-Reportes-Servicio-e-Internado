import baseDatos from '../../../database';
import SolicitudPersonalizada from '../../../resources/models/Request';
import Trimestre from '../../../resources/models/Trimestre';

export default async function obtenerCompleto(req: SolicitudPersonalizada, res: any) {
  try {
    const generales = await baseDatos.almacenamientoServicioGeneral
      .obtenerPorIdUsuario(req.usuario.id);

    if (!generales) {
      return res.status(404).send({ code: 'SERVICIO_NO_ENCONTRADO' });
    }
    
    const trimestres: Trimestre[] = await baseDatos.almacenamientoTrimestre
      .obtenerPorFechas(generales.fechaInicio, generales.fechaFin);

    return res.status(200).send(trimestres);
  } catch (err) {
    return res.status(500).send({ code: 'ERROR_DE_BASE_DE_DATOS' });
  }
}
