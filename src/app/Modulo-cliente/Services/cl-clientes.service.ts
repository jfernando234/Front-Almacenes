import { Injectable } from "@angular/core";
import { ClienteList, DataCliente, ICliente } from "../Models/cliente.model";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  apiUrl = environment.url_api;
  constructor(public http: HttpClient) { }
  obtenerAllClientes(): Observable<ClienteList[]> {
    return this.http.get<ClienteList[]>(`${this.apiUrl}cliente/ListarAllClientes`);
  }
  registrar(cleinte: ICliente): Observable<any> {
    return this.http.post(`${this.apiUrl}cliente/RegistrarCliente`, cleinte);
  }
  editarCliente(clienteId: number, cleinte: ICliente): Observable<any> {
    return this.http.put(`${this.apiUrl}cliente/ActualizarCliente/${clienteId}`, cleinte);
  }
  eliminarCliente(ClienteId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}cliente/EliminarCliente/${ClienteId}`, null);
  }

}
