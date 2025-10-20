/* eslint-disable linebreak-style */
// Endpoint para obtener las actividades de un usuario autenticado
import baseDatos from '../../../database';
import ActividadesDeUsuario from '../../../resources/models/ActividadesDeUsuario';

export default async function crearUsuario(req: any, res: any) {
  const {
    usuario,
  } = req;

  try {
    const actividadesDeUsuario: ActividadesDeUsuario[] = await baseDatos
      .almacenamientoActividadDeUsuario.obtenerPorIdUsuario(usuario.id);
    return res.status(201).send(actividadesDeUsuario);
  } catch (err) {
    return res.status(500).send({ codigo: 'ERROR_DE_BASE_DE_DATOS' });
  }
}
