import { Component } from '@angular/core';

@Component({
  selector: 'app-cl-clientes',
  templateUrl: './cl-clientes.component.html',
  styleUrls: ['./cl-clientes.component.css'],
})
export class ClClientesComponent {
  clientes: any[] = [];

  constructor() {}

  ngOnInit() {}
}
