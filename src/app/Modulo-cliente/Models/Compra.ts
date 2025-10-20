
export interface Icompra {
  compraId: number;
  fecha: Date;
  numeroDocumento: string;
  ruc: string;
  proveedor: string;
  almacen: string;
  monto: number;
  estadoPago: string;
}

export class Compras {
  clinicaId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

  usuarioId = '';
  fecha = '';
  tipoDocumento = '';
  numDocumento = 0;
  proveedorId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  almacenId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  efectivo = 0;
  saldoCompra = 0;
  pago = '';
  moneda = '';
  guiaRemision = '';
  observacion = '';
  loginUsuario = '';
  usuarioCompraId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  sedeId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  dias = 0;
  fechaVencimiento = '';
  total = 0;
  igv = 0;
  subtotal = 0;
  pendiente = 0;
  estados = '';
}

export interface IcompraDetalles {
  compraDetalleId?: string;
  compraId?: string;
  productoId?: string;
  cantidad: number;
  valorVenta: number;
  igv: number;
  subtotal: number;
}

export interface ICompras {
  fechaRegistro: Date;
  idTipoDocumento: number;
  numeroDocumento: string;
  idProveedor: number;
  idTipoCompra: number;
  efectivo: number;
  fechaVencimiento: Date;
  observacion: string;
  total: number;
  estado: number;
}
export interface IComprasList {

  idOrdenCompra: number;
  fechaRegistro: string
  idTipoDocumento: number;
  numeroDocumento: string
  idProveedor: number;
  nombreProveedor: string
  idTipoCompra: number;
  efectivo: number;
  fechaVencimiento: Date;
  observacion: string;
  total: number;
  estado: number;

}

export interface DataCompras {

  data: IComprasList[];
  totalData: number;
}

export class DetalleCompraResponse {
  nombre = '';
  direccion = '';
  fecha = '';
}
