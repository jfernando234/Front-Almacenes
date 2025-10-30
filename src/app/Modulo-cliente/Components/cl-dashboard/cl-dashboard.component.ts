import { Component, OnInit } from '@angular/core';

import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Producto } from '../../Models/inventario';
import { InventarioService } from '../../Services/cl-inventario.service';
@Component({
  selector: 'app-cl-dashboard',
  templateUrl: './cl-dashboard.component.html',
  styleUrls: ['./cl-dashboard.component.css']
})
export class ClDashboardComponent {

  totalProductos = 0;
  /// --- Widgets ---
  stockBajo: any[] = [];
  ultimasTransferencias: string[] = [];
  ultimosPedidos: string[] = [];
  productosMovidos: any[] = [];

  // --- Gráficos ---
  inventarioChartData: ChartData<'line'> = { labels: [], datasets: [] };
  movimientosChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barStockData: any[] = [];
  constructor(private inventarioSer: InventarioService) { }

  ngOnInit(): void {

    this.obtenerTotalProductos();
    this.obtenerStockBajo();
    // --- Datos simulados ---
    this.ultimasTransferencias = ['Prod A -> Prod B', 'Prod C -> Prod D'];
    this.barStockData = this.stockBajo.map(p => ({
      name: p.nombreProducto,
      value: p.stock
    }));
    this.productosMovidos = [
      { nombreProducto: 'PRODUCTO MODIFICADO', stock: 156, totalMovimientos: 10 },
      { nombreProducto: 'TEST qweqe', stock: 12, totalMovimientos: 8 },
      { nombreProducto: 'Producto', stock: 100, totalMovimientos: 50 }
    ];

    // --- Configurar gráficos ---
    this.inventarioChartData = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
      datasets: [
        { data: [50, 45, 60, 55, 40], label: 'Stock total', borderColor: '#42A5F5', fill: false }
      ]
    };

    this.movimientosChartData = {
      labels: ['Producto A', 'Producto B', 'Producto C'],
      datasets: [
        { data: [10, 7, 3], label: 'Entradas/Salidas', backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'] }
      ]
    };
  }
  // Bar vertical (Ventas por mes)
  barData = [
    { name: 'Enero', value: 100 },
    { name: 'Febrero', value: 200 },
    { name: 'Marzo', value: 150 }
  ];
  barView: [number, number] = [600, 300];
  barShowLegend = false;
  barShowXAxis = true;
  barShowYAxis = true;
  barShowXAxisLabel = true;
  barXAxisLabel = 'Mes';
  barShowYAxisLabel = true;
  barYAxisLabel = 'Ventas';

  // Pie (Distribución de usuarios)
  pieData = [
    { name: 'Activos', value: 300 },
    { name: 'Inactivos', value: 100 },
    { name: 'Pendientes', value: 50 }
  ];
  pieView: [number, number] = [400, 300];

  // Line (Usuarios nuevos por semana) -> formato series
  lineData = [
    {
      name: 'prueba',
      series: [
        { name: 'Semana 1', value: 50 },
        { name: 'Semana 2', value: 75 },
        { name: 'Semana 3', value: 60 },
        { name: 'Semana 4', value: 90 }
      ]
    }
  ];
  lineView: [number, number] = [600, 300];
  lineShowXAxis = true;
  lineShowYAxis = true;
  lineShowLegend = false;
  lineShowGridLines = true;
  obtenerTotalProductos() {
    this.inventarioSer.getTotalProductos().subscribe({
      next: (data: any) => {
        this.totalProductos = data.totalInventario; // Asegúrate de que tu backend envíe { total: 100 }
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
};
