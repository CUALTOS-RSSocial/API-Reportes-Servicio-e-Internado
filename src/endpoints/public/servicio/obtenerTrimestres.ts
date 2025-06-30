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

    // Determinamos si el usuario es nuevo o viejo según la fecha de inicio de su servicio
    const esUsuarioNuevo = new Date(generales.fechaInicio) > new Date('2025-01-01');

    const trimestres: Trimestre[] = await baseDatos.almacenamientoTrimestre
      .obtenerPorFechas(generales.fechaInicio, generales.fechaFin);

    // Si es un usuario nuevo, solo devolver los semestres
    const trimestresFiltrados = esUsuarioNuevo
      ? trimestres.filter(trimestre => {
          const mes = new Date(trimestre.fechaInicio).getMonth();  
          return [2, 8].includes(mes);  // Semestres: Febrero (2) y Agosto (8)
        })
      : trimestres;

    return res.status(200).send(trimestresFiltrados);
  } catch (err) {
    return res.status(500).send({ code: 'ERROR_DE_BASE_DE_DATOS' });
  }
}
