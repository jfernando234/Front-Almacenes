import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { finalize } from 'rxjs/operators';
import { ICliente } from 'src/app/Modulo-cliente/Models/cliente.model';
import { ClienteService } from 'src/app/Modulo-cliente/Services/cl-clientes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cl-editar-cliente',
  templateUrl: './cl-editar-cliente.component.html',
  styleUrl: './cl-editar-cliente.component.css'
})
export class ClEditarClienteComponent {
  clienteSeleccionado: any;
  form!: FormGroup;
  public mostrarErrores = false;
  showPassword = false;
  constructor(public bsModalRef: BsModalRef, private usuarioService: ClienteService, public fb: FormBuilder) { }
  ngOnInit() {
    this.form = this.fb.group({
      Razon: ['', Validators.required],
      documento: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      estado: ['', Validators.required],
    });
    this.cargarDatosCliente();
  }
  editar() {
    this.mostrarErrores = true;
    if (this.form.invalid) {
      console.log('Formulario inválido');
      return;
    }
    const nuevo: ICliente = {
      idCliente: this.clienteSeleccionado.idCliente,
      numeroDocumento: this.form.value.documento,
      razonSocial: this.form.value.Razon,
      telefono: this.form.value.telefono,
      correo: this.form.value.email,
      direccion: this.form.value.direccion,
      estado: this.form.value.estado
    };
    this.usuarioService.editarCliente(this.clienteSeleccionado.idCliente, nuevo)
      .pipe(finalize(() => this.form.reset()))
      .subscribe({
        next: (res) => {
          Swal.fire('Cliente actualizado', 'El cliente ha sido actualizado correctamente.', 'success');
          this.bsModalRef.hide();
        },
        error: (err) => {
          Swal.fire('Error', 'Hubo un error al actualizar el cliente.', 'error');
        }
      });
  }
  cargarDatosCliente() {
    console.log(this.clienteSeleccionado);
    this.form.patchValue({
      Razon: this.clienteSeleccionado.contacto,
      documento: this.clienteSeleccionado.numeroDocumento,
      direccion: this.clienteSeleccionado.direccion,
      telefono: this.clienteSeleccionado.telefono,
      email: this.clienteSeleccionado.correo,
      estato: this.clienteSeleccionado.estado,
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
