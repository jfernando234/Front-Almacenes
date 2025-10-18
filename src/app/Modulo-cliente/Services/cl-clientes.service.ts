import { Injectable } from "@angular/core";
import { ClienteList, DataCliente, ICliente } from "../Models/cliente.model";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { successResponse } from "src/assets/Model/successResponse";
@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  apiUrl = environment.url_api;
  constructor(public http: HttpClient) { }
  obtenerAllClientes(): Observable<ClienteList[]> {
    return this.http.get<ClienteList[]>(`${this.apiUrl}cliente/ListarAllClientes`);
  }
  registrar(producto: ICliente): Observable<any> {
    return this.http.post(`${this.apiUrl}cliente/RegistrarCliente`, producto);
  }
  eliminarCliente(ClienteId: number): Observable<successResponse> {
    return this.http.delete<successResponse>(this.apiUrl + `/cliente/Deletecliente/${ClienteId}`);
  }

}
