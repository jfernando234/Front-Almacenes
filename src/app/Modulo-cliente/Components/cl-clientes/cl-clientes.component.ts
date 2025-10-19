import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { DataCliente, ClienteList, ICliente } from '../../Models/cliente.model';
import { ClienteService } from '../../Services/cl-clientes.service';
import { finalize } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { pageSelection } from '../../Models/modelsPag';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ClAddClientesComponent } from './cl-add-clientes/cl-add-clientes.component';
import { ClEditarClienteComponent } from './cl-editar-cliente/cl-editar-cliente.component';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cl-clientes',
  templateUrl: './cl-clientes.component.html',
  styleUrls: ['./cl-clientes.component.css'],
})
export class ClClientesComponent implements OnInit {
  form!: FormGroup;
  serialNumberArray: number[] = [];
  pageNumberArray: Array<number> = [];
  ClientesList: ClienteList[] = [];
  dataSource!: MatTableDataSource<ClienteList>;
  isLoading = false;
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  public fechaInicio = '';
  public fechaFin = '';
  public skip = 0;
  public totalPages = 0;
  public pageSelection: Array<pageSelection> = [];
  public limit: number = this.pageSize;
  bsModalRef?: BsModalRef;
  constructor(private clienteServiceList: ClienteService, private modalService: BsModalService,) { }

  ngOnInit() {
    this.ObtenerClientes();

  }
  public ObtenerClientes() {
    this.ClientesList = [];
    this.serialNumberArray = [];
    let fechaInicioFormateado = undefined
    let fechaFinFormateado = undefined
    this.isLoading = true

    if (this.fechaInicio != "") {
      fechaInicioFormateado = new Date(this.fechaInicio)?.toISOString().split('T')[0];
    }
    if (this.fechaFin != "") {
      fechaFinFormateado = new Date(this.fechaFin)?.toISOString().split('T')[0];
    }
    this.clienteServiceList.obtenerAllClientes()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data: ClienteList[]) => {
        console.log(data);
        for (let index = this.skip; index < Math.min(this.limit, data.length); index++) {
          const serialNumber = index + 1;
          this.serialNumberArray.push(serialNumber);
        }
        this.ClientesList = data;
        this.dataSource = new MatTableDataSource(this.ClientesList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      })
  }
  private limpiar() {
    this.ClientesList = [];
    this.serialNumberArray = [];
    this.fechaInicio = '';
    this.fechaFin = '';
  }
  public refresh() {
    this.limpiar();
    this.clienteServiceList.obtenerAllClientes()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data: ClienteList[]) => {

        for (let index = this.skip; index < Math.min(this.limit, data.length); index++) {
          const serialNumber = index + 1;
          this.serialNumberArray.push(serialNumber);
        }
        this.ClientesList = data;
        this.dataSource = new MatTableDataSource(this.ClientesList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      })
  }
  editarCliente(cliente: ClienteList) {
    const initialState = {
      clienteSeleccionado: cliente
    };
    this.bsModalRef = this.modalService.show(ClEditarClienteComponent, { initialState });
    const clienteActualizado = new Subject<boolean>();
    this.bsModalRef.content.proveedorActualizado = clienteActualizado;
    clienteActualizado.subscribe((proveedorEditada: boolean) => {
      if (proveedorEditada) {
        this.ObtenerClientes();
      }
    });
    this.bsModalRef.onHidden?.subscribe(() => {
      clienteActualizado.unsubscribe();
    });
  }
  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.ClientesList = this.dataSource.filteredData;
  }
  eliminarCliente(clienteId: number) {
    Swal.fire({
      title: '¿Seguro que deseas eliminar?',
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteServiceList.eliminarCliente(clienteId)
          .subscribe({
            next: (res) => {
              Swal.fire('Cliente Elminado', 'El cliente ha sido Eliminado correctamente.', 'success');
              this.ObtenerClientes();
            },
            error: (err) => {
              Swal.fire('Error', 'Hubo un error al Eliminar el cliente.', 'error');
            }
          });
      } else {
        return;
      }
    })
  }
  crearCliente() {
    this.bsModalRef = this.modalService.show(ClAddClientesComponent);
    this.bsModalRef.onHidden?.subscribe(() => {
      this.ObtenerClientes();
    });
  }
  onCreate() { }
  //Paginacion
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
