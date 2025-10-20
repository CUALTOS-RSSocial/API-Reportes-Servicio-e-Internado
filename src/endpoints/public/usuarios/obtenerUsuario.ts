/* eslint-disable linebreak-style */
/*
  Endpoint para obtener la información de un usuario dado su código.
  Valida las credenciales del usuario contra el sistema SIIAU
  y recupera la información del usuario desde la base de datos.
*/
import baseDatos from '../../../database';
import validarSiiau from './validarSiiau';

export default async function crearUsuario(req: any, res: any) {
  const {
    query,
  } = req;

  const { codigo, nip } = query;
  const errorData: any = {};
  let datosSiiau: any = {};

  let usuarioCompleto;

  try {
    usuarioCompleto = await baseDatos
      .almacenamientoUsuario.obtenerUsuario(codigo);
  } catch (err) {
    return res.status(500).send({ codigo: 'ERROR_DE_BASE_DE_DATOS' });
  }

  try {
    datosSiiau = await validarSiiau(codigo, nip);
    if (datosSiiau.length === 1 && datosSiiau[0] === '0') {
      errorData.code = 'USUARIO_NO_ENCONTRADO_EN_SIIAU';
      errorData.status = 404;
      return res.status(errorData.status).send({ code: errorData.code });
    }
  } catch (err) {
    errorData.code = 'ERROR_DE_CONEXION_A_SIIAU';
    errorData.status = 404;
    return res.status(errorData.status).send({ code: errorData.code });
  }

  return res.status(201).send({
    id: datosSiiau[1],
    rol: usuarioCompleto.rol,
    nombre: datosSiiau[2],
    carrera: datosSiiau[4],
  });
}
