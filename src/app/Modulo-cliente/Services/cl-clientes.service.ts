import { Injectable } from "@angular/core";
import { Cliente, ClienteDNI, ClienteList, DataCliente, ICliente } from "../Models/cliente.model";
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
  editarCliente(cleinte: ICliente): Observable<any> {
    return this.http.put(`${this.apiUrl}cliente/ModificarCliente`, cleinte);
  }
  eliminarCliente(ClienteId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}cliente/EliminarCliente/${ClienteId}`, null);
  }
  obtenerClienteDni(dni: string): Observable<ClienteDNI> {
    const url = `${this.apiUrl}Catalogos/obtenerDNI`;
    return this.http.get<ClienteDNI>(url, { params: { dni } });
  }

}
