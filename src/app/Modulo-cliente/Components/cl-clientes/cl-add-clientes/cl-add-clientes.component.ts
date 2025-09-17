import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ClienteService } from 'src/app/Modulo-cliente/Services/cl-clientes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cl-add-clientes',
  standalone: false,
  templateUrl: './cl-add-clientes.component.html',
  styleUrl: './cl-add-clientes.component.css'
})
export class ClAddClientesComponent {
  form!: FormGroup;
  public mostrarErrores = false;
  constructor(public bsModalRef: BsModalRef, private clienteServiceList: ClienteService, public fb: FormBuilder) {
    this.form = this.fb.group({
      apellido: ['', Validators.required],
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      tipoDocumentoIdentidadId: ['', Validators.required],
      documento: ['', Validators.required],
      fechaRegistro: [''],
      estado: ['', Validators.required]
    });
  }

  //metodo para crear cliente
  crearCliente() {
    if (this.form.invalid) {
      this.isTouched();
      return;
    }

    const formData = new FormData();

    formData.append("Apellido", this.form.get("apellido")?.value);
    formData.append("Nombre", this.form.get("nombre")?.value);
    formData.append("Telefono", this.form.get("telefono")?.value.toString());
    formData.append("Direccion", this.form.get("direccion")?.value);
    formData.append("Email", this.form.get("email")?.value);
    formData.append("Documento", this.form.get("documento")?.value.toString());
    formData.append("TipoDocumentoIdentidadId", this.form.get("tipoDocumentoIdentidadId")?.value);
    formData.append("RolId", this.form.get("rolId")?.value);
    formData.append("Estado",this.form.get("estado")?.value);


    this.clienteServiceList.crearCliente(formData).subscribe(
      (response) => {
        if (response.isSuccess) {
          Swal.fire(response.message, '', 'success');
          this.bsModalRef.hide();
        } else {
          console.error(response.message);
        }
      },
      (error) => {
        console.error(error);
      });
  }
  Cancelar() {}
  //validaciones y demas logicas del formulario
  isInvalid(controlName: string) {
    const control = this.form.get(controlName);
    return control?.invalid && control?.touched;
  }

  isTouched() {
    Object.values(this.form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
  isRequerido(controlName: string) {
    const control = this.form.get(controlName);
    return control?.errors && control.errors['required'];
  }
}
