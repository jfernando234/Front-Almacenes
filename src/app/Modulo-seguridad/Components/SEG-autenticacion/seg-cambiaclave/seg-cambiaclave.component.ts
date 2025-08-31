import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { cambiaClaveDTO } from 'src/app/Modulo-seguridad/Models/seg-login.model';
import { SegLoginService } from 'src/app/Modulo-seguridad/Services/seg-login.service';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';
import { UserContextService } from 'src/app/Modulo-seguridad/Services/user-context.service';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import swal from'sweetalert2';

@Component({
  selector: 'app-seg-cambiaclave',
  templateUrl: './seg-cambiaclave.component.html',
  styleUrls: ['./seg-cambiaclave.component.css']
})
export class SegCambiaclaveComponent implements OnInit {
  modeloGrabar: cambiaClaveDTO = new cambiaClaveDTO();
  formulario!: FormGroup;
  globalConstants: GlobalsConstants = new GlobalsConstants();
  subscription!: Subscription;
  usuario=''
  idusuario=0

  constructor(private readonly router: Router,
    private readonly fb: FormBuilder,
    private loginService: SegLoginService,
    private storageService: StorageService,
    private readonly userContextService: UserContextService) { }

  ngOnInit(): void {
    this.idusuario=this.storageService.getItemDecrypt('idUsuario');
    this.usuario=this.storageService.getItemDecrypt('usuario');
    this.instanciarFormulario();
  }

  instanciarFormulario() {
    this.formulario = this.fb.group({
      idusuario:[this.idusuario,{
        validators: [Validators.required]
      }],
      login:[this.usuario,{
        validators: [Validators.required]
      }],
      claveAnterior:['',{
        validators: [Validators.required]
      }],
      claveNueva:['',{
        validators: [Validators.required , Validators.minLength(8)]
      }],
      claveNuevaValida:['',{
        validators: [Validators.required, Validators.minLength(8)]
      }],
    });
  }

  cambiarClave(){
    let claveNueva=this.formulario.value.claveNueva;
    let claveNuevaValida=this.formulario.value.claveNuevaValida;

    if(claveNueva != claveNuevaValida)
    {
      swal.fire("Cambio de clave", "Las claves deben coincidir", 'warning');
      return
    }
    
    //this.modeloGrabar=this.formulario.value;
    this.modeloGrabar.idUsuario = this.idusuario;
    this.modeloGrabar.login = this.formulario.value.login;
    this.modeloGrabar.claveAnterior = btoa(this.formulario.value.claveAnterior);
    this.modeloGrabar.claveNueva = btoa(this.formulario.value.claveNueva);
    

      console.log(this.modeloGrabar);
      this.subscription = new Subscription();
      this.subscription = this.loginService.cambiaClave(this.modeloGrabar)
      
      .subscribe((mensaje : any) =>  {
        this.globalConstants.Mensaje=mensaje;
          if (this.globalConstants.Mensaje?.errorCodigo == 'OK'){
            swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail , 'success');
            //this.userContextService.logout();
            this.router.navigate(['/main/principal']);
          }
          else{
            swal.fire(this.globalConstants.msgErrorSummary, this.globalConstants.Mensaje?.errorMensaje , 'warning');        
          }
      },
      (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, 'error' ,'error');
    });
  }

  cancelar(){
    this.router.navigate(['/main/principal']);
  }

}
