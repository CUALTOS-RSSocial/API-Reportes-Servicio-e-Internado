 /* 
 Controlador de autenticación de usuarios con validación SIIAU. 
  Este endpoint permite:
  1. Validar credenciales del usuario en el sistema SIIAU.
  2. Crear el usuario en la base de datos si no existe.
  3. Generar un token de autenticación para futuras peticiones.
 */
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
  //Validar credenciales contra el sistema SIIAU
  try {
    datosSiiau = await validarSiiau(codigo, nip);
    if (datosSiiau.length === 1 && datosSiiau[0] === '0') { //Usuario o contraseña incorrectos
      errorData.code = 'NO_SE_ENCONTRO_EL_USUARIO_O_LA_CONTRASENA_ES_INCORRECTA';
      errorData.status = 404;
      return res.status(errorData.status).send({ code: errorData.code });
    }
  } catch (err) {
    errorData.code = 'ERROR_DE_CONEXION_A_SIIAU'; //No se pudo conectar con el servicio SIIAU
    errorData.status = 404;
    return res.status(errorData.status).send({ code: errorData.code });
  }

  if (datosSiiau.length < 4) {
    errorData.code = 'ERROR_DE_CONEXION_A_SIIAU';
    errorData.status = 404;
    return res.status(errorData.status).send({ code: errorData.code });
  }
  //Carreras válidas permitidas (Área de la salud)
  // #### MODIFICAR AQUI SI SE AGREGAN NUEVAS CARRERAS  O SI REQUIERES ENTRAR AL SISTEMA PARA PROBARLO  ####
  const carreras = ['NUT', 'LNTO', 'ENFA', 'NUTA', 'DENA', 'MCPA', 'MCP', 'LENF', 'ENF', 'LICD', 'DEN', 'EODP', 'EMFM', 'EMUR', 'ENDO', 'MIDU'];

  if (!carreras.includes(datosSiiau[4])) {
    errorData.code = 'ESTA_APP_SOLO_FUNCIONA_PARA_CARRERAS_DEL_AREA_DE_LA_SALUD';
    errorData.status = 404;
    return res.status(errorData.status).send({ code: errorData.code });
  }
  //Intentar obtener el usuario en la base de datos local
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
    //Si ya existe, obtener el servicio general asociado
      servicio = await baseDatos.almacenamientoServicioGeneral.obtenerPorIdUsuario(usuario.id);
      idServicio = servicio.id;
    }
    //Generar token JWT para el usuario autenticado
    const token = autenticacion.crearToken(usuario, idServicio);
    return res.status(201).send({ token });
  } catch (err) {
    //Manejo de errores específicos de base de datos
    if (err.errno === 1048) {
      errorData.code = 'USUARIO_NO_ENCONTRADO_EN_SIIAU';
      errorData.status = 500;
    }

    errorData.code = 'ERROR_DE_BASE_DE_DATOS';
    errorData.status = 500;
    return res.status(errorData.status).send({ code: errorData.code });
  }
}
