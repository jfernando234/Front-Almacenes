import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { grabaUsuarioDTO, listaPerfilDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { SegPersonaDialogComponent } from '../seg-persona-dialog/seg-persona-dialog.component';
import swal from'sweetalert2';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';

@Component({
  selector: 'app-seg-usuario-nuevo',
  templateUrl: './seg-usuario-nuevo.component.html',
  styleUrls: ['./seg-usuario-nuevo.component.css']
})

export class SegUsuarioNuevoComponent implements OnInit,OnDestroy {
  form! : UntypedFormGroup;
  perfilControl: UntypedFormControl= new UntypedFormControl;
  listaPerfil!:listaPerfilDTO[];
  listaPerfil_new:listaPerfilDTO[]=[];
  modeloGrabar: grabaUsuarioDTO = new grabaUsuarioDTO();
  globalConstants: GlobalsConstants = new GlobalsConstants();
  
  constructor(private fb: UntypedFormBuilder,private router:Router,
  private seguridadService: SegMantenimientosService,
  private dialog: MatDialog,
  private storageService: StorageService) { }
  subscription!: Subscription;
  
  ngOnInit(): void {
    this.instanciaForm();
    this.listarPerfil();
  }
  
  instanciaForm(){
    this.form = this.fb.group({
      idPersona:[0,{
        validators: [Validators.required]
      }],
      primerApellido:['',{
        validators: [Validators.required]
      }],
      segundoApellido:['',{
        validators: [Validators.required]
      }],
      nombres:['',{
        validators: [Validators.required]
      }],
      numeroDocumento:['',{
        validators: [Validators.required]
      }],
      correoInstitucional:['',{
        validators: [Validators.required,Validators.email]
      }],
    })
  }
  listarPerfil(){
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getPerfil()
    .subscribe((resp: listaPerfilDTO[]) => {
      if (resp) {
          this.listaPerfil = resp;
        }
      },
      (error) => console.error(error));
  };
  
  
  cancelar(){
    this.router.navigate(['/main/seg-usuario']);
  }
  
  buscaPersona(){
    const dialogRef = this.dialog.open(SegPersonaDialogComponent, {
      width: '60%',
      disableClose:true,
    });
    
    dialogRef.afterClosed().subscribe(data => {
      //console.log(result);
      this.form.patchValue(data);
      this.form.controls['correoInstitucional'].setValue(data.correo);
    });    
  }

  seleccionaPerfil(item: listaPerfilDTO,index: number){
    this.listaPerfil_new.push(item);
    this.listaPerfil.splice(index,1);
  }
  deseleccionaPerfil(item: listaPerfilDTO,index: number){
    this.listaPerfil.push(item);
    this.listaPerfil_new.splice(index,1);
  }
  seleccionaTodo(){
    this.listaPerfil_new.push(...this.listaPerfil);
    this.listaPerfil=[]
  }
  deseleccionaTodo(){
    this.listaPerfil.push(...this.listaPerfil_new);
    this.listaPerfil_new=[]
  }
  grabar(){

      if (this.listaPerfil_new.length < 1){
        swal.fire(this.globalConstants.msgErrorSummary, 'Debe ingresar un perfil de usuario' ,'warning');
        return
      }
      this.modeloGrabar=this.form.value;
      this.modeloGrabar.listaPerfil=this.listaPerfil_new;
      this.modeloGrabar.idUsuarioLogin=this.storageService.getItemDecrypt('idUsuario');
      this.subscription = new Subscription();
      this.subscription = this.seguridadService.crearUsuario(this.modeloGrabar)
      .subscribe((mensaje : any) =>  {
      this.globalConstants.Mensaje=mensaje;
      if (this.globalConstants.Mensaje?.errorCodigo == 'OK'){
        swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail , 'success');
        this.router.navigate(['main/seg-usuario']);
      }
      else{
        swal.fire(this.globalConstants.msgErrorSummary, this.globalConstants.Mensaje?.errorMensaje , 'warning');        
      }
       },
      (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, error.error.errorMensaje ,'error');
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
