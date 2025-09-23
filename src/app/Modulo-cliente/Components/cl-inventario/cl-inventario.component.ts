import { Component } from '@angular/core';
import { pageSelection } from '../../Models/modelsPag';
import { DataInventario, Producto } from '../../Models/inventario';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddInventarioComponent } from './add-inventario/add-inventario.component';
import { InventarioService } from '../../Services/cl-inventario.service';
import { finalize } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cl-inventario',
  templateUrl: './cl-inventario.component.html',
  styleUrls: ['./cl-inventario.component.css'],
})
export class ClInventarioComponent {
  // Datos y lógica inicial del componente
  InventarioList: Producto[] = [];
  items: any[] = [];
  serialNumberArray: number[] = [];
  pageNumberArray: Array<number> = [];
  bsModalRef?: BsModalRef;
  isLoading = false;
  dataSource!: MatTableDataSource<Producto>;
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  public fechaInicio = '';
  public fechaFin = '';
  public skip = 0;
  public totalPages = 0;
  public pageSelection: Array<pageSelection> = [];
  public limit: number = this.pageSize;
  constructor(private modalService: BsModalService, private inventarioService: InventarioService) { }

  ngOnInit() {
    // cargar datos iniciales si aplica
  }

  ObtenerProveedores() {
    this.serialNumberArray = [];
    this.InventarioList = [];
    let fechaInicioFormateado = undefined
    let fechaFinFormateado = undefined
    this.isLoading = true

    if (this.fechaInicio != "") {
      fechaInicioFormateado = new Date(this.fechaInicio)?.toISOString().split('T')[0];
    }
    if (this.fechaFin != "") {
      fechaFinFormateado = new Date(this.fechaFin)?.toISOString().split('T')[0];
    }
    this.inventarioService.obtenerInventario().pipe(finalize(() => this.isLoading = false))
      .subscribe((data: Producto[]) => {

        for (let index = this.skip; index < Math.min(this.limit, data.length); index++) {
          const serialNumber = index + 1;
          this.serialNumberArray.push(serialNumber);
        }
        this.InventarioList = data;
        this.dataSource = new MatTableDataSource(this.InventarioList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      })
  }
  limpiar() {
    this.serialNumberArray = [];
    this.InventarioList = [];
    this.fechaInicio = '';
    this.fechaFin = '';

  }
  refresh() {
    this.limpiar();
    this.inventarioService.obtenerInventario().pipe(finalize(() => this.isLoading = false))
      .subscribe((data: Producto[]) => {

        for (let index = this.skip; index < Math.min(this.limit, data.length); index++) {
          const serialNumber = index + 1;
          this.serialNumberArray.push(serialNumber);
        }
        this.InventarioList = data;
        this.dataSource = new MatTableDataSource(this.InventarioList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      })
  }
  CrearPorducto() {
    this.bsModalRef = this.modalService.show(AddInventarioComponent);
    this.bsModalRef.onHidden?.subscribe(() => {

    });
  }
  /*paginacion*/
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
}
