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


  serialNumberArray: number[] = [];

  ProveedorList: ListIproveedor[] = [];
  isLoading = false;
  dataSource!: MatTableDataSource<IComprasList>;

  public fechaInicio = ''
  public fechaFin = '';
  public skip = 0;
  public totalPages = 0;
  public pageSelection: Array<pageSelection> = [];

  isNuevaCompra = false;

  ComprasList: any[] = [];
  currentPage = 1;
  pageSize = 10;
  totalData = 0;
  displayList: any[] = [];
  pageNumberArray: Array<number> = [];

  constructor(private router: Router, private Compraservice: ComprasService, private proveedorService: ProveedorService) { }

  ngOnInit() {

    this.obtenerCompraData();

  }
  obtenerCompraData(): void {
    this.Compraservice.obtenerCompras().pipe(finalize(() => this.isLoading = false))
      .subscribe((data: IComprasList[]) => {
        this.ComprasList = data;
        this.totalData = data.length;
        this.calculateTotalPages();
        this.moveToPage(1);
      })
  }
  formatearFechaZona(fecha: Date): string {
    const tzOffset = -5 * 60; // Perú GMT-5
    const fechaLocal = new Date(fecha.getTime() - (tzOffset * 60000));
    const iso = fechaLocal.toISOString();
    return iso.replace('Z', '-05:00');
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
    this.displayList = this.ComprasList.slice(startIndex, endIndex);

    // Opcional: actualizar números de serie
    this.serialNumberArray = this.displayList.map((_, i) => startIndex + i + 1);
  }

  calculateTotalPages(): void {
    const totalPages = Math.ceil(this.totalData / this.pageSize);
    this.pageNumberArray = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  irANuevaCompra() {
    this.isNuevaCompra = true;
    this.router.navigate(['main/cl-ordenes-de-compra/compras/nueva']);
  }
}
