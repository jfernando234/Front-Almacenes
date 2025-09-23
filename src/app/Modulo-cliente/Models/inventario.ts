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
  inventarioId?: string;
  NombreProducto: string;
  precioEntrada: number;
  precioSalida: number;
  stock: number;
  fechaRegistro?: Date;
  estado?: String;
}
