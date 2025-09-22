import { Component, OnInit } from '@angular/core';

import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-cl-dashboard',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './cl-dashboard.component.html',
  styleUrls: ['./cl-dashboard.component.css']
})
export class ClDashboardComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  // Gráfico de barras
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  };
  barChartData: ChartData<'bar'> = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [
      { label: 'Ventas', data: [500, 700, 800, 650, 900], backgroundColor: '#007bff' }
    ]
  };

  // Gráfico de pastel
  pieChartData: ChartData<'pie'> = {
    labels: ['Activos', 'Inactivos', 'Pendientes'],
    datasets: [
      { data: [300, 100, 50], backgroundColor: ['#28a745', '#dc3545', '#ffc107'] }
    ]
  };

  // Gráfico de líneas
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { display: true } }
  };
  lineChartData: ChartData<'line'> = {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    datasets: [
      { label: 'Usuarios nuevos', data: [50, 75, 60, 90], borderColor: '#17a2b8', fill: false }
    ]
  };
};
