import { Injectable } from "@angular/core";
import { DataCliente } from "../Models/cliente.model";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { DataInventario, ListProducto, Producto } from "../Models/inventario";
import { successResponse } from "src/assets/Model/successResponse";
@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  apiUrl = environment.url_api;
  constructor(public http: HttpClient) { }
  obtenerInventario(): Observable<ListProducto[]> {
    return this.http.get<ListProducto[]>(`${this.apiUrl}producto/ListarAllProductos`);
  }

  filtrarInventario(inicio: string, fin: string, nombre: string = ''): Observable<ListProducto[]> {
    let params = `?inicio=${inicio}&fin=${fin}`;
    if (nombre) {
      params += `&nombre=${nombre}`;
    }
    return this.http.get<ListProducto[]>(`${this.apiUrl}producto/FiltrarProductos${params}`);
  }
  // ✅ Registrar producto
  registrar(producto: Producto): Observable<any> {
    return this.http.post(`${this.apiUrl}producto/RegistrarProducto`, producto);
  }
  editar(producto: Producto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}producto/ModificarProducto/`, producto);
  }
  eliminarProducto(productoId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}producto/EliminarProducto/${productoId}`, null);
  }
  getTotalProductos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}producto/AllStock`);
  }
  getStockBajo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}producto/StockCritico`);
  }
}
