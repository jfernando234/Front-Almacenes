import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { listaPersonaDTO, modificaPersonaDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
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
  selector: 'app-seg-persona-actualiza',
  templateUrl: './seg-persona-actualiza.component.html',
  styleUrls: ['./seg-persona-actualiza.component.css']
})
export class SegPersonaActualizaComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private readonly route: ActivatedRoute,
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
    modeloGrabar: modificaPersonaDTO = new modificaPersonaDTO();
    cantidad_caracter:number=0;
    selectTipoDocumento:any;
    selectTipoGenero:any;
    control_tipoDocumento: FormControl= new FormControl;
    idPersona:number=0;
    listaPersona: listaPersonaDTO = new listaPersonaDTO();
    selectedTD:number=0;
    selectedGenero:boolean=false;
  
    ngOnInit(): void {
      this.instanciaForm();
      this.route.params.subscribe((params: Params) => {
      this.idPersona = params.idPersona;
      this.listaPersonaID();
    });
  }

  listaPersonaID(){
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getPersonaID(this.idPersona)
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
      /*tipo_Documento:['',{
        validators: [Validators.required]
      }],*/
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
      /*tipoGenero:['',{
        validators: [Validators.required]
      }],*/
      
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
    
    this.selectTipoDocumento=this.tipo_Documento.filter(x => x.idTipoDocumento == this.selectedTD)
    this.cantidad_caracter=this.selectTipoDocumento[0].caracteres;
    //console.log(this.cantidad_caracter)
    this.form.controls['numeroDocumento'].setValidators([
      Validators.minLength(this.cantidad_caracter),
      Validators.maxLength(this.cantidad_caracter)]);      
  }

  grabar(){
    /*this.selectTipoDocumento = [];
    this.selectTipoDocumento=this.selectedTD;

    this.selectTipoGenero = [];
    this.selectTipoGenero=this.selectedGenero;*/
    //console.log(this.form.valid);
    if(!this.form.valid)
    {return;}
    this.modeloGrabar= this.form.value;
    this.modeloGrabar.idPersona=this.idPersona;
    this.modeloGrabar.idTipoDocumento=this.selectedTD
    this.modeloGrabar.sexo=this.selectedGenero
    //console.log(this.modeloGrabar);
    //return;
    this.subscription = new Subscription();
      this.subscription = this.seguridadService.actualizaPersona(this.modeloGrabar)
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
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
