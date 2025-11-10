import { Component, OnInit, ViewChild } from '@angular/core';

import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Producto } from '../../Models/inventario';
import { InventarioService } from '../../Services/cl-inventario.service';
import { ComprasService } from '../../Services/cl-compras.service';
import { CompraPorMes, ProductoCompras } from '../../Models/Compra';
import { LegendPosition } from '@swimlane/ngx-charts';
@Component({
  selector: 'app-cl-dashboard',
  templateUrl: './cl-dashboard.component.html',
  styleUrls: ['./cl-dashboard.component.css']
})
export class ClDashboardComponent {

  totalProductos = 0;
  /// --- Widgets ---
  stockBajo: any[] = [];
  //(compras por mes)
  barData: { name: string, value: number }[] = [];;
  barView: [number, number] = [600, 300];
  //grafico barras horizontales stock bajo
  pieData: { name: string, value: number }[] = [];
  pieView: [number, number] = [500, 400];
  //grafico pie
  pieViewpie: [number, number] = [500, 400];
  // --- Gráficos ---
  barStockData: any[] = [];

  legendPosition: LegendPosition = LegendPosition.Below;
  constructor(private inventarioSer: InventarioService, private compraService: ComprasService) { }

  ngOnInit(): void {
    this.cargarDatos();
    this.comprasMes();
    this.obtenerTotalProductos();
    this.obtenerStockBajo();
    // --- Datos simulados ---
    this.barStockData = this.stockBajo.map(p => ({
      name: p.nombreProducto,
      value: p.stock
    }));

  }
  obtenerTotalProductos() {
    this.inventarioSer.getTotalProductos().subscribe({
      next: (data: any) => {
        this.totalProductos = data.totalInventario;
      },
      error: (err) => {
        console.error('Error al obtener total de productos', err);
      }
    });
  }

  obtenerStockBajo() {
    this.inventarioSer.getStockBajo().subscribe({
      next: (data: any[]) => {
        this.stockBajo = data;

        // Transformamos el array para ngx-charts
        this.barStockData = this.stockBajo.map(item => ({
          name: item.nombreProducto,
          value: item.stock
        }));
      },
      error: (err) => {
        console.error('Error al obtener productos con stock crítico', err);
        this.stockBajo = [];
        this.barStockData = [];
      }
    });
  }
  cargarDatos() {
    this.compraService.getDistribucionComprasPorProducto().subscribe(
      (data: ProductoCompras[]) => {
        this.pieData = data.map(p => ({
          name: p.nombreProducto,
          value: p.totalComprado
        }));
      },
      (error) => {
        console.error('Error al cargar datos del gráfico', error);
      }
    );
  }
  comprasMes() {
    this.compraService.getComprasPorMes().subscribe(
      (data: CompraPorMes[]) => {
        this.barData = data.map(d => ({
          name: d.mes,
          value: d.totalCompras
        }));
      },
      (error) => {
        console.error('Error al cargar datos del gráfico', error);
      }
    );
  }
};
