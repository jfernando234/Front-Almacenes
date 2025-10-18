import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { Producto } from 'src/app/Modulo-cliente/Models/inventario';
import { pageSelection } from 'src/app/Modulo-cliente/Models/modelsPag';
import { ComprasService } from 'src/app/Modulo-cliente/Services/cl-compras.service';
import { InventarioService } from 'src/app/Modulo-cliente/Services/cl-inventario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detalle-compra',
  templateUrl: './detalle-compra.component.html',
  styleUrl: './detalle-compra.component.css'
})
export class DetalleCompraComponent {
  @Input() entryData: any;

  constructor(
    private productosService: InventarioService,
    public formBuilder: FormBuilder,
    public bsModalRef: BsModalRef,
    public comprasDetallesService: ComprasService
  ) { }

  public quantities: number[] = [];
  public productosList: Array<Producto> = [];
  public selectedProduct: Producto[] = [];
  public pageSize = 5;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;
  isLoading = false;


  form!: FormGroup;
  public productoSeleccionado: Producto[] = [];
  nombreProducto = '';
  dataSource!: MatTableDataSource<Producto>;
  cantidades: number[] = [];
  ngOnInit() {
    this.obtenerDatosProductos();
  }

  public obtenerDatosProductos(): void {
    this.productosList = [];
    this.serialNumberArray = [];
    this.isLoading = true;
    this.productosService
      .obtenerInventario()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((data: Producto[]) => {
        this.productosList = data;
        this.dataSource = new MatTableDataSource<Producto>(this.productosList);
        this.calculateTotalPages(this.totalData, this.pageSize);
        this.cantidades = new Array(this.productosList.length).fill(1);
      });
  }
  crearCompraDetallle(item: any) {
    const producto = this.productosList[item];
    const productoExistente = this.productoSeleccionado.find(p => p.productoId === producto.productoId);

    if (!productoExistente) {
      this.productoSeleccionado.push(producto);
      this.comprasDetallesService.disparadorOtro.emit({
        data: this.productoSeleccionado.map((p, index) => ({
          productoListProductoId: p.productoId,
          productoListNombre: p.nombreProducto,
          productoListPrecio: p.precioEntrada,
          cantidadIm: this.cantidades[this.productosList.findIndex(prod => prod.productoId === p.productoId)],
          productoId: p.productoId,
        })),
        action: 'add'
      });
    } else {
      // Opcional: mostrar mensaje de que el producto ya está agregado
      alert('Este producto ya ha sido agregado a la compra');
    }
  }
  public sortData(sort: Sort) {
    const data = this.productosList.slice();
    if (!sort.active || sort.direction === '') {
      this.productosList = data;
    } else {
      this.productosList = data.sort((a, b) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.obtenerDatosProductos();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.obtenerDatosProductos();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.obtenerDatosProductos();
  }

  cerrar() {
    this.bsModalRef.hide();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (let i = 1; i <= this.totalPages; i++) {
      this.limit = pageSize * i;
      const skip = this.limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: this.limit });
    }
  }
  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && control?.touched;
  }
  isRequerido(controlName: string) {
    const control = this.form.get(controlName);
    return control?.errors && control.errors['required'];
  }
  isTouched() {
    Object.values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

}
