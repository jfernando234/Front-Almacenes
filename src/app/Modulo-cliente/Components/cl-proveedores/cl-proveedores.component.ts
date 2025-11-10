import { Component } from '@angular/core';
import { Iproveedor, ListIproveedor } from '../../Models/provedor';
import { pageSelection } from '../../Models/modelsPag';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddProveedorComponent } from './add-proveedor/add-proveedor.component';
import { finalize } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { ProveedorService } from '../../Services/cl-proveedor.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { EditarProveedorComponent } from './editar-proveedor/editar-proveedor.component';

@Component({
  selector: 'app-cl-proveedores',
  templateUrl: './cl-proveedores.component.html',
  styleUrls: ['./cl-proveedores.component.css']
})
export class ClProveedoresComponent {

  serialNumberArray: number[] = [];
  bsModalRef?: BsModalRef;
  isLoading = false;
  dataSource!: MatTableDataSource<ListIproveedor>;

  public fechaInicio = '';
  public fechaFin = '';


  ProveedorList: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalData = 0;
  displayList: any[] = [];
  pageNumberArray: Array<number> = [];

  constructor(private modalService: BsModalService, private proveedorService: ProveedorService) { }

  ngOnInit() {
    this.ObtenerProveedor();
  }
  ObtenerProveedor() {
    this.serialNumberArray = [];
    this.ProveedorList = [];
    this.isLoading = true
    this.proveedorService.obtenerAllProveedores()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data: ListIproveedor[]) => {
        this.ProveedorList = data
        this.totalData = data.length;
        this.calculateTotalPages();
        this.moveToPage(1);
      })
  }
  limpiar() {
    this.serialNumberArray = [];
    this.ProveedorList = [];
    this.fechaFin = '';
    this.fechaFin = '';

  }
  refresh() {
    this.limpiar();
    this.proveedorService.obtenerAllProveedores()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data: ListIproveedor[]) => {
        this.ProveedorList = data
        this.totalData = data.length;
        this.calculateTotalPages();
        this.moveToPage(1);
      })
  }
  CrearProveedor() {
    this.bsModalRef = this.modalService.show(AddProveedorComponent);
    this.bsModalRef.onHidden?.subscribe(() => {
      this.ObtenerProveedor();
    });
  }
  editarProveedor(proveedor: Iproveedor) {
    const initialState = {
      proveedorSeleccionado: proveedor
    };
    this.bsModalRef = this.modalService.show(EditarProveedorComponent, { initialState });
    const proveedorActualizado = new Subject<boolean>();
    this.bsModalRef.content.proveedorActualizado = proveedorActualizado;
    proveedorActualizado.subscribe((proveedorEditada: boolean) => {
      if (proveedorEditada) {
        this.ObtenerProveedor();
      }
    });
    this.bsModalRef.onHidden?.subscribe(() => {
      proveedorActualizado.unsubscribe();
      this.ObtenerProveedor();
    });
  }
  eliminarProveedor(proveedorId?: number) {
    Swal.fire({
      title: '¿Seguro que deseas eliminar?',
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.proveedorService.eliminarProveedor(proveedorId).subscribe({
          next: (res) => {
            Swal.fire('Eliminado!', 'El Proveedor Eliminado correctamente', 'success');
            this.ObtenerProveedor();
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo eliminar el proveedor', 'error');
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
    this.displayList = this.ProveedorList.slice(startIndex, endIndex);

    // Opcional: actualizar números de serie
    this.serialNumberArray = this.displayList.map((_, i) => startIndex + i + 1);
  }

  calculateTotalPages(): void {
    const totalPages = Math.ceil(this.totalData / this.pageSize);
    this.pageNumberArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}
