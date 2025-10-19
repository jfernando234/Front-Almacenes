import { Component, OnInit } from '@angular/core';

import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Producto } from '../../Models/inventario';
@Component({
  selector: 'app-cl-dashboard',
  templateUrl: './cl-dashboard.component.html',
  styleUrls: ['./cl-dashboard.component.css']
})
export class ClDashboardComponent {
  /// --- Widgets ---
  stockBajo: any[] = [];
  ultimasTransferencias: string[] = [];
  ultimosPedidos: string[] = [];
  productosMovidos: any[] = [];

  // --- Gráficos ---
  inventarioChartData: ChartData<'line'> = { labels: [], datasets: [] };
  movimientosChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barStockData: any[] = [];
  constructor() { }

  ngOnInit(): void {
    // --- Datos simulados ---
    this.stockBajo = [
      { nombreProducto: 'prueba ', stock: 3, totalMovimientos: 10 },
      { nombreProducto: 'eqwewqe B', stock: 5, totalMovimientos: 8 },
      { nombreProducto: 'aqweqe', stock: 2, totalMovimientos: 2 },
      { nombreProducto: 'Producto 2', stock: 1, totalMovimientos: 0 }
    ];

    this.ultimasTransferencias = ['Prod A -> Prod B', 'Prod C -> Prod D'];
    this.barStockData = this.stockBajo.map(p => ({
      name: p.nombreProducto,
      value: p.stock
    }));
    this.productosMovidos = [
      { nombreProducto: 'Producto A', stock: 3, totalMovimientos: 10 },
      { nombreProducto: 'Producto B', stock: 5, totalMovimientos: 8 },
      { nombreProducto: 'Producto C', stock: 0, totalMovimientos: 2 }
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
};
