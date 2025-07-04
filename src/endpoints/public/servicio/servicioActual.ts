import baseDatos from '../../../database';

export default async function obtenerServicioActual(req: any, res: any) {
  const idUsuarioStr = req.params.usuario;

  if (!idUsuarioStr) {
    return res.status(400).send({ code: 'NO_SE_INDICO_ID_USUARIO' });
  }

  //console.log("Params recibidos:", req.params);

  const usuario = parseInt(idUsuarioStr);
  if (isNaN(usuario)) { //Si no es un número
    return res.status(400).send({ code: 'ID_USUARIO_INVALIDO' });
  }

  try {
    //Revisa que el servicio existe
    const servicio = await baseDatos.almacenamientoServicioGeneral.obtenerPorIdUsuario(usuario);

    //Si no existe, regresa un error
    if (!servicio) {
      return res.status(404).send({ code: 'NO_SE_ENCONTRO_SERVICIO' });
    }

    //Si no, regresa que si lo encontro
    return res.status(200).send(servicio);

  } catch (err) {
    console.error("Error al obtener servicio:", err);
    return res.status(500).send({ code: 'ERROR_INTERNO', error: err.message || err });
  }
}