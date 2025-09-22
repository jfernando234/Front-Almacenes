import { Component, OnInit } from '@angular/core';

import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-cl-dashboard',
  templateUrl: './cl-dashboard.component.html',
  styleUrls: ['./cl-dashboard.component.css']
})
export class ClDashboardComponent {
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
      name: 'Usuarios nuevos',
      series: [
        { name: 'Semana 1', value: 50 },
        { name: 'Semana 2', value: 75 },
        { name: 'Semana 3', value: 60 },
        { name: 'Semana 4', value: 90 }
      ]
    }
  ];
  lineView: [number, number] = [800, 300];
  lineShowXAxis = true;
  lineShowYAxis = true;
  lineShowLegend = false;
  lineShowGridLines = true;
};
