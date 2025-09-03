import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { grabarModuloDTO} from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import swal from'sweetalert2';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import { SEGModulosDialogComponent } from '../seg-modulos-dialog/seg-modulos-dialog.component';
import { ButtonAcces } from 'src/assets/Model/acceso-button.model';
import { AccesoOpcionesService } from 'src/assets/Model/acceso-opciones.service';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';


@Component({
  selector: 'app-seg-modulos-nuevo',
  templateUrl: './seg-modulos-nuevo.component.html',
  styleUrls: ['./seg-modulos-nuevo.component.css']
})
export class SegModulosNuevoComponent implements OnInit {


  idModuloPadre:number=0;
  buttonAcces: ButtonAcces = new ButtonAcces();
  form! : UntypedFormGroup;
  perfilControl: UntypedFormControl= new UntypedFormControl;  
  modeloGrabar: grabarModuloDTO = new grabarModuloDTO();
  globalConstants: GlobalsConstants = new GlobalsConstants();

  constructor(
    private fb: UntypedFormBuilder,private router:Router,
    private moduloService: SegMantenimientosService,
    private dialog: MatDialog,
    private accesoOpcionesService: AccesoOpcionesService,
    private storageService: StorageService
    ) { }
    subscription!: Subscription;

  ngOnInit(): void {

    let idModulo: number =parseInt(this.storageService.getItemDecrypt('idModulo'));
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones(idModulo);

    this.instanciaForm();    
  }

  instanciaForm(){
    this.form = this.fb.group({      
      nombreModuloPadre:'',
      nivel:['',{
        validators: [Validators.required]
      }],
      esHijo:false,
      nombreModulo:['',{
        validators: [Validators.required]
      }],      
      codigoAccesoDirecto:'',
      icono:['',{
        validators: [Validators.required]
      }],
      url:'',
      numeroOrden:0,
    })
  }

  cancelar(){
    this.router.navigate(['/main/seg-modulo']);
  }

  grabar(){

    /*if (this.form.get('nombre').length < 1){
      swal.fire(this.globalConstants.msgErrorSummary, 'Debe ingresar un perfil de usuario' ,'warning');
      return
    }*/

    this.modeloGrabar=this.form.value;    
    this.modeloGrabar.idModuloPadre=this.idModuloPadre;
    
    this.subscription = new Subscription();
    this.subscription = this.moduloService.crearModulo(this.modeloGrabar)
    
    .subscribe((mensaje : any) =>  {
    this.globalConstants.Mensaje=mensaje;
    if (this.globalConstants.Mensaje?.errorCodigo == 'OK'){
      swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail , 'success');
      this.router.navigate(['main/seg-modulo']);
    }
    else{
      swal.fire(this.globalConstants.msgErrorSummary, this.globalConstants.Mensaje?.errorMensaje , 'warning');        
    }
     },
    (error) => {
    swal.fire(this.globalConstants.msgErrorSummary, error.error.errorMensaje ,'error');
  });
}

buscarModulo(){
  const dialogRef = this.dialog.open(SEGModulosDialogComponent, {    
    width: '50%',
    disableClose:true,
    panelClass: 'dialog-container'
  });  
  
  dialogRef.afterClosed().subscribe(data => {
        
    this.idModuloPadre= data.idModulo; 
    this.form.controls['nombreModuloPadre'].setValue(data.dependencia);     
    
  });    
}

ngOnDestroy() {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}

}
