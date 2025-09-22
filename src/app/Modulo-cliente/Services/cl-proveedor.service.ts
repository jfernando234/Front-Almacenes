import { Injectable } from "@angular/core";
import { DataCliente } from "../Models/cliente.model";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { DataProveedor } from "../Models/provedor";
@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  apiUrl = environment.url_api;
  constructor(public http: HttpClient) { }
  obtenerAllProveedores(page: number, rows: number,
    fechaInicio?: string, fechaFin?: string
  ): Observable<DataProveedor> {
    let url = `${this.apiUrl}/Clientes/GetProveedoresAll?page=${page}&rows=${rows}`
    if (fechaInicio) {
      url += `&fechaInicio=${fechaInicio}`;
    }
    if (fechaFin) {
      url += `&fechaFin=${fechaFin}`;
    }
    return this.http.get<DataProveedor>(url);
  }
}
