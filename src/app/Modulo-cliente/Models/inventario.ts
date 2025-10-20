export class inventario {
  ClinicaId = '';
  UsuarioId = '';
  CodigoBarra = '';
  NombreAlmacen = '';
  NombreProducto = '';
  PrecioEntrada!: number;
  PrecioSalida!: number;
  Unidad = '';
  Stock!: number;
  FechaRegistro!: Date;
  tipoinventarioId?: string[];
  estado!: number;

}
export interface DataInventario {
  totalData: number;

}
export interface Producto {
  productoId?: number;
  inventarioId?: string;
  nombreProducto: string;
  precioEntrada: number;
  precioSalida: number;
  stock: number;
  fechaRegistro?: string;
  estado?: String;
}
export interface ListProducto {
  productoId: number;
  inventarioId?: string;
  nombreProducto: string;
  precioEntrada: number;
  precioSalida: number;
  stock: number;
  fechaRegistro: string;
  estado?: String;
}
