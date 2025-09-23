import { Injectable } from "@angular/core";
import { DataCliente } from "../Models/cliente.model";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { DataInventario, Producto } from "../Models/inventario";
@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  apiUrl = environment.url_api;
  constructor(public http: HttpClient) { }
  obtenerInventario(  ): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.http}/ListarAllProductos`);
  }
  // ✅ Registrar producto
  registrar(producto: Producto): Observable<any> {
    return this.http.post(`${this.apiUrl}/RegistrarProducto`, producto);
  }
}
