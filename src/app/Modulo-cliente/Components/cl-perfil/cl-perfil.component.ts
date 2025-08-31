import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';
import { ButtonAcces } from 'src/assets/Model/acceso-button.model';
import { AccesoOpcionesService } from 'src/assets/Model/acceso-opciones.service';
import { ClientePerfilDTO } from '../../Models/cl-perfil.model';
import { ClPerfilService } from '../../Services/cl-perfil.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { grabaPersonaDTO, listaPersonaDTO, modificaPersonaDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import swal from'sweetalert2';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';

interface tipoGenero{
  idTipoGenero:boolean;
  desTipoGenero:string;
}

interface tipoDocumento{
  idTipoDocumento:number;
  tipoDocumento:string;
  caracteres:number;
}

@Component({
  selector: 'app-cl-perfil',
  templateUrl: './cl-perfil.component.html',
  styleUrls: ['./cl-perfil.component.css']
})
export class ClPerfilComponent implements OnInit {
  form! : FormGroup;  
  buttonAcces: ButtonAcces = new ButtonAcces();
  subscription!: Subscription;
  listPerfil: ClientePerfilDTO[]=[];
  nombre_perfil: string='';
  listaPersona: listaPersonaDTO = new listaPersonaDTO();  
  idUsuario: number=0
  selectTipoDocumento:any;
  cantidad_caracter:number=0;
  selectedTD:number=0;
  selectedGenero:boolean=false;
  accion:number=0;
  modeloGrabar: grabaPersonaDTO = new grabaPersonaDTO();
  modeloGrabarAct: modificaPersonaDTO = new modificaPersonaDTO();
  globalConstants: GlobalsConstants = new GlobalsConstants();
  selectTipoGenero:any;
  idPersona:number=0
  persona_natural_b:boolean=true;

  constructor(
    private fb: FormBuilder,
    private clperfilService: ClPerfilService,
    private router: Router,
    private accesoOpcionesService: AccesoOpcionesService,
    private storageService: StorageService,
    private seguridadService: SegMantenimientosService,
    ) { }
  
    tipo_Documento:tipoDocumento[]=[
      {idTipoDocumento:1,tipoDocumento:'DNI',caracteres:8},
      {idTipoDocumento:2,tipoDocumento:'RUC',caracteres:11}
    ]
   
    tipoGenero:tipoGenero[]=[
      {idTipoGenero:true,desTipoGenero:'MASCULINO'},
      {idTipoGenero:false,desTipoGenero:'FEMENINO'}
    ]
  
  ngOnInit(): void {
    //this.nombre_perfil=this.storageService.getItemDecrypt('clientePerfil');
    this.selectedTD=2;
    this.persona_natural_b=false;
    this.accion=1;
    this.selTipoDocumento();
    this.instanciaFormJuridico();
    let idModulo: number =parseInt(this.storageService.getItemDecrypt('idModulo'));
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones(idModulo);
    this.idUsuario = this.storageService.getItemDecrypt('idUsuario');    
    this.listaClientePerfil()
  }

  instanciaForm(){
    this.form = this.fb.group({
      primerApellido:['',{
        validators: [Validators.required]
      }],
      segundoApellido:['',{
        validators: [Validators.required]
      }],
      nombres:['',{
        validators: [Validators.required]
      }],
      tipoDocumento:['',{
        validators: [Validators.required]
      }],
      numeroDocumento:['',{
        validators: [Validators.required,
                     Validators.minLength(this.cantidad_caracter),
                     Validators.maxLength(this.cantidad_caracter)]
      }],
      correo:['',{
        validators: [Validators.required,Validators.email]
      }],
      fechaNacimiento:['',{
        validators: [Validators.required]
      }],
      genero:['',{
        validators: [Validators.required]
      }],
      razon:['',],
      contacto:['',],
      celular:['',],
      
    })
  }

  instanciaFormJuridico(){
    
    this.form = this.fb.group({
      primerApellido:['',],
      segundoApellido:['',],
      nombres:[''],
      razon:['',{
        validators: [Validators.required]
      }],
      tipoDocumento:['',{
        validators: [Validators.required]
      }],
      numeroDocumento:['',{
        validators: [Validators.required,
                     Validators.minLength(this.cantidad_caracter),
                     Validators.maxLength(this.cantidad_caracter)]
      }],
      correo:['',{
        validators: [Validators.required,Validators.email]
      }],
      fechaNacimiento:['',],
      genero:['',],
      contacto:['',{
        validators: [Validators.required]
      }],
      celular:['',{
        validators: [Validators.required,Validators.pattern("[0-9 ]{11}")]
      }],
    })
  }

  listaClientePerfil(){
    this.subscription = new Subscription();
    this.subscription = this.clperfilService.getClientePerfilAll(this.idUsuario)
    .subscribe((resp: ClientePerfilDTO[]) => {
      if (resp) {
          this.listPerfil = resp;
        }
      },
      (error) => console.error(error));

  }

  selectPerfil(item:ClientePerfilDTO){
    this.nombre_perfil = item.perfil!;
    this.idPersona=item.idPersona!
    this.listaPersonaID(this.idPersona);
    this.accion=2;
  }

  listaPersonaID(idPersona: number){
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getPersonaID(idPersona)
    .subscribe((data :any) => {
      this.listaPersona=data;            
      this.selectedTD=this.listaPersona.idTipoDocumento!;
      this.selectedGenero=this.listaPersona.sexo!;      
      this.selTipoDocumento();
      this.form.patchValue(data);
      var fechaNac=new Date(this.listaPersona.fechaNacimiento!);
      this.form.controls['fechaNacimiento'].setValue(fechaNac.toLocaleDateString('en-CA'));      
    },
    (error) => {});
  }

  selTipoDocumento(){
    
    this.selectTipoDocumento=this.tipo_Documento.filter(x => x.idTipoDocumento == this.selectedTD)
    this.cantidad_caracter=this.selectTipoDocumento[0].caracteres;
    if (this.selectedTD==1){
      this.instanciaForm();
      this.persona_natural_b = true;
    }
    if (this.selectedTD==2){
      this.instanciaFormJuridico(); 
      this.persona_natural_b = false; 
    }
    this.form.controls['numeroDocumento'].setValidators([
      Validators.minLength(this.cantidad_caracter),
      Validators.maxLength(this.cantidad_caracter)]);      
  }

  nuevoPerfil(){
    this.accion=1;
    this.instanciaForm();
  }
  grabaPerfil(){
    if (this.accion == 1)
    {
      this.grabaNuevoPerfil();
    }
    if (this.accion == 2)
    {
      this.actualizaPerfil();
    }
  }
  grabaNuevoPerfil(){    
    this.selectTipoDocumento = [];
    this.selectTipoDocumento=this.form.controls['tipoDocumento'].value;

    this.selectTipoGenero = [];
    this.selectTipoGenero=this.form.controls['genero'].value;
    this.modeloGrabar= this.form.value;
    this.modeloGrabar.idTipoDocumento=this.selectedTD
    this.modeloGrabar.sexo=this.selectTipoGenero.idTipoGenero
   // console.log(this.modeloGrabar);
    //console.log(this.form.valid,'valid');
    if (this.selectedTD==2){
      this.modeloGrabar.primerApellido="";
      this.modeloGrabar.segundoApellido="";
      this.modeloGrabar.sexo=true;
      this.modeloGrabar.fechaNacimiento= new Date();
      this.modeloGrabar.nombres=this.form.controls['razon'].value;
    }
    this.subscription = new Subscription();
      this.subscription = this.seguridadService.crearPerfilCli(this.modeloGrabar,this.idUsuario)
      .subscribe((mensaje : any) =>  {
      this.globalConstants.Mensaje=mensaje;
      if (this.globalConstants.Mensaje?.errorCodigo == 'OK'){
        swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail , 'success');
        //this.router.navigate(['main/cl-perfil']);
        window.location.reload();
      }
      else{
        swal.fire(this.globalConstants.msgErrorSummary, this.globalConstants.Mensaje?.errorMensaje , 'warning');        
      }
       },
      (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, error.error.errorMensaje ,'error');
    });
  }
  actualizaPerfil(){
    this.modeloGrabarAct= this.form.value;
    this.modeloGrabarAct.idPersona=this.idPersona;
    this.modeloGrabarAct.idTipoDocumento=this.selectedTD
    this.modeloGrabarAct.sexo=this.selectedGenero
    if (this.selectedTD==2){
      this.modeloGrabar.primerApellido="";
      this.modeloGrabar.segundoApellido="";
      this.modeloGrabar.sexo=true;
      this.modeloGrabar.fechaNacimiento= new Date();
      this.modeloGrabar.nombres=this.form.controls['razon'].value;
    }
    //return
    this.subscription = new Subscription();
      this.subscription = this.seguridadService.actualizaPersona(this.modeloGrabarAct)
      .subscribe((mensaje : any) =>  {
      this.globalConstants.Mensaje=mensaje;
      if (this.globalConstants.Mensaje?.errorCodigo == 'OK'){
        swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail , 'success');
        //this.router.navigate(['main/seg-persona']);
        window.location.reload();
      }
      else{
        swal.fire(this.globalConstants.msgErrorSummary, this.globalConstants.Mensaje?.errorMensaje , 'warning');        
      }
       },
      (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, error.error.errorMensaje ,'error');
    });
  }

}
