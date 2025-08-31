import { listaAccesoDTO } from "./seg-login.model";

export class AuditoriaDTO{
    idUsuarioLogin?: number;
    pcIp?:string;
    pcHost?:string;
}

export class listaTCambioDTO
{
    idtipocambio?:number;
    fecha?:Date;
    compra?:number;
    venta?:number;
}

export class grabaTCambioDTO extends AuditoriaDTO
{
    compra?:number;
    venta?:number;
}

export class listaUsuarioDTO
{
    idUsuario?: number;
    login?: string;
    primerApellido?: string;
    segundoApellido?:string;
    nombres?:string;
    apellidosyNombres?:string;
    numeroDocumento?:string;
    area?:string;
    cargo?:string;
    correoInstitucional?:string;
    estado?:string ;
    listaUsuarioPerfil:listaPerfilDTO[];
    constructor()
    {
        this.idUsuario = 0;
        this.login ='';
        this.primerApellido='';
        this.segundoApellido='';
        this.nombres='';
        this.apellidosyNombres='';
        this.numeroDocumento='';
        this.area='';
        this.cargo='';
        this.correoInstitucional='';
        this.correoInstitucional='';
        this.listaUsuarioPerfil=[];
    }
    
}

export class grabaUsuarioDTO extends AuditoriaDTO
{
    idUsuario?: number;
    idPersona?: number;
    primerApellido?: string;
    segundoApellido?:string;
    nombres?:string;
    numeroDocumento?:string;
    idPerfil?:number;
    idArea?:number;
    idCargo?:number;
    correoInstitucional?:string;
    listaPerfil:listaPerfilDTO[]=[];
    constructor()
    {
        super();
        this.idUsuario = 0;
        this.idPersona = 0;
        this.primerApellido='';
        this.segundoApellido='';
        this.nombres='';
        this.numeroDocumento='';
        this.idPerfil=0;
        this.idArea=0;
        this.idCargo=0;
        this.correoInstitucional='';
        this.idUsuarioLogin=0;
        this.pcIp='';
        this.pcHost='';

    }
    
}

export class eliminaUsuarioDTO extends AuditoriaDTO
{
    id?: number;

    constructor()
    {
        super();
        this.id = 0;
        this.idUsuarioLogin=0;
        this.pcIp='';
        this.pcHost='';
    }
    
}

export class eliminaPerfilDTO extends AuditoriaDTO
{
    id?: number;

    constructor()
    {
        super();
        this.id = 0;
        this.idUsuarioLogin=0;
        this.pcIp='';
        this.pcHost='';
    }    
}

export class listaPerfilDTO
{
    idPerfil?: number;
    nombrePerfil?: string;
    descripcionPerfil?: string;

    constructor()
    {
        this.idPerfil = 0;
        this.nombrePerfil ='';
        this.descripcionPerfil='';
    }    
}

export class grabaPerfilDTO extends AuditoriaDTO
{
    idPerfil?: number;
    nombrePerfil?: string;
    descripcionPerfil?: string;
    listaPerfilModulo?:listaAccesoDTO[];

    constructor()
    {
        super();
        this.idPerfil = 0;
        this.nombrePerfil ='';
        this.descripcionPerfil='';
    }    
}

export class actualizaPerfilDTO extends AuditoriaDTO
{
    idPerfil?: number;
    nombrePerfil?: string;
    descripcionPerfil?: string;
    constructor()
    {
        super();
        this.idPerfil = 0;
        this.nombrePerfil ='';
        this.descripcionPerfil='';
    }    
}

export class listaUsuarioPerfilDTO
{
    idUsuarioPerfil?: number;
    idPerfil?: number;
    nombrePerfil?: string;
    descripcionPerfil?: string;

    constructor()
    {
        this.idUsuarioPerfil=0;
        this.idPerfil = 0;
        this.nombrePerfil ='';
        this.descripcionPerfil='';
    }
    
}

export class agregaUsuarioPerfilDTO extends AuditoriaDTO{
    idUsuario?:number;
    idPerfil?:number;
}

export class eliminaUsuarioPerfilDTO extends AuditoriaDTO{
    id?:number;
}

export class listaPersonaDTO
{
    idPersona?: number;
    idTipoPersona?:number;
    idTipoDocumento?: number;
    numeroDocumento?:string;
    primerApellido?: string;
    segundoApellido?:string;
    nombres?:string;
    apellidosyNombres?:string;
    fechaNacimiento?:Date;
    sexo?:boolean;
    correo?:string ;        
}

export class grabaPersonaDTO extends AuditoriaDTO
{
    idTipoPersona?:number;
    idTipoDocumento?: number;
    numeroDocumento?:string;
    primerApellido?: string;
    segundoApellido?:string;
    nombres?:string;
    fechaNacimiento?:Date;
    sexo?:boolean;
    correo?:string ;  
    login?:string ; 
    clave?:string ;  
    celular?:string      
}

export class modificaPersonaDTO extends AuditoriaDTO
{
    idPersona?:number;
    idTipoPersona?:number;
    idTipoDocumento?: number;
    numeroDocumento?:string;
    primerApellido?: string;
    segundoApellido?:string;
    nombres?:string;
    fechaNacimiento?:Date;
    sexo?:boolean;
    correo?:string ;        
}

export class eliminaDTO extends AuditoriaDTO
{
    id?: number;

    constructor()
    {
        super();
        this.id = 0;
        this.idUsuarioLogin=0;
        this.pcIp='';
        this.pcHost='';
    }
    
}

export class grabarModuloDTO extends AuditoriaDTO {
    idModulo?:number;
    idModuloPadre?:number;
    nivel?:number;
    esHijo?:boolean;
    nombreModulo?:string;
    nombreObjeto?:string;
    codigoAccesoDirecto?:string;
    icono?:string;
    url?:string;
    numeroOrden?:number;
    esVisible?:boolean;    
}

export class eliminarDTO
{
    id?: number;
    idUsuarioLogin?: number;
    pcIp?:string;
    pcHost?:string;
    constructor()
    {
        this.id = 0;
        this.idUsuarioLogin=0;
        this.pcIp='';
        this.pcHost='';
    }    
}
export class listaModuloDTO
{
    idModulo?:number;
    idModuloPadre?:number;
    nombreModuloPadre:string='';
    nivel?:number;
    esHijo?:boolean;
    nombreModulo?:string;
    nombreObjeto?:string;
    codigoAccesoDirecto?:string;
    icono?:string;
    url?:string;
    numeroOrden?:number;
    esVisible?:boolean;
}

export class usuarioRolDTO extends AuditoriaDTO
{
    idUsuarioRol?:number;
    descPerfil?:string;
    idUsuarioPerfil?:number;
    idRolModulo:number=0;
    idRol:number=0;
    nombreRol?:string;
    descripRol?:string;
    nombreModulo?:string;
    sel?:boolean;
    tiene_detalle?:boolean;
    rolDetalle?:usuarioRolDetDTO[];
}

export class usuarioRolDetDTO
{
    idUsuarioRolDet?:number;
    descOpcion?:string;
    sel?:boolean;    
}