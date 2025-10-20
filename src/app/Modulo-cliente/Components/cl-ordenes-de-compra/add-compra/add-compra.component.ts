import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

import { ICompras } from 'src/app/Modulo-cliente/Models/Compra';
import { Iproveedor } from 'src/app/Modulo-cliente/Models/provedor';

import { ComprasService } from 'src/app/Modulo-cliente/Services/cl-compras.service';
import { ProveedorService } from 'src/app/Modulo-cliente/Services/cl-proveedor.service';
import Swal from 'sweetalert2';
import { DetalleCompraComponent } from './detalle-compra/detalle-compra.component';



@Component({
  selector: 'app-add-compra',
  templateUrl: './add-compra.component.html',
  styleUrl: './add-compra.component.css'
})
export class AddCompraComponent implements OnInit {
  CompraAgregada$: Subject<boolean> = new Subject<boolean>();
  cantidad = 11;
  form!: FormGroup;
  fecha: Date = new Date();
  public mostrarErrores = false;
  isFormSubmitted = false;
  proveedorSeleccionado?: Iproveedor;
  listProveedores!: Iproveedor[];
  listProveedoresFiltrados!: Iproveedor[];
  mostrarOpcionesProveedor = false;
  proveedor_LISTA: Array<Iproveedor> = [];
  almacen_LISTA: Array<any> = [];
  usuarioId = "";
  dataProductoTable: Array<any> = [];
  tipoCompraSeleccionada = '';
  subtotal = 0;
  igv = 0;
  total = 0;
  vuelto = 0;
  tipoPago_LISTA: Array<{ tipoPagoId: number; descripcion: string }> = [];
  @ViewChild('multiProveedorSearch') multiProveedorSearchInput!: ElementRef;

  ngOnInit(): void {

    this.form = this.fb.group({
      fecha: [{ value: new Date(), disabled: true }, Validators.required],
      tipoDocumento: ['', Validators.required],
      ruc: ['', Validators.required],
      proveedorId: ['', Validators.required],
      tipoCompra: ['', Validators.required],
      observacion: ['', Validators.required],
    });
    this.agregarDataProducto();
    this.tipoPago_LISTA = [
      { tipoPagoId: 1, descripcion: 'Credito' },
      { tipoPagoId: 2, descripcion: 'Contado' },
    ];
    this.proveedorService.obtenerAllProveedores()
      .subscribe((data: Iproveedor[]) => {
        this.listProveedores = data;
      });


  }

  constructor(
    public bsModalRef: BsModalRef,
    private Compraservice: ComprasService,
    public formBuilder: FormBuilder,
    public fb: FormBuilder,
    private proveedorService: ProveedorService,
    private renderer: Renderer2,
    private modalService: BsModalService,
    private router: Router
  ) { }

  buscarProveedores() {
    const searchInput = this.multiProveedorSearchInput.nativeElement.value
      ? this.multiProveedorSearchInput.nativeElement.value.toLowerCase()
      : '';

    this.mostrarOpcionesProveedor = searchInput.length >= 3;
    if (this.mostrarOpcionesProveedor) {
      this.listProveedoresFiltrados = this.listProveedores.filter(
        (proveedor) => proveedor.nombre.toLowerCase().includes(searchInput)
      );
    } else {
      this.listProveedoresFiltrados = [];
    }
  }
  proveedoresParaMostrar(): Iproveedor[] {
    if (this.mostrarOpcionesProveedor && this.listProveedoresFiltrados) {
      return this.listProveedoresFiltrados;
    }
    return this.listProveedores || [];
  }

  actualizarFechaVencimiento(dias: number): void {
    const fechaBase = this.form.get('fecha')?.value ? new Date(this.form.get('fecha')?.value) : new Date();
    if (dias && !isNaN(dias)) {
      const nuevaFecha = new Date(fechaBase);
      nuevaFecha.setDate(nuevaFecha.getDate() + Number(dias));
      const fechaFormateada = nuevaFecha.toISOString().slice(0, 10);
      this.form.get('fechaVenc')?.setValue(fechaFormateada, { emitEvent: false });
    } else {
      this.form.get('fechaVenc')?.setValue('', { emitEvent: false });
    }
  }
  onChangeProveedor(event: any): void {
    const proveedor = (this.listProveedoresFiltrados?.length ? this.listProveedoresFiltrados : this.listProveedores)
      .find((p) => p.idProveedor === event.value);

    this.proveedorSeleccionado = proveedor;
    this.form.patchValue({
      ruc: proveedor?.ruc || ''
    });
  }

  isCantidadNroDocumento(controlName: string) {
    const control = this.form.get(controlName);

    if (control && control.value) {
      const cantidadCorrecta = this.cantidad;
      return control.value.length !== cantidadCorrecta;
    }
    return false;
  }

  soloNumeros(event: Event) {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    input.value = currentValue.replace(/[^0-9]/g, '');
  }

  validarInput(event: any) {
    const inputValue = event.target.value;

    if (isNaN(inputValue)) {
      const newValue = inputValue.slice(0, -1);
      this.renderer.setProperty(event.target, 'value', newValue);
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

  Cancelar() {
    this.CompraAgregada$.next(false);
    this.bsModalRef.hide();
  }
  isTouched() {
    Object.values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
  crearCompra() {
    if (this.form.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan datos',
        text: 'Por favor, complete todos los campos obligatorios.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
    const compra: ICompras = {
      fechaRegistro: this.form.get('fecha')?.value,
      idTipoDocumento: this.form.get('tipoDocumento')?.value,
      numeroDocumento: this.form.get('ruc')?.value,
      idProveedor: this.form.get('proveedorId')?.value,
      idTipoCompra: this.form.get('tipoCompra')?.value,
      efectivo: 10,
      fechaVencimiento: this.form.get('fecha')?.value,
      observacion: this.form.get('observacion')?.value,
      total: this.calcularTotal(),
      estado: 1
      /*detalles: this.dataProductoTable.map((dataProducto) => ({
        productoId: dataProducto.productoId,
        cantidad: dataProducto.cantidad,
        valorVenta: dataProducto.valorVenta,
        igv: dataProducto.igv ?? 0,
        precioUnitario: dataProducto.precioNew,
        subtotal: dataProducto.subtotal,
      })),*/
    };

    this.Compraservice.crearCompra(compra).subscribe(
      (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: 'Registrando...',
            allowOutsideClick: false,
          })
          Swal.showLoading();
          Swal.close();
          this.regresar(); //regresar al listado de compras
        } else {
          Swal.fire('Exito', response.message, 'success');
          this.regresar();
        }
      },
      (error) => {
        console.error(error);
      },
    );
  }
  regresar() {
    this.router.navigate(['main/cl-ordenes-de-compra/compras/listar']);
  }
  calculoTotalSubtotalIgv(total: number) {
    this.subtotal = total;
    this.igv = 0;
    this.total = total;
    this.llenarFormCalculo();
  }
  llenarFormCalculo() {
    this.form.patchValue({
      subtotal: this.subtotal,
      vuelto: this.vuelto,
      igv: 0,
      total: this.total,
    });
  }
  cancelar() {
    this.router.navigate(['main/cl-ordenes-de-compra/compras/listar']);
  }


  agregarProductoCompras() {
    this.bsModalRef = this.modalService.show(
      DetalleCompraComponent
    );
    this.bsModalRef.setClass('modal-lg');
  }
  agregarDataProducto() {
    this.Compraservice.disparadorOtro.subscribe((response: any) => {
      if (response.action === 'add') {
        response.data.forEach((data: any) => {
          const productoExistente = this.dataProductoTable.find(
            item => item.productoId === data.productoListProductoId
          );
          const precioUnitario = data.productoListPrecio;
          const cantidad = data.cantidadIm;
          const subtotal = precioUnitario * cantidad;
          const igv = +(subtotal * 0.18).toFixed(2);

          if (!productoExistente) {
            this.dataProductoTable.push({
              productoId: data.productoListProductoId,
              nombre: data.productoListNombre,
              cantidad: data.cantidadIm,
              valorVenta: 0,
              igv: igv,
              precioNew: data.productoListPrecio,
              subtotal: data.productoListPrecio * data.cantidadIm,
            });
          }
        });
      }
    });
  }
  calcularSubTotal(dataProducto: any): void {
    dataProducto.subtotal = dataProducto.cantidad * dataProducto.precioNew;
    dataProducto.igv = +(dataProducto.subtotal * 0.18).toFixed(2);
    if (dataProducto.precioNew < dataProducto.precioOg)
      this.calcularDescuento(dataProducto);
    else { dataProducto.descuento = 0; }
  }
  calcularDescuento(dataProducto: any) {
    dataProducto.descuento = (((dataProducto.precioOg - dataProducto.precioNew) / dataProducto.precioOg) * 100).toFixed(2);
  }

  calcularTotal(): number {
    let suma = 0.00;
    this.dataProductoTable.forEach(dataProducto => {
      suma += dataProducto.subtotal;
    });
    return suma;
  }
  eliminarElementoDataProducto(item: number) {
    this.dataProductoTable.splice(item, 1);
  }
  isInvalidTablet(tamanio: number): boolean {
    if (tamanio === 0) {
      return true;
    } else return false;
  }
}
