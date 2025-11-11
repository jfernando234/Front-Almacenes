import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  
  
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
    
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
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
    
    
    const headersFormateados = headers.map(header => this.formatearEncabezado(header));
    
    
    const lineaEncabezados = headersFormateados.map(h => `"${h}"`).join(',');
    
    
    const lineasDatos = datos.map((row) =>
      headers
        .map((header) => {
          let value = row[header];
          
          
          if (value === null || value === undefined) {
            return '""';
          }
          
          
          value = String(value);
          
          
          value = value.replace(/"/g, '""');
          return `"${value}"`;
        })
        .join(',')
    );

    
    return [lineaEncabezados, ...lineasDatos].join('\r\n');
  }

  /**
   * Formatea un nombre de propiedad camelCase a un título legible
   */
  private formatearEncabezado(header: string): string {
    const mapeoEncabezados: { [key: string]: string } = {
      
      'productoId': 'ID Producto',
      'nombreProducto': 'Nombre Producto',
      'stock': 'Stock',
      'precioEntrada': 'Precio Entrada',
      'precioSalida': 'Precio Salida',
      'valorTotal': 'Valor Total',
      
      
      'movimientoId': 'ID Movimiento',
      'tipoMovimiento': 'Tipo Movimiento',
      'cantidad': 'Cantidad',
      'precioUnitario': 'Precio Unitario',
      'total': 'Total',
      'fechaMovimiento': 'Fecha Movimiento',
      'numeroCompra': 'Número Compra',
      
      
      'proveedorId': 'ID Proveedor',
      'nombreProveedor': 'Nombre Proveedor',
      'ruc': 'RUC',
      'telefono': 'Teléfono',
      'correo': 'Correo',
      'totalOrdenesCompra': 'Total Órdenes Compra',
      'promedioOrden': 'Promedio Orden',
      'calificacionGlobal': 'Calificación',
      
      
      'clienteId': 'ID Cliente',
      'razonSocial': 'Razón Social',
      'tipoDocumento': 'Tipo Documento',
      'numeroDocumento': 'Número Documento',
      'totalOrdenes': 'Total Órdenes',
      'montoTotalComprado': 'Monto Total Comprado',
      'promedioCompra': 'Promedio Compra',
      'ultimaCompra': 'Última Compra',
      
      
      'stockActual': 'Stock Actual',
      'stockMinimo': 'Stock Mínimo',
      'diferencia': 'Diferencia',
      'urgencia': 'Urgencia',
      
      
      'clasificacion': 'Clasificación',
      'porcentajeValor': 'Porcentaje Valor',
      'porcentajeAcumulado': 'Porcentaje Acumulado'
    };

    
    if (mapeoEncabezados[header]) {
      return mapeoEncabezados[header];
    }

    
    return header
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }
}
