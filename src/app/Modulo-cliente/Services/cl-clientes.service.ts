import { Injectable } from "@angular/core";
import { DataCliente } from "../Models/cliente.model";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  apiUrl = environment.url_api;
  constructor(public http: HttpClient) { }
  obtenerAllClientes(page:number, rows:number,
    fechaInicio?: string, fechaFin?: string
  ):Observable<DataCliente>{
    let url = `${this.apiUrl}/Clientes/GetCobrosByPaciente?page=${page}&rows=${rows}`
    if (fechaInicio) {
      url += `&fechaInicio=${fechaInicio}`;
    }
    if (fechaFin) {
      url += `&fechaFin=${fechaFin}`;
    }
    return this.http.get<DataCliente>(url);
  }
  crearCliente(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Clientes/CreateCliente`, formData);
  }
}
