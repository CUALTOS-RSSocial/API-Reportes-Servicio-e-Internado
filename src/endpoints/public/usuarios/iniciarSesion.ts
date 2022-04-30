import Usuario from '../../../resources/models/Usuario';
import baseDatos from '../../../database';
import autenticacion from '../../../autenticacion';
import DatosGeneralesServicio from '../../../resources/models/DatosGeneralesServicio';
import validarSiiau from './validarSiiau';
import ObjetoNoEncontrado from '../../../database/errors/ObjetoNoEncontrado';

export default async function (req: any, res: any) {
  const {
    body,
  } = req;

  const { codigo, nip } = body;

  let usuario: Usuario;
  let servicio: DatosGeneralesServicio;
  const errorData: any = {};
  let datosSiiau: any = {};

  try {
    datosSiiau = await validarSiiau(codigo, nip);
    if (datosSiiau.length === 1 && datosSiiau[0] === '0') {
      errorData.code = 'NO_SE_ENCONTRO_EL_USUARIO_O_LA_CONTRASENA_ES_INCORRECTA';
      errorData.status = 404;
      return res.status(errorData.status).send({ code: errorData.code });
    }
  } catch (err) {
    errorData.code = 'ERROR_DE_CONEXION_A_SIIAU';
    errorData.status = 404;
    return res.status(errorData.status).send({ code: errorData.code });
  }

  if (datosSiiau.length < 4) {
    errorData.code = 'ERROR_DE_CONEXION_A_SIIAU';
    errorData.status = 404;
    return res.status(errorData.status).send({ code: errorData.code });
  }

  const carreras = ['NUT', 'LNTO', 'ENFA', 'NUTA', 'DENA', 'MCPA', 'MCP', 'LENF', 'ENF', 'LICD', 'DEN', 'EODP', 'EMFM', 'EMUR', 'ENDO', 'MIDU'];

  if (!carreras.includes(datosSiiau[4])) {
    errorData.code = 'ESTA_APP_SOLO_FUNCIONA_PARA_CARRERAS_DEL_AREA_DE_LA_SALUD';
    errorData.status = 404;
    return res.status(errorData.status).send({ code: errorData.code });
  }

  try {
    let idServicio;
    usuario = await baseDatos.almacenamientoUsuario.obtenerUsuario(codigo);
    if (usuario instanceof ObjetoNoEncontrado) {
      const datosUsuario: Usuario = {
        id: datosSiiau[1],
        rol: 'prestador',
        nombre: datosSiiau[2],
        carrera: datosSiiau[4],
      };
      usuario = await baseDatos.almacenamientoUsuario.crearUsuario(datosUsuario);
      idServicio = 0;
    } else {
      servicio = await baseDatos.almacenamientoServicioGeneral.obtenerPorIdUsuario(usuario.id);
      idServicio = servicio.id;
    }
    const token = autenticacion.crearToken(usuario, idServicio);
    return res.status(201).send({ token });
  } catch (err) {
    if (err.errno === 1048) {
      errorData.code = 'USUARIO_NO_ENCONTRADO_EN_SIIAU';
      errorData.status = 500;
    }

    errorData.code = 'ERROR_DE_BASE_DE_DATOS';
    errorData.status = 500;
    return res.status(errorData.status).send({ code: errorData.code });
  }
}
