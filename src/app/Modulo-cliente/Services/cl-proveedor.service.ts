import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Iproveedor, ListIproveedor } from "../Models/provedor";
import { successResponse } from "src/assets/Model/successResponse";
@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  apiUrl = environment.url_api;
  constructor(public http: HttpClient) { }
  obtenerAllProveedores(
  ): Observable<ListIproveedor[]> {
    let url = `${this.apiUrl}proveedor/ListarAllProveedores`
    return this.http.get<ListIproveedor[]>(url);
  }

  filtrarProveedores(inicio: string, fin: string, nombre: string = ''): Observable<ListIproveedor[]> {
    let params = `?inicio=${inicio}&fin=${fin}`;
    if (nombre) {
      params += `&nombre=${nombre}`;
    }
    return this.http.get<ListIproveedor[]>(`${this.apiUrl}proveedor/FiltrarProveedores${params}`);
  }
  registrar(producto: Iproveedor): Observable<any> {
    return this.http.post(`${this.apiUrl}proveedor/RegistrarProveedor`, producto);
  }
  editar(proveedor: Iproveedor): Observable<any> {
    return this.http.put(`${this.apiUrl}proveedor/ModificarProveedor`, proveedor);
  }
  eliminarProveedor(proveedorId?: number): Observable<successResponse> {
    return this.http.put<successResponse>(this.apiUrl + `proveedor/EliminarProveedor/${proveedorId}`, null);
  }
}
