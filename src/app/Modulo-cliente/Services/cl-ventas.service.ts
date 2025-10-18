import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataVentas, Iventas } from '../Models/ventas';
import { successResponse } from 'src/assets/Model/successResponse';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { DataInventario } from '../Models/inventario';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  apiUrl = environment.url_api;

  constructor(public http: HttpClient) { }

  obtenerVentas(
    clinicaId: string,
    page: number,
    rows: number,
    fechaInicio?: string,
    fechaFin?: string,
    paciente?: string,
    TipoPago?: string,
  ): Observable<DataVentas> {
    let url = `${this.apiUrl}/Ventas/GetAllVenta?clinicaid=${clinicaId}&page=${page}&rows=${rows}`;
    if (fechaInicio && fechaInicio != '') {
      url += `&FechaInicio=${fechaInicio}`;
    }
    if (fechaFin && fechaFin != '') {
      url += `&FechaFin=${fechaFin}`;
    }
    if (paciente && paciente != '') {
      url += `&PacienteNombre=${paciente}`;
    }
    if (TipoPago && TipoPago != 'todos') {
      url += `&Venta=${TipoPago}`;
    }
    return this.http.get<DataVentas>(url);
  }

  crearVenta(venta: Iventas): Observable<successResponse> {
    return this.http
      .post<successResponse>(this.apiUrl + `/Ventas/SaveVenta`, venta)
      .pipe(
        catchError((error) => {
          Swal.fire('Error', error.error, 'warning');
          return throwError(() => error);
        }),
      );
  }

  obtenerVenta(ventaId: string): Observable<Iventas> {
    return this.http.get<Iventas>(this.apiUrl + `/Ventas/GetVenta/${ventaId}`);
  }

  eliminarVentas(ventaId: string): Observable<successResponse> {
    return this.http.delete<successResponse>(
      this.apiUrl + `/Ventas/DeleteVenta/${ventaId}`,
    );
  }
  obtenerProductos(clinicaId: string, page: number, rows: number, descripcion?: string): Observable<DataInventario> {
    let url = `${this.apiUrl}/Productos/GetAllProducto?clinicaid=${clinicaId}&page=${page}&rows=${rows}`;
    if (descripcion && descripcion != '') {
      url += `&descripcion=${descripcion}`;
    }
    return this.http.get<DataInventario>(url);
  }
}

