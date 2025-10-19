import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { Iproveedor } from 'src/app/Modulo-cliente/Models/provedor';
import { ProveedorService } from 'src/app/Modulo-cliente/Services/cl-proveedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-proveedor',
  templateUrl: './add-proveedor.component.html',
  styleUrl: './add-proveedor.component.css'
})
export class AddProveedorComponent {
  form!: FormGroup;
  public mostrarErrores = false;
  showPassword = false;

  constructor(public bsModalRef: BsModalRef, public fb: FormBuilder, private proveedoerservice: ProveedorService) { }

  ngOnInit() {
    this.form = this.fb.group({
      rozonSocial: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ruc: ['', Validators.required],
    });
  }

  guardar() {
    this.mostrarErrores = true;
    if (this.form.invalid) {
      console.log('Formulario inválido');
      return;
    }
    const nuevo: Iproveedor = {
      ruc: this.form.value.ruc,
      nombre: this.form.value.rozonSocial,
      direccion: this.form.value.direccion,
      telefono: this.form.value.telefono,
      correo: this.form.value.email,
      contacto: "nuevo"
    };
    this.proveedoerservice.registrar(nuevo)
      .pipe(finalize(() => this.form.reset()))
      .subscribe({
        next: (res) => {
          Swal.fire('Éxito', 'Proveedor registrado correctamente', 'success');
          this.bsModalRef.hide();
        },
        error: (err) => {
          Swal.fire('Error', 'No se pudo registrar el proveedor', 'error');
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
