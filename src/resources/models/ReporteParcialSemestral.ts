/* eslint-disable linebreak-style */

import ActividadesRealizadasSemestral from './ActividadesRealizadasSemestral';
import AtencionesRealizadasSemestral from './AtencionesRealizadasSemestral';

/* eslint-disable semi */
export default interface ReporteParcialSemestral {
    id: number;
    idServicio: number;
    idSemestre: number;
    actualizado: string;
    horasRealizadas: number;
    actividadesRealizadas: ActividadesRealizadasSemestral[];
    atencionesRealizadas: AtencionesRealizadasSemestral[];
}
