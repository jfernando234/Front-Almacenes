import { Injectable } from "@angular/core";
import { DataCliente } from "../Models/cliente.model";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { DataInventario } from "../Models/inventario";
@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  apiUrl = environment.url_api;
  constructor(public http: HttpClient) { }
  obtenerInventario(page:number, rows:number,
    fechaInicio?: string, fechaFin?: string
  ):Observable<DataInventario>{
    let url = `${this.apiUrl}/Clientes/GetInventarioAll?page=${page}&rows=${rows}`
    if (fechaInicio) {
      url += `&fechaInicio=${fechaInicio}`;
    }
    if (fechaFin) {
      url += `&fechaFin=${fechaFin}`;
    }
    return this.http.get<DataInventario>(url);
  }
}
