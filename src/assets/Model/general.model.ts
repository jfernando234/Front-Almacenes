export class AuditoriaDTO{
    idUsuarioLogin?: number;
    pcIp?:string;
    pcHost?:string;
}

export class EliminarDTO extends AuditoriaDTO
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

export class EstadoRegistroDTO {
    idEstado: number=-1;
    estadoNombre:string='';
    estadoNombreCorto:string='';
}
export class DashboardTCambio{
    name:string='';
    series:any[]=[];
}

export class DashboardDTO{    
    value: number=0.00
    name:string=''
}

export class DashboarAnualdDTO{    
    name?:string;
    series?:series[];
}
export class series{
    name?:string;
    value?:number;
}
