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
  idCliente: number;
  contacto?: string;
  nombre: string;
  apellido : string;
  numeroDocumento : string;
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
  idCliente?: number;
  contacto: string;
  idTipoDocumento: number;
  numeroDocumento: string;
  razonSocial: string
  direccion: string
  telefono: string
  correo: string

}
