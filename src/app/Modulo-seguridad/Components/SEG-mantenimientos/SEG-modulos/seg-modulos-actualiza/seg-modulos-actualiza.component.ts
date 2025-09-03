import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { grabarModuloDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import { SEGModulosDialogComponent } from '../seg-modulos-dialog/seg-modulos-dialog.component';
import swal from'sweetalert2';
import { AccesoOpcionesService } from 'src/assets/Model/acceso-opciones.service';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';
import { ButtonAcces } from 'src/assets/Model/acceso-button.model';

@Component({
  selector: 'app-seg-modulos-actualiza',
  templateUrl: './seg-modulos-actualiza.component.html',
  styleUrls: ['./seg-modulos-actualiza.component.css']
})
export class SegModulosActualizaComponent implements OnInit {
  
  idModulo:number=-1;
  idModuloPadre:number=0;
  buttonAcces: ButtonAcces = new ButtonAcces();  
  form! : UntypedFormGroup;
  perfilControl: UntypedFormControl= new UntypedFormControl;  
  modeloGrabar: grabarModuloDTO = new grabarModuloDTO();
  globalConstants: GlobalsConstants = new GlobalsConstants();
  
  constructor(
    private fb: UntypedFormBuilder,private router:Router,
    private readonly route: ActivatedRoute,
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
    this.route.params.subscribe((params: Params) => {
      this.idModulo=params.idModulo;      
    });
    this.listar();
  }
  
  instanciaForm(){    
    this.form = this.fb.group({
      idModulo:0,      
      nombreModuloPadre:[''],
      nivel:['',{validators: [Validators.required]}],
      esHijo:false,
      nombreModulo:['',{validators: [Validators.required]}],      
      codigoAccesoDirecto:'',
      icono:['',{validators: [Validators.required]}],
      url:'',
      numeroOrden:0,
    })
  }

  listar(){    
    this.subscription=new Subscription();
    this.subscription=this.moduloService.getModuloID(this.idModulo)
    .subscribe((data:any)=> {
      this.form.patchValue(data);
      this.idModuloPadre=data.idModuloPadre;
    },
    (error)=> {      
    }
    );

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
    this.subscription = this.moduloService.actualizarModulo(this.modeloGrabar)    
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
    
    if (this.idModulo==data.idModulo) {        
      return;
    }
    
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
