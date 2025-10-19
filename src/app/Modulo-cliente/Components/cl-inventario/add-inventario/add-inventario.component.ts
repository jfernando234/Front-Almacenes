import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { Producto } from 'src/app/Modulo-cliente/Models/inventario';
import { InventarioService } from 'src/app/Modulo-cliente/Services/cl-inventario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-inventario',
  templateUrl: './add-inventario.component.html',
  styleUrl: './add-inventario.component.css'
})
export class AddInventarioComponent {
  form!: FormGroup;
  public mostrarErrores = false;
  showPassword = false;

  constructor(public bsModalRef: BsModalRef, public fb: FormBuilder, private inventarioService: InventarioService) { }

  ngOnInit() {
    this.form = this.fb.group({
      precioEntrada: ['', Validators.required],
      nombre: ['', Validators.required],
      precioSalida: ['', Validators.required],
      stock: ['', Validators.required],
    });
  }
  guardar() {
    this.mostrarErrores = true;
    if (this.form.invalid) {
      console.log('Formulario inválido');
      return;
    }
    const nuevo: Producto = {
      nombreProducto: this.form.value.nombre,
      precioEntrada: this.form.value.precioEntrada,
      precioSalida: this.form.value.precioSalida,
      stock: this.form.value.stock
    };
    this.inventarioService.registrar(nuevo)
      .pipe(finalize(() => this.form.reset()))
      .subscribe({
        next: (data) => {
          Swal.fire('Éxito', 'Producto registrado correctamente', 'success');
          this.bsModalRef.hide();
        },
        error: (err) => {
          Swal.fire('Error', 'No se pudo registrar el producto', 'error');
        }
      });
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
