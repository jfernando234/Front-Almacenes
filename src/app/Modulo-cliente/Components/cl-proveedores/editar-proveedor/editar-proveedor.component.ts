import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ProveedorService } from 'src/app/Modulo-cliente/Services/cl-proveedor.service';

@Component({
  selector: 'app-editar-proveedor',
  templateUrl: './editar-proveedor.component.html',
  styleUrl: './editar-proveedor.component.css'
})
export class EditarProveedorComponent {
  form!: FormGroup;
  public mostrarErrores = false;
  showPassword = false;
  proveedorSeleccionado: any;
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

  editarProveedor() {}
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
