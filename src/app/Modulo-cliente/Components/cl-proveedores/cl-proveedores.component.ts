import { Component } from '@angular/core';

@Component({
  selector: 'app-cl-proveedores',
  templateUrl: './cl-proveedores.component.html',
  styleUrls: ['./cl-proveedores.component.css']
})
export class ClProveedoresComponent {
  proveedores: any[] = [];

  constructor() {}

  ngOnInit() {
  }
}
