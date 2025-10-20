import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { Cliente, ICliente } from 'src/app/Modulo-cliente/Models/cliente.model';
import { ClienteService } from 'src/app/Modulo-cliente/Services/cl-clientes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cl-add-clientes',
  standalone: false,
  templateUrl: './cl-add-clientes.component.html',
  styleUrl: './cl-add-clientes.component.css'
})
export class ClAddClientesComponent {

  usuario: Cliente = new Cliente();
  form!: FormGroup;
  public mostrarErrores = false;
  showPassword = false;
  constructor(public bsModalRef: BsModalRef, private usuarioService: ClienteService, public fb: FormBuilder) { }
  ngOnInit() {
    this.form = this.fb.group({
      razon: ['', Validators.required],
      documento: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }
  guardar() {
    this.mostrarErrores = true;
    if (this.form.invalid) {
      console.log('Formulario inválido');
      return;
    }
    const nuevo: ICliente = {
      idTipoDocumento: 1,
      numeroDocumento: this.form.value.documento,
      razonSocial: this.form.value.razon,
      telefono: this.form.value.telefono,
      correo: this.form.value.email,
      direccion: this.form.value.direccion
    };
    this.usuarioService.registrar(nuevo)
      .pipe(finalize(() => this.form.reset()))
      .subscribe({
        next: (res) => {
          Swal.fire('Cliente registrado', 'El cliente ha sido registrado correctamente.', 'success');
          this.bsModalRef.hide();
        },
        error: (err) => {
          Swal.fire('Error', 'Hubo un error al registrar el cliente.', 'error');
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
