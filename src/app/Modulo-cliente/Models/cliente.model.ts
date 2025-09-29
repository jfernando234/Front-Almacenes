export class Cliente{
  nombre= '';
  apellido = '';
  dni = '';
  correo = '';
  telefono = '';
  direccion = '';
  TipoDocumentoId = 0;
  NumeroDocumento = '';
}

export interface ClienteList{
  contacto?: string;
  nombre: string;
  apellido : string;
  dni : string;
  correo: string;
  telefono: number;
  direccion: string;
  estado: number;
}

export interface DataCliente{
  data: ClienteList[];
  totalData: number;
}
export interface ICliente {
  idTipoDocumento: number;
  numeroDocumento: string;
  razonSocial: string
  direccion: string
  telefono: string
  correo: string
  contacto: string
}
