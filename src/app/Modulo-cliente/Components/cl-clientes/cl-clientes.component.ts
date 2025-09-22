import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { DataCliente, ClienteList } from '../../Models/cliente.model';
import { ClienteService } from '../../Services/cl-clientes.service';
import { finalize } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { pageSelection } from '../../Models/modelsPag';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ClAddClientesComponent } from './cl-add-clientes/cl-add-clientes.component';
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
    this.clienteServiceList.obtenerAllClientes(this.currentPage, this.pageSize, fechaInicioFormateado, fechaFinFormateado)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data: DataCliente) => {
        this.totalData = data.totalData;
        for (let index = this.skip; index < Math.min(this.limit, data.totalData); index++) {
          const serialNumber = index + 1;
          this.serialNumberArray.push(serialNumber);
        }
        this.ClientesList = data.data;
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
  public refresh(){
    this.limpiar();
    this.clienteServiceList.obtenerAllClientes(this.currentPage, this.pageSize)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data: DataCliente) => {
        this.totalData = data.totalData;
        for (let index = this.skip; index < Math.min(this.limit, data.totalData); index++) {
          const serialNumber = index + 1;
          this.serialNumberArray.push(serialNumber);
        }
        this.ClientesList = data.data;
        this.dataSource = new MatTableDataSource(this.ClientesList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      })
  }
  buscarPorFecha() { }
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
