import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationEnd, Router } from '@angular/router';
import { filter, finalize } from 'rxjs/operators';
import { Icompra, IComprasList } from 'src/app/Modulo-cliente/Models/Compra';
import { pageSelection } from 'src/app/Modulo-cliente/Models/modelsPag';
import { ListIproveedor } from 'src/app/Modulo-cliente/Models/provedor';
import { ComprasService } from 'src/app/Modulo-cliente/Services/cl-compras.service';
import { ProveedorService } from 'src/app/Modulo-cliente/Services/cl-proveedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-compra',
  templateUrl: './listar-compra.component.html',
  styleUrl: './listar-compra.component.css'
})
export class ListarCompraComponent {
  ordenesCompra: any[] = [];
  // Datos y lógica inicial del componente

  ComprasList: any[] = [];
  serialNumberArray: number[] = [];
  pageNumberArray: Array<number> = [];
  ProveedorList: ListIproveedor[] = [];
  isLoading = false;
  dataSource!: MatTableDataSource<IComprasList>;
  public pageSize = 10;
  public totalData = 0;
  public currentPage = 1;
  public fechaInicio = ''
  public fechaFin = '';
  public skip = 0;
  public totalPages = 0;
  public pageSelection: Array<pageSelection> = [];
  public limit: number = this.pageSize;
  isNuevaCompra = false;
  constructor(private router: Router, private Compraservice: ComprasService, private proveedorService: ProveedorService) { }

  ngOnInit() {

    this.obtenerCompraData();

  }
  cargarProveedores() {
    this.proveedorService.obtenerAllProveedores()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe((data: ListIproveedor[]) => {
        this.ProveedorList = data
        console.log(this.ProveedorList)
      })
  };

  obtenerCompraData(): void {
    this.Compraservice.obtenerCompras().pipe(finalize(() => this.isLoading = false))
      .subscribe((data: IComprasList[]) => {
        console.log(data);
        for (let index = this.skip; index < Math.min(this.limit, data.length); index++) {
          const serialNumber = index + 1;
          this.serialNumberArray.push(serialNumber);
        }
        this.ComprasList = data
        this.dataSource = new MatTableDataSource(this.ComprasList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      })
  }
  formatearFechaZona(fecha: Date): string {
    const tzOffset = -5 * 60; // Perú GMT-5
    const fechaLocal = new Date(fecha.getTime() - (tzOffset * 60000));
    const iso = fechaLocal.toISOString();
    return iso.replace('Z', '-05:00'); // Resultado: "2025-10-20T20:48:22.3166667-05:00"
  }

  eliminarCompra(idcompra: number) {
    Swal.fire({
      title: '¿Seguro que deseas eliminar?',
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.Compraservice.eliminarCompra(idcompra)
          .subscribe({
            next: (res) => {
              Swal.fire('Compra Eliminada', 'La Compra ha sido Eliminada correctamente.', 'success');
              this.obtenerCompraData();
            },
            error: (err) => {
              Swal.fire('Error', 'Hubo un error al Elminar la compra.', 'error');
            }
          });
      } else {
        return;
      }
    })
  }
  formatoFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.toString().split('T')[0].split('-');
    return `${dia}/${mes}/${anio}`;
  }
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
    this.isNuevaCompra = true;
    this.router.navigate(['main/cl-ordenes-de-compra/compras/nueva']);
  }
}
