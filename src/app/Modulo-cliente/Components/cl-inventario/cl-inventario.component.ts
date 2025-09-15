import { Component } from '@angular/core';

@Component({
  selector: 'app-cl-inventario',
  templateUrl: './cl-inventario.component.html',
  styleUrls: ['./cl-inventario.component.css'],
})
export class ClInventarioComponent {
  // Datos y lógica inicial del componente
  items: any[] = [];

  constructor() {}

  ngOnInit() {
    // cargar datos iniciales si aplica
  }
}
