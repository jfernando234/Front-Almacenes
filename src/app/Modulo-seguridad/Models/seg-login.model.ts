export interface menuListaDTO{
    text:string;
    icon:string;
    routerLink: string;
    children: menuListaDTO[];
    
}
export class loginModel
{
    login?: string;
    clave?: string;

    constructor()
    {
        this.login = '';
        this.clave = '';      
    }
}

export class loginPermisoDTO
{
    idUsuario:number;
    login?: string;
    nuevaClave:boolean;
    ApellidosyNombres:string;
    correoInstitucional:string;
    idClientePerfil?:number;
    clientePerfil?:string;
    idPerfil?:number;
    constructor()
    {
        this.idUsuario=0;
        this.login = '';
        this.nuevaClave=true;
        this.ApellidosyNombres='';
        this.correoInstitucional='';        
    }
}

export class restauraClaveDTO
{
    idUsuarioLogin:number;
    login?: string;
    numeroDocumento?: string;
    correoInstitucional?: string;
    pcIp?:string;
    pcHost?:string;

    constructor()
    {
        this.idUsuarioLogin=0;
        this.login = '';
        this.numeroDocumento = '';
        this.correoInstitucional = '';
        this.pcIp='';
        this.pcHost='';
    }
    
}

export class cambiaClaveDTO
{
    idUsuario:number;
    login?: string;
    claveAnterior?: string;
    claveNueva?: string;
    pcIp?:string;
    pcHost?:string;

    constructor()
    {
        this.idUsuario=0;
        this.login = '';
        this.claveAnterior = '';
        this.claveNueva = '';
        this.pcIp='';
        this.pcHost='';
    }
    
}

export class accesoDirecto{
    idModulo?:number;
    codigoAccesoDirecto?:string;
    url?:string;
}

export class listarModuloDTO
{
    codigoAccesoDirecto?:string;
    esHijo?: boolean;
    esVisible?: boolean;
    icono?: string;
    idModulo?:number;
    idModuloPadre?:number;
    nivel?:number;
    nombreModulo?:string;
    nombreObjeto?:string;
    numeroOrden?:number;
    url?:string;
    listarModuloDTO?: listarModuloDTO[];
    listaAccesoDTO?: listaAccesoDTO[];
}

export class listaAccesoDTO{
    idPerfilModulo?:number;
    idModulo?:number;
    consultar?: boolean;
    agregar?: boolean;    
    modificar?: boolean;
    eliminar?: boolean;    
    imprimir?: boolean;    
    descargarExcel?: boolean;
    descargarPDF?: boolean;
}

export class grabaAccesoDTO{
    idModulo?:number;
    consultar?: boolean;
    agregar?: boolean;    
    modificar?: boolean;
    eliminar?: boolean;    
    imprimir?: boolean;    
    descargarExcel?: boolean;
    descargarPDF?: boolean;
    idUsuarioLogin?:number;
    pcIp?:string;
    pcHost?:string;
}

export class actualizaAccesoDTO{
    idPerfilModulo?:number;
    idModulo?:number;
    idPerfil?:number;
    consultar?: boolean;
    agregar?: boolean;    
    modificar?: boolean;
    eliminar?: boolean;    
    imprimir?: boolean;    
    descargarExcel?: boolean;
    descargarPDF?: boolean;
    idUsuarioLogin?:number;
    pcIp?:string;
    pcHost?:string;
}

export class eliminaAccesoDTO{
    id?:number;
    idUsuarioLogin?:number;
    pcIp?:string;
    pcHost?:string;
}

export class listaAccionDTO{
    idPerfilModulo?:number;
    idModulo?:number;
    accion?: string;
    nombreModulo?: string;
    valor?:boolean
}

export class listaAmbienteDTO{
    nomAmbiente:string=''
}

