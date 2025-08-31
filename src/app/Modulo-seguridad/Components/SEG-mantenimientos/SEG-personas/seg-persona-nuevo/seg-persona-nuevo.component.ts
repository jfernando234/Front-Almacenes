import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { grabaPersonaDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import swal from'sweetalert2';

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
  selector: 'app-seg-persona-nuevo',
  templateUrl: './seg-persona-nuevo.component.html',
  styleUrls: ['./seg-persona-nuevo.component.css']
})

export class SegPersonaNuevoComponent implements OnInit {
  
  constructor(private fb: FormBuilder,
              private router:Router,
              private seguridadService: SegMantenimientosService) { }
  
  tipo_Documento:tipoDocumento[]=[
    {idTipoDocumento:1,tipoDocumento:'DNI',caracteres:8},
    {idTipoDocumento:2,tipoDocumento:'RUC',caracteres:11}
  ]
  tipoGenero:tipoGenero[]=[
    {idTipoGenero:true,desTipoGenero:'MASCULINO'},
    {idTipoGenero:false,desTipoGenero:'FEMENINO'}
  ]
  form! : FormGroup;
  globalConstants: GlobalsConstants = new GlobalsConstants();
  subscription!: Subscription;
  modeloGrabar: grabaPersonaDTO = new grabaPersonaDTO();
  cantidad_caracter:number=0;
  selectTipoDocumento:any;
  selectTipoGenero:any;
  control_tipoDocumento: FormControl= new FormControl;

  ngOnInit(): void {
    this.instanciaForm();
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
      
    })
  }
  obtenerErrorCampo(nombreCampo:string){
    var campo = this.form.get(nombreCampo);
    if (campo?.hasError('required')){
      return 'El campo es requerido';
    }

    if (campo?.hasError('minlength')){
      return 'Debe ingresar ' + this.cantidad_caracter + ' carácteres';
    }

    if (campo?.hasError('maxlength')){
      return 'Debe ingresar ' + this.cantidad_caracter + ' carácteres';
    }

    return '';
  }
  selTipoDocumento(){
    this.selectTipoDocumento = [];
    this.selectTipoDocumento=this.form.controls['tipoDocumento'].value;
    this.cantidad_caracter=this.selectTipoDocumento.caracteres;
    this.form.controls['numeroDocumento'].setValidators([
      Validators.minLength(this.cantidad_caracter),
      Validators.maxLength(this.cantidad_caracter)]);
  }
  
  grabar(){
    this.selectTipoDocumento = [];
    this.selectTipoDocumento=this.form.controls['tipoDocumento'].value;

    this.selectTipoGenero = [];
    this.selectTipoGenero=this.form.controls['genero'].value;

    this.modeloGrabar= this.form.value;
    this.modeloGrabar.idTipoDocumento=this.selectTipoDocumento.idTipoDocumento
    this.modeloGrabar.sexo=this.selectTipoGenero.idTipoGenero
    //console.log(this.modeloGrabar);
  
    this.subscription = new Subscription();
      this.subscription = this.seguridadService.crearPersona(this.modeloGrabar)
      .subscribe((mensaje : any) =>  {
      this.globalConstants.Mensaje=mensaje;
      if (this.globalConstants.Mensaje?.errorCodigo == 'OK'){
        swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail , 'success');
        this.router.navigate(['main/seg-persona']);
      }
      else{
        swal.fire(this.globalConstants.msgErrorSummary, this.globalConstants.Mensaje?.errorMensaje , 'warning');        
      }
       },
      (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, error.error.errorMensaje ,'error');
    });

  }
  cancelar(){
    this.router.navigate(['/main/seg-persona']);
  }

}
