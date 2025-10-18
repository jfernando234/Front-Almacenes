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

  constructor() { }

  ngOnInit(): void {
    // --- Datos simulados ---
    this.stockBajo = [
      { nombreProducto: 'Producto A', stock: 3, totalMovimientos: 10 },
      { nombreProducto: 'Producto B', stock: 5, totalMovimientos: 8 }
    ];

    this.ultimasTransferencias = ['Prod A -> Prod B', 'Prod C -> Prod D'];

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
};
