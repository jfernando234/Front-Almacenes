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
  idProveedor?: string;
  ruc: string;
  nombre: string;
  direccion: string;
  telefono: number;
  correo: string;
  contacto: string;
}
export interface ListIproveedor {
  idProveedor: string;
  ruc: string;
  nombre: string;
  direccion: string;
  telefono: number;
  correo: string;
  contacto: string;
}
