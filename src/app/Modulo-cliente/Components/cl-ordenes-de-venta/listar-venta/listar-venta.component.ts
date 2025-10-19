import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Icompra } from 'src/app/Modulo-cliente/Models/Compra';
import { pageSelection } from 'src/app/Modulo-cliente/Models/modelsPag';

@Component({
  selector: 'app-listar-venta',

  templateUrl: './listar-venta.component.html',
  styleUrl: './listar-venta.component.css'
})
export class ListarVentaComponent {
  ordenesCompra: any[] = [];
  // Datos y lógica inicial del componente

  ComprasList: Icompra[] = [];
  serialNumberArray: number[] = [];
  pageNumberArray: Array<number> = [];

  isLoading = false;
  dataSource!: MatTableDataSource<Icompra>;
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  public fechaInicio = '';
  public fechaFin = '';
  public skip = 0;
  public totalPages = 0;
  public pageSelection: Array<pageSelection> = [];
  public limit: number = this.pageSize;
  isNuevaVenta = false;
  constructor(private router: Router) { }

  ngOnInit() { }
  ObtenerOrdenesCompra() {

  }
  CrearCompra() { }
  refresh() { }
  getMoreData(value: string) { }
  moveToPage(page: number) { }
  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
  irANuevaCompra() {
    this.isNuevaVenta = true;
    // Navegar a la ruta completa dentro del layout 'main'
    this.router.navigate(['main/cl-ordenes-de-venta/ventas/nueva']);

  }
}
