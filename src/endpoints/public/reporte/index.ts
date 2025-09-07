/* eslint-disable linebreak-style */
import actualizarReporte from './actualizarReporte';
import actualizarReporteSemestral from './actualizarReporteSemestral';
import crearReporte from './crearReporte';
import crearReporteSemestral from './crearReporteSemestral';
import autenticacion from '../../../autenticacion';
import baseDatos from '../../../database';

const express = require('express');

const enrutadorReporte = express.Router();

enrutadorReporte.use(express.json());

enrutadorReporte.put('/:numeroReporte', autenticacion.jwtAutenticacion(['interno', 'prestador']), async (req, res) => {
  try {
    const { usuario } = req;
    const servicio = await baseDatos.almacenamientoServicioGeneral.obtenerServicioGeneral(usuario.idServicio);

    const fechaLimite = new Date('2025-02-01');
    const fechaInicio = new Date(servicio.fechaInicio);

    if (fechaInicio >= fechaLimite) {
      // Semestral
      return actualizarReporteSemestral(req, res);
    } else {
      // Trimestral
      return actualizarReporte(req, res);
    }
  } catch (err) {
    return res.status(500).send({ code: 'ERROR_INTERNO' });
  }
});

enrutadorReporte.post('/:numeroReporte', autenticacion.jwtAutenticacion(['interno', 'prestador']), async (req, res) =>{
  try {
    const { usuario } = req;
    const servicio = await baseDatos.almacenamientoServicioGeneral.obtenerServicioGeneral(usuario.idServicio);

    // Obtener servicio para decidir periodicidad
    const fechaLimite = new Date('2025-02-01');
    const fechaInicio = new Date(servicio.fechaInicio);

    if (fechaInicio >= fechaLimite) {
      // Semestral
      return crearReporteSemestral(req, res);
    } else {
      // Trimestral
      return crearReporte(req, res);
    }
  } catch (err) {
    return res.status(500).send({ code: 'ERROR_INTERNO' });
  }
});

export default enrutadorReporte;
