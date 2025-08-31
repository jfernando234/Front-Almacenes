import { AuditoriaDTO } from "src/assets/Model/general.model";

export class ClientePerfilDTO{
    idClientePerfil?: number;
    idUsuario?: number;
    idPersona?: number;
    perfil?:string;
    constructor() {
        this.idClientePerfil = 0;
        this.idUsuario = 0;
        this.idPersona = 0;
        this.perfil='';
    }
}

export class listaCuentaBanco{
    idCuentabanc?: number;
    idClientePerfil?: number;
    nomBanco?:string;
    tipocuenta?:string;
    moneda?:string;
    nrocta?:string;
    cci?:string;
}

export class PerfilcuentaBancariaDTO{
    idCuentabanc?: number;
    idClientePerfil?: number;
    idBanco?: number;
    idtipoCuenta?:number;
    idmoneda?:number;
    nrocta?:string;
    cci?:string;
    flgtercero?:string;
    fk_tip_doc_id?: number;
    num_doc?:string;
    nombres?:string;
    apellidos?:string;
    flgmancomunada?:string;
    fk_tip_doc_id_man?: number;
    num_doc_man?:string;
    nombres_man?:string;
    apellidos_man?:string;
}
export class listaOperacionDTO{
    idOperacion?: number;
    estado?: string;
    numero?:string;
    titular?:string;
    cuentaCliente?:string;
    fecha?:Date;
    tipooperacion?:string;
    moneda_envio?:string;
    moneda_recibe?:string;
    valor_solicitado?:number;
    valor_enviado?:number;
    tipo_cambio?:number;
    ruta_archivo?:string;
    voucher?: string;
    motivoRechazo?:string;
}

export class listaOperacionAgregaDTO  extends AuditoriaDTO{
    idOperacion?: number;
    idClientePerfil?: number;
    idCuentaBancoEnvia?: number;
    idCuentaBancoRecibe?: number;
    tipooperacion?: string;
    valor_envio?:number;
    valor_recibe?:number;
    tipo_cambio?:number;
    voucher?:string;
    ruta_archivo?:string;
    idEstado?:number;
    idMotivoRechazo?:number;
}

export class OperacionActualizaDTO  extends AuditoriaDTO{
    idOperacion?: number;
    idEstado?:number;
    idMotivoRechazo?:number;
}

export interface IArchivo {
    idOperacion?: number;
    nombreArchivo: string,
    idFigura?: number,
    Figura?: number
  }

  export class listaAyo{
    ayo?:number;
  }
  
  export class listaMes{
    mes?:number;
    nombreMes?:string
  }
  export class dashboardCliente{
    ayo?:number;
    mes?:number;
    codigoMerchant?:string;
    saldo_inicial?:number;
    payin?:number;
    payincomision?:number;
    payouting?:number;
    payoutingext?:number;
    payout?:number;
    payoutcomision?:number;
    solicitud?:number;
    saldo_final?:number;
    transfing?:number;
    transfext?:number;
  }
  