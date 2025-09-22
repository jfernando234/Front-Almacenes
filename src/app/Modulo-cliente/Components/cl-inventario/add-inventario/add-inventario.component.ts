import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-inventario',
  templateUrl: './add-inventario.component.html',
  styleUrl: './add-inventario.component.css'
})
export class AddInventarioComponent {
  form!: FormGroup;
  public mostrarErrores = false;
  showPassword = false;

  constructor(public bsModalRef: BsModalRef, public fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      precioEntrada: ['', Validators.required],
      nombre: ['', Validators.required],
      precioSalida: ['', Validators.required],
      stock: ['', Validators.required],
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
