import { Component } from '@angular/core';
import { DataProveedor, Iproveedor, ListIproveedor } from '../../Models/provedor';
import { pageSelection } from '../../Models/modelsPag';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
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
  ProveedorList: ListIproveedor[] = [];
  serialNumberArray: number[] = [];
  pageNumberArray: Array<number> = [];
  bsModalRef?: BsModalRef;
  isLoading = false;
  dataSource!: MatTableDataSource<ListIproveedor>;
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  public fechaInicio = '';
  public fechaFin = '';
  public skip = 0;
  public totalPages = 0;
  public pageSelection: Array<pageSelection> = [];
  public limit: number = this.pageSize;
  constructor(private modalService: BsModalService, private proveedorService: ProveedorService) { }

  ngOnInit() {
    this.ObtenerProveedor();
  }
  ObtenerProveedor() {
    this.serialNumberArray = [];
    this.ProveedorList = [];
    let fechaInicioFormateado = undefined
    let fechaFinFormateado = undefined
    this.isLoading = true

    if (this.fechaInicio != "") {
      fechaInicioFormateado = new Date(this.fechaInicio)?.toISOString().split('T')[0];
    }
    if (this.fechaFin != "") {
      fechaFinFormateado = new Date(this.fechaFin)?.toISOString().split('T')[0];
    }
    this.proveedorService.obtenerAllProveedores()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data: ListIproveedor[]) => {
        for (let index = this.skip; index < Math.min(this.limit, data.length); index++) {
          const serialNumber = index + 1;
          this.serialNumberArray.push(serialNumber);
        }
        this.ProveedorList = data
        this.dataSource = new MatTableDataSource(this.ProveedorList);
        this.calculateTotalPages(this.totalData, this.pageSize);
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
        for (let index = this.skip; index < Math.min(this.limit, data.length); index++) {
          const serialNumber = index + 1;
          this.serialNumberArray.push(serialNumber);
        }
        this.ProveedorList = data
        this.dataSource = new MatTableDataSource(this.ProveedorList);
        this.calculateTotalPages(this.totalData, this.pageSize);
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
    });
  }
  eliminarProveedor(proveedorId?: string) {
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
