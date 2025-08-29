/* eslint-disable linebreak-style */
import autenticacion from '../../../autenticacion';
import crearServicio from './crearServicio';
import actualizarServicio from './actualizarServicio';
import obtenerCompleto from './obtenerCompleto';
import obtenerSemestres from './obtenerSemestres';
import servicioActual from './servicioActual'

const express = require('express');

const enrutadorServicio = express.Router();

enrutadorServicio.use(express.json());

enrutadorServicio.post('/', autenticacion.jwtAutenticacion(['interno', 'prestador']), crearServicio);
enrutadorServicio.put('/', autenticacion.jwtAutenticacion(['interno', 'prestador']), actualizarServicio);
enrutadorServicio.get('/', autenticacion.jwtAutenticacion(['interno', 'prestador']), obtenerCompleto);
enrutadorServicio.get('/semestres', autenticacion.jwtAutenticacion(['interno', 'prestador']), obtenerSemestres);
enrutadorServicio.get('/servicioActual/:usuario', servicioActual);

export default enrutadorServicio;
