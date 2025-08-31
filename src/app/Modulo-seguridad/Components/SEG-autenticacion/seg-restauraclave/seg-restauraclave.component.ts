import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { restauraClaveDTO } from 'src/app/Modulo-seguridad/Models/seg-login.model';
import { SegLoginService } from 'src/app/Modulo-seguridad/Services/seg-login.service';
import { UserContextService } from 'src/app/Modulo-seguridad/Services/user-context.service';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import swal from'sweetalert2';

@Component({
  selector: 'app-seg-restauraclave',
  templateUrl: './seg-restauraclave.component.html',
  styleUrls: ['./seg-restauraclave.component.css']
})
export class SegRestauraclaveComponent implements OnInit {
  modeloGrabar: restauraClaveDTO = new restauraClaveDTO();
  formulario!: FormGroup;
  globalConstants: GlobalsConstants = new GlobalsConstants();
  subscription!: Subscription;
  
  constructor(private readonly router: Router,
    private readonly fb: FormBuilder,
    private loginService: SegLoginService,
    private readonly userContextService: UserContextService) { }
  

  ngOnInit(): void {
    this.instanciarFormulario();
  }

  instanciarFormulario() {
    this.formulario = this.fb.group({
      login:['',{
        validators: [Validators.required]
      }],
      correoInstitucional:['',{
        validators: [Validators.required,Validators.email]
      }],
      numeroDocumento:['',{
        validators: [Validators.required]
      }]
    });
  }
  cancelar(){
    this.router.navigate(['/login']);
  }
  restauraClave(){
    this.modeloGrabar=this.formulario.value;

    console.log(this.modeloGrabar);
      this.subscription = new Subscription();
      this.subscription = this.loginService.restauraClave(this.modeloGrabar)
      
      .subscribe((mensaje : any) =>  {
        this.globalConstants.Mensaje=mensaje;
          if (this.globalConstants.Mensaje?.errorCodigo == 'OK'){
            swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail , 'success');
            this.userContextService.logout();
          }
          else{
            swal.fire(this.globalConstants.msgErrorSummary, this.globalConstants.Mensaje?.errorMensaje , 'error');        
          }
      },
      (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, 'error' ,'error');
    });
  }
  
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
