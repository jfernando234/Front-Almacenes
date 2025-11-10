import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { environment } from 'src/environments/environment';
import { CompraPorMes, ICompras, IComprasList, ProductoCompras } from '../Models/Compra';
import { successResponse } from 'src/assets/Model/successResponse';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  apiUrl = environment.url_api;
  @Output() disparadorOtro: EventEmitter<any> = new EventEmitter();
  constructor(public http: HttpClient) { }

  obtenerCompras(
  ): Observable<IComprasList[]> {
    let url = this.apiUrl + `compra/ListarCompra`;

    return this.http.get<IComprasList[]>(url);
  }
  obtenerComprasFiltro(inicio: any, fin: any
  ): Observable<IComprasList[]> {
    let url = this.apiUrl + `OrdenCompra/ListarAllOrdenesCompra`;
    if (inicio) {
      url += `?inicio=${inicio}`;
    }
    if (fin) {
      url += `&fin=${fin}`;
    }
    return this.http.get<IComprasList[]>(url);
  }
  crearCompra(compra: ICompras): Observable<successResponse> {
    return this.http.post<successResponse>(`${this.apiUrl}compra/RegistrarCompra`, compra).pipe(
      catchError(error => {
        Swal.fire('Error', error.error, 'warning');
        return throwError(() => error);
      })
    );
  }

  obtenerCompra(compraId: string): Observable<ICompras> {
    return this.http.get<ICompras>(this.apiUrl + `/Compras/GetCompra/${compraId}`);
  }

  eliminarCompra(compraId: number): Observable<any> {
    return this.http.put<any>(this.apiUrl + `OrdenCompra/EliminarOrdenCompra/${compraId}`, null);
  }

  actualizarCompra(compra: FormData, compraId: string): Observable<successResponse> {
    return this.http.put<successResponse>(this.apiUrl + `/Compras/UpdateCompra/${compraId}`, compra).pipe(
      catchError(error => {
        Swal.fire('Error', error.error, 'warning');
        return throwError(() => error);
      })
    );
  }
  getDistribucionComprasPorProducto(): Observable<ProductoCompras[]> {
    return this.http.get<ProductoCompras[]>(this.apiUrl + `proveedor/TopProductos`);
  }

  getComprasPorMes(): Observable<CompraPorMes[]> {
    return this.http.get<CompraPorMes[]>(this.apiUrl + `compra/ComprasPorMes`);
  }
}
