import { Component } from '@angular/core';
import { pageSelection } from '../../Models/modelsPag';
import { DataInventario, ListProducto, Producto } from '../../Models/inventario';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddInventarioComponent } from './add-inventario/add-inventario.component';
import { InventarioService } from '../../Services/cl-inventario.service';
import { finalize } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { EditarProductoComponent } from './editar-producto/editar-producto.component';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cl-inventario',
  templateUrl: './cl-inventario.component.html',
  styleUrls: ['./cl-inventario.component.css'],
})
export class ClInventarioComponent {
  // Datos y lógica inicial del componente

  serialNumberArray: number[] = [];
  bsModalRef?: BsModalRef;
  isLoading = false;
  dataSource!: MatTableDataSource<ListProducto>;


  public fechaInicio = '';
  public fechaFin = '';
  public skip = 0;
  public totalPages = 0;
  public pageSelection: Array<pageSelection> = [];

  InventarioList: ListProducto[] = [];
  currentPage = 1;
  pageSize = 10;
  totalData = 0;
  displayList: any[] = [];
  pageNumberArray: Array<number> = [];

  constructor(private modalService: BsModalService, private inventarioService: InventarioService) { }

  ngOnInit() {
    // cargar datos iniciales si aplica
    this.ObtenerProductos();
  }

  ObtenerProductos() {
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
      .subscribe((data: ListProducto[]) => {
        this.InventarioList = data;
        this.totalData = data.length;
        this.calculateTotalPages();
        this.moveToPage(1);
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
      .subscribe((data: ListProducto[]) => {
        this.InventarioList = data;
        this.totalData = data.length;
        this.calculateTotalPages();
        this.moveToPage(1);
      })
  }
  CrearPorducto() {
    this.bsModalRef = this.modalService.show(AddInventarioComponent);
    this.bsModalRef.onHidden?.subscribe(() => {
      this.ObtenerProductos();
    });
  }
  editarProducto(producto: Producto) {
    const initialState = {
      Seleccionado: producto
    };
    this.bsModalRef = this.modalService.show(EditarProductoComponent, { initialState });
    const clienteActualizado = new Subject<boolean>();
    this.bsModalRef.content.proveedorActualizado = clienteActualizado;
    clienteActualizado.subscribe((proveedorEditada: boolean) => {
      if (proveedorEditada) {
        this.ObtenerProductos();
      }
    });
    this.bsModalRef.onHidden?.subscribe(() => {
      clienteActualizado.unsubscribe();
      this.ObtenerProductos();
    });
  }
  formatoFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.toString().split('T')[0].split('-');
    return `${dia}/${mes}/${anio}`;
  }
  eliminarProducto(productoId: number) {
    Swal.fire({
      title: '¿Seguro que deseas eliminar?',
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.inventarioService.eliminarProducto(productoId)
          .subscribe({
            next: (res) => {
              Swal.fire('Producto Elminado', 'El Producto ha sido Eliminado correctamente.', 'success');
              this.ObtenerProductos();
            },
            error: (err) => {
              Swal.fire('Error', 'Hubo un error al Eliminar el Producto.', 'error');
            }
          });
      } else {
        return;
      }
    })
  }

  /*paginacion*/
  getMoreData(direction: 'next' | 'previous'): void {
    if (direction === 'next' && this.currentPage < this.pageNumberArray.length) {
      this.moveToPage(this.currentPage + 1);
    } else if (direction === 'previous' && this.currentPage > 1) {
      this.moveToPage(this.currentPage - 1);
    }
  }

  moveToPage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayList = this.InventarioList.slice(startIndex, endIndex);

    // Opcional: actualizar números de serie
    this.serialNumberArray = this.displayList.map((_, i) => startIndex + i + 1);
  }

  calculateTotalPages(): void {
    const totalPages = Math.ceil(this.totalData / this.pageSize);
    this.pageNumberArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
