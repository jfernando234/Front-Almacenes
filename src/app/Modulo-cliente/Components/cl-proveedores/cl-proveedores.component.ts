import { Component } from '@angular/core';
import { Iproveedor } from '../../Models/provedor';
import { pageSelection } from '../../Models/modelsPag';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { AddProveedorComponent } from './add-proveedor/add-proveedor.component';

@Component({
  selector: 'app-cl-proveedores',
  templateUrl: './cl-proveedores.component.html',
  styleUrls: ['./cl-proveedores.component.css']
})
export class ClProveedoresComponent {
  ProveedorList: Iproveedor[] = [];
  serialNumberArray: number[] = [];
  pageNumberArray: Array<number> = [];
  bsModalRef?: BsModalRef;
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  public fechaInicio = '';
  public fechaFin = '';
  public skip = 0;
  public totalPages = 0;
  public pageSelection: Array<pageSelection> = [];
  public limit: number = this.pageSize;
  constructor( private modalService: BsModalService) { }

  ngOnInit() {
  }
  CrearProveedor() {
    this.bsModalRef = this.modalService.show(AddProveedorComponent);
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
