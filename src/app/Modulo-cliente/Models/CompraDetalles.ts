export class CompraDetalles {
  clinicaId? = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
  usuarioId? = 'string';
  compraId? = '';
  productoId = '';
  cantidad = 0;
  precioUnitario = 0;
  igv = 0;
  precioVenta = 0;
  subtotal = 0;
}
export interface DataCompraDetalles {
  totalData: number;
  data: IcompraDetalles[];
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
