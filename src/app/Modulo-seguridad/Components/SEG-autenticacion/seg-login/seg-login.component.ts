
import { Component, ElementRef, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { accesoDirecto, listaAccesoDTO, listaAccionDTO, listarModuloDTO, loginModel, loginPermisoDTO } from 'src/app/Modulo-seguridad/Models/seg-login.model';
import { SegLoginService } from 'src/app/Modulo-seguridad/Services/seg-login.service';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';
import { UserContextService } from 'src/app/Modulo-seguridad/Services/user-context.service';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import swal from'sweetalert2';
import { SEGCargaEsperaComponent } from '../../seg-carga-espera/seg-carga-espera.component';

@Component({
  selector: 'app-seg-login',
  templateUrl: './seg-login.component.html',
  styleUrls: ['./seg-login.component.css']
})
export class SegLoginComponent implements OnInit {
  globalConstants: GlobalsConstants = new GlobalsConstants();
  subscription!: Subscription;
  islogin:boolean = false;
  modeloLogin: loginModel = new loginModel();
  modeloLoginPermiso: loginPermisoDTO = new loginPermisoDTO();
  
  modeloModulo:listarModuloDTO= new listarModuloDTO();
  modeloModuloHijo:listarModuloDTO= new listarModuloDTO();
  modeloModuloList:listarModuloDTO[]=[];
  modeloModuloHijoList:listarModuloDTO[]=[];
  modeloModuloNew:listarModuloDTO[]=[];
  accionListaDTO:listaAccesoDTO[]=[];
  accesoDirecto:accesoDirecto[]=[]
  accesoDirectoSel:accesoDirecto=new accesoDirecto();
  
  constructor(private readonly router: Router,
              private readonly fb: UntypedFormBuilder,
              private readonly loginService: SegLoginService,
              private readonly storageService: StorageService,
              private readonly userContextService: UserContextService,
              private el:ElementRef,
              private dialog: MatDialog) { }
  formularioLogin!: UntypedFormGroup;

  ngOnInit(): void {
    this.instanciarFormulario();
  }
  instanciarFormulario() {
    this.formularioLogin = this.fb.group({
      login: new UntypedFormControl('', [Validators.minLength(4),Validators.required ]),
      clave: new UntypedFormControl('', [Validators.minLength(6),Validators.required])
    });
  }
  restauraClave(){
    this.router.navigate(['/restaura-clave']);
    //restaura-clave
  }
  registrarse(){
    this.router.navigate(['/registrarse']);
    //restaura-clave
  }
  login(){
    
    if (this.formularioLogin.value.login.length<4){
      swal.fire("Login", "Ingrese usuario", 'warning');
      return; 
    }

    if (this.formularioLogin.value.clave.length<6){
      //this.formularioLogin.value.clave.focus();
      swal.fire("Login", "Ingrese clave", 'warning');
      return; 
    }

    this.modeloLogin.login = this.formularioLogin.value.login;
    this.modeloLogin.clave = btoa(this.formularioLogin.value.clave);

    const dialogRef = this.dialog.open(SEGCargaEsperaComponent, {
      disableClose:true,
      panelClass:'fondo-carga',
    });
    
    this.subscription = new Subscription();
    this.subscription = this.loginService.login(this.modeloLogin)
    .subscribe((mensaje : any) =>  {
      //console.log(mensaje);
      this.globalConstants.Mensaje=mensaje;
        if (this.globalConstants.Mensaje?.errorCodigo == 'OK'){
          this.modeloLoginPermiso=this.globalConstants.Mensaje?.value;
          this.onObtienePermisosPorUsuario(this.modeloLoginPermiso.idUsuario);
        }
        else{
          swal.fire(this.globalConstants.msgErrorSummary, this.globalConstants.Mensaje?.errorMensaje , 'error');        
        }
        dialogRef.close();
    },
    (error) => {
    swal.fire(this.globalConstants.msgErrorSummary, 'error' ,'error');
    dialogRef.close();
  });
  }
  onObtienePermisosPorUsuario(idUsuario:number){
    this.subscription = new Subscription();
    this.subscription = this.loginService.obtienePermisosPorUsuario(idUsuario)
      .subscribe((res: any) => {  
        this.accionListaDTO=[]
        res.forEach((value: any)=>{
          let opciones=new listaAccionDTO()          
          opciones=value.moduloAcceso;          
          if (opciones){
            this.accionListaDTO.push(opciones);
          }          
        })
        this.storageService.setItem('opciones', this.accionListaDTO);
        this.setArmaMenuDimamico(res);
      },
        (error) => {
          swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion, 'error');
        }
      );
  }
   
  setArmaMenuDimamico(modeloModuloList:listarModuloDTO[]) {
    //console.log(modeloModuloList);
    this.modeloModuloNew = [];

    this.modeloModulo = new listarModuloDTO();
    this.modeloModuloNew.push(this.modeloModulo);
    if (this.modeloModuloList) {
      let i = 0;
      do {
        if(modeloModuloList[i].idModuloPadre === 0 ){
          this.modeloModulo = new listarModuloDTO();
          this.modeloModulo.codigoAccesoDirecto=modeloModuloList[i].codigoAccesoDirecto;
          this.modeloModulo.esHijo=modeloModuloList[i].esHijo;
          this.modeloModulo.esVisible=modeloModuloList[i].esVisible;
          this.modeloModulo.icono=modeloModuloList[i].icono;
          this.modeloModulo.idModulo=modeloModuloList[i].idModulo;
          this.modeloModulo.idModuloPadre=modeloModuloList[i].idModuloPadre;
          this.modeloModulo.nivel=modeloModuloList[i].nivel;
          this.modeloModulo.nombreModulo=modeloModuloList[i].nombreModulo;
          this.modeloModulo.nombreObjeto=modeloModuloList[i].nombreObjeto;
          this.modeloModulo.numeroOrden=modeloModuloList[i].numeroOrden;
          this.modeloModulo.url=modeloModuloList[i].url;
          
          if(modeloModuloList[i].url !='')
          {
            this.accesoDirectoSel= new accesoDirecto();
            this.accesoDirectoSel.idModulo=modeloModuloList[i].idModulo;
            this.accesoDirectoSel.codigoAccesoDirecto=modeloModuloList[i].codigoAccesoDirecto;
            this.accesoDirectoSel.url=modeloModuloList[i].url;
            this.accesoDirecto.push(this.accesoDirectoSel)
          }
          //console.log(this.modeloModulo);

          if(modeloModuloList[i].esHijo == true){
            this.modeloModulo.listarModuloDTO = [];
            const modulo_padre=modeloModuloList[i].idModulo;
            this.setArmaMenuDimamicoHijo(this.modeloModulo,modulo_padre!,modeloModuloList);
          }
            this.modeloModuloNew.push(this.modeloModulo);
            //console.log(this.accesoDirecto);
            this.storageService.setItem('menu', this.modeloModuloNew);
            this.storageService.setItem('accesoDirecto', this.accesoDirecto);
            this.onEncriptaData(this.modeloLoginPermiso);
          }
          i++;
      } while (i < modeloModuloList.length);
    }
    //this.storageService.setItem('menu',this.modeloModuloNew);
  }
  setArmaMenuDimamicoHijo(modeloPadre:listarModuloDTO,modulo_padre: number,modeloModuloList:listarModuloDTO[]){
    if (modeloModuloList) {
      let i = 0;
      do {
        let modelo = new listarModuloDTO();
        if(modeloModuloList[i].idModuloPadre === modulo_padre){
          
          if(modeloModuloList[i].url !='')
          {
            this.accesoDirectoSel= new accesoDirecto();
            this.accesoDirectoSel.idModulo=modeloModuloList[i].idModulo;
            this.accesoDirectoSel.codigoAccesoDirecto=modeloModuloList[i].codigoAccesoDirecto;
            this.accesoDirectoSel.url=modeloModuloList[i].url;
            this.accesoDirecto.push(this.accesoDirectoSel)
          }

          modelo= modeloModuloList[i];
          if(modeloModuloList[i].esHijo = true){
            modelo.listarModuloDTO = [];
            let modeloChildren = new listarModuloDTO();
            this.setArmaMenuDimamicoHijo(modelo,modeloModuloList[i].idModulo!,modeloModuloList);
          }
            modeloPadre.listarModuloDTO?.push(modelo);
          //}
        }
          i++;
      } while (i < modeloModuloList.length);
    }
  }

  onEncriptaData(res: any) {
    this.storageService.setItem('perfil', res.listaPerfilModuloDTO);    
    this.storageService.setItemEncrypt('idUsuario', res.idUsuario);
    this.storageService.setItemEncrypt('correoInstitucional', res.correoInstitucional);
    this.storageService.setItemEncrypt('nombre', res.apellidosyNombres);
    this.storageService.setItemEncrypt('usuario', res.login);
    this.storageService.setItemEncrypt('nuevaClave', res.nuevaClave);
    this.storageService.setItemEncrypt('idClientePerfil', res.idClientePerfil);
    this.storageService.setItemEncrypt('clientePerfil', res.clientePerfil);
    this.storageService.setItemEncrypt('idPerfil', res.idPerfil);
    this.storageService.setItemEncrypt('codigo_merchant', res.codigo_merchant);
    this.userContextService.setUser(res.login);
    if(res.nuevaClave == true){
      
      this.router.navigate(['/cambia-clavenueva']);
    }
    else 
    {      
      this.router.navigate(['/main/cl-dashboard']);
    }    
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

