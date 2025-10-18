

export class Ventas {
  clinicaId = 'D30C2D1E-E883-4B2D-818A-6813E15046E6';
  ventaId = '';
  tipoDocumentoId = '';
  serie = '';
  secuencia = '';
  fecha!: Date;
  almacenId = '';
  beneficiarioId = '';
  tipoBeneficiario = '';
  beneficiarioDocumento = '';
  beneficiarioDireccion = '';
  tipoPago = '';
  observacion = '';
  metodoPago = '';
  tipoTarjetaId = '';
  montoRecibido = 0;
  tipoMonedaId = '';
  vuelto = 0;
  total = 0.0;
}

export interface Iventas {
  clinicaId?: string;
  tipoDocumentoId: string;
  serie: string;
  secuencia: string;
  fecha: Date;
  almacenId: string;
  tipoBeneficiario: string;
  beneficiarioId: string;
  beneficiarioDocumento: string;
  beneficiarioDireccion: string;
  nombreBeneficiario: string;
  apellidoBeneficiario: string;
  nombreDocumento: string;
  tipoPago: string;
  observacion?: string;
  metodoPago: string;
  tipoTarjetaId?: string;
  montoRecibido: number;
  tipoMonedaId: string;
  vuelto: number;
  total: number;
  detalle?: IventasDetalles[];
}
export interface IventasDetalles {
  ventaDetalleId?: string;
  ventaId?: string;
  productoId?: string;
  codigoProducto?: string;
  cantidad: number;
  precio: number;
  subtotal: number;
  descuento?: number;
}
export interface ListVentas {
  clinicaId: string;
  ventaId: string;
  tipoDocumentoId: string;
  nombreDocumento: string;
  serie: string;
  secuencia: string;
  fecha: Date;
  almacenId: string;
  tipoBeneficiario: string;
  beneficiarioId: string;
  nombreBeneficiario: string;
  apellidoBeneficiario: string;
  beneficiarioDocumento: string;
  beneficiarioDireccion: string;
  tipoPago: string;
  observacion: string;
  tipoTarjetaId: string;
  metodoPago: string;
  montoRecibido: number;
  tipoMonedaId: string;
  vuelto: number;
  estado: number;
  total: number;
}
export interface DataVentas {
  data: ListVentas[];
  totalData: number;
}

export class VentaResponse {
  fecha = '';
  tipoDocumentoId = '';
  serie = '';
  secuencia = '';
  beneficiarioId = '';
  beneficiarioDocumento = '';
  total = '';
}
