export class proveedor {
    clinicaId = '';
    usuarioId = "";
    ruc = "";
    nombre = "";
    direccion =  "";
    telefono ="";
    contacto =  "";
    correo=  "";
  }
  export interface DataProveedor {
    totalData: number;
    data: Iproveedor[];
  }
  export interface Iproveedor {
    proveedorId:string;
    ruc : string;
    nombre : string;
    direccion : string;
    telefono : number;
    contacto : string;
    correo: string;
  }
