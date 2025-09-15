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
