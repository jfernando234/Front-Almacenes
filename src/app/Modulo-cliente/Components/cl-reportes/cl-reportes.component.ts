import { Component, OnInit } from '@angular/core';
import { ReportesService } from 'src/app/Services/reportes.service';

@Component({
  selector: 'app-cl-reportes',
  templateUrl: './cl-reportes.component.html',
  styleUrls: ['./cl-reportes.component.css'],
})
export class ClReportesComponent implements OnInit {
  // Estados generales
  cargando: boolean = false;
  reporteCargado: boolean = false;

  // Datos del reporte actual
  reporteData: any = {};
  resumenGeneral: any = {};

  // Información del reporte activo
  reporteActual = {
    tipo: '',
    titulo: 'Seleccione un reporte para visualizar',
  };

  // Filtros para movimientos de stock
  movimientosFilter = {
    fechaInicio: '',
    fechaFin: '',
    tipoMovimiento: '',
    selectedRange: 'Último mes',
  };

  // Definición de reportes
  reportesDisponibles = [
    {
      id: 'valoracion-inventario',
      titulo: 'Valoración de Inventario',
      tipo: 'valoracion-inventario',
    },
    {
      id: 'movimientos-stock',
      titulo: 'Movimientos de Stock',
      tipo: 'movimientos-stock',
    },
    {
      id: 'rendimiento-proveedores',
      titulo: 'Rendimiento de Proveedores',
      tipo: 'rendimiento-proveedores',
    },
    {
      id: 'historial-clientes',
      titulo: 'Historial de Clientes',
      tipo: 'historial-clientes',
    },
    { id: 'stock-critico', titulo: 'Stock Crítico', tipo: 'stock-critico' },
    { id: 'analisis-abc', titulo: 'Análisis ABC', tipo: 'analisis-abc' },
  ];

  constructor(private reportesService: ReportesService) {}

  ngOnInit(): void {
    this.cargarResumenGeneral();
    this.inicializarFiltros();
  }

  /**
   * Inicializa los filtros por defecto
   */
  private inicializarFiltros(): void {
    const hoy = new Date();
    const unMesAtras = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);

    this.movimientosFilter.fechaFin = this.formatearFecha(hoy);
    this.movimientosFilter.fechaInicio = this.formatearFecha(unMesAtras);
  }

  /**
   * Formatea una fecha al formato YYYY-MM-DD
   */
  private formatearFecha(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Carga el resumen general de todos los reportes
   */
  private cargarResumenGeneral(): void {
    this.reportesService.obtenerResumenGeneral().subscribe(
      (datos: any) => {
        this.resumenGeneral = datos;
      },
      (error) => {
        console.error('Error al cargar resumen general:', error);
      }
    );
  }

  /**
   * Carga un reporte específico
   */
  cargarReporte(tipoReporte: string): void {
    this.cargando = true;
    this.reporteCargado = false;

    // Encontrar información del reporte
    const reporte = this.reportesDisponibles.find(
      (r) => r.tipo === tipoReporte
    );
    if (!reporte) {
      console.error('Reporte no encontrado');
      this.cargando = false;
      return;
    }

    this.reporteActual = {
      tipo: reporte.tipo,
      titulo: reporte.titulo,
    };

    // Cargar datos según el tipo de reporte
    switch (tipoReporte) {
      case 'valoracion-inventario':
        this.reportesService.obtenerValoracionInventario().subscribe(
          (datos: any) => {
            this.reporteData = datos;
            this.cargando = false;
            this.reporteCargado = true;
          },
          (error) => this.manejarError(error)
        );
        break;

      case 'movimientos-stock':
        this.cargarMovimientosStock();
        break;

      case 'rendimiento-proveedores':
        this.reportesService.obtenerRendimientoProveedores().subscribe(
          (datos: any) => {
            this.reporteData = datos;
            this.cargando = false;
            this.reporteCargado = true;
          },
          (error) => this.manejarError(error)
        );
        break;

      case 'historial-clientes':
        this.reportesService.obtenerHistorialClientes().subscribe(
          (datos: any) => {
            this.reporteData = datos;
            this.cargando = false;
            this.reporteCargado = true;
          },
          (error) => this.manejarError(error)
        );
        break;

      case 'stock-critico':
        this.reportesService.obtenerStockCritico().subscribe(
          (datos: any) => {
            this.reporteData = datos;
            this.cargando = false;
            this.reporteCargado = true;
          },
          (error) => this.manejarError(error)
        );
        break;

      case 'analisis-abc':
        this.reportesService.obtenerAnalisisABC().subscribe(
          (datos: any) => {
            this.reporteData = datos;
            this.cargando = false;
            this.reporteCargado = true;
          },
          (error) => this.manejarError(error)
        );
        break;
    }
  }

  /**
   * Carga los movimientos de stock con filtros
   */
  private cargarMovimientosStock(): void {
    this.reportesService
      .obtenerMovimientosStock(
        this.movimientosFilter.fechaInicio,
        this.movimientosFilter.fechaFin,
        undefined,
        this.movimientosFilter.tipoMovimiento || undefined
      )
      .subscribe(
        (datos: any) => {
          this.reporteData = datos;
          this.cargando = false;
          this.reporteCargado = true;
        },
        (error) => this.manejarError(error)
      );
  }

  /**
   * Aplica filtros y recarga el reporte
   */
  aplicarFiltros(): void {
    if (this.reporteActual.tipo === 'movimientos-stock') {
      this.cargando = true;
      this.cargarMovimientosStock();
    }
  }

  /**
   * Limpia los filtros y recarga el reporte
   */
  limpiarFiltros(): void {
    this.inicializarFiltros();
    this.movimientosFilter.tipoMovimiento = '';
    this.aplicarFiltros();
  }

  /**
   * Obtiene los detalles del reporte actual
   */
  obtenerDetalles(): any[] {
    if (!this.reporteData) return [];

    switch (this.reporteActual.tipo) {
      case 'valoracion-inventario':
        return this.reporteData.detalles || [];
      case 'movimientos-stock':
        return this.reporteData.movimientos || [];
      case 'rendimiento-proveedores':
        return this.reporteData.proveedores || [];
      case 'historial-clientes':
        return this.reporteData.clientes || [];
      case 'stock-critico':
        return this.reporteData.productos || [];
      case 'analisis-abc':
        return this.reporteData.productos || [];
      default:
        return [];
    }
  }

  /**
   * Exporta el reporte actual a CSV
   */
  exportarCSV(): void {
    const detalles = this.obtenerDetalles();
    if (detalles && detalles.length > 0) {
      this.reportesService.exportarCSV(detalles, this.reporteActual.titulo);
    }
  }

  /**
   * Imprime el reporte
   */
  imprimirReporte(): void {
    window.print();
  }

  /**
   * Actualiza el reporte actual
   */
  actualizarReporte(): void {
    this.cargarReporte(this.reporteActual.tipo);
  }

  /**
   * Obtiene la clase CSS para la urgencia de stock
   */
  obtenerClaseUrgencia(urgencia: string): string {
    switch (urgencia) {
      case 'Muy Crítico':
        return 'bg-danger';
      case 'Crítico':
        return 'bg-warning';
      case 'Alerta':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  /**
   * Obtiene la clase CSS para la clasificación ABC
   */
  obtenerClaseABC(clasificacion: string): string {
    switch (clasificacion) {
      case 'A':
        return 'bg-primary';
      case 'B':
        return 'bg-info';
      case 'C':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  /**
   * Obtiene la clase CSS para la calificación del proveedor
   */
  obtenerClaseCalificacion(calificacion: string): string {
    switch (calificacion) {
      case 'Excelente':
        return 'bg-success';
      case 'Muy Bueno':
        return 'bg-info';
      case 'Bueno':
        return 'bg-primary';
      case 'Regular':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  /**
   * Maneja errores en la carga de reportes
   */
  private manejarError(error: any): void {
    console.error('Error al cargar reporte:', error);
    this.cargando = false;
    this.reporteCargado = false;
    alert('Error al cargar el reporte. Por favor, intente nuevamente.');
  }
}
