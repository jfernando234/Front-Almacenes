import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';

import { environment } from 'src/environments/environment';
import { DataCompras, ICompras } from '../Models/Compra';
import { successResponse } from 'src/assets/Model/successResponse';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {
  apiUrl = environment.url_api;
  constructor(public http: HttpClient) { }

  obtenerCompras(clinicaId: string, page: number, rows: number,
    fechaInicio?: string, fechaFin?: string,
    proveedorId?: string,
    estadoPago?: string
  ): Observable<DataCompras> {
    let url = this.apiUrl + `/Compras/GetAllCompra?ClinicaId=${clinicaId}&page=${page}&rows=${rows}`;
    if (fechaInicio) {
      url += `&fechaInicio=${fechaInicio}`;
    }
    if (fechaFin) {
      url += `&fechaFin=${fechaFin}`;
    }

    if (proveedorId && proveedorId !== 'todos') {
      url += `&ProveedorId=${proveedorId}`;
    }
    if (estadoPago && estadoPago !== 'todos') {
      url += `&estadoPago=${estadoPago}`;
    }

    return this.http.get<DataCompras>(url);

  }

  crearCompra(compra: ICompras): Observable<successResponse> {
    return this.http.post<successResponse>(this.apiUrl + `/Compras/SaveCompra`, compra).pipe(
      catchError(error => {
        Swal.fire('Error', error.error, 'warning');
        return throwError(() => error);
      })
    );
  }

  obtenerCompra(compraId: string): Observable<ICompras> {
    return this.http.get<ICompras>(this.apiUrl + `/Compras/GetCompra/${compraId}`);
  }

  eliminarCompra(compraId: string): Observable<successResponse> {
    return this.http.delete<successResponse>(this.apiUrl + `/Compras/DeleteCompra/${compraId}`);
  }

  actualizarCompra(compra: FormData, compraId: string): Observable<successResponse> {
    return this.http.put<successResponse>(this.apiUrl + `/Compras/UpdateCompra/${compraId}`, compra).pipe(
      catchError(error => {
        Swal.fire('Error', error.error, 'warning');
        return throwError(() => error);
      })
    );
  }
}
