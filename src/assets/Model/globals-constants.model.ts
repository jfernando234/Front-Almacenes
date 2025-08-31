//export interface Mensaje{
//    tipo: string;
//    errorCodigo: string;
//    errorMensaje: string;
//}


export class GlobalsConstants {
    Mensaje?: {value:any;errorCodigo:string, errorMensaje:string};   
    listaAcceso?:{
        idModulo?:number;
        accion?: string;
        nombreModulo?: string;
        valor?: boolean
        };
    // Variables Etiquetas
    cEditar?: string;
    cBuscar: string;
    cConsultar: string;
    cNuevo: string;
    cEliminar: string;
    cGrabar: string;
    cCancelar: string;
    cRegresar: string;
    cListar: string;
    cAgregar: string;
    cAceptar: string;
    cSalir: string;
    cCerrar: string;
    cAnular: string;

    cToastPosition: string;

    // Variables titulos
    titleEliminar: string;
    
    subTitleEliminar: string;

    titleFactura: string;
    subTitleFactura: string;

    titleAnular: string;
    subTitleAnular: string;

    titleCierre: string;
    subTitleCierre: string;

    // Variables mensaje
    msgExitoSummary: string;
    msgExitoDetail: string;

    msgErrorSummary: string;

    msgCancelDetail: string;
    msgCancelSummary: string;

    msgInfoDetail: string;
    msgInfoSummary: string;

    tipo: string;
    errorCodigo: string;
    errorMensaje: string;
    
    //Variables colores
    colorAprobar:string='#2ea444';
    colorEliminar:string='#db4a48';
    colorCancelar:string='#ffc208';
    

    constructor() {
        // Etiqueta de Controles
        this.cNuevo = 'Nuevo';
        this.cBuscar = 'Buscar';
        this.cConsultar = 'Consultar';
        this.cGrabar = 'Grabar';
        this.cCancelar = 'Cancelar';
        this.cEliminar = 'Eliminar';
        this.cRegresar = 'Regresar';
        this.cListar = 'Listar';
        this.cAgregar = 'Agregar';
        this.cAceptar = 'Aceptar';
        this.cSalir = 'Salir';
        this.cCerrar = 'Cerrar';
        this.cAnular = 'Anular';

        this.cToastPosition = 'bottom-right';

        // Titulo
        this.titleEliminar = 'Confirmación de Eliminación';
        this.subTitleEliminar = '¿Seguro de eliminar registro seleccionado?';

        this.titleFactura='Generar Factura';
        this.subTitleFactura='¿Seguro de generar FE?';

        this.titleAnular = 'Confirmación de Anulación';
        this.subTitleAnular = '¿Seguro de anular registro seleccionado?';

        this.titleCierre = 'Confirmación de Cierre';
        this.subTitleCierre = '¿Seguro de cerrar el registro seleccionado?';


        this.msgExitoSummary = 'Mensaje de Éxito : ';
        this.msgExitoDetail = 'Se realizó correctamente...!!!';

        this.msgErrorSummary = 'Mensaje de Error : ';

        this.msgCancelSummary = 'Mensaje de Cancelación : ';
        this.msgCancelDetail = 'Se canceló la acción con Éxito...!!!';

        this.msgInfoSummary = 'Mensaje de Información : ';
        this.msgInfoDetail = 'Se informó con Éxito...!!!';

        this.tipo='';
        this.errorCodigo='';
        this.errorMensaje='';
        this.listaAcceso = {};
    }
}