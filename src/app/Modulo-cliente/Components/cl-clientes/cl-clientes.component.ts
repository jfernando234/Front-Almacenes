import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators,ValidatorFn,AbstractControl } from '@angular/forms';
import { Cliente } from '../../Models/cliente.model';
@Component({
  selector: 'app-cl-clientes',
  templateUrl: './cl-clientes.component.html',
  styleUrls: ['./cl-clientes.component.css'],
})
export class ClClientesComponent implements OnInit{
  clientes: any[] = [];
  form!: FormGroup;
  isFormSubmitted = false;
  paciente: Cliente = new Cliente();
  cantidad = 0;
  constructor() {}

  ngOnInit() {}
  crearPaciente() {

  }
  soloNumeros(event: Event) {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    input.value = currentValue.replace(/[^0-9]/g, '');
  }
  actualizarCantidad() {
    this.form.get('numeroDocumento')!.setValue('');
    const tipoDocumento = this.form.get('tipoDocumentoId')!.value;
    let maxCaracteres = 0;
    switch (tipoDocumento) {
      case '01':
        maxCaracteres = 8;
        break;
      case '06':
        maxCaracteres = 11;
        break;
      default:
        maxCaracteres = 12;
        break;
    }
    this.cantidad = maxCaracteres;
    this.form
      .get('numeroDocumento')
      ?.setValidators([
        Validators.required,
        Validators.maxLength(maxCaracteres),
        Validators.minLength(maxCaracteres),
        Validators.pattern('^[0-9]+$'),
      ]);
    this.form.get('numeroDocumento')?.updateValueAndValidity();
  }
  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && control?.touched;
  }
  isRequerido(controlName: string) {
    const control = this.form.get(controlName);
    return control?.errors && control.errors['required'];
  }

}
