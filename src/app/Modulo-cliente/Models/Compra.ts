
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
  tipoDocumentoId: number;
  ruc: string;
  razonSocial?: string;
  observacion: string;
  tipoCompraId: number;
  total: number;
  fechaRegistro: Date;
  detalles: DetalleCompra[];
}

export interface DetalleCompra {
  productoId: number,
  cantidad: number,
  precioUnitario: number,
  valorVenta?: number,
  total: number
}
export interface IComprasList {
  tipoDocumentoId: number;
  ruc: string;
  razonSocial: string;
  observacion: string;
  tipoCompraId: number;
  total: number;
  fechaRegistro: Date;
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
