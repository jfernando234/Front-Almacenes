import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { grabaPersonaDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import swal from'sweetalert2';
import { SEGCargaEsperaComponent } from '../../seg-carga-espera/seg-carga-espera.component';
import { SegCatalogoService } from 'src/app/Modulo-seguridad/Services/seg-catalogo.service';
import { dniDTO, rucDTO } from 'src/app/Modulo-seguridad/Models/seg-catalogo.model';

interface tipoGenero{
  idTipoGenero:number;
  desTipoGenero:string;
}

interface tipoDocumento{
  idTipoDocumento:number;
  tipoDocumento:string;
  caracteres:number;
}

@Component({
  selector: 'app-seg-registrarse',
  templateUrl: './seg-registrarse.component.html',
  styleUrls: ['./seg-registrarse.component.css']
})
export class SegRegistrarseComponent implements OnInit {
  listaDNI:dniDTO=new dniDTO();
  listaRUC:rucDTO=new rucDTO();
  esSoloLectura:boolean=false;
  persona_natural_b:boolean=false;
  selectedTD:number=2;

  constructor(private fb: FormBuilder,
  private router:Router,
  private seguridadService: SegMantenimientosService,
  private dialog: MatDialog,
  private catalogosService: SegCatalogoService,
  ) { }

  tipo_Documento:tipoDocumento[]=[
    {idTipoDocumento:1,tipoDocumento:'DNI',caracteres:8},
    {idTipoDocumento:2,tipoDocumento:'RUC',caracteres:11},
    {idTipoDocumento:3,tipoDocumento:'Carnet de Extranjería',caracteres:9},
    {idTipoDocumento:4,tipoDocumento:'Pasaporte',caracteres:9}
  ]
  
  tipoGenero:tipoGenero[]=[
    {idTipoGenero:0,desTipoGenero:'Mujer'},
    {idTipoGenero:1,desTipoGenero:'Hombre'},
  ]

  form! : FormGroup;
  globalConstants: GlobalsConstants = new GlobalsConstants();
  subscription!: Subscription;
  modeloGrabar: grabaPersonaDTO = new grabaPersonaDTO();
  cantidad_caracter:number=0;
  selectTipoDocumento:any;
  selectTipoGenero:any;
  control_tipoDocumento: FormControl= new FormControl;
  terminosAceptados?:boolean;

  ngOnInit(): void {
    this.selTipoDocumento();
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
      razon:[''],
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
      contacto:[''],
      // genero:['',{
      //   validators: [Validators.required]
      // }],
      login:['',{
        validators: [Validators.minLength(4),Validators.required]
      }],
      password:['',{
        validators: [Validators.minLength(6),Validators.required]
      }],
      password2:['',{
        validators: [Validators.minLength(6),Validators.required]
      }],
      celular:['',{
        validators: [Validators.required,Validators.pattern("[0-9 ]{9}")]
      }],
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
      numeroDocumento:['',{
        validators: [Validators.required,
                     Validators.minLength(this.cantidad_caracter),
                     Validators.maxLength(this.cantidad_caracter)]
      }],
      correo:['',{
        validators: [Validators.required,Validators.email]
      }],
      fechaNacimiento:[''],
      contacto:[''],
      celular:['',{
        validators: [Validators.required,Validators.pattern("[0-9 ]{9}")]
      }],
      login:['',{
        validators: [Validators.minLength(4),Validators.required]
      }],
      password:['',{
        validators: [Validators.minLength(6),Validators.required]
      }],
      password2:['',{
        validators: [Validators.minLength(6),Validators.required]
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
      Validators.required,
      Validators.required,Validators.minLength(this.cantidad_caracter),
      Validators.maxLength(this.cantidad_caracter)]);
  }
  
  grabar(){
    let claveNueva=this.form.value.password;
    let claveNuevaValida=this.form.value.password2;
    
    if(claveNueva != claveNuevaValida)
    {
      swal.fire("Registro", "Las claves deben coincidir", 'warning');
      return
    }

    /*const fechaNacimiento = new Date(this.form.controls.fechaNacimiento.value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();*/

    const dialogRef = this.dialog.open(SEGCargaEsperaComponent, {
      disableClose:true,
      panelClass:'fondo-carga',
    });

    this.modeloGrabar= this.form.value;
    this.modeloGrabar.idTipoDocumento=this.selectedTD;
    this.modeloGrabar.clave = btoa(this.form.value.password);
    let celular:string = this.form.get('celular')?.value?.toString() || '';
    this.modeloGrabar.celular=celular.toString();

    if (this.selectedTD==1){
      // this.selectTipoGenero = [];
      // this.selectTipoGenero=this.form.controls['genero'].value;
      //this.modeloGrabar.sexo=this.selectTipoGenero.idTipoGenero;
    }

    if (this.selectedTD==2){
      this.modeloGrabar.primerApellido="";
      this.modeloGrabar.segundoApellido="";
      this.modeloGrabar.sexo=false;
      this.modeloGrabar.fechaNacimiento= new Date();
      this.modeloGrabar.nombres=this.form.controls['razon'].value;
    }
    console.log(this.modeloGrabar)
    this.subscription = new Subscription();
      this.subscription = this.seguridadService.crearPersona(this.modeloGrabar)
      .subscribe((mensaje : any) =>  {
      this.globalConstants.Mensaje=mensaje;
      if (this.globalConstants.Mensaje?.errorCodigo == 'OK'){
        swal.fire(this.globalConstants.msgExitoSummary, 'Usuario registrado correctamente, validar cuenta en el correo registrado' , 'success');
        this.router.navigate(['login']);
      }
      else{
        swal.fire(this.globalConstants.msgErrorSummary, this.globalConstants.Mensaje?.errorMensaje , 'warning');        
      }
      dialogRef.close();
       },
      (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, error.error.errorMensaje ,'error');
      dialogRef.close();
    });

  }
  cancelar(){
    this.router.navigate(['/main/seg-usuario']);
  }
  onInputChange(event: Event): void {
    var idTipoDocumento = this.selectedTD!;
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    // Lógica para permitir solo números
    if (idTipoDocumento != 4)
    {
      inputElement.value = inputValue.replace(/[^0-9]/g, '');
    }
    if (idTipoDocumento ==1)
    {
      this.consultaDNI();
    }
    if ( idTipoDocumento==2)
    {
      this.consultaRUC();
    }
  }
  consultaDNI(){
    var documento = this.form.controls['numeroDocumento'].value//this.form.controls.numeroDocumento.value();
    
    if (documento.length == this.cantidad_caracter)
    {
      const dialogRef = this.dialog.open(SEGCargaEsperaComponent, {
        disableClose:true,
        panelClass:'fondo-carga',
      });

      this.subscription = new Subscription();
      this.subscription = this.catalogosService.getDNI(documento)
      .subscribe((resp) => {
        if (resp) {
            this.listaDNI=resp;
            if (this.listaDNI.success=="true")
              {
                this.form.controls.numeroDocumento.setValue(this.listaDNI.dni);
                this.form.controls.nombres.setValue(this.listaDNI.nombres);
                this.form.controls.primerApellido.setValue(this.listaDNI.apellidoPaterno);
                this.form.controls.segundoApellido.setValue(this.listaDNI.apellidoMaterno);
                
  
              }
              else
              {
                this.form.controls.numeroDocumento.setValue('');
                this.form.controls.nombres.setValue('');
                this.form.controls.primerApellido.setValue('');
                this.form.controls.segundoApellido.setValue('');

                swal.fire('Consulta de datos', 
                this.listaDNI.message,
                'warning'); 
              }
            dialogRef.close();
            
        }
        },
        (error) => console.error(error));
    }

  }

  consultaRUC(){
    var documento = this.form.controls['numeroDocumento'].value//this.form.controls.numeroDocumento.value();
    if (documento.length == this.cantidad_caracter)
    {
      const dialogRef = this.dialog.open(SEGCargaEsperaComponent, {
        disableClose:true,
        panelClass:'fondo-carga',
      });

      this.subscription = new Subscription();
      this.subscription = this.catalogosService.getRUC(documento)
      .subscribe((resp) => {
        if (resp) {
            this.listaRUC=resp;
            if (this.listaRUC.success !="false")
              {
                this.form.controls.numeroDocumento.setValue(this.listaRUC.ruc);
                this.form.controls.razon.setValue(this.listaRUC.razonSocial);
                this.form.controls.nombres.setValue(this.listaRUC.razonSocial);
                this.form.controls.primerApellido.setValue(' ');
                this.form.controls.segundoApellido.setValue(' ');

              }
              if (this.listaRUC.success =="false")
              {
                this.form.controls.numeroDocumento.setValue('');
                this.form.controls.razon.setValue('');

                swal.fire('Consulta de datos', 
                'El RUC ingresado no se encuentra registrado',
                'warning'); 
              }
            dialogRef.close();
        }
        },
        (error) => console.error(error));
    }

  }

  mensajeRegEmpresa(){
    swal.fire('Perfil de empresa', 
    'Para generar este perfil es necesario registrar como persona natural al gestor del perfil',
    'warning'); 
   }
  selectTermino(){
    if (this.terminosAceptados == false)
    {
      this.form.controls.terminos.setValue(null);
    }
  }
}
