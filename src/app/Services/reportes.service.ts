import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  // El environment en este proyecto define 'url_api' que termina con /
  // Por lo que solo agregamos reportes (sin barra inicial)
  private apiUrl = `${environment.url_api}reportes`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el reporte de Valoración de Inventario
   */
  obtenerValoracionInventario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/valoracion-inventario`);
  }

  /**
   * Obtiene el reporte de Movimientos de Stock
   * @param fechaInicio Fecha inicial (formato: YYYY-MM-DD)
   * @param fechaFin Fecha final (formato: YYYY-MM-DD)
   * @param productoId ID del producto (opcional)
   * @param tipoMovimiento Tipo de movimiento (opcional)
   */
  obtenerMovimientosStock(
    fechaInicio?: string,
    fechaFin?: string,
    productoId?: number,
    tipoMovimiento?: string
  ): Observable<any> {
    let params = new HttpParams();

    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }

    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    if (productoId) {
      params = params.set('productoId', productoId.toString());
    }

    if (tipoMovimiento) {
      params = params.set('tipoMovimiento', tipoMovimiento);
    }

    return this.http.get(`${this.apiUrl}/movimientos-stock`, { params });
  }

  /**
   * Obtiene el reporte de Rendimiento de Proveedores
   */
  obtenerRendimientoProveedores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rendimiento-proveedores`);
  }

  /**
   * Obtiene el reporte de Historial de Clientes
   */
  obtenerHistorialClientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/historial-clientes`);
  }

  /**
   * Obtiene el reporte de Stock Crítico
   * @param limiteStock Límite de stock para considerarse crítico (por defecto 20)
   */
  obtenerStockCritico(limiteStock: number = 20): Observable<any> {
    const params = new HttpParams().set('limiteStock', limiteStock.toString());
    return this.http.get(`${this.apiUrl}/stock-critico`, { params });
  }

  /**
   * Obtiene el reporte de Análisis ABC de Productos
   */
  obtenerAnalisisABC(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analisis-abc`);
  }

  /**
   * Obtiene un resumen general de todos los reportes
   */
  obtenerResumenGeneral(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resumen-general`);
  }

  /**
   * Exporta un reporte a CSV
   * @param datos Datos del reporte
   * @param nombreArchivo Nombre del archivo a exportar
   */
  exportarCSV(datos: any[], nombreArchivo: string): void {
    const csv = this.convertirACSV(datos);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${nombreArchivo}_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Exporta un reporte a Excel
   * @param datos Datos del reporte
   * @param nombreArchivo Nombre del archivo a exportar
   */
  exportarExcel(datos: any[], nombreArchivo: string): void {
    // Esta función requeriría librerías adicionales como xlsx
    // Por ahora se deja como referencia
    console.log('Exportar a Excel: ' + nombreArchivo);
  }

  /**
   * Convierte datos a formato CSV
   */
  private convertirACSV(datos: any[]): string {
    if (!datos || datos.length === 0) {
      return '';
    }

    const headers = Object.keys(datos[0]);
    const csv = [
      headers.join(','),
      ...datos.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escapar comillas y envolver en comillas si contiene comas
            return typeof value === 'string' && value.includes(',')
              ? `"${value.replace(/"/g, '""')}"`
              : value;
          })
          .join(',')
      ),
    ];

    return csv.join('\n');
  }
}
