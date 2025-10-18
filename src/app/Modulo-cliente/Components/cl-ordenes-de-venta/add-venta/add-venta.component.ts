import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Producto } from 'src/app/Modulo-cliente/Models/inventario';
import { Iventas, IventasDetalles, Ventas } from 'src/app/Modulo-cliente/Models/ventas';
import { VentasService } from 'src/app/Modulo-cliente/Services/cl-ventas.service';
import Swal from 'sweetalert2';
import { DetalleVentaComponent } from './detalle-venta/detalle-venta.component';

@Component({
  selector: 'app-add-venta',

  templateUrl: './add-venta.component.html',
  styleUrl: './add-venta.component.css'
})
export class AddVentaComponent {

  form!: FormGroup;
  isFormSubmitted = false;
  bsModalRef?: BsModalRef;

  almacen_LISTA: Array<any> = [];
  tipoPago_LISTA: Array<any> = [];
  ventasDetalles_LISTA: Array<IventasDetalles> = [];
  pacienteSeleccionado?: any;
  listPacientes!: any[];
  listPacientesFiltrados!: any[];
  tipoPagoSeleccionado: string | undefined;
  tipoTarjeta_LISTA: Array<any> = [];
  tipoMoneda_LISTA: Array<any> = [];
  listMetodoPago: Array<any> = [];
  metodoPagoSeleccionado: string | undefined;
  vuelto = 0;
  subtotal = 0;
  total = 0;
  igv = 0;
  venta = new Ventas();
  fecha: Date = new Date();
  productoSeleccionado: Producto[] = [];
  listProductos!: Producto[];
  listProductosFiltrados!: Producto[];
  isLoading = false;
  mostrarOpcionesBeneficiario = false;
  mostrarOpcionesProducto = false;
  dataProductoTable: Array<any> = [];
  productoAgregado = false;

  @ViewChild('multiUserSearch') multiPacienteSearchInput!: ElementRef;
  @ViewChild('multiProductSearch') multiProductoSearchInput!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,

    private ventaService: VentasService,

    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    let getCheckedTipoBeneficiario = null;
    this.tipoBeneficiario_LISTA.forEach((o) => {
      if (o.checked) getCheckedTipoBeneficiario = o.value;
    });
    this.form = this.formBuilder.group({
      tipoDocumentoId: ['', [Validators.required]],
      serie: [{ value: '', disabled: true }, Validators.required],
      secuencia: [{ value: '', disabled: true }, Validators.required],
      fecha: [{ value: new Date(), disabled: true }, Validators.required],
      almacenId: ['', Validators.required],
      tipoBeneficiario: [getCheckedTipoBeneficiario, [Validators.required]],
      beneficiarioId: ['', [Validators.required, Validators.maxLength(40)]],
      beneficiarioDocumento: [
        { value: '', disabled: true },
        Validators.required,
      ],
      beneficiarioDireccion: [
        { value: '', disabled: true },
        Validators.required,
      ],
      tipoPago: ['', [Validators.required]],
      observacion: [''],
      metodoPago: ['Efectivo', Validators.required],
      tipoTarjetaId: [''],
      montoRecibido: ['', Validators.required],
      tipoMonedaId: ['', [Validators.required]],
      vuelto: [{ value: '', disabled: true }, Validators.required],
      subtotal: [{ value: '', disabled: true }, Validators.required],
      igv: [{ value: '', disabled: true }, Validators.required],
      total: [{ value: '', disabled: true }, Validators.required],
    });

    this.agregarDataProducto();


    this.isEfectivo('metodoPago');
  }


  updateSerieAndSecuencia(tipoDocumentoId: string): void {

  }

  // seleccion checkbox tipo Beneficiario
  tipoBeneficiario_LISTA = [
    { name: 'Paciente', value: 'Paciente', checked: false },
    { name: 'Cliente', value: 'Cliente', checked: false },
  ];

  buscarBeneficiarios() {
    const searchInput = this.multiPacienteSearchInput.nativeElement.value
      ? this.multiPacienteSearchInput.nativeElement.value.toLowerCase()
      : '';
    this.mostrarOpcionesBeneficiario = searchInput.length >= 3;
    if (this.mostrarOpcionesBeneficiario) {
      if (!this.listPacientesFiltrados) {
        this.listPacientesFiltrados = [...this.listPacientes];
      }
      this.listPacientes = this.listPacientesFiltrados.filter((paciente) => {
        const nombres = paciente.nombres.toLowerCase();
        const apellidos = paciente.apellidos.toLowerCase();
        if (!searchInput) {
          return true;
        }
        return nombres.includes(searchInput) || apellidos.includes(searchInput);
      });
    }
  }

  onChangeBeneficiario(event: any): void {
    this.pacienteSeleccionado = this.listPacientesFiltrados.find(
      (paciente) => paciente.pacienteId === event.value,
    );
    this.form.patchValue({
      nombrePaciente: this.pacienteSeleccionado?.nombres,
      apellidoPaciente: this.pacienteSeleccionado?.apellidos,
      beneficiarioDocumento: this.pacienteSeleccionado?.numeroDocumento,
      beneficiarioDireccion: this.pacienteSeleccionado?.direccion,
    });
  }

  buscarProductos(searchTerm: string) {
    if (!searchTerm || searchTerm.length < 3) {
      this.mostrarOpcionesProducto = false;
      this.listProductosFiltrados = [];
      return;
    }
    this.mostrarOpcionesProducto = true;
    this.listProductosFiltrados = this.listProductos.filter((producto) =>
      producto.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  isEfectivo(controlName: string): void {
    const control = this.form.get(controlName);
    const valorSeleccionado = control?.value;

    if (valorSeleccionado === 'Efectivo' || valorSeleccionado === undefined) {
      this.form.get('tipoTarjetaId')?.disable();
    } else {
      this.form.get('tipoTarjetaId')?.enable();
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

  markAllFieldsAsTouched() {
    Object.values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  crearVenta() {
    if (this.form.invalid) {
      this.isFormSubmitted = true;
      this.markAllFieldsAsTouched();
      return;
    }

    const addVenta: Iventas = {
      tipoDocumentoId: this.form.get('tipoDocumentoId')?.value,
      serie: this.form.get('serie')?.value,
      secuencia: this.form.get('secuencia')?.value,
      fecha: this.form.get('fecha')?.value,
      almacenId: this.form.get('almacenId')?.value,
      tipoBeneficiario: this.form.get('tipoBeneficiario')?.value,
      beneficiarioId: this.form.get('beneficiarioId')?.value,
      beneficiarioDocumento: this.form.get('beneficiarioDocumento')?.value,
      beneficiarioDireccion: this.form.get('beneficiarioDireccion')?.value,
      nombreBeneficiario: this.form.get('nombrePaciente')?.value,
      apellidoBeneficiario: this.form.get('apellidoPaciente')?.value,
      nombreDocumento: this.form.get('')?.value,
      tipoPago: this.form.get('tipoPago')?.value,
      observacion: this.form.get('observacion')?.value,
      metodoPago: this.form.get('metodoPago')?.value,
      tipoTarjetaId: this.form.get('tipoTarjetaId')?.value || null,
      montoRecibido: this.form.get('montoRecibido')?.value,
      tipoMonedaId: this.form.get('tipoMonedaId')?.value,
      vuelto: this.form.get('vuelto')?.value,
      total: this.calcularTotal(),
      detalle: this.dataProductoTable.map((dataProducto) => ({
        productoId: dataProducto.productoId,
        codigoProducto: dataProducto.codigoProducto,
        cantidad: dataProducto.cantidad,
        precio: dataProducto.precioOg,
        subtotal: dataProducto.subtotal,
      })),
    };
    this.ventaService.crearVenta(addVenta).subscribe(
      (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: 'Registrando...',
            allowOutsideClick: false,
          });
          Swal.showLoading();
          Swal.fire(
            'Correcto',
            'Venta registrada en el sistema correctamente.',
            'success',
          );
          this.onCancel();
        } else {
          console.error(response.message);
        }
      },
      (error) => {
        console.error(error);
      },
    );
  }

  onCancel() {

  }

  agregarProcedimientoProducto() {
    // Verifica si ya hay un producto agregado
    if (this.dataProductoTable.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Detalle de Venta ya agregado',
        text: 'Solo puedes agregar un Detalle de Venta a la vez. Por favor, elimina el Detalle actual primero.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    // Si no hay productos agregados, abre el modal
    this.bsModalRef = this.modalService.show(DetalleVentaComponent);
    this.bsModalRef.setClass('modal-lg');

  }

  agregarDataProducto(): void {

  }

  isInvalidTablet(tamanio: number): boolean {
    if (tamanio === 0) {
      this.form.get('montoRecibido')?.disable();
      return true;
    }
    this.form.get('montoRecibido')?.enable();
    return false;
  }

  eliminarElementoDataProducto(item: number) {
    // Eliminar el producto de la lista
    this.dataProductoTable.splice(item, 1);
    Swal.fire({
      icon: 'success',
      title: 'Detalle de Venta eliminado',
      text: 'El Detalle de Venta ha sido eliminado. Ahora puedes agregar otro Detalle de Venta.',
      confirmButtonText: 'Aceptar',
    });

    // Reiniciar el array de productos seleccionados para permitir agregar uno nuevo
    this.productoSeleccionado = [];
    // Restablece el estado de la bandera
    this.productoAgregado = false;
  }

  calcularSubTotal(dataProducto: any): void {
    dataProducto.subtotal = dataProducto.cantidad * dataProducto.precioNew;
    if (dataProducto.precioNew < dataProducto.precioOg)
      this.calcularDescuento(dataProducto);
    else {
      dataProducto.descuento = 0;
    }
  }

  calcularDescuento(dataProducto: any) {
    dataProducto.descuento = (
      ((dataProducto.precioOg - dataProducto.precioNew) /
        dataProducto.precioOg) *
      100
    ).toFixed(2);
  }

  calcularTotal(): number {
    let suma = 0.0;
    this.dataProductoTable.forEach((dataProducto) => {
      suma += dataProducto.subtotal;
    });
    this.calculoTotalSubtotalIgv(suma);
    return suma;
  }

  calculoTotalSubtotalIgv(total: number) {
    this.subtotal = total;
    this.igv = 0;
    this.total = total;
    this.llenarFormCalculo();
  }

  calcularVuelto(event: any) {
    const monto = event.target.value;
    this.vuelto = monto - this.total;
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
}
