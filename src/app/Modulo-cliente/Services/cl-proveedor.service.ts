import { Injectable } from "@angular/core";
import { DataCliente } from "../Models/cliente.model";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { DataProveedor, Iproveedor } from "../Models/provedor";
import { successResponse } from "src/assets/Model/successResponse";
@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  apiUrl = environment.url_api;
  constructor(public http: HttpClient) { }
  obtenerAllProveedores(
  ): Observable<Iproveedor[]> {
    let url = `${this.apiUrl}proveedor/ListarAllProveedores`
    return this.http.get<Iproveedor[]>(url);
  }
  registrar(producto: Iproveedor): Observable<any> {
    return this.http.post(`${this.apiUrl}proveedor/RegistrarProveedor`, producto);
  }
  eliminarProveedor(proveedorId?: string): Observable<successResponse> {
   return this.http.delete<successResponse>(this.apiUrl + `/Proveedor/DeleteProveedor/${proveedorId}`);
  }
}
