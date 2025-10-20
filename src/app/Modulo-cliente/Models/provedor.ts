export class proveedor {
  clinicaId = '';
  usuarioId = "";
  ruc = "";
  nombre = "";
  direccion = "";
  telefono = "";
  contacto = "";
  correo = "";
}
export interface DataProveedor {
  totalData: number;
  data: Iproveedor[];
}
export interface Iproveedor {
  idProveedor?: number;
  ruc: string;
  nombre: string;
  direccion: string;
  telefono: number;
  correo: string;
  contacto: string;
}
export interface ListIproveedor {
  idProveedor: number;
  ruc: string;
  nombre: string;
  direccion: string;
  telefono: number;
  correo: string;
  contacto: string;
}
