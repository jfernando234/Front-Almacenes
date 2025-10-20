import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { Producto } from 'src/app/Modulo-cliente/Models/inventario';
import { InventarioService } from 'src/app/Modulo-cliente/Services/cl-inventario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-producto',

  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css'
})
export class EditarProductoComponent {
  form!: FormGroup;
  public mostrarErrores = false;
  showPassword = false;
  public idproducto= 0;
  Seleccionado: any;
  constructor(public bsModalRef: BsModalRef, public fb: FormBuilder, private inventarioService: InventarioService) { }

  ngOnInit() {
    this.form = this.fb.group({
      precioEntrada: ['', Validators.required],
      nombre: ['', Validators.required],
      precioSalida: ['', Validators.required],
      stock: ['', Validators.required],
    });
    this.cargarDatosProducto();
  }
  editar() {
    this.mostrarErrores = true;
    if (this.form.invalid) {
      console.log('Formulario inválido');
      return;
    }
    const nuevo: Producto = {
      productoId: this.idproducto,
      nombreProducto: this.form.value.nombre,
      precioEntrada: this.form.value.precioEntrada,
      precioSalida: this.form.value.precioSalida,
      stock: this.form.value.stock
    };
    this.inventarioService.editar(nuevo)
      .pipe(finalize(() => this.form.reset()))
      .subscribe({
        next: (data) => {
          Swal.fire('Éxito', 'Producto editado correctamente', 'success');
          this.bsModalRef.hide();
        },
        error: (err) => {
          Swal.fire('Error', 'No se pudo editar el producto', 'error');
        }
      });
  }
  cargarDatosProducto() {
    console.log(this.Seleccionado);
    this.form.patchValue({
      nombre: this.Seleccionado.nombreProducto,
      precioEntrada: this.Seleccionado.precioEntrada,
      precioSalida: this.Seleccionado.precioSalida,
      stock: this.Seleccionado.stock,

    });
    this.idproducto = this.Seleccionado.productoId
  }
  Cancelar() {
    this.bsModalRef.hide();
  }
  /*Validacion*/
  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && control?.touched;
  }

  isRequerido(controlName: string) {
    const control = this.form.get(controlName);
    return control?.errors && control.errors['required'];
  }
}
