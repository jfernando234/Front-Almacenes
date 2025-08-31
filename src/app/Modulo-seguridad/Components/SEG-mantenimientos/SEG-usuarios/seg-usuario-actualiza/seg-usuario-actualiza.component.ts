import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { agregaUsuarioPerfilDTO, eliminaUsuarioPerfilDTO, grabaUsuarioDTO, listaPerfilDTO, listaUsuarioDTO, listaUsuarioPerfilDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import swal from'sweetalert2';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';

@Component({
  selector: 'app-seg-usuario-actualiza',
  templateUrl: './seg-usuario-actualiza.component.html',
  styleUrls: ['./seg-usuario-actualiza.component.css']
})
export class SegUsuarioActualizaComponent implements OnInit,OnDestroy {
  form! : FormGroup;
  globalConstants: GlobalsConstants = new GlobalsConstants();
  listaPerfil!:listaPerfilDTO[];
  listaPerfil_new:listaUsuarioPerfilDTO[]=[];
  modeloUsuario: listaUsuarioDTO[]=[];
  modeloGrabaPeril!: agregaUsuarioPerfilDTO;
  modeloEliminaPeril!: eliminaUsuarioPerfilDTO;
  idUsuario: number=0;
  subscription!: Subscription;
  modeloGrabar: grabaUsuarioDTO = new grabaUsuarioDTO();
  
  constructor(private router: Router, private fb:FormBuilder,
    private readonly route: ActivatedRoute,
    private seguridadService: SegMantenimientosService,
    private storageService: StorageService) { }


  ngOnInit(): void {
    this.instanciaForm();

    this.route.params.subscribe((params: Params) => {
      this.idUsuario = params.idUsuario;
      this.listaUsuarioID();      
    });
  }
  
  listaUsuarioID(){
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getUsuarioID(this.idUsuario)
    .subscribe((data :any) => {
      this.form.patchValue(data);
      //console.log(data);
      this.listaPerfil_new=data.listaUsuarioPerfil;
      this.listarPerfil();
    },
    (error) => {
    });
    
  }
  listarPerfil(){
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getPerfil()
    .subscribe((resp: listaPerfilDTO[]) => {
      if (resp) {
          this.listaPerfil = resp;        
          if (this.listaPerfil_new) {        
            let i = this.listaPerfil_new.length-1;
            do {
              const elementIndex = this.listaPerfil.findIndex((obj => obj.idPerfil == this.listaPerfil_new[i].idPerfil));
              if (elementIndex>=0){
                this.listaPerfil.splice(elementIndex,1);
              }
                i--;
            } while (i >= 0);
          }

        }
      },
      (error) => console.error(error));
  };

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
  seleccionaPerfil(item: listaPerfilDTO,index: number){
    this.listaPerfil_new.push(item);
    this.listaPerfil.splice(index,1);
    
    this.modeloGrabaPeril = new agregaUsuarioPerfilDTO();
    this.modeloGrabaPeril.idUsuario=this.idUsuario;
    this.modeloGrabaPeril.idPerfil=item.idPerfil;
  
    this.subscription = new Subscription();
      this.subscription = this.seguridadService.crearUsuarioPerfil(this.modeloGrabaPeril)
      .subscribe((mensaje : any) =>  {
      this.globalConstants.Mensaje=mensaje;
       },
      (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, error.error.errorMensaje ,'error');
    });

  }
  deseleccionaPerfil(item: listaUsuarioPerfilDTO,index: number){
    this.modeloEliminaPeril = new eliminaUsuarioPerfilDTO();
    this.modeloEliminaPeril.id=item.idUsuarioPerfil;
    this.subscription = new Subscription();
      this.subscription = this.seguridadService.eliminaUsuarioPerfil(this.modeloEliminaPeril)
      .subscribe((mensaje : any) =>  {
      this.globalConstants.Mensaje=mensaje;
        this.listaPerfil.push(item);
        this.listaPerfil_new.splice(index,1);
       },
      (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, error.error.errorMensaje ,'error');
    });

  }
  seleccionaTodo(){
    this.listaPerfil_new.push(...this.listaPerfil);
    this.listaPerfil=[]
  }
  deseleccionaTodo(){
    this.listaPerfil.push(...this.listaPerfil_new);
    this.listaPerfil_new=[]
  }
  cancelar(){
    this.router.navigate(['/main/seg-usuario']);
  }
  grabar(){
    if(!this.form.valid)
    {return;}
      this.modeloGrabar=this.form.value;
      this.modeloGrabar.idUsuario=this.idUsuario;  
      this.modeloGrabar.listaPerfil=this.listaPerfil_new;
      this.modeloGrabar.idUsuarioLogin=this.storageService.getItemDecrypt('idUsuario');
      console.log(this.modeloGrabar);
      this.subscription = new Subscription();
      this.subscription = this.seguridadService.actualziaUsuario(this.modeloGrabar)
      .subscribe((mensaje : any) =>  {
      console.log(mensaje);
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
