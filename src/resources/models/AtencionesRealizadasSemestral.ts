/* Interfaz de Atenciones Realizadas
 */

interface AtencionesRealizadasSemestral {
    id: number;
    idReporteParcialSemestral: number;
    idUsuario: number;
    tipo: number;
    cantidad: number;
}

export default AtencionesRealizadasSemestral;
